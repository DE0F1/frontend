"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, Award, RotateCcw } from "lucide-react"
import Header from "@/components/header"
import Link from "next/link"

interface TestResult {
  id: string
  title: string
  score: number
  maxScore: number
  grade: number
  timeSpent: number
  submittedAt: string
  questions: Array<{
    id: string
    question: string
    userAnswer: string
    correctAnswer: string
    isCorrect: boolean
    points: number
    earnedPoints: number
  }>
}

export default function TestResultClientPage() {
  const params = useParams()
  const [user, setUser] = useState<any>(null)
  const [result, setResult] = useState<TestResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}")
    setUser(userData)
    fetchResult()
  }, [params.id])

  const fetchResult = async () => {
    try {
      // Моковые данные результата
      const mockResult: TestResult = {
        id: params.id as string,
        title: "Тест по производным",
        score: 6,
        maxScore: 8,
        grade: 4,
        timeSpent: 18 * 60, // 18 минут в секундах
        submittedAt: new Date().toISOString(),
        questions: [
          {
            id: "1",
            question: "Чему равна производная функции f(x) = x²?",
            userAnswer: "2x",
            correctAnswer: "2x",
            isCorrect: true,
            points: 2,
            earnedPoints: 2,
          },
          {
            id: "2",
            question: "Производная константы равна:",
            userAnswer: "0",
            correctAnswer: "0",
            isCorrect: true,
            points: 1,
            earnedPoints: 1,
          },
          {
            id: "3",
            question: "Запишите правило дифференцирования произведения функций.",
            userAnswer: "(uv)' = u'v + uv'",
            correctAnswer: "(uv)' = u'v + uv'",
            isCorrect: true,
            points: 3,
            earnedPoints: 3,
          },
          {
            id: "4",
            question: "Найдите производную функции f(x) = 3x² + 2x - 1 в точке x = 1.",
            userAnswer: "6",
            correctAnswer: "8",
            isCorrect: false,
            points: 2,
            earnedPoints: 0,
          },
        ],
      }

      setResult(mockResult)
    } catch (error) {
      console.error("Error fetching result:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const getGradeColor = (grade: number) => {
    if (grade >= 5) return "text-green-600"
    if (grade >= 4) return "text-blue-600"
    if (grade >= 3) return "text-yellow-600"
    return "text-red-600"
  }

  const getGradeBadgeVariant = (grade: number) => {
    if (grade >= 5) return "default"
    if (grade >= 4) return "secondary"
    return "destructive"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100">
        <Header user={user} setUser={setUser} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Загрузка результатов...</div>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100">
        <Header user={user} setUser={setUser} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Результаты не найдены</div>
        </div>
      </div>
    )
  }

  const percentage = (result.score / result.maxScore) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100">
      <Header user={user} setUser={setUser} />

      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Заголовок */}
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-8">
            <div className="text-center">
              <Award className="h-16 w-16 mx-auto mb-4 text-red-600" />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Результаты теста</h1>
              <p className="text-gray-600">{result.title}</p>
            </div>
          </motion.div>

          {/* Общие результаты */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-red-100 mb-6">
              <CardHeader>
                <CardTitle className="text-center">Ваш результат</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="text-4xl sm:text-6xl font-bold">
                    <span className={getGradeColor(result.grade)}>{result.grade}</span>
                  </div>
                  <Badge variant={getGradeBadgeVariant(result.grade)} className="text-lg px-4 py-2">
                    {result.grade >= 5
                      ? "Отлично"
                      : result.grade >= 4
                        ? "Хорошо"
                        : result.grade >= 3
                          ? "Удовлетворительно"
                          : "Неудовлетворительно"}
                  </Badge>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-800">
                        {result.score}/{result.maxScore}
                      </div>
                      <div className="text-sm text-gray-600">Баллы</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-800">{Math.round(percentage)}%</div>
                      <div className="text-sm text-gray-600">Процент</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-800">{formatTime(result.timeSpent)}</div>
                      <div className="text-sm text-gray-600">Время</div>
                    </div>
                  </div>

                  <Progress value={percentage} className="w-full mt-4" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Детальные результаты */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-red-100 mb-6">
              <CardHeader>
                <CardTitle>Детальные результаты</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {result.questions.map((question, index) => (
                    <div
                      key={question.id}
                      className={`p-4 rounded-lg border-2 ${
                        question.isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-3">
                        <div className="flex items-start gap-3">
                          {question.isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 mb-2">
                              Вопрос {index + 1}: {question.question}
                            </h4>
                          </div>
                        </div>
                        <Badge variant={question.isCorrect ? "default" : "destructive"}>
                          {question.earnedPoints}/{question.points} балл(ов)
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">Ваш ответ:</span>
                          <p className={question.isCorrect ? "text-green-700" : "text-red-700"}>
                            {question.userAnswer || "Не отвечено"}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Правильный ответ:</span>
                          <p className="text-green-700">{question.correctAnswer}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Действия */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/student/dashboard">
                <Button variant="outline" className="w-full sm:w-auto">
                  Вернуться к курсам
                </Button>
              </Link>
              <Button className="bg-red-600 hover:bg-red-700 w-full sm:w-auto">
                <RotateCcw className="h-4 w-4 mr-2" />
                Пройти еще раз
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
