import { useState, useEffect } from "react"
 import { motion } from "framer-motion"
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
 import { Button } from "@/components/ui/button"
 import { Badge } from "@/components/ui/badge"
 import { Progress } from "@/components/ui/progress"
 import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
 import { BookOpen, Play, FileText, Award, Clock } from "lucide-react"
 import Header from "@/components/header"
 import Link from "next/link"
 

 export default function StudentDashboard() {
  const [user, setUser] = useState<any>(null)
  const [courses, setCourses] = useState([])
  const [grades, setGrades] = useState([])
 

  useEffect(() => {
  const userData = JSON.parse(localStorage.getItem("user") || "{}")
  setUser(userData)
 

  // Загрузка курсов и оценок
  fetchCourses()
  fetchGrades()
  }, [])
 

  const fetchCourses = async () => {
  // Здесь бы был запрос к API
  setCourses([
  {
  id: 1,
  title: "Алгебра и начала анализа",
  progress: 75,
  lectures: [
  { id: 1, title: "Функции и их свойства", type: "video", url: "https://example.com/video1" },
  { id: 2, title: "Производная функции", type: "text", content: "Текст лекции..." },
  { id: 3, title: "Rick Astley - Never Gonna Give You Up", type: "video", url: "http://www.youtube.com/watch?v=dQw4w9WgXcQ" }, // Added YouTube video lecture
  ],
  },
  ])
  }
 

  const fetchGrades = async () => {
  // Здесь бы был запрос к API
  setGrades([
  { id: 1, course: "Алгебра", test: "Тест 1", grade: 5, date: "2024-01-15" },
  { id: 2, course: "Физика", test: "Тест 2", grade: 4, date: "2024-01-20" },
  ])
  }
 

  if (!user) return <div>Загрузка...</div>
 

  return (
  <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100">
  <Header user={user} setUser={setUser} />
 

  <div className="container mx-auto px-4 py-8">
  <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
  <h1 className="text-3xl font-bold text-gray-800 mb-2">Добро пожаловать, {user.name}!</h1>
  <p className="text-gray-600">Продолжайте изучение курсов</p>
  </motion.div>
 

  <Tabs defaultValue="courses" className="space-y-6">
  <TabsList className="grid w-full grid-cols-3">
  <TabsTrigger value="courses">Мои курсы</TabsTrigger>
  <TabsTrigger value="tests">Тесты</TabsTrigger>
  <TabsTrigger value="grades">Оценки</TabsTrigger>
  </TabsList>
 

  <TabsContent value="courses" className="space-y-6">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {courses.map((course: any) => (
  <motion.div
  key={course.id}
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ delay: 0.1 }}
  >
  <Card className="border-red-100">
  <CardHeader>
  <CardTitle className="flex items-center gap-2">
  <BookOpen className="h-5 w-5 text-red-600" />
  {course.title}
  </CardTitle>
  <Progress value={course.progress} className="w-full" />
  <p className="text-sm text-gray-600">{course.progress}% завершено</p>
  </CardHeader>
  <CardContent>
  <div className="space-y-3">
  <h4 className="font-semibold">Лекции:</h4>
  {course.lectures.map((lecture: any) => (
  <div key={lecture.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
  <div className="flex items-center gap-2">
  {lecture.type === "video" ? (
  <Play className="h-4 w-4 text-red-600" />
  ) : (
  <FileText className="h-4 w-4 text-red-600" />
  )}
  <span className="text-sm">{lecture.title}</span>
  </div>
  <Button size="sm" variant="outline" asChild>
  <Link href={lecture.type === "video" ? lecture.url : "#"}> {/* Add link here */}
  Открыть
  </Link>
  </Button>
  </div>
  ))}
  </div>
  </CardContent>
  </Card>
  </motion.div>
  ))}
  </div>
  </TabsContent>
 

  <TabsContent value="tests" className="space-y-6">
  <Card className="border-red-100">
  <CardHeader>
  <CardTitle>Доступные тесты</CardTitle>
  </CardHeader>
  <CardContent>
  <div className="space-y-4">
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-red-50 rounded-lg gap-4">
  <div className="flex-1">
  <h4 className="font-semibold">Тест по производным</h4>
  <p className="text-sm text-gray-600">Алгебра и начала анализа</p>
  <p className="text-xs text-gray-500 mt-1">Доступен до: 25.01.2024</p>
  </div>
  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
  <Badge variant="secondary" className="w-full sm:w-auto justify-center">
  <Clock className="h-3 w-3 mr-1" />
  30 мин
  </Badge>
  <Link href="/student/tests/1">
  <Button className="bg-red-600 hover:bg-red-700 w-full sm:w-auto">Пройти тест</Button>
  </Link>
  </div>
  </div>
 

  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg gap-4">
  <div className="flex-1">
  <h4 className="font-semibold text-gray-500">Тест по интегралам</h4>
  <p className="text-sm text-gray-600">Алгебра и начала анализа</p>
  <p className="text-xs text-gray-500 mt-1">Будет доступен: 30.01.2024</p>
  </div>
  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
  <Badge variant="outline" className="w-full sm:w-auto justify-center">
  <Clock className="h-3 w-3 mr-1" />
  45 мин
  </Badge>
  <Button disabled className="w-full sm:w-auto">
  Скоро
  </Button>
  </div>
  </div>
  </div>
  </CardContent>
  </Card>
  </TabsContent>
 

  <TabsContent value="grades" className="space-y-6">
  <Card className="border-red-100">
  <CardHeader>
  <CardTitle className="flex items-center gap-2">
  <Award className="h-5 w-5 text-red-600" />
  Сводная таблица оценок
  </CardTitle>
  </CardHeader>
  <CardContent>
  <div className="overflow-x-auto">
  <table className="w-full">
  <thead>
  <tr className="border-b">
  <th className="text-left p-2">Курс</th>
  <th className="text-left p-2">Тест</th>
  <th className="text-left p-2">Оценка</th>
  <th className="text-left p-2">Дата</th>
  </tr>
  </thead>
  <tbody>
  {grades.map((grade: any) => (
  <tr key={grade.id} className="border-b">
  <td className="p-2">{grade.course}</td>
  <td className="p-2">{grade.test}</td>
  <td className="p-2">
  <Badge variant={grade.grade >= 4 ? "default" : "destructive"}>{grade.grade}</Badge>
  </td>
  <td className="p-2">{grade.date}</td>
  </tr>
  ))}
  </tbody>
  </table>
  </div>
  </CardContent>
  </Card>
  </TabsContent>
  </Tabs>
  </div>
  </div>
  )
 }
