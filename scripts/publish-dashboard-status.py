"""Publish a local plain-text status line to the public Dashboard Gist.

The GitHub token is read from the environment, .env.local, or
.private/github-token.txt.
Neither the token nor the editable status text is tracked by Git.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


def configure_console_encoding() -> None:
    """Keep Chinese text and emoji usable in Windows PowerShell terminals."""
    for stream in (sys.stdout, sys.stderr):
        reconfigure = getattr(stream, "reconfigure", None)
        if reconfigure is not None:
            reconfigure(encoding="utf-8", errors="replace")


configure_console_encoding()


ROOT = Path(__file__).resolve().parents[1]
SITE_CONFIG = ROOT / "src" / "config" / "site.ts"
DEFAULT_STATUS_FILE = ROOT / ".private" / "status.txt"
DEFAULT_TOKEN_FILE = ROOT / ".private" / "github-token.txt"
DEFAULT_ENV_FILE = ROOT / ".env.local"
GIST_ENDPOINT_PATTERN = re.compile(
    r"statusEndpoint:\s*'https://gist\.githubusercontent\.com/[^/]+/([0-9a-f]+)/raw'",
)
EMOJI_BASE = r"[\U0001F000-\U0001FAFF\u2600-\u27BF]"
EMOJI_TRAIL = rf"(?:{EMOJI_BASE}|\ufe0f|\u200d|\u20e3|\U0001F3FB-\U0001F3FF)+"
TRAILING_EMOJI = re.compile(rf"(?P<emoji>{EMOJI_TRAIL})$")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="发布 Dashboard Status 到 GitHub Gist")
    parser.add_argument("message", nargs="?", help="要发布的明文；省略时读取 .private/status.txt")
    parser.add_argument("--gist-id", help="覆盖从 src/config/site.ts 读取的 Gist ID")
    parser.add_argument("--file", help="Gist 内要更新的文件名（仅在 Gist 有多个文件时需要）")
    parser.add_argument("--dry-run", action="store_true", help="仅显示解析结果，不访问 GitHub")
    return parser.parse_args()


def read_message(argument: str | None) -> str:
    if argument is not None:
        message = argument.strip()
    else:
        if not DEFAULT_STATUS_FILE.exists():
            raise ValueError(f"找不到状态文件：{DEFAULT_STATUS_FILE}")
        message = DEFAULT_STATUS_FILE.read_text(encoding="utf-8").strip()

    if not message:
        raise ValueError("状态内容不能为空")
    return message


def split_status_and_emoji(message: str) -> dict[str, str]:
    match = TRAILING_EMOJI.search(message)
    if not match:
        return {"status": message}

    status = message[: match.start()].rstrip()
    emoji = match.group("emoji")
    return {"status": status, "emoji": emoji} if status else {"status": message}


def get_gist_id(override: str | None) -> str:
    if override:
        return override

    source = SITE_CONFIG.read_text(encoding="utf-8")
    match = GIST_ENDPOINT_PATTERN.search(source)
    if not match:
        raise ValueError("无法从 src/config/site.ts 的 statusEndpoint 读取 Gist ID；请使用 --gist-id")
    return match.group(1)


def get_token() -> str:
    token = os.environ.get("GITHUB_TOKEN", "").strip()
    if token:
        return token
    if DEFAULT_ENV_FILE.exists():
        for line in DEFAULT_ENV_FILE.read_text(encoding="utf-8").splitlines():
            match = re.match(r"^\s*(?:export\s+)?GITHUB_TOKEN\s*=\s*(.*?)\s*$", line)
            if match:
                return match.group(1).strip().strip("\"'")
    if DEFAULT_TOKEN_FILE.exists():
        token = DEFAULT_TOKEN_FILE.read_text(encoding="utf-8").strip()
    if token:
        return token
    raise ValueError(
        "找不到 GitHub Token。请设置 GITHUB_TOKEN，或将具有 Gist 写入权限的 Token 保存到 .private/github-token.txt",
    )


def github_request(url: str, token: str, method: str = "GET", body: dict[str, Any] | None = None) -> dict[str, Any]:
    data = json.dumps(body, ensure_ascii=False).encode("utf-8") if body is not None else None
    request = Request(
        url,
        data=data,
        method=method,
        headers={
            "Accept": "application/vnd.github+json",
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "Aphrosyne-Atlas-Status-Publisher",
        },
    )
    with urlopen(request, timeout=15) as response:
        result = json.loads(response.read().decode("utf-8"))
    if not isinstance(result, dict):
        raise ValueError("GitHub API 返回了无法识别的数据")
    return result


def select_file(gist: dict[str, Any], requested_name: str | None) -> str:
    files = gist.get("files")
    if not isinstance(files, dict) or not files:
        raise ValueError("该 Gist 没有可更新的文件")
    names = [name for name in files if isinstance(name, str)]
    if requested_name:
        if requested_name not in names:
            raise ValueError(f"Gist 中不存在文件 {requested_name!r}；可选：{', '.join(names)}")
        return requested_name
    if len(names) == 1:
        return names[0]
    raise ValueError(f"Gist 有多个文件，请使用 --file 指定一个：{', '.join(names)}")


def main() -> int:
    args = parse_args()
    try:
        message = read_message(args.message)
        payload = split_status_and_emoji(message)
        gist_id = get_gist_id(args.gist_id)

        print(json.dumps(payload, ensure_ascii=False, indent=2))
        if args.dry_run:
            print("Dry run：未访问 GitHub。")
            return 0

        token = get_token()
        gist = github_request(f"https://api.github.com/gists/{gist_id}", token)
        filename = select_file(gist, args.file)
        github_request(
            f"https://api.github.com/gists/{gist_id}",
            token,
            method="PATCH",
            body={"files": {filename: {"content": json.dumps(payload, ensure_ascii=False, indent=2) + "\n"}}},
        )
        print(f"已更新 Gist：{filename}")
        return 0
    except (ValueError, HTTPError, URLError, TimeoutError) as error:
        if isinstance(error, HTTPError):
            detail = error.read().decode("utf-8", errors="replace")
            print(f"GitHub API 请求失败（HTTP {error.code}）：{detail}", file=sys.stderr)
        else:
            print(f"发布失败：{error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
