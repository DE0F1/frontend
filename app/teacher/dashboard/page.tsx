"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Users, CheckCircle, Plus } from "lucide-react"
import Header from "@/components/header"
import Link from "next/link"

export default function TeacherDashboard() {
  const [user, setUser] = useState<any>(null)
  const [students, setStudents] = useState([])
  const [tests, setTests] = useState([])

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}")
    setUser(userData)

    fetchStudents()
    fetchTests()
  }, [])

  const fetchStudents = async () => {
    // Здесь бы был запрос к API
    setStudents([
      { id: 1, name: "Анна Петрова", email: "anna@example.com", course: "Алгебра", grade: "11" },
      { id: 2, name: "Михаил Сидоров", email: "mikhail@example.com", course: "Физика", grade: "10" },
    ])
  }

  const fetchTests = async () => {
    // Здесь бы был запрос к API
    setTests([{ id: 1, title: "Тест по производным", course: "Алгебра", submissions: 5, status: "active" }])
  }

  if (!user) return <div>Загрузка...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100">
      <Header user={user} setUser={setUser} />

      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Панель учителя</h1>
          <p className="text-gray-600">Управление курсами и учениками</p>
        </motion.div>

        <Tabs defaultValue="lectures" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="lectures">Лекции</TabsTrigger>
            <TabsTrigger value="tests">Тесты</TabsTrigger>
            <TabsTrigger value="grading">Проверка</TabsTrigger>
            <TabsTrigger value="students">Ученики</TabsTrigger>
          </TabsList>

          <TabsContent value="lectures" className="space-y-6">
            <Card className="border-red-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-red-600" />
                  Загрузка лекций
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lecture-title">Название лекции</Label>
                      <Input id="lecture-title" placeholder="Введите название" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lecture-course">Курс</Label>
                      <Input id="lecture-course" placeholder="Выберите курс" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lecture-url">Ссылка на видео (YouTube, Vimeo и т.д.)</Label>
                    <Input id="lecture-url" placeholder="https://..." />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lecture-text">Или текстовая лекция</Label>
                    <Textarea id="lecture-text" placeholder="Введите текст лекции..." rows={6} />
                  </div>

                  <Button className="bg-red-600 hover:bg-red-700">Загрузить лекцию</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tests" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-800">Управление тестами</h2>
              <Link href="/teacher/tests/create">
                <Button className="bg-red-600 hover:bg-red-700 w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Создать тест
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tests.map((test: any) => (
                <Card key={test.id} className="border-red-100">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <CardTitle className="text-lg">{test.title}</CardTitle>
                      <Badge variant={test.status === "active" ? "default" : "secondary"}>
                        {test.status === "active" ? "Активный" : "Неактивный"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-2">Курс: {test.course}</p>
                    <p className="text-sm text-gray-600 mb-4">Ответов: {test.submissions}</p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button size="sm" variant="outline" className="w-full sm:w-auto">
                        Редактировать
                      </Button>
                      <Button size="sm" className="bg-red-600 hover:bg-red-700 w-full sm:w-auto">
                        Просмотр
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="grading" className="space-y-6">
            <Card className="border-red-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-red-600" />
                  Проверка тестов
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold">Анна Петрова - Тест по производным</h4>
                      <p className="text-sm text-gray-600">Отправлено: 15.01.2024</p>
                    </div>
                    <Button className="bg-red-600 hover:bg-red-700">Проверить</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold">Михаил Сидоров - Тест по механике</h4>
                      <p className="text-sm text-gray-600">Отправлено: 14.01.2024</p>
                    </div>
                    <Button className="bg-red-600 hover:bg-red-700">Проверить</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <Card className="border-red-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-red-600" />
                  Список учеников
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Имя</th>
                        <th className="text-left p-2">Email</th>
                        <th className="text-left p-2">Курс</th>
                        <th className="text-left p-2">Класс</th>
                        <th className="text-left p-2">Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student: any) => (
                        <tr key={student.id} className="border-b">
                          <td className="p-2">{student.name}</td>
                          <td className="p-2">{student.email}</td>
                          <td className="p-2">{student.course}</td>
                          <td className="p-2">{student.grade}</td>
                          <td className="p-2">
                            <Button size="sm" variant="outline">
                              Профиль
                            </Button>
                          </td>
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
