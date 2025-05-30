const express = require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const { Pool } = require('pg')

const app = express()
const port = process.env.PORT || 4000

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

app.use(cors())
app.use(express.json())

// Helper function to query database
async function query(text, params) {
  const start = Date.now()
  const res = await pool.query(text, params)
  const duration = Date.now() - start
  console.log('executed query', { text, duration, rows: res.rowCount })
  return res
}

// Courses mock data (can be moved to DB later)
const courses = [
  { id: '1', title: 'Course 1', description: 'Description for course 1' },
  { id: '2', title: 'Course 2', description: 'Description for course 2' },
  { id: '3', title: 'Course 3', description: 'Description for course 3' },
]

// Auth routes
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' })
  }
  try {
    const result = await query('SELECT id, email, password_hash FROM users WHERE email = $1', [email])
    if (result.rowCount === 0) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    const user = result.rows[0]
    const isValid = await bcrypt.compare(password, user.password_hash)
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    res.json({ token: 'fake-jwt-token', user: { id: user.id, email: user.email } })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server error' })
  }
})

app.post('/auth/register', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' })
  }
  try {
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [email])
    if (existingUser.rowCount > 0) {
      return res.status(409).json({ error: 'User already exists' })
    }
    const passwordHash = await bcrypt.hash(password, 10)
    await query('INSERT INTO users (email, password_hash) VALUES ($1, $2)', [email, passwordHash])
    res.json({ message: 'User registered successfully', user: { email } })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Courses routes
app.get('/courses/list', (req, res) => {
  res.json({ courses })
})

app.get('/courses/detail', (req, res) => {
  const id = req.query.id
  const course = courses.find(c => c.id === id)
  if (!course) {
    return res.status(404).json({ error: 'Course not found' })
  }
  res.json({ course })
})

// Profile routes
app.put('/profile/update', (req, res) => {
  const profileData = req.body
  if (!profileData.email) {
    return res.status(400).json({ error: 'Missing profile data' })
  }
  // For demo, just echo back
  res.json({ message: 'Profile updated successfully', profile: profileData })
})

app.put('/profile/change-password', (req, res) => {
  const { oldPassword, newPassword } = req.body
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: 'Missing password data' })
  }
  res.json({ message: 'Password changed successfully' })
})

app.listen(port, () => {
  console.log('Backend server running on port ' + port)
})
