import { NextRequest, NextResponse } from 'next/server'
import { query } from 'lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing course id' }, { status: 400 })
    }

    const result = await query('SELECT id, title, description FROM courses WHERE id = $1', [id])

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    return NextResponse.json({ course: result.rows[0] })
  } catch (error) {
    console.error('Error fetching course detail:', error)
    return NextResponse.json({ error: 'Failed to fetch course detail' }, { status: 500 })
  }
}
