import { NextRequest, NextResponse } from 'next/server'
import { query } from 'lib/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 })
    }

    // Check if user exists
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [email])
    if (existingUser.rowCount > 0) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Insert user
    await query('INSERT INTO users (email, password_hash) VALUES ($1, $2)', [email, passwordHash])

    // Generate JWT token
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' })

    return NextResponse.json({ message: 'User registered successfully', token, user: { email } })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
