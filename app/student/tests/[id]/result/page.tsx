// Генерируем статические параметры для экспорта
export async function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }, { id: "5" }]
}

import TestResultClientPage from "./TestResultClientPage"

export default function TestResultPage() {
  return <TestResultClientPage />
}
