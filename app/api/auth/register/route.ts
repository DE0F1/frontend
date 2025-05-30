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

    // Check if user exists
    const { data: existingUser, error: existingUserError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUserError === null && existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Insert user
    const { error: insertError } = await supabase
      .from('users')
      .insert([{ email, password_hash: passwordHash }])

    if (insertError) {
      console.error(insertError)
      return NextResponse.json({ error: 'Failed to register user' }, { status: 500 })
    }

    // Generate JWT token
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' })

    return NextResponse.json({ message: 'User registered successfully', token, user: { email } })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
