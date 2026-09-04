import { NextResponse } from 'next/server'

export const dynamic = 'force-static'

export function GET() {
  return NextResponse.json({ hitokoto: '薄暝柳隙人独立，数点雨痕待江凝。' })
}
