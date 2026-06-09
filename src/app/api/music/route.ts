import { NextResponse } from 'next/server'
import NeteaseCloudMusicApi from 'NeteaseCloudMusicApi'

const SONG_ID = '2614435703'

// GET /api/music — 返回歌曲元数据
export async function GET() {
  try {
    const [urlRes, detailRes] = await Promise.all([
      NeteaseCloudMusicApi.song_url_v1({ id: SONG_ID, level: 'standard' } as any) as any,
      NeteaseCloudMusicApi.song_detail({ ids: SONG_ID } as any) as any,
    ])

    const urlData = urlRes.body?.data?.[0]
    const song = detailRes.body?.songs?.[0]

    if (!urlData?.url) {
      return NextResponse.json({ error: '无法获取播放链接' }, { status: 502 })
    }

    return NextResponse.json({
      id: SONG_ID,
      url: urlData.url,
      title: song?.name || '未知',
      artist: song?.ar?.map((a: { name: string }) => a.name).join(' / ') || '未知',
      cover: song?.al?.picUrl || '',
      duration: Math.round((song?.dt || 0) / 1000),
    })
  } catch (e) {
    console.error('Music API error:', e)
    return NextResponse.json({ error: '音乐接口异常' }, { status: 500 })
  }
}
