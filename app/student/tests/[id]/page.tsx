// Генерируем статические параметры для экспорта
export async function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }, { id: "5" }]
}

import TakeTestClientPage from "./TakeTestClientPage"

export default function TakeTestPage({ params }: { params: { id: string } }) {
  return <TakeTestClientPage params={params} />
}
