"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Clock, Users, Star, BookOpen } from "lucide-react"
import Header from "@/components/header"
import Link from "next/link"

export default function CoursesPage() {
  const [user, setUser] = useState<any>(null)
  const [courses, setCourses] = useState([])
  const [filteredCourses, setFilteredCourses] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [levelFilter, setLevelFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}")
    setUser(userData)
    fetchCourses()
  }, [])

  useEffect(() => {
    filterCourses()
  }, [courses, searchTerm, categoryFilter, levelFilter])

  const fetchCourses = async () => {
    try {
      // Моковые данные для демонстрации
      const mockCourses = [
        {
          id: 1,
          title: "Алгебра и начала анализа",
          description:
            "Изучение функций, производных, интегралов и их применение в решении практических задач. Курс включает теоретические основы и множество практических примеров.",
          category: "mathematics",
          level: "intermediate",
          duration: "36 часов",
          teacher_name: "Иван Петров",
          teacher_subject: "Математика, Алгебра",
          students_count: 25,
          lectures_count: 12,
          rating: 4.8,
        },
        {
          id: 2,
          title: "Физика: Механика",
          description:
            "Основы классической механики: кинематика, динамика, законы сохранения. Изучение движения тел и взаимодействия между ними.",
          category: "physics",
          level: "advanced",
          duration: "48 часов",
          teacher_name: "Мария Сидорова",
          teacher_subject: "Физика",
          students_count: 18,
          lectures_count: 16,
          rating: 4.6,
        },
        {
          id: 3,
          title: "Геометрия",
          description:
            "Планиметрия и стереометрия, векторы, координаты и методы решения геометрических задач. Подготовка к ЕГЭ.",
          category: "mathematics",
          level: "beginner",
          duration: "32 часа",
          teacher_name: "Иван Петров",
          teacher_subject: "Математика",
          students_count: 32,
          lectures_count: 10,
          rating: 4.9,
        },
        {
          id: 4,
          title: "Информатика: Алгоритмы",
          description: "Основы алгоритмизации и программирования. Изучение базовых алгоритмов и структур данных.",
          category: "informatics",
          level: "intermediate",
          duration: "40 часов",
          teacher_name: "Алексей Иванов",
          teacher_subject: "Информатика",
          students_count: 22,
          lectures_count: 14,
          rating: 4.7,
        },
        {
          id: 5,
          title: "Физика: Электричество",
          description: "Изучение электрических явлений, законов Ома и Кирхгофа, электромагнитных полей.",
          category: "physics",
          level: "intermediate",
          duration: "36 часов",
          teacher_name: "Мария Сидорова",
          teacher_subject: "Физика",
          students_count: 20,
          lectures_count: 13,
          rating: 4.5,
        },
        {
          id: 6,
          title: "Высшая математика",
          description: "Дифференциальные уравнения, ряды, кратные интегралы и их применение в физике и технике.",
          category: "mathematics",
          level: "advanced",
          duration: "52 часа",
          teacher_name: "Иван Петров",
          teacher_subject: "Высшая математика",
          students_count: 15,
          lectures_count: 18,
          rating: 4.9,
        },
      ]

      setCourses(mockCourses)
    } catch (error) {
      console.error("Error fetching courses:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterCourses = () => {
    const filtered = courses.filter((course: any) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = categoryFilter === "all" || course.category === categoryFilter
      const matchesLevel = levelFilter === "all" || course.level === levelFilter

      return matchesSearch && matchesCategory && matchesLevel
    })

    setFilteredCourses(filtered)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100">
        <Header user={user} setUser={setUser} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Загрузка курсов...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100">
      <Header user={user} setUser={setUser} />

      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Каталог курсов</h1>
          <p className="text-gray-600">Выберите курс для изучения физико-математических дисциплин</p>
        </motion.div>

        {/* Фильтры и поиск */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="border-red-100">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Поиск курсов..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Категория" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все категории</SelectItem>
                    <SelectItem value="mathematics">Математика</SelectItem>
                    <SelectItem value="physics">Физика</SelectItem>
                    <SelectItem value="informatics">Информатика</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Уровень" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все уровни</SelectItem>
                    <SelectItem value="beginner">Базовый</SelectItem>
                    <SelectItem value="intermediate">Средний</SelectItem>
                    <SelectItem value="advanced">Продвинутый</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                  <Filter className="h-4 w-4 mr-2" />
                  Сбросить фильтры
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Список курсов */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course: any, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full border-red-100 hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant={course.level === "advanced" ? "default" : "secondary"}>
                      {course.level === "beginner"
                        ? "Базовый"
                        : course.level === "intermediate"
                          ? "Средний"
                          : "Продвинутый"}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{course.rating || "4.5"}</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl text-gray-800">{course.title}</CardTitle>
                  <p className="text-gray-600 text-sm line-clamp-3">{course.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration || "32 часа"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{course.students_count || "0"} учеников</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4 text-red-600" />
                        <span className="text-sm text-gray-600">{course.lectures_count || "0"} лекций</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Link href={`/courses/${course.id}`}>
                        <Button className="w-full bg-red-600 hover:bg-red-700">Подробнее</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <div className="text-gray-500 text-lg">Курсы не найдены</div>
            <p className="text-gray-400 mt-2">Попробуйте изменить параметры поиска</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
