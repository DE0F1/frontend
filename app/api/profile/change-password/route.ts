import { NextRequest, NextResponse } from 'next/server'
import { supabase } from 'lib/supabaseClient'

export async function PUT(request: NextRequest) {
  try {
    const profileData = await request.json()

    if (!profileData.email) {
      return NextResponse.json({ error: 'Missing profile data' }, { status: 400 })
    }

    // Update profile in Supabase
    const { data, error } = await supabase
      .from('profiles')
      .update({
        full_name: profileData.name || null,
        bio: profileData.bio || null,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', profileData.user_id)
      .select()
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Profile not found or update failed' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Profile updated successfully', profile: data })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
