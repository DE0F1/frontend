import { NextResponse } from 'next/server'
import { query } from 'lib/db'

export async function GET() {
  try {
    const result = await query('SELECT id, title, description FROM courses')
    return NextResponse.json({ courses: result.rows })
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
  }
}
