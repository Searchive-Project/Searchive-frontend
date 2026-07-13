import { MessageSquare, Search, Upload } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface FeatureCardsProps {
  onCardClick?: () => void
  onUploadClick?: () => void
}

export default function FeatureCards({ onCardClick, onUploadClick }: FeatureCardsProps) {
  const navigate = useNavigate()
  const cards = [
    { title: "문서 업로드", description: "파일을 올리면 요약과 태그를 함께 확인합니다.", icon: Upload, onClick: onUploadClick || onCardClick },
    { title: "문서 검색", description: "파일명과 태그를 기준으로 필요한 문서를 찾습니다.", icon: Search, onClick: onCardClick },
    { title: "AI 채팅", description: "선택한 문서를 기반으로 바로 질문할 수 있습니다.", icon: MessageSquare, onClick: () => navigate("/conversations") },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map(({ title, description, icon: Icon, onClick }) => (
        <button
          key={title}
          type="button"
          onClick={onClick}
          className="group rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md active:translate-y-0"
        >
          <span className="grid size-10 place-items-center rounded-lg bg-blue-50 text-blue-700 transition group-hover:bg-blue-600 group-hover:text-white">
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <h3 className="mt-5 font-semibold text-slate-950">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        </button>
      ))}
    </div>
  )
}
