import CourseDetailPageClient from "./CourseDetailPageClient"

// Генерируем статические параметры для экспорта
export async function generateStaticParams() {
  // Возвращаем список ID курсов для статической генерации
  return [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }, { id: "5" }, { id: "6" }]
}

export default function CourseDetailPage() {
  return <CourseDetailPageClient />
}
