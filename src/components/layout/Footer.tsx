const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-7 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="font-semibold text-slate-800">Searchive</p>
          <p className="mt-1">문서 기반 검색과 대화를 위한 개인 워크스페이스</p>
        </div>
        <p>© 2025 Searchive</p>
      </div>
    </footer>
  )
}

export default Footer
