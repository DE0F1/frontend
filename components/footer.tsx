"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { BookOpen, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-8 w-8 text-red-500" />
              <span className="text-xl font-bold">МБОУ СОШ №2</span>
            </div>
            <p className="text-gray-400 mb-4">Качественное образование в области физико-математических дисциплин</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold mb-4">Навигация</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-red-500 transition-colors">
                  Главная
                </Link>
              </li>
              <li>
                <Link href="/courses" className="text-gray-400 hover:text-red-500 transition-colors">
                  Курсы
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-red-500 transition-colors">
                  О нас
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-red-500 transition-colors">
                  Контакты
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-4">Курсы</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/courses/1" className="text-gray-400 hover:text-red-500 transition-colors">
                  Алгебра
                </Link>
              </li>
              <li>
                <Link href="/courses/2" className="text-gray-400 hover:text-red-500 transition-colors">
                  Физика
                </Link>
              </li>
              <li>
                <Link href="/courses/3" className="text-gray-400 hover:text-red-500 transition-colors">
                  Геометрия
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-4">Контакты</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-red-500" />
                <span className="text-gray-400">+7 (XXX) XXX-XX-XX</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-red-500" />
                <span className="text-gray-400">info@school2.ru</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-red-500" />
                <span className="text-gray-400">г. Донской, ул. Западная, д. 27</span>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="border-t border-gray-800 mt-12 pt-8 text-center"
        >
          <p className="text-gray-400">© 2024 МБОУ СОШ №2. Все права защищены.</p>
        </motion.div>
      </div>
    </footer>
  )
}
