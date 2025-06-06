"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Clock, Users, Star, Play, FileText } from "lucide-react"
import Header from "@/components/header"

// Статические данные для экспорта
const staticCourseData = {
  "1": {
    id: 1,
    title: "Алгебра и начала анализа",
    description: "Изучение функций, производных, интегралов и их применение в решении практических задач.",
    category: "mathematics",
    level: "intermediate",
    duration: "36 часов",
    students_count: 25,
    rating: 4.8,
    teacher: {
      name: "Иван Петров",
      subject: "Математика, Алгебра",
      bio: "Преподаватель математики с 15-летним стажем.",
      avatar: "/placeholder.svg?height=64&width=64",
    },
    lectures: [
      { id: 1, title: "Введение в функции", type: "text" },
      { id: 2, title: "Производная функции", type: "video" },
      { id: 3, title: "Применение производной", type: "text" },
    ],
    reviews: [
      {
        id: 1,
        rating: 5,
        comment: "Отличный курс! Преподаватель объясняет очень понятно.",
        created_at: "2024-01-15",
        student: {
          name: "Анна Козлова",
          avatar: "/placeholder.svg?height=40&width=40",
        },
      },
    ],
    progress: 0,
  },
  "2": {
    id: 2,
    title: "Физика: Механика",
    description: "Основы классической механики: кинематика, динамика, законы сохранения.",
    category: "physics",
    level: "advanced",
    duration: "48 часов",
    students_count: 18,
    rating: 4.6,
    teacher: {
      name: "Мария Сидорова",
      subject: "Физика",
      bio: "Кандидат физико-математических наук.",
      avatar: "/placeholder.svg?height=64&width=64",
    },
    lectures: [
      { id: 1, title: "Основы кинематики", type: "video" },
      { id: 2, title: "Законы Ньютона", type: "text" },
    ],
    reviews: [
      {
        id: 1,
        rating: 5,
        comment: "Очень интересный курс!",
        created_at: "2024-01-12",
        student: {
          name: "Петр Иванов",
          avatar: "/placeholder.svg?height=40&width=40",
        },
      },
    ],
    progress: 0,
  },
}

export default function CourseDetailPageClient() {
  const params = useParams()
  const [user, setUser] = useState<any>(null)
  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}")
    setUser(userData)

    // Используем статические данные
    const courseId = params.id as string
    const courseData = staticCourseData[courseId as keyof typeof staticCourseData]

    if (courseData) {
      setCourse(courseData)
    }
    setLoading(false)
  }, [params.id])

  const handleEnroll = async () => {
    // Removed enrollment logic as per user request
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100">
        <Header user={user} setUser={setUser} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Загрузка курса...</div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100">
        <Header user={user} setUser={setUser} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Курс не найден</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100">
      <Header user={user} setUser={setUser} />

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Основная информация */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-red-100">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <Badge variant={course.level === "advanced" ? "default" : "secondary"} className="mb-2">
                      {course.level === "beginner"
                        ? "Базовый"
                        : course.level === "intermediate"
                          ? "Средний"
                          : "Продвинутый"}
                    </Badge>
                    <CardTitle className="text-2xl text-gray-800 mb-2">{course.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{course.students_count} учеников</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span>{course.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">{course.description}</p>
              </CardContent>
            </Card>

            <Tabs defaultValue="program" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="program">Программа</TabsTrigger>
                <TabsTrigger value="teacher">Преподаватель</TabsTrigger>
                <TabsTrigger value="reviews">Отзывы</TabsTrigger>
              </TabsList>

              <TabsContent value="program" className="space-y-4">
                <Card className="border-red-100">
                  <CardHeader>
                    <CardTitle>Программа курса</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {course.lectures?.map((lecture: any, index: number) => (
                        <div key={lecture.id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 bg-red-600 text-white rounded-full text-sm font-semibold">
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800">{lecture.title}</h4>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                {lecture.type === "video" ? (
                                  <Play className="h-4 w-4" />
                                ) : (
                                  <FileText className="h-4 w-4" />
                                )}
                                <span>{lecture.type === "video" ? "Видеолекция" : "Текстовая лекция"}</span>
                              </div>
                            </div>
                          </div>
                          {enrolled && (
                            <Button size="sm" variant="outline" asChild>
                              <a
                                href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Открыть
                              </a>
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="teacher" className="space-y-4">
                <Card className="border-red-100">
                  <CardHeader>
                    <CardTitle>О преподавателе</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={course.teacher?.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{course.teacher?.name?.[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{course.teacher?.name}</h3>
                        <p className="text-gray-600 mb-2">{course.teacher?.subject}</p>
                        <p className="text-gray-600 text-sm">{course.teacher?.bio}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                <Card className="border-red-100">
                  <CardHeader>
                    <CardTitle>Отзывы студентов</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {course.reviews?.map((review: any) => (
                        <div key={review.id} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={review.student?.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{review.student?.name?.[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-gray-800">{review.student?.name}</h4>
                                <div className="flex items-center">
                                  {[...Array(review.rating)].map((_, i) => (
                                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                                  ))}
                                </div>
                              </div>
                              <p className="text-gray-600 text-sm">{review.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Боковая панель */}
          <div className="space-y-6">

            <Card className="border-red-100">
              <CardHeader>
                <CardTitle className="text-lg">Что вы изучите</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-600">Основные понятия и определения</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-600">Практические задачи и упражнения</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-600">Методы решения сложных задач</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-600">Подготовка к экзаменам</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
