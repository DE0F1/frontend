import { NextRequest, NextResponse } from 'next/server'
import { query } from 'lib/db'

export async function PUT(request: NextRequest) {
  try {
    const profileData = await request.json()

    if (!profileData.email) {
      return NextResponse.json({ error: 'Missing profile data' }, { status: 400 })
    }

    // Update profile in DB
    const result = await query(
      'UPDATE profiles SET name = $1, bio = $2 WHERE email = $3 RETURNING *',
      [profileData.name || null, profileData.bio || null, profileData.email]
    )

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Profile updated successfully', profile: result.rows[0] })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
