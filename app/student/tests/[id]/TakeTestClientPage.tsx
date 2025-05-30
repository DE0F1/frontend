"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, CheckCircle, AlertCircle, ArrowLeft, ArrowRight } from "lucide-react"
import Header from "@/components/header"

interface Question {
  id: string
  type: "multiple_choice" | "text" | "number"
  question: string
  options?: string[]
  points: number
}

interface TestData {
  id: string
  title: string
  description: string
  timeLimit: number
  questions: Question[]
}

export default function TakeTestClientPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [test, setTest] = useState<TestData | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}")
    setUser(userData)
    fetchTest()
  }, [params.id])

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && test) {
      handleSubmit()
    }
  }, [timeLeft, test])

  const fetchTest = async () => {
    try {
      // Моковые данные
      const mockTest: TestData = {
        id: params.id as string,
        title: "Тест по производным",
        description: "Проверка знаний по теме 'Производная функции'",
        timeLimit: 30,
        questions: [
          {
            id: "1",
            type: "multiple_choice",
            question: "Чему равна производная функции f(x) = x²?",
            options: ["2x", "x", "2", "x²"],
            points: 2,
          },
          {
            id: "2",
            type: "multiple_choice",
            question: "Производная константы равна:",
            options: ["1", "0", "∞", "x"],
            points: 1,
          },
          {
            id: "3",
            type: "text",
            question: "Запишите правило дифференцирования произведения функций.",
            points: 3,
          },
          {
            id: "4",
            type: "number",
            question: "Найдите производную функции f(x) = 3x² + 2x - 1 в точке x = 1.",
            points: 2,
          },
        ],
      }

      setTest(mockTest)
      setTimeLeft(mockTest.timeLimit * 60) // конвертируем в секунды
    } catch (error) {
      console.error("Error fetching test:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers({ ...answers, [questionId]: answer })
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      // Здесь бы был запрос к API
      console.log("Submitting answers:", answers)
      router.push(`/student/tests/${params.id}/result`)
    } catch (error) {
      console.error("Error submitting test:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const progress = test ? ((currentQuestion + 1) / test.questions.length) * 100 : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100">
        <Header user={user} setUser={setUser} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Загрузка теста...</div>
        </div>
      </div>
    )
  }

  if (!test) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100">
        <Header user={user} setUser={setUser} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Тест не найден</div>
        </div>
      </div>
    )
  }

  const currentQ = test.questions[currentQuestion]

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100">
      <Header user={user} setUser={setUser} />

      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Заголовок и таймер */}
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{test.title}</h1>
                <p className="text-gray-600">{test.description}</p>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow">
                <Clock className="h-5 w-5 text-red-600" />
                <span className={`font-mono text-lg ${timeLeft < 300 ? "text-red-600" : "text-gray-800"}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>

            {/* Прогресс */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>
                  Вопрос {currentQuestion + 1} из {test.questions.length}
                </span>
                <span>{Math.round(progress)}% завершено</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </motion.div>

          {/* Текущий вопрос */}
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-red-100 mb-6">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <CardTitle className="text-lg sm:text-xl">{currentQ.question}</CardTitle>
                  <Badge variant="outline">{currentQ.points} балл(ов)</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {currentQ.type === "multiple_choice" && (
                  <div className="space-y-3">
                    {currentQ.options?.map((option, index) => (
                      <label
                        key={index}
                        className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-red-50 transition-colors"
                      >
                        <input
                          type="radio"
                          name={`question-${currentQ.id}`}
                          value={option}
                          checked={answers[currentQ.id] === option}
                          onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                          className="text-red-600"
                        />
                        <span className="flex-1">{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {currentQ.type === "text" && (
                  <Textarea
                    value={answers[currentQ.id] || ""}
                    onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                    placeholder="Введите ваш ответ..."
                    rows={4}
                    className="w-full"
                  />
                )}

                {currentQ.type === "number" && (
                  <Input
                    type="number"
                    value={answers[currentQ.id] || ""}
                    onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                    placeholder="Введите числовой ответ..."
                    className="w-full sm:w-64"
                  />
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Навигация */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
                className="w-full sm:w-auto"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Предыдущий
              </Button>

              <div className="flex flex-col sm:flex-row gap-4">
                {currentQuestion < test.questions.length - 1 ? (
                  <Button
                    onClick={() => setCurrentQuestion(currentQuestion + 1)}
                    className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
                  >
                    Следующий
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {submitting ? "Отправка..." : "Завершить тест"}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Предупреждение о времени */}
          {timeLeft < 300 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="fixed bottom-4 right-4 bg-red-100 border border-red-300 rounded-lg p-4 shadow-lg max-w-sm"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-semibold text-red-800">Осталось мало времени!</p>
                  <p className="text-sm text-red-600">Поторопитесь с ответами</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
