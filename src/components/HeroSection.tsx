"use client"

import { Button } from "./common/Button"
import { ArrowDown, Sparkles } from "lucide-react"
import FeatureCards from "./FeatureCards"

interface HeroSectionProps {
  onGetStarted: () => void
  isLoggedIn?: boolean
  onFeatureClick: () => void
  onUploadClick?: () => void
}

export default function HeroSection({ onGetStarted, isLoggedIn, onFeatureClick, onUploadClick }: HeroSectionProps) {
  return (
    <>
      <section className="border-b border-slate-200 bg-white px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-md bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-800">
              <Sparkles className="size-4" aria-hidden="true" /> 문서를 더 쉽게 찾고 이해하세요
            </p>
            <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              문서를 쌓아두지 말고, 바로 답을 찾으세요.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              업로드한 문서를 요약하고 태그로 정리한 뒤, 필요한 내용을 AI 채팅으로 빠르게 확인합니다.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button onClick={onGetStarted} size="lg">{isLoggedIn ? "문서로 이동" : "문서 정리 시작"}</Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              >
                기능 살펴보기 <ArrowDown className="ml-2 size-4" aria-hidden="true" />
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6 sm:p-8">
            <p className="text-sm font-semibold text-blue-800">Searchive 워크플로</p>
            <ol className="mt-5 space-y-4 text-slate-700">
              <li className="flex gap-3"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-blue-600 text-xs font-bold text-white">1</span><span><strong>문서 업로드</strong><br /><span className="text-sm text-slate-600">PDF와 문서를 한 곳에 모읍니다.</span></span></li>
              <li className="flex gap-3"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-blue-600 text-xs font-bold text-white">2</span><span><strong>자동 정리</strong><br /><span className="text-sm text-slate-600">요약과 태그로 핵심 정보를 확인합니다.</span></span></li>
              <li className="flex gap-3"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-blue-600 text-xs font-bold text-white">3</span><span><strong>문서 기반 질문</strong><br /><span className="text-sm text-slate-600">연결한 문서를 바탕으로 AI와 대화합니다.</span></span></li>
            </ol>
          </div>
        </div>
      </section>

      <section id="features" className="bg-slate-50 px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 max-w-xl">
            <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">문서 관리에 필요한 흐름만 담았습니다.</h2>
            <p className="mt-3 text-slate-600">업로드, 검색, 질문을 분리하지 않고 하나의 워크스페이스에서 이어갑니다.</p>
          </div>
          <div id="how-it-works"><FeatureCards onCardClick={onFeatureClick} onUploadClick={onUploadClick} /></div>
        </div>
      </section>
    </>
  )
}
