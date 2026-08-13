import DecodeText from './DecodeText'
import Reveal from './Reveal'

interface Props {
  /** Tartib raqami, masalan "01" */
  index: string
  title: string
  /** Terminal buyruq ko'rinishidagi kichik izoh, masalan "cat about.md" */
  command?: string
  className?: string
}

/** Har bir sektsiya sarlavhasi — raqam + decode sarlavha + terminal buyruq */
export default function SectionHeading({ index, title, command, className }: Props) {
  return (
    <Reveal className={className}>
      <div className="mb-10 md:mb-14">
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="font-mono text-matrix text-sm md:text-base">/{index}/</span>
          <DecodeText
            as="h2"
            text={title}
            className="font-display text-2xl md:text-4xl font-bold uppercase tracking-wider text-ghost"
          />
        </div>
        {command && (
          <p className="mt-2 font-mono text-xs md:text-sm text-steel">
            <span className="text-amber">❯</span> {command}
            <span className="inline-block w-2 h-3.5 bg-matrix ml-1 align-middle animate-blink" />
          </p>
        )}
        <div className="mt-4 h-px w-full bg-gradient-to-r from-matrix via-steel-dim to-transparent" />
      </div>
    </Reveal>
  )
}
