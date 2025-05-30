import fetch from 'node-fetch'

const BASE_URL = 'http://localhost:3000/api'

async function testRegisterLogin() {
  console.log('Testing registration and login...')

  const email = `test${Date.now()}@example.com`
  const password = 'Test1234'

  // Register
  let res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  let data = await res.json()
  if (!res.ok) {
    console.error('Register failed:', data)
    return false
  }
  console.log('Register success:', data)

  // Login
  res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  data = await res.json()
  if (!res.ok) {
    console.error('Login failed:', data)
    return false
  }
  console.log('Login success:', data)
  const token = data.token

  return { email, token }
}

async function testCourses() {
  console.log('Testing courses list and detail...')

  let res = await fetch(`${BASE_URL}/courses/list`)
  let data = await res.json()
  if (!res.ok) {
    console.error('Courses list failed:', data)
    return false
  }
  console.log('Courses list:', data)

  if (data.courses.length === 0) {
    console.error('No courses found')
    return false
  }

  const courseId = data.courses[0].id
  res = await fetch(`${BASE_URL}/courses/detail?id=${courseId}`)
  data = await res.json()
  if (!res.ok) {
    console.error('Course detail failed:', data)
    return false
  }
  console.log('Course detail:', data)

  return true
}

async function testProfile(email: string, token: string) {
  console.log('Testing profile update and password change...')

  // Update profile
  let res = await fetch(`${BASE_URL}/profile/update`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name: 'Test User', bio: 'Test bio' }),
  })
  let data = await res.json()
  if (!res.ok) {
    console.error('Profile update failed:', data)
    return false
  }
  console.log('Profile update success:', data)

  // Change password
  res = await fetch(`${BASE_URL}/profile/change-password`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, oldPassword: 'Test1234', newPassword: 'NewPass123' }),
  })
  data = await res.json()
  if (!res.ok) {
    console.error('Password change failed:', data)
    return false
  }
  console.log('Password change success:', data)

  return true
}

async function runTests() {
  const user = await testRegisterLogin()
  if (!user) {
    console.error('User registration/login tests failed')
    return
  }

  const coursesOk = await testCourses()
  if (!coursesOk) {
    console.error('Courses tests failed')
    return
  }

  const profileOk = await testProfile(user.email, user.token)
  if (!profileOk) {
    console.error('Profile tests failed')
    return
  }

  console.log('All API tests passed successfully')
}

runTests()
