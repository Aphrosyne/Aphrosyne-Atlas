import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const res = await fetch('https://v1.hitokoto.cn/?c=i&encode=json', {
      next: { revalidate: 60 },
    })
    const data = await res.json()
    return NextResponse.json({ hitokoto: data.hitokoto })
  } catch {
    return NextResponse.json({ hitokoto: '薄暝柳隙人独立，数点雨痕待江凝。' })
  }
}
