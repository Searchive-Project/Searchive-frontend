import { Upload, Search, MessageSquare } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface FeatureCardsProps {
  onCardClick?: () => void
  onUploadClick?: () => void
}

export default function FeatureCards({ onCardClick, onUploadClick }: FeatureCardsProps) {
  const navigate = useNavigate()
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 w-full">
      <div
        style={{ padding: '1rem' }}
        className="rounded-2xl bg-white border border-gray-200/60 hover:border-blue-400/40 hover:shadow-lg transition-all cursor-pointer"
        onClick={onUploadClick || onCardClick}
      >
        <div className="w-12 h-12 rounded-xl bg-blue-400/10 flex items-center justify-center mb-4">
          <Upload className="w-6 h-6 text-blue-400" />
        </div>
        <h3 className="font-semibold text-gray-900 mb-2 text-base">간편한 업로드</h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          문서를 드래그 앤 드롭하여 즉시 처리하세요
        </p>
      </div>

      <div
        style={{ padding: '1rem' }}
        className="rounded-2xl bg-white border border-gray-200/60 hover:border-blue-400/40 hover:shadow-lg transition-all cursor-pointer"
        onClick={onCardClick}
      >
        <div className="w-12 h-12 rounded-xl bg-blue-300/10 flex items-center justify-center mb-4">
          <Search className="w-6 h-6 text-blue-300" />
        </div>
        <h3 className="font-semibold text-gray-900 mb-2 text-base">스마트 검색</h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          키워드와 의미 이해를 결합한 하이브리드 검색
        </p>
      </div>

      <div
        style={{ padding: '1rem' }}
        className="rounded-2xl bg-white border border-gray-200/60 hover:border-blue-400/40 hover:shadow-lg transition-all cursor-pointer"
        onClick={() => navigate('/conversations')}
      >
        <div className="w-12 h-12 rounded-xl bg-blue-400/10 flex items-center justify-center mb-4">
          <MessageSquare className="w-6 h-6 text-blue-400" />
        </div>
        <h3 className="font-semibold text-gray-900 mb-2 text-base">AI 채팅</h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          문서 컬렉션과 자연스러운 대화를 나누세요
        </p>
      </div>
    </div>
  )
}
