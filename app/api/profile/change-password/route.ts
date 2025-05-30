import { NextRequest, NextResponse } from 'next/server'
import { query } from 'lib/db'
import bcrypt from 'bcryptjs'

export async function PUT(request: NextRequest) {
  try {
    const { email, oldPassword, newPassword } = await request.json()

    if (!email || !oldPassword || !newPassword) {
      return NextResponse.json({ error: 'Missing password data' }, { status: 400 })
    }

    // Get user password hash
    const result = await query('SELECT password_hash FROM users WHERE email = $1', [email])
    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const user = result.rows[0]
    const isValid = await bcrypt.compare(oldPassword, user.password_hash)
    if (!isValid) {
      return NextResponse.json({ error: 'Old password is incorrect' }, { status: 401 })
    }

    // Hash new password and update
    const newHash = await bcrypt.hash(newPassword, 10)
    await query('UPDATE users SET password_hash = $1 WHERE email = $2', [newHash, email])

    return NextResponse.json({ message: 'Password changed successfully' })
  } catch (error) {
    console.error('Error changing password:', error)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
