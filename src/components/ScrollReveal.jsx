import { useEffect, useRef } from 'react'

export default function ScrollReveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        node.classList.add('is-visible')
        observer.disconnect()
      }
    }, { threshold: 0.12 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return <div ref={ref} className={`scroll-reveal ${className}`} style={{ '--reveal-delay': `${delay}ms` }}>{children}</div>
}
