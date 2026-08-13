import GlitchText from '../components/ui/GlitchText'
import CyberButton from '../components/ui/CyberButton'
import PageTransition from '../components/PageTransition'
import { useI18n } from '../lib/i18n'

export default function NotFound() {
  const { tr } = useI18n()
  return (
    <PageTransition>
      <div className="flex min-h-[80vh] flex-col items-center justify-center px-5 text-center">
        <p className="font-mono text-sm text-amber mb-4">{tr.notFound.errLine}</p>
        <h1 className="font-display text-7xl md:text-9xl font-black text-ghost">
          <GlitchText text="404" interval={3} />
        </h1>
        <p className="mt-6 font-mono text-steel-light max-w-md">{tr.notFound.text}</p>
        <div className="mt-10">
          <CyberButton to="/">{tr.notFound.homeBtn}</CyberButton>
        </div>
      </div>
    </PageTransition>
  )
}
