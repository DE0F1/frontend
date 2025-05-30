import { NextRequest, NextResponse } from 'next/server'
import { supabase } from 'lib/supabaseClient'
import bcrypt from 'bcryptjs'

export async function PUT(request: NextRequest) {
  try {
    const { email, oldPassword, newPassword } = await request.json()

    if (!email || !oldPassword || !newPassword) {
      return NextResponse.json({ error: 'Missing password data' }, { status: 400 })
    }

    // Get user password hash from Supabase
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('password_hash')
      .eq('email', email)
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const isValid = await bcrypt.compare(oldPassword, user.password_hash)
    if (!isValid) {
      return NextResponse.json({ error: 'Old password is incorrect' }, { status: 401 })
    }

    // Hash new password and update
    const newHash = await bcrypt.hash(newPassword, 10)
    const { error: updateError } = await supabase
      .from('users')
      .update({ password_hash: newHash })
      .eq('email', email)

    if (updateError) {
      console.error('Error updating password:', updateError)
      return NextResponse.json({ error: 'Failed to update password' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Password changed successfully' })
  } catch (error) {
    console.error('Error changing password:', error)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
