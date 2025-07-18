import { NextResponse } from 'next/server'
import { supabase } from 'lib/supabaseClient'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('id, title, description')

    if (error) {
      console.error('Error fetching courses:', error)
      return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
    }

    return NextResponse.json({ courses: data })
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
  }
}
