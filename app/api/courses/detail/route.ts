import { NextRequest, NextResponse } from 'next/server'
import { supabase } from 'lib/supabaseClient'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing course id' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('courses')
      .select('id, title, description')
      .eq('id', id)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    return NextResponse.json({ course: data })
  } catch (error) {
    console.error('Error fetching course detail:', error)
    return NextResponse.json({ error: 'Failed to fetch course detail' }, { status: 500 })
  }
}
