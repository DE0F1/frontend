"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import Hero from "@/components/hero"
import AboutSection from "@/components/about-section"
import CoursesSection from "@/components/courses-section"
import TestimonialsSection from "@/components/testimonials-section"
import Footer from "@/components/footer"

export default function HomePage() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Проверяем авторизацию пользователя
    const token = localStorage.getItem("token")
    if (token) {
      // Здесь бы был запрос к API для получения данных пользователя
      const userData = JSON.parse(localStorage.getItem("user") || "{}")
      setUser(userData)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100">
      <Header user={user} setUser={setUser} />
      <main>
        <Hero user={user} />
        <AboutSection />
        <CoursesSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  )
}
