import { NextResponse } from 'next/server'

const STEAM_API_KEY = process.env.STEAM_API_KEY!
const STEAM_ID = process.env.STEAM_ID!

export async function GET() {
  try {
    const url = `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1/?key=${STEAM_API_KEY}&steamid=${STEAM_ID}&format=json`
    const res = await fetch(url, { next: { revalidate: 300 } })
    const data = await res.json()

    const games = (data.response?.games || []).map((g: any) => ({
      name: g.name,
      appId: g.appid,
      playtime2weeks: g.playtime_2weeks, // minutes
      playtimeForever: g.playtime_forever, // minutes
      icon: `https://media.steampowered.com/steamcommunity/public/images/apps/${g.appid}/${g.img_icon_url}.jpg`,
    }))

    return NextResponse.json({ games })
  } catch (e) {
    console.error('Steam API error:', e)
    return NextResponse.json({ games: [] }, { status: 500 })
  }
}
