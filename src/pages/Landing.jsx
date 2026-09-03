import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import TextInput from '../components/ui/TextInput'
import Icon from '../components/ui/Icon'
import Stepper from '../components/ui/Stepper'
import Logo from '../components/layout/Logo'
import Background from '../components/layout/Background'
import { useQuiz } from '../context/QuizContext'
import { validateBiodata } from '../utils/validation'
import { QUESTIONS, PROGRAMS } from '../data/quizData'

const TARGET_OPTIONS = [
  { value: 'conversation', label: 'Conversation', desc: 'Lancar ngobrol sehari-hari' },
  { value: 'academic', label: 'Academic', desc: 'Persiapan kuliah / IELTS' },
  { value: 'professional', label: 'Professional', desc: 'Karier & dunia kerja' },
  { value: 'kids', label: 'Kids & Teens', desc: 'Program untuk anak & remaja' },
]

const HOW_IT_WORKS = [
  {
    icon: 'edit',
    step: 'Langkah 1',
    title: 'Isi biodata',
    desc: 'Lengkapi data diri kamu — cukup 1 menit, semua aman & privat.',
  },
  {
    icon: 'keyboard',
    step: 'Langkah 2',
    title: 'Kerjakan tes',
    desc: `Jawab ${QUESTIONS.length} soal pilihan ganda. Progres tersimpan otomatis.`,
  },
  {
    icon: 'trophy',
    step: 'Langkah 3',
    title: 'Dapatkan hasil',
    desc: 'Langung dapat level, rekomendasi program, & konsultasi WhatsApp.',
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 90, damping: 16 } },
}

/* ---- Form field wrapper (collapsible fieldset w/ icon) ----- */
function Fieldset({ legend, icon, children, className = '' }) {
  return (
    <fieldset className={`rounded-2xl border border-ink-900/8 bg-paper-100/40 p-4 sm:p-5 ${className}`}>
      <legend className="sr-only">{legend}</legend>
      <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-ink-500">
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-moss-100 text-moss-700">
          <Icon name={icon} size={13} />
        </span>
        {legend}
      </div>
      <div className="space-y-4">{children}</div>
    </fieldset>
  )
}

