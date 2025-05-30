"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BookOpen, User, LogOut, Menu, X } from "lucide-react"

interface HeaderProps {
  user: any
  setUser: (user: any) => void
}

export default function Header({ user, setUser }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white/90 backdrop-blur-md shadow-lg border-b border-red-100 sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
            <span className="text-lg sm:text-xl font-bold text-gray-800 hidden xs:block">МБОУ СОШ №2</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-red-600 transition-colors">
              Главная
            </Link>
            <Link href="/courses" className="text-gray-700 hover:text-red-600 transition-colors">
              Курсы
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <span>{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={user.role === "teacher" ? "/teacher/dashboard" : "/student/dashboard"}>
                      <User className="mr-2 h-4 w-4" />
                      Личный кабинет
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      Профиль
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Выйти
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login">
                  <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                    Вход
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-red-600 hover:bg-red-700">Регистрация</Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="md:hidden mt-4 pb-4 border-t border-red-100 bg-white/95 backdrop-blur-sm"
          >
            <div className="flex flex-col space-y-3 pt-4">
              <Link href="/" className="text-gray-700 hover:text-red-600 transition-colors">
                Главная
              </Link>
              <Link href="/courses" className="text-gray-700 hover:text-red-600 transition-colors">
                Курсы
              </Link>
              {user ? (
                <>
                  <Link href={user.role === "teacher" ? "/teacher/dashboard" : "/student/dashboard"}>
                    <Button variant="outline" className="w-full justify-start">
                      <User className="mr-2 h-4 w-4" />
                      Личный кабинет
                    </Button>
                  </Link>
                  <Button variant="outline" onClick={handleLogout} className="w-full justify-start">
                    <LogOut className="mr-2 h-4 w-4" />
                    Выйти
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outline" className="w-full border-red-600 text-red-600">
                      Вход
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="w-full bg-red-600 hover:bg-red-700">Регистрация</Button>
                  </Link>
                </>
              )}
            </div>
          </motion.nav>
        )}
      </div>
    </motion.header>
  )
}
