import { motion, useScroll, useSpring } from 'framer-motion'

/** Sahifa tepasidagi ingichka scroll progress chizig'i */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 })

  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-matrix via-matrix-bright to-amber"
      style={{ scaleX, boxShadow: '0 0 8px rgb(var(--clr-matrix) / 0.6)' }}
    />
  )
}
