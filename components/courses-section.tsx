"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calculator, Atom, BarChart3 } from "lucide-react"
import Link from "next/link"

const courses = [
  {
    id: 1,
    title: "Алгебра и начала анализа",
    description: "Изучение функций, производных, интегралов и их применение в решении практических задач",
    icon: Calculator,
    level: "Средний",
    duration: "36 часов",
    color: "bg-red-100 text-red-600",
  },
  {
    id: 2,
    title: "Физика",
    description: "Механика, термодинамика, электричество и магнетизм, оптика и квантовая физика",
    icon: Atom,
    level: "Продвинутый",
    duration: "48 часов",
    color: "bg-rose-100 text-rose-600",
  },
  {
    id: 3,
    title: "Геометрия",
    description: "Планиметрия и стереометрия, векторы, координаты и методы решения геометрических задач",
    icon: BarChart3,
    level: "Базовый",
    duration: "32 часа",
    color: "bg-red-100 text-red-600",
  },
]

export default function CoursesSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-red-50 to-rose-100">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Наши курсы</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Выберите курс, который поможет вам достичь ваших образовательных целей
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <Card className="h-full border-red-100 hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${course.color}`}>
                    <course.icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl text-gray-800">{course.title}</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="secondary">{course.level}</Badge>
                    <Badge variant="outline">{course.duration}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{course.description}</p>
                </CardContent>
                <CardFooter>
                  <Link href={`/courses/${course.id}`} className="w-full">
                    <Button className="w-full bg-red-600 hover:bg-red-700">Подробнее</Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
