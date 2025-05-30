"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Calendar, Upload, Save, Eye, EyeOff, Shield } from "lucide-react"
import Header from "@/components/header"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
    grade: "",
    subject: "",
    experience: "",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}")
    if (!userData.id) {
      router.push("/login")
      return
    }
    setUser(userData)
    setFormData({
      name: userData.name || "",
      email: userData.email || "",
      phone: userData.phone || "",
      address: userData.address || "",
      bio: userData.bio || "",
      grade: userData.grade || "",
      subject: userData.subject || "",
      experience: userData.experience || "",
    })
  }, [router])

  const handleSaveProfile = async () => {
    setLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        const updatedUser = { ...user, ...formData }
        setUser(updatedUser)
        localStorage.setItem("user", JSON.stringify(updatedUser))
        setMessage("Профиль успешно обновлен!")
        setIsEditing(false)
      } else {
        setMessage(data.message || "Ошибка обновления профиля")
      }
    } catch (err) {
      setMessage("Ошибка подключения к серверу")
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage("Новые пароли не совпадают")
      return
    }

    setLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/profile/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage("Пароль успешно изменен!")
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
        setShowPasswordChange(false)
      } else {
        setMessage(data.message || "Ошибка изменения пароля")
      }
    } catch (err) {
      setMessage("Ошибка подключения к серверу")
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("avatar", file)

    setLoading(true)

    try {
      const response = await fetch("/api/profile/upload-avatar", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        const updatedUser = { ...user, avatar: data.avatarUrl }
        setUser(updatedUser)
        localStorage.setItem("user", JSON.stringify(updatedUser))
        setMessage("Аватар успешно обновлен!")
      } else {
        setMessage(data.message || "Ошибка загрузки аватара")
      }
    } catch (err) {
      setMessage("Ошибка подключения к серверу")
    } finally {
      setLoading(false)
    }
  }

  if (!user) return <div>Загрузка...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100">
      <Header user={user} setUser={setUser} />

      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Профиль пользователя</h1>
            <p className="text-gray-600">Управление личными данными и настройками</p>
          </div>

          {message && (
            <Alert className={`mb-6 ${message.includes("успешно") ? "border-green-500" : "border-red-500"}`}>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Основная информация</TabsTrigger>
              <TabsTrigger value="security">Безопасность</TabsTrigger>
              <TabsTrigger value="stats">Статистика</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card className="border-red-100">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <User className="h-5 w-5 text-red-600" />
                      Личная информация
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(!isEditing)}
                      className="border-red-600 text-red-600 hover:bg-red-50"
                    >
                      {isEditing ? "Отменить" : "Редактировать"}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Аватар */}
                    <div className="flex flex-col items-center space-y-4">
                      <Avatar className="h-32 w-32">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-2xl">{user.name?.[0]}</AvatarFallback>
                      </Avatar>
                      <div className="text-center">
                        <h3 className="font-semibold text-lg">{user.name}</h3>
                        <Badge variant={user.role === "teacher" ? "default" : "secondary"}>
                          {user.role === "teacher" ? "Учитель" : "Ученик"}
                        </Badge>
                      </div>
                      {isEditing && (
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                            id="avatar-upload"
                          />
                          <label htmlFor="avatar-upload">
                            <Button variant="outline" className="cursor-pointer" asChild>
                              <span>
                                <Upload className="h-4 w-4 mr-2" />
                                Загрузить фото
                              </span>
                            </Button>
                          </label>
                        </div>
                      )}
                    </div>

                    {/* Основная информация */}
                    <div className="md:col-span-2 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Полное имя</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Телефон</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            disabled={!isEditing}
                            placeholder="+7 (XXX) XXX-XX-XX"
                          />
                        </div>
                        {user.role === "student" && (
                          <div className="space-y-2">
                            <Label htmlFor="grade">Класс</Label>
                            <Input
                              id="grade"
                              value={formData.grade}
                              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                              disabled={!isEditing}
                              placeholder="11А"
                            />
                          </div>
                        )}
                        {user.role === "teacher" && (
                          <div className="space-y-2">
                            <Label htmlFor="subject">Предмет</Label>
                            <Input
                              id="subject"
                              value={formData.subject}
                              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                              disabled={!isEditing}
                              placeholder="Математика, Физика"
                            />
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Адрес</Label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          disabled={!isEditing}
                          placeholder="Город, улица, дом"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">{user.role === "teacher" ? "О себе / Опыт работы" : "О себе"}</Label>
                        <Textarea
                          id="bio"
                          value={formData.bio}
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                          disabled={!isEditing}
                          rows={4}
                          placeholder={
                            user.role === "teacher"
                              ? "Расскажите о своем опыте преподавания..."
                              : "Расскажите о себе, своих интересах..."
                          }
                        />
                      </div>

                      {isEditing && (
                        <div className="flex gap-2 pt-4">
                          <Button
                            onClick={handleSaveProfile}
                            disabled={loading}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            {loading ? "Сохранение..." : "Сохранить"}
                          </Button>
                          <Button variant="outline" onClick={() => setIsEditing(false)}>
                            Отменить
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card className="border-red-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-red-600" />
                    Безопасность аккаунта
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold">Изменить пароль</h4>
                      <p className="text-sm text-gray-600">Обновите пароль для повышения безопасности</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setShowPasswordChange(!showPasswordChange)}
                      className="border-red-600 text-red-600 hover:bg-red-50"
                    >
                      {showPasswordChange ? "Отменить" : "Изменить пароль"}
                    </Button>
                  </div>

                  {showPasswordChange && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-4 p-4 border border-red-200 rounded-lg"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Текущий пароль</Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showCurrentPassword ? "text" : "password"}
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            placeholder="Введите текущий пароль"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          >
                            {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword">Новый пароль</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            placeholder="Введите новый пароль"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Подтвердите новый пароль</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          placeholder="Подтвердите новый пароль"
                        />
                      </div>

                      <Button onClick={handleChangePassword} disabled={loading} className="bg-red-600 hover:bg-red-700">
                        {loading ? "Изменение..." : "Изменить пароль"}
                      </Button>
                    </motion.div>
                  )}

                  <div className="space-y-4">
                    <h4 className="font-semibold">Информация об аккаунте</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">Дата регистрации</p>
                          <p className="text-sm text-gray-600">{user.created_at || "01.01.2024"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">Email подтвержден</p>
                          <p className="text-sm text-green-600">Да</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {user.role === "student" ? (
                  <>
                    <Card className="border-red-100">
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold text-red-600 mb-2">3</div>
                        <p className="text-gray-600">Активных курса</p>
                      </CardContent>
                    </Card>
                    <Card className="border-red-100">
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">4.5</div>
                        <p className="text-gray-600">Средний балл</p>
                      </CardContent>
                    </Card>
                    <Card className="border-red-100">
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">12</div>
                        <p className="text-gray-600">Пройдено тестов</p>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <>
                    <Card className="border-red-100">
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold text-red-600 mb-2">25</div>
                        <p className="text-gray-600">Учеников</p>
                      </CardContent>
                    </Card>
                    <Card className="border-red-100">
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">8</div>
                        <p className="text-gray-600">Курсов</p>
                      </CardContent>
                    </Card>
                    <Card className="border-red-100">
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">45</div>
                        <p className="text-gray-600">Лекций</p>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>

              <Card className="border-red-100">
                <CardHeader>
                  <CardTitle>Последняя активность</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <span className="text-sm">Просмотр лекции "Производные функций"</span>
                      <span className="text-sm text-gray-500">2 часа назад</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <span className="text-sm">Прохождение теста по алгебре</span>
                      <span className="text-sm text-gray-500">1 день назад</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <span className="text-sm">Обновление профиля</span>
                      <span className="text-sm text-gray-500">3 дня назад</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
