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

/* Hero signature: one payment request retried three times, settled once. */
const events = [
  { name: 'payment.requested', note: 'key ord_8841', state: 'received' },
  { name: 'payment.requested', note: 'key ord_8841 · retry', state: 'duplicate, ignored' },
  { name: 'payment.requested', note: 'key ord_8841 · retry', state: 'duplicate, ignored' },
  { name: 'payment.settled', note: '1 charge · 1 ledger entry', state: 'settled' },
]

function Ledger() {
  const [n, setN] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setN((v) => (v > events.length ? 0 : v + 1)), n > events.length ? 2600 : 900)
    return () => clearTimeout(t)
  }, [n])
  return (
    <div className="ledger" aria-label="Animated example of an idempotent payment: three requests, one settlement">
      <div className="ledger-head">idempotent transaction log</div>
      <AnimatePresence>
        {events.slice(0, n).map((e, i) => (
          <motion.div key={i} className={`row ${e.state === 'settled' ? 'ok' : ''}`}
            initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <span className="ev">{e.name}</span><span className="nt">{e.note}</span><span className="st">{e.state}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

function Hero() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 600], [0, -80])
  return (
    <header className="hero" id="top">
      <motion.div style={{ y }} initial="hidden" animate="show" transition={{ staggerChildren: 0.12 }}>
        <motion.p variants={rise} className="role">{profile.role}</motion.p>
        <motion.h1 variants={rise}>Fareed<br />Sokkar</motion.h1>
        <motion.p variants={rise} className="lede">{profile.summary}</motion.p>
        <motion.div variants={rise}><Ledger /></motion.div>
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
        <motion.h2 variants={rise} initial="hidden" whileInView="show" viewport={{ once: true }}>Let’s talk about your billing system.</motion.h2>
        <a className="mail" href={`mailto:${profile.email}`}>{profile.email}</a>
        <p><a href={`tel:${profile.phone.replace(/[^+\d]/g, '')}`}>{profile.phone}</a></p>
        <p className="links"><a href={profile.linkedin}>LinkedIn</a> <a href={profile.github}>GitHub</a></p>
      </div>
    </footer>
  )
}

export default function App() {
  useSmoothScroll()
  const { scrollYProgress } = useScroll()
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 28 })
  return (
    <>
      <motion.div className="progress" style={{ scaleX: bar }} />
      <nav className="nav">
        <a href="#top" onClick={goTo('top')}>FS</a>
        <div>
          {['impact', 'experience', 'skills', 'contact'].map((id) => (
            <a key={id} href={`#${id}`} onClick={goTo(id)}>{id}</a>
          ))}
        </div>
      </nav>
      <Hero />
      <main><Achievements /><Experience /><Skills /></main>
      <Contact />
    </>
  )
}
