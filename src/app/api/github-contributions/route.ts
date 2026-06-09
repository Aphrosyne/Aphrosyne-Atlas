import { NextResponse } from 'next/server'

export const revalidate = 3600 // 1 hour

const query = `
query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        weeks {
          contributionDays {
            contributionCount
            date
            color
          }
        }
      }
    }
  }
}`

export async function GET() {
  const token = process.env.GITHUB_TOKEN
  if (!token) {
    return NextResponse.json({ weeks: [] }, { status: 200 })
  }

  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables: { login: 'aphrosyne' } }),
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      return NextResponse.json({ weeks: [] }, { status: 200 })
    }

    const data = await res.json()
    const weeks = data.data?.user?.contributionsCollection?.contributionCalendar?.weeks ?? []
    return NextResponse.json({ weeks })
  } catch {
    return NextResponse.json({ weeks: [] }, { status: 200 })
  }
}
