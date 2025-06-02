import { NextRequest, NextResponse } from 'next/server'
import { supabase } from 'lib/supabaseClient'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('avatar')

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Generate unique file name
    const fileName = `${Date.now()}_${file.name}`

    // Upload file to Supabase Storage bucket 'avatars'
    const { data, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file)

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ error: 'Failed to upload avatar' }, { status: 500 })
    }

    // Get public URL of uploaded file
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)

    const publicURL = urlData.publicUrl

    // Update user profile avatar_url by email from form data
    const email = formData.get('email')
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 })
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicURL })
      .eq('user_id', userData.id)

    if (updateError) {
      console.error('Update profile error:', updateError)
      return NextResponse.json({ error: 'Failed to update profile avatar' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Avatar uploaded successfully', avatarUrl: publicURL })
  } catch (error) {
    console.error('Upload avatar error:', error)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
