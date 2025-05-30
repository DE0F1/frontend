"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react"
import Header from "@/components/header"
import Link from "next/link"

interface Question {
  id: string
  type: "multiple_choice" | "text" | "number"
  question: string
  options?: string[]
  correctAnswer: string
  points: number
}

export default function CreateTestPage() {
  const [user, setUser] = useState<any>(null)
  const [testData, setTestData] = useState({
    title: "",
    description: "",
    courseId: "",
    timeLimit: 30,
    maxAttempts: 3,
  })
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: "multiple_choice",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      points: 1,
    }
    setQuestions([...questions, newQuestion])
  }

  const updateQuestion = (id: string, field: string, value: any) => {
    setQuestions(
      questions.map((q) =>
        q.id === id
          ? {
              ...q,
              [field]: value,
            }
          : q,
      ),
    )
  }

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options?.map((opt, idx) => (idx === optionIndex ? value : opt)),
            }
          : q,
      ),
    )
  }

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // Здесь бы был запрос к API
      console.log("Saving test:", { testData, questions })
      router.push("/teacher/dashboard")
    } catch (error) {
      console.error("Error saving test:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100">
      <Header user={user} setUser={setUser} />

      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Заголовок */}
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Создание теста</h1>
                <p className="text-gray-600">Создайте новый тест для ваших учеников</p>
              </div>
              <Link href="/teacher/dashboard">
                <Button variant="outline" className="w-full sm:w-auto">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Назад
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Основная информация о тесте */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-red-100 mb-6">
              <CardHeader>
                <CardTitle>Информация о тесте</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Название теста</Label>
                    <Input
                      id="title"
                      value={testData.title}
                      onChange={(e) => setTestData({ ...testData, title: e.target.value })}
                      placeholder="Введите название теста"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="course">Курс</Label>
                    <Select
                      value={testData.courseId}
                      onValueChange={(value) => setTestData({ ...testData, courseId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите курс" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Алгебра и начала анализа</SelectItem>
                        <SelectItem value="2">Физика: Механика</SelectItem>
                        <SelectItem value="3">Геометрия</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Описание</Label>
                  <Textarea
                    id="description"
                    value={testData.description}
                    onChange={(e) => setTestData({ ...testData, description: e.target.value })}
                    placeholder="Описание теста..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timeLimit">Время на прохождение (минуты)</Label>
                    <Input
                      id="timeLimit"
                      type="number"
                      value={testData.timeLimit}
                      onChange={(e) => setTestData({ ...testData, timeLimit: Number.parseInt(e.target.value) })}
                      min="1"
                      max="180"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxAttempts">Максимум попыток</Label>
                    <Input
                      id="maxAttempts"
                      type="number"
                      value={testData.maxAttempts}
                      onChange={(e) => setTestData({ ...testData, maxAttempts: Number.parseInt(e.target.value) })}
                      min="1"
                      max="10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Вопросы */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-red-100 mb-6">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle>Вопросы ({questions.length})</CardTitle>
                  <Button onClick={addQuestion} className="bg-red-600 hover:bg-red-700 w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить вопрос
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {questions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>Пока нет вопросов. Добавьте первый вопрос.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {questions.map((question, index) => (
                      <div key={question.id} className="p-4 sm:p-6 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                          <Badge variant="outline">Вопрос {index + 1}</Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeQuestion(question.id)}
                            className="text-red-600 hover:text-red-700 w-full sm:w-auto"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Удалить
                          </Button>
                        </div>

                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="sm:col-span-2 space-y-2">
                              <Label>Текст вопроса</Label>
                              <Textarea
                                value={question.question}
                                onChange={(e) => updateQuestion(question.id, "question", e.target.value)}
                                placeholder="Введите текст вопроса..."
                                rows={2}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Тип вопроса</Label>
                              <Select
                                value={question.type}
                                onValueChange={(value) => updateQuestion(question.id, "type", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="multiple_choice">Выбор варианта</SelectItem>
                                  <SelectItem value="text">Текстовый ответ</SelectItem>
                                  <SelectItem value="number">Числовой ответ</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {question.type === "multiple_choice" && (
                            <div className="space-y-3">
                              <Label>Варианты ответов</Label>
                              {question.options?.map((option, optIndex) => (
                                <div key={optIndex} className="flex flex-col sm:flex-row gap-2">
                                  <Input
                                    value={option}
                                    onChange={(e) => updateOption(question.id, optIndex, e.target.value)}
                                    placeholder={`Вариант ${optIndex + 1}`}
                                    className="flex-1"
                                  />
                                  <Button
                                    variant={question.correctAnswer === option ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => updateQuestion(question.id, "correctAnswer", option)}
                                    className="w-full sm:w-auto"
                                  >
                                    {question.correctAnswer === option ? "Правильный" : "Выбрать"}
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}

                          {(question.type === "text" || question.type === "number") && (
                            <div className="space-y-2">
                              <Label>Правильный ответ</Label>
                              <Input
                                value={question.correctAnswer}
                                onChange={(e) => updateQuestion(question.id, "correctAnswer", e.target.value)}
                                placeholder="Введите правильный ответ..."
                                type={question.type === "number" ? "number" : "text"}
                              />
                            </div>
                          )}

                          <div className="space-y-2">
                            <Label>Баллы за вопрос</Label>
                            <Input
                              type="number"
                              value={question.points}
                              onChange={(e) => updateQuestion(question.id, "points", Number.parseInt(e.target.value))}
                              min="1"
                              max="10"
                              className="w-full sm:w-32"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Кнопки действий */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button variant="outline" className="w-full sm:w-auto">
                Сохранить как черновик
              </Button>
              <Button
                onClick={handleSave}
                disabled={loading || questions.length === 0}
                className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Сохранение..." : "Опубликовать тест"}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
