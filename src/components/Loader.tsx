import { useI18n } from '../lib/i18n'

/** Sahifa yuklanayotganda ko'rinadigan terminal-uslub loader */
export default function Loader() {
  const { tr } = useI18n()
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="font-mono text-sm text-matrix">
        <span className="animate-pulse">[ {tr.common.loading}</span>
        <span className="inline-block w-2 h-4 bg-matrix ml-1 align-middle animate-blink" />
        <span className="animate-pulse"> ]</span>
      </div>
    </div>
  )
}
