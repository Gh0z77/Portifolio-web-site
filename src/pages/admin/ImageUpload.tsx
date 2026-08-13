import { useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'

interface Props {
  value: string | null
  onChange: (url: string | null) => void
  label?: string
}

/** Supabase Storage'ga rasm yuklash komponenti (media bucket) */
export default function ImageUpload({ value, onChange, label = 'rasm' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [manualUrl, setManualUrl] = useState('')

  const upload = async (file: File) => {
    setError(null)
    setUploading(true)
    try {
      const clean = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-')
      const path = `${Date.now()}-${clean}`
      const { error: upErr } = await supabase.storage.from('media').upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      })
      if (upErr) throw upErr
      const { data } = supabase.storage.from('media').getPublicUrl(path)
      onChange(data.publicUrl)
    } catch (e) {
      setError(`[XATO] yuklab bo'lmadi: ${e instanceof Error ? e.message : String(e)}`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label className="mb-1.5 block font-mono text-xs text-matrix">--{label}</label>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) upload(f)
          e.target.value = ''
        }}
      />

      {value ? (
        <div className="clip-corner-sm relative overflow-hidden border border-steel-dim/60">
          <img src={value} alt="preview" className="max-h-48 w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 flex gap-2 bg-bg/85 p-2 backdrop-blur">
            <button
              type="button"
              data-hover
              onClick={() => inputRef.current?.click()}
              className="flex-1 border border-matrix/50 px-2 py-1.5 font-mono text-xs text-matrix-bright transition-colors hover:bg-matrix hover-text-on-matrix"
            >
              almashtirish
            </button>
            <button
              type="button"
              data-hover
              onClick={() => onChange(null)}
              className="flex-1 border border-amber/50 px-2 py-1.5 font-mono text-xs text-amber-bright transition-colors hover:bg-amber hover-text-on-amber"
            >
              o'chirish
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          data-hover
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="clip-corner-sm flex h-32 w-full flex-col items-center justify-center gap-2 border border-dashed border-steel-dim bg-navy-900/30 font-mono text-xs text-steel-light transition-colors hover:border-matrix hover:text-matrix-bright"
        >
          {uploading ? (
            <span className="animate-pulse">yuklanmoqda...</span>
          ) : (
            <>
              <span className="text-2xl">+</span>
              <span>rasm yuklash</span>
            </>
          )}
        </button>
      )}

      {/* Qo'lda URL kiritish varianti */}
      <div className="mt-2 flex gap-2">
        <input
          value={manualUrl}
          onChange={(e) => setManualUrl(e.target.value)}
          placeholder="yoki URL kiriting: https://..."
          className="cyber-input flex-1 !py-2 text-xs"
        />
        <button
          type="button"
          data-hover
          onClick={() => {
            if (manualUrl.trim()) {
              onChange(manualUrl.trim())
              setManualUrl('')
            }
          }}
          className="border border-steel-dim px-3 font-mono text-xs text-steel-light transition-colors hover:border-matrix hover:text-matrix-bright"
        >
          OK
        </button>
      </div>

      {error && <p className="mt-2 font-mono text-xs text-amber-bright">{error}</p>}
    </div>
  )
}
