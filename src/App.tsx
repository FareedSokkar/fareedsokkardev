import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useTransform, AnimatePresence, type Variants } from 'framer-motion'
import Lenis from 'lenis'
import { profile, achievements, jobs, skills, more } from './data'

let lenis: Lenis | null = null

function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    lenis = new Lenis({ duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 4) })
    let id = 0
    const raf = (t: number) => { lenis?.raf(t); id = requestAnimationFrame(raf) }
    id = requestAnimationFrame(raf)
    return () => { cancelAnimationFrame(id); lenis?.destroy(); lenis = null }
  }, [])
}

const goTo = (id: string) => (e: React.MouseEvent) => {
  e.preventDefault()
  const el = document.getElementById(id)
  if (!el) return
  lenis ? lenis.scrollTo(el, { offset: -60 }) : el.scrollIntoView({ behavior: 'auto' })
}

const rise: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

type Theme = 'light' | 'dark'

function getInitialTheme(): Theme {
  const savedTheme = window.localStorage.getItem('fareed-portfolio-theme')
  if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/* Hero signature: one payment request retried three times, settled once. */
const events = [
  { name: 'payment.requested', note: 'key ord_8841', state: 'received' },
  { name: 'payment.requested', note: 'key ord_8841 · retry', state: 'duplicate, ignored' },
  { name: 'payment.requested', note: 'key ord_8841 · retry', state: 'duplicate, ignored' },
  { name: 'payment.settled', note: '1 charge · 1 ledger entry', state: 'settled' },
]

function Ledger({ darkMode }: { darkMode: boolean }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setN((v) => (v > events.length ? 0 : v + 1)), n > events.length ? 2600 : 900)
    return () => clearTimeout(t)
  }, [n])
  return (
    <div className="ledger" style={darkMode ? { background: '#151b23', color: '#f1f5f9', borderColor: '#3b4654' } : undefined} aria-label="Animated example of an idempotent payment: three requests, one settlement">
      <div className="ledger-head" style={darkMode ? { background: '#202a36', color: '#f1f5f9', borderColor: '#3b4654' } : undefined}>idempotent transaction log</div>
      <AnimatePresence>
        {events.slice(0, n).map((e, i) => (
          <motion.div key={i} className={`row ${e.state === 'settled' ? 'ok' : ''}`}
            style={darkMode ? { background: e.state === 'settled' ? '#18372d' : '#151b23', color: '#f1f5f9', borderColor: '#3b4654' } : undefined}
            initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <span className="ev" style={darkMode ? { color: '#f1f5f9' } : undefined}>{e.name}</span><span className="nt" style={darkMode ? { color: '#cbd5e1' } : undefined}>{e.note}</span><span className="st" style={darkMode ? { color: '#86efac' } : undefined}>{e.state}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

function Hero({ darkMode }: { darkMode: boolean }) {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 600], [0, -80])
  return (
    <header className="hero" id="top">
      <motion.div style={{ y }} initial="hidden" animate="show" transition={{ staggerChildren: 0.12 }}>
        <motion.p variants={rise} className="role">{profile.role}</motion.p>
        <motion.h1 variants={rise}>Fareed<br />Sokkar</motion.h1>
        <motion.p variants={rise} className="lede">{profile.summary}</motion.p>
        <motion.div variants={rise}><Ledger darkMode={darkMode} /></motion.div>
      </motion.div>
      <motion.figure className="photo" initial={{ clipPath: 'inset(0 0 100% 0)', opacity: 0 }}
        animate={{ clipPath: 'inset(0 0 0% 0)', opacity: 1 }} transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}>
        <img src={profile.photo} alt={`Portrait of ${profile.name}`} width={480} height={600} />
      </motion.figure>
    </header>
  )
}

function Achievements() {
  return (
    <section id="impact" className="wrap">
      <h2>Impact</h2>
      {achievements.map((a) => (
        <motion.div key={a.big} className="ach" variants={rise} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
          <span className="big">{a.big}</span><p>{a.text}</p>
        </motion.div>
      ))}
    </section>
  )
}

function Experience() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 70%'] })
  const grow = useSpring(scrollYProgress, { stiffness: 90, damping: 22 })
  return (
    <section id="experience" className="wrap">
      <h2>Experience</h2>
      <div className="jobs" ref={ref}>
        <div className="track"><motion.div className="fill" style={{ scaleY: grow }} /></div>
        {jobs.map((j) => (
          <motion.article key={j.when} className="job" variants={rise} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }}>
            <span className="when">{j.when}</span>
            <h3>{j.title}</h3>
            <p className="org">{j.org}</p>
            <ul>{j.points.map((p) => <li key={p}>{p}</li>)}</ul>
            <p className="stack">{j.stack.join(', ')}</p>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

function Skills() {
  return (
    <section id="skills" className="wrap">
      <h2>Skills</h2>
      {skills.map((s) => (
        <div className="skill" key={s.group}>
          <h3>{s.group}</h3>
          <motion.ul initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ staggerChildren: 0.05 }}>
            {s.items.map((i) => <motion.li key={i} variants={rise} whileHover={{ y: -3 }}>{i}</motion.li>)}
          </motion.ul>
        </div>
      ))}
      <dl className="more">{more.map((m) => <div key={m.k}><dt>{m.k}</dt><dd>{m.v}</dd></div>)}</dl>
    </section>
  )
}

function Contact() {
  return (
    <footer id="contact" className="contact">
      <div className="wrap">
        <motion.h2 variants={rise} initial="hidden" whileInView="show" viewport={{ once: true }}>Let’s talk about your revenue system.</motion.h2>
        <a className="mail" href={`mailto:${profile.email}`}>{profile.email}</a>
        <p><a href={`tel:${profile.phone.replace(/[^+\d]/g, '')}`}>{profile.phone}</a></p>
        <p className="links"><a href={profile.linkedin}>LinkedIn</a> <a href={profile.github}>GitHub</a></p>
      </div>
    </footer>
  )
}

export default function App() {
  useSmoothScroll()
  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  const { scrollYProgress } = useScroll()
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 28 })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem('fareed-portfolio-theme', theme)
  }, [theme])

  return (
    <>
      <div className="ambient-background" aria-hidden="true" />
      <motion.div className="progress" style={{ scaleX: bar }} />
      <nav className="nav">
        <a href="#top" onClick={goTo('top')}>FS</a>
        <div className="nav-links">
          {['impact', 'experience', 'skills', 'contact'].map((id) => (
            <a key={id} href={`#${id}`} onClick={goTo(id)}>{id}</a>
          ))}
          <button
            className="theme-toggle"
            type="button"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            aria-pressed={theme === 'dark'}
            onClick={() => setTheme((current) => current === 'light' ? 'dark' : 'light')}
          >
            <span aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span>
            {theme === 'light' ? 'Dark' : 'Light'}
          </button>
        </div>
      </nav>
      <Hero darkMode={theme === 'dark'} />
      <main><Achievements /><Experience /><Skills /></main>
      <Contact />
    </>
  )
}
