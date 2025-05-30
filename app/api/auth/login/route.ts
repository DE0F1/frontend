import { NextRequest, NextResponse } from 'next/server'
import { supabase } from 'lib/supabaseClient'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 })
    }

    // Find user by email using Supabase
    const { data, error } = await supabase
      .from('users')
      .select('id, email, password_hash')
      .eq('email', email)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const user = data

    // Compare password
    const isValid = await bcrypt.compare(password, user.password_hash)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' })

    return NextResponse.json({ token, user: { id: user.id, email: user.email } })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