function Landing() {
  const navigate = useNavigate()
  const { setUserProfile } = useQuiz()
  const formRef = useRef(null)

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    domisili: '',
    target: '',
    agree: false,
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const update = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextErrors = validateBiodata(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      const firstField = ['name', 'email', 'phone', 'domisili', 'target', 'agree'].find(
        (k) => nextErrors[k]
      )
      const el = document.getElementById(firstField === 'agree' ? 'f-agree' : `f-${firstField}`)
      el?.focus()
      return
    }

    setSubmitting(true)
    const targetLabel = TARGET_OPTIONS.find((o) => o.value === form.target)?.label ?? form.target
    setTimeout(() => {
      setUserProfile({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        domisili: form.domisili.trim(),
        target: targetLabel,
        startedAt: Date.now(),
      })
      navigate('/test')
    }, 550)
  }

  return (
    <>
      <Background />
      <div className="noise relative mx-auto flex min-h-svh max-w-7xl flex-col px-5 pb-16 sm:px-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between py-6"
        >
          <Logo />
          <div className="flex items-center gap-2 rounded-full border border-ink-900/10 bg-paper-50/70 px-3.5 py-1.5 text-xs font-semibold text-ink-600 backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-moss-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-moss-500" />
            </span>
            {QUESTIONS.length} soal · ±10 menit
          </div>
        </motion.header>

        {/* Step indicator */}
        <div className="mt-2">
          <Stepper current="register" />
        </div>

        {/* Hero */}
        <motion.section
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-12 pb-12 pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-16 lg:pt-14"
        >
          {/* Left copy */}
          <motion.div variants={item} className="max-w-2xl">
            <motion.h1
              variants={item}
              className="font-display mt-6 text-5xl font-semibold leading-[1.05] tracking-tight text-ink-950 sm:text-6xl"
            >
              Temukan level
              <br />
              kemampuanmu,{' '}
              <span className="relative inline-block text-moss-600">
                dalam 10 menit.
                <motion.span
                  className="absolute -bottom-1 left-0 h-[6px] w-full rounded-full bg-sun-300/70"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, type: 'spring', stiffness: 60 }}
                />
              </span>
            </motion.h1>

            <motion.p variants={item} className="mt-6 text-lg leading-relaxed text-ink-600">
              Isi biodata, kerjakan {QUESTIONS.length} soal pilihan ganda, dan dapatkan
              rekomendasi program belajar beserta level kemampuan yang akurat — tanpa ribet.
            </motion.p>

            {/* Primary CTA */}
            <motion.div variants={item} className="mt-8">
              <Button size="lg" onClick={scrollToForm} icon={<Icon name="play" size={17} />}>
                Mulai Sekarang
              </Button>
            </motion.div>

            {/* Feature ticks */}
            <motion.ul variants={item} className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                'Auto-save progres otomatis',
                'Navigasi bebas antar soal',
                'Hasil & rekomendasi instan',
                'Konsultasi via WhatsApp',
              ].map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm font-medium text-ink-700">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-moss-100 text-moss-600">
                    <Icon name="check" size={12} strokeWidth={2.6} />
                  </span>
                  {f}
                </li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Right — form card */}
          <motion.div variants={item} className="lg:sticky lg:top-8" ref={formRef}>
            <motion.form
              onSubmit={handleSubmit}
              noValidate
              className="rounded-3xl border border-ink-900/8 bg-paper-50 p-6 shadow-card sm:p-8"
            >
              <div className="mb-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink-950 text-paper-50">
                    <Icon name="edit" size={18} />
                  </span>
                  <div>
                    <h2 className="font-display text-xl font-semibold tracking-tight text-ink-950">
                      Isi Biodata
                    </h2>
                    <p className="text-sm text-ink-600">Sebelum memulai tes</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Data pribadi */}
                <Fieldset legend="Data Pribadi" icon="user">
                  <TextInput
                    htmlFor="f-name"
                    label="Nama Lengkap"
                    icon="user"
                    placeholder="cth. Budi Santoso"
                    value={form.name}
                    onChange={update('name')}
                    error={errors.name}
                    autoComplete="name"
                  />

                  <TextInput
                    htmlFor="f-email"
                    label="Email"
                    icon="mail"
                    type="email"
                    placeholder="nama@email.com"
                    value={form.email}
                    onChange={update('email')}
                    error={errors.email}
                    autoComplete="email"
                  />
                </Fieldset>

                {/* Kontak & program */}
                <Fieldset legend="Kontak & Program" icon="message">
                  <TextInput
                    htmlFor="f-phone"
                    label="Nomor WhatsApp"
                    icon="phone"
                    type="tel"
                    placeholder="cth. 081234567890"
                    value={form.phone}
                    onChange={update('phone')}
                    error={errors.phone}
                    hint="Gunakan nomor aktif untuk dihubungi via WhatsApp."
                    autoComplete="tel"
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <TextInput
                      htmlFor="f-domisili"
                      label="Domisili / Kota"
                      icon="mapPin"
                      placeholder="cth. Jakarta"
                      value={form.domisili}
                      onChange={update('domisili')}
                      error={errors.domisili}
                    />
                    <div className="group">
                      <label htmlFor="f-target" className="mb-1.5 block text-sm font-semibold text-ink-800">
                        Target Program
                      </label>
                      <div className="relative">
                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-500/70 group-focus-within:text-moss-600">
                          <Icon name="target" size={18} />
                        </span>
                        <select
                          id="f-target"
                          value={form.target}
                          onChange={update('target')}
                          className={`h-13 w-full appearance-none rounded-2xl border bg-paper-50 py-3.5 pl-11 pr-10 text-ink-900 transition-all outline-none ${
                            errors.target
                              ? 'border-red-400 focus:ring-4 focus:ring-red-100'
                              : 'border-ink-900/10 hover:border-ink-900/20 focus:border-moss-500 focus:ring-4 focus:ring-moss-100'
                          } ${form.target ? 'text-ink-900' : 'text-ink-500/50'}`}
                        >
                          <option value="">Pilih…</option>
                          {TARGET_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value} className="text-ink-900">
                              {o.label} — {o.desc}
                            </option>
                          ))}
                        </select>
                        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-500">
                          <Icon name="chevronDown" size={18} />
                        </span>
                      </div>
                      <AnimatePresence>
                        {errors.target && (
                          <motion.p
                            initial={{ opacity: 0, y: -4, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: -4, height: 0 }}
                            className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600"
                          >
                            <Icon name="warning" size={13} />
                            {errors.target}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </Fieldset>

                <label htmlFor="f-agree" className="flex cursor-pointer items-start gap-3 pt-1">
                  <input
                    id="f-agree"
                    type="checkbox"
                    checked={form.agree}
                    onChange={update('agree')}
                    className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded-md border-2 border-ink-900/20 accent-moss-600"
                  />
                  <span className="text-sm leading-relaxed text-ink-700">
                    Saya setuju data saya digunakan untuk keperluan penempatan kelas dan
                    dihubungi tim PlacePro.
                  </span>
                </label>
                <AnimatePresence>
                  {errors.agree && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-1.5 text-xs font-medium text-red-600"
                    >
                      <Icon name="warning" size={13} />
                      {errors.agree}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <Button
                type="submit"
                size="lg"
                fullWidth
                className="mt-6"
                disabled={submitting}
                icon={
                  submitting ? (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
                    >
                      <Icon name="refresh" size={18} />
                    </motion.span>
                  ) : (
                    <Icon name="arrowRight" size={18} />
                  )
                }
              >
                {submitting ? 'Memulai…' : 'Mulai Kerjakan'}
              </Button>

              <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-ink-500/70">
                <Icon name="eye" size={13} />
                Aman &amp; privasi terjaga · Tidak ada biaya
              </p>
            </motion.form>
          </motion.div>
        </motion.section>

        {/* How it works */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ type: 'spring', stiffness: 80, damping: 18 }}
          className="mt-4"
        >
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h3 className="font-display text-2xl font-semibold tracking-tight text-ink-950 sm:text-3xl">
                Cara kerjanya
              </h3>
              <p className="mt-1 text-sm text-ink-600">
                Tiga langkah sederhana menuju level & program terbaikmu.
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {HOW_IT_WORKS.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, type: 'spring', stiffness: 90, damping: 16 }}
                className="group relative overflow-hidden rounded-2xl border border-ink-900/8 bg-paper-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
              >
                <span className="absolute right-4 top-4 font-display text-4xl font-bold text-ink-900/6">
                  0{i + 1}
                </span>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-moss-100 text-moss-700 transition-colors group-hover:bg-moss-600 group-hover:text-white">
                  <Icon name={s.icon} size={20} />
                </span>
                <p className="mt-4 text-xs font-bold uppercase tracking-wider text-moss-600">
                  {s.step}
                </p>
                <h4 className="font-display mt-1 text-lg font-semibold text-ink-950">{s.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Program preview strip */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ type: 'spring', stiffness: 80, damping: 18 }}
          className="mt-14 border-t border-ink-900/8 pt-12"
        >
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h3 className="font-display text-2xl font-semibold tracking-tight text-ink-950 sm:text-3xl">
                Program belajar yang tersedia
              </h3>
              <p className="mt-1 text-sm text-ink-600">
                Rekomendasi akhir akan disesuaikan dengan hasil tes kamu.
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {Object.values(PROGRAMS).map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: 'spring', stiffness: 90, damping: 16 }}
                className="group relative overflow-hidden rounded-2xl border border-ink-900/8 bg-paper-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
              >
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-xl text-white ${
                    p.accent === 'sun'
                      ? 'bg-sun-500'
                      : p.accent === 'moss'
                        ? 'bg-moss-600'
                        : 'bg-ink-800'
                  }`}
                >
                  <Icon name={p.icon} size={20} />
                </span>
                <h4 className="mt-4 text-sm font-bold uppercase tracking-wider text-ink-500">
                  {p.label}
                </h4>
                <p className="font-display mt-1 text-lg font-semibold text-ink-950">{p.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-600 line-clamp-3">
                  {p.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-moss-600 opacity-0 transition-opacity group-hover:opacity-100">
                  Dapatkan di hasil tes <Icon name="arrowRight" size={14} />
                </span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-ink-900/8 pt-8 sm:flex-row">
          <Logo />
          <p className="text-xs text-ink-500/70">
            © {new Date().getFullYear()} PlacePro · Placement Test Engine
          </p>
        </footer>
      </div>
    </>
  )
}

export default Landing
