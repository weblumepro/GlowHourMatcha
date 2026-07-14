import { useEffect, useRef, useState } from 'react'

// Update this address to the business inbox that should receive booking requests.
const BOOKING_EMAIL = 'glowhourmatcha@gmail.com'

const NAV_LINKS = [
  { label: 'Meet Us', href: '#meet' },
  { label: 'Schedule', href: '#schedule' },
  { label: 'Menu', href: '#menu' },
  { label: 'Brands', href: '#collabs' },
  { label: 'Contact', href: '#contact' },
  { label: 'Shop', href: '#shop' },
]

/* ---------- Scroll reveal ---------- */

function Reveal({ as: Tag = 'div', delay = 0, className = '', children }) {
  const ref = useRef(null)
  // Visibility lives in state (not a direct classList mutation) so it survives
  // re-renders and dev hot-reloads once an element has been revealed.
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (visible) return
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -5% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [visible])

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ '--reveal-delay': `${delay}ms` }}
    >
      {children}
    </Tag>
  )
}

/* ---------- Shared bits ---------- */

function ArrowCta({ href, children }) {
  return (
    <a
      href={href}
      className="group inline-flex items-center gap-4 border border-black/70 px-8 py-4 text-[11px] font-medium uppercase tracking-[0.25em] text-black transition-all duration-500 ease-lux hover:border-matcha hover:bg-matcha hover:text-cream active:scale-[0.99]"
    >
      {children}
      <span
        aria-hidden="true"
        className="transition-transform duration-500 ease-lux group-hover:translate-x-1.5"
      >
        →
      </span>
    </a>
  )
}

function FramedImage({ src, alt, className = '' }) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" />
    </div>
  )
}

function SectionHeading({ title, titleClassName = '' }) {
  return (
    <Reveal>
      <h2
        className={`font-serif text-4xl leading-[1.05] font-normal tracking-tight md:text-6xl ${titleClassName}`}
      >
        {title}
      </h2>
    </Reveal>
  )
}

/* ---------- Navigation ---------- */

// Section links shown on the left side of the header
const LEFT_LINKS = NAV_LINKS.filter((l) => !['#contact', '#shop'].includes(l.href))

const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.25,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  className: 'h-[19px] w-[19px]',
  'aria-hidden': true,
}

function ContactIcon() {
  return (
    <svg {...iconProps}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="m4.5 7.5 7.5 5.5 7.5-5.5" />
    </svg>
  )
}

function ShopIcon() {
  return (
    <svg {...iconProps}>
      <path d="M6.5 8.5h11l-.85 10.6a1 1 0 0 1-1 .9h-7.3a1 1 0 0 1-1-.9L6.5 8.5Z" />
      <path d="M9.25 8.25V6.75a2.75 2.75 0 0 1 5.5 0v1.5" />
    </svg>
  )
}

function ProfileIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="8.25" r="3.25" />
      <path d="M5.75 19.5a6.25 6.25 0 0 1 12.5 0" />
    </svg>
  )
}

const ICON_LINKS = [
  { label: 'Contact', href: '#contact', Icon: ContactIcon },
  { label: 'Shop', href: '#shop', Icon: ShopIcon },
  { label: 'Meet Us', href: '#meet', Icon: ProfileIcon },
]

function Nav({ onStory }) {
  const [open, setOpen] = useState(false)
  const [overHero, setOverHero] = useState(true)
  const [active, setActive] = useState('')
  // Falls back to the serif wordmark where transparent WebM isn't supported (Safari)
  const [logoVideoOk, setLogoVideoOk] = useState(true)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Transparent while the homepage hero is on screen. Anchor jumps land
  // content 80px from the top (html { scroll-padding-top: 5rem }), and an
  // edge-touch still counts as intersecting, so trigger at 96px to make the
  // nav reliably solid at the "Meet Us" landing position.
  useEffect(() => {
    const hero = document.getElementById('top')
    if (!hero) return
    const io = new IntersectionObserver(([entry]) => setOverHero(entry.isIntersecting), {
      rootMargin: '-96px 0px 0px 0px',
    })
    io.observe(hero)
    return () => io.disconnect()
  }, [])

  // Scroll spy — whichever section crosses the viewport's middle band is active
  useEffect(() => {
    const ids = ['meet', 'schedule', 'menu', 'collabs', 'contact', 'shop']
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`)
        }
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  const light = overHero && !open
  const labelClass = light
    ? 'text-cream/90 hover:text-cream'
    : 'text-[#355440] hover:text-forest'

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-40">
        <header
          className={`grid grid-cols-[1fr_auto_1fr] items-center border-b px-4 py-1.5 transition-colors duration-400 ease-lux md:px-24 ${
            light
              ? 'border-transparent bg-transparent text-cream'
              : 'border-sage/25 bg-white/94 text-black backdrop-blur-md'
          }`}
        >
          {/* Left: section links (desktop) / hamburger (mobile) */}
          <div className="flex items-center justify-start">
            <nav className="hidden items-center gap-1 lg:flex">
              <button
                type="button"
                onClick={onStory}
                className={`cursor-pointer px-3 py-3 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors duration-500 ease-lux ${labelClass}`}
              >
                Our Story
              </button>
              {LEFT_LINKS.map((link) => {
                const isActive = !light && active === link.href
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className={`relative px-3 py-3 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors duration-500 ease-lux ${
                      isActive ? 'text-matcha hover:text-matcha' : labelClass
                    }`}
                  >
                    {link.label}
                    <span
                      aria-hidden="true"
                      className={`absolute right-3 bottom-1.5 left-3 h-px bg-matcha transition-opacity duration-500 ease-lux ${
                        isActive ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  </a>
                )
              })}
            </nav>

            {/* Mobile hamburger — morphs into an X */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className="relative z-50 flex h-11 w-11 items-center justify-center lg:hidden"
            >
              <span className="relative block h-3 w-5">
                <span
                  className={`absolute left-0 block h-px w-5 bg-current transition-all duration-500 ease-lux ${
                    open ? 'top-1/2 rotate-45' : 'top-0'
                  }`}
                />
                <span
                  className={`absolute left-0 block h-px w-5 bg-current transition-all duration-500 ease-lux ${
                    open ? 'top-1/2 -rotate-45' : 'top-full'
                  }`}
                />
              </span>
            </button>
          </div>

          {/* Center: animated video logo (transparent WebM) */}
          <a
            href="#top"
            aria-label="Glow Hour — back to top"
            className="flex items-center justify-center px-1 transition-opacity duration-500 ease-lux hover:opacity-70"
          >
            {logoVideoOk ? (
              <span className="relative flex h-16 w-16 items-center justify-center">
                {/* Tapered ring — thickness swells and thins around the circle,
                    rotating once per 4s pour loop */}
                <svg
                  viewBox="0 0 64 64"
                  aria-hidden="true"
                  className={`absolute inset-0 animate-[spin_4s_linear_infinite] transition-colors duration-500 ease-lux ${
                    light ? 'text-white/60' : 'text-black/45'
                  }`}
                >
                  <path
                    fillRule="evenodd"
                    fill="currentColor"
                    d="M32 2a30 30 0 1 0 .01 0ZM60.8 32A29 29 0 0 1 46.7 57.46 29 29 0 0 1 18.05 56.16 29 29 0 0 1 3.1 32 29 29 0 0 1 17.25 6.45 29 29 0 0 1 46.1 7.58 29 29 0 0 1 60.8 32Z"
                  />
                </svg>
                <video
                  src="/videos/navlogo-loop2.webm"
                  autoPlay
                  loop
                  muted
                  playsInline
                  onError={() => setLogoVideoOk(false)}
                  aria-hidden="true"
                  className={`h-11 w-auto -translate-y-1 transition-all duration-500 ease-lux ${
                    light
                      ? 'filter-[drop-shadow(0_1px_3px_rgba(0,0,0,0.55))]'
                      : 'hue-rotate-180 invert'
                  }`}
                />
              </span>
            ) : (
              <span className="font-serif text-2xl tracking-tight">glow hour</span>
            )}
          </a>

          {/* Right: contact / shop / profile icons */}
          <div className="flex items-center justify-end gap-1">
            {ICON_LINKS.map(({ label, href, Icon }) => (
              <a
                key={href}
                href={href}
                aria-label={label}
                title={label}
                className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-500 ease-lux ${
                  light
                    ? 'text-cream/90 hover:bg-cream/15 hover:text-cream'
                    : 'text-[#355440] hover:bg-forest/10 hover:text-forest'
                }`}
              >
                <Icon />
              </a>
            ))}
          </div>
        </header>
      </div>

      {/* Mobile overlay menu */}
      <div
        className={`fixed inset-0 z-40 flex flex-col items-start justify-center gap-2 bg-white/90 px-10 backdrop-blur-3xl transition-opacity duration-700 ease-lux lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <button
          type="button"
          onClick={() => {
            setOpen(false)
            onStory()
          }}
          style={{ transitionDelay: open ? '100ms' : '0ms' }}
          className={`cursor-pointer text-left font-serif text-4xl font-light tracking-tight transition-all duration-700 ease-lux hover:text-matcha ${
            open ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
          }`}
        >
          Our Story
        </button>
        {NAV_LINKS.map((link, i) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            style={{ transitionDelay: open ? `${160 + i * 60}ms` : '0ms' }}
            className={`font-serif text-4xl font-light tracking-tight transition-all duration-700 ease-lux hover:text-matcha ${
              open ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
            }`}
          >
            {link.label}
          </a>
        ))}
      </div>
    </>
  )
}

/* ---------- Sections ---------- */

function Hero({ onStory }) {
  const [videoOk, setVideoOk] = useState(true)
  const fadeRef = useRef(null)

  // Fade the hero text out as it approaches the fixed nav while scrolling,
  // so it never clashes with the logo. Opacity-only, rAF-throttled.
  useEffect(() => {
    const el = fadeRef.current
    if (!el) return
    let raf = 0
    const update = () => {
      raf = 0
      const rect = el.getBoundingClientRect()
      const navClearance = 110 // px from viewport top where the nav lives
      const fadeRange = 170 // px over which the text fades away
      const opacity = Math.min(1, Math.max(0, (rect.top - navClearance) / fadeRange))
      el.style.opacity = opacity
      el.style.pointerEvents = opacity < 0.1 ? 'none' : ''
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section
      id="top"
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-black"
    >
      {/* Poster fallback — shows until the hero video exists/loads */}
      <img
        src="/images/homepage.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
        fetchPriority="high"
      />

      {/* Full-bleed autoplay video, sorate.co style, with a crossfaded loop
          seam baked into the file (see public/videos/README.txt). */}
      {videoOk && (
        <video
          src="/videos/hero-slow.mp4"
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/images/homepage.png"
          onError={() => setVideoOk(false)}
        />
      )}

      {/* Darkening overlay for text contrast */}
      <div className="absolute inset-0 bg-black/30" aria-hidden="true" />

      {/* Centered heading, fades in on load and fades out near the nav on scroll */}
      <div ref={fadeRef} className="relative z-10">
        {/* Soft radial scrim so the text stays readable over bright footage */}
        <div
          className="absolute -inset-x-40 -inset-y-24 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.25)_45%,transparent_72%)]"
          aria-hidden="true"
        />
        <Reveal className="relative px-6 pb-5 text-center">
        <p
          lang="ja"
          className="text-sm text-cream/90 [text-shadow:0_1px_12px_rgba(0,0,0,0.5)] md:text-base"
        >
          輝く
        </p>
        <p className="mt-2 font-hand text-xs font-bold uppercase tracking-[0.3em] text-cream/90 [text-shadow:0_1px_12px_rgba(0,0,0,0.5)] md:text-sm">
          Glow Hour Matcha
        </p>
        <h1 className="mx-auto mt-5 max-w-4xl font-serif text-[22px] leading-normal font-light uppercase tracking-[0.18em] text-cream [text-shadow:0_2px_18px_rgba(0,0,0,0.55)] md:text-4xl md:leading-snug">
          Grounded by Tradition, Guided by Ritual, and Crafted with Authenticity
        </h1>
        <button
          type="button"
          onClick={onStory}
          className="group mt-10 inline-flex cursor-pointer items-center gap-4 border border-cream/70 px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.25em] text-cream transition-all duration-500 ease-lux hover:bg-cream hover:text-black active:scale-[0.99]"
        >
          Our Story
          <span
            aria-hidden="true"
            className="transition-transform duration-500 ease-lux group-hover:translate-x-1.5"
          >
            →
          </span>
        </button>
        </Reveal>
      </div>
    </section>
  )
}

function StoryModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Our Story"
      className={`fixed inset-0 z-50 overflow-y-auto bg-blush transition-all duration-700 ease-lux ${
        open ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'
      }`}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="fixed top-5 right-5 z-10 flex h-11 w-11 cursor-pointer items-center justify-center text-black/50 transition-colors duration-500 ease-lux hover:text-matcha"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path d="M5 5l14 14M19 5L5 19" />
        </svg>
      </button>

      {/* Section-style layout, mirroring Meet Judy */}
      <div className="mx-auto grid min-h-dvh w-full max-w-7xl items-center gap-14 px-5 py-24 md:px-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <FramedImage
            src="/images/homepage.png"
            alt="A freshly whisked bowl of Glow Hour matcha"
            className="mx-auto max-w-sm lg:max-w-none"
          />
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <h2 className="font-serif text-4xl leading-[1.05] font-normal tracking-tight md:text-6xl">
            Our <em>Story</em>
          </h2>
          <p className="mt-8 text-[15px] leading-relaxed text-black/70">
            Glow Hour Matcha is an AAPI women-owned business founded in Ottawa —
            inspired by community, culture, and tradition. Growing up in a
            Vietnamese household, tea was always part of everyday life. It was
            more than just a drink — a daily ritual woven into moments of
            connection, conversation, and hospitality.
          </p>
          <p className="mt-5 text-[15px] leading-relaxed text-black/70">
            As we explored the world of matcha, our appreciation deepened through
            learning about the craftsmanship, intention, and traditions behind it.
            We came to realize that matcha is more than just a drink; it is an
            experience. From the quality of the leaves to the preparation and
            presentation, every detail contributes to creating the perfect cup.
          </p>
          <p className="mt-5 text-[15px] leading-relaxed text-black/70">
            Inspired by this, Glow Hour Matcha was created to bring that experience
            to Ottawa — a space where communities can gather, connect, and discover
            the beauty of matcha together. We believe matcha is more than simply an
            alternative beverage; it is a ritual that stands on its own. When
            crafted with quality and care at the forefront, matcha has the power to
            shift perceptions and create meaningful experiences, even for those who
            may not have enjoyed it before.
          </p>
          <p className="mt-5 text-[15px] leading-relaxed text-black/70">
            We continue to honour our Vietnamese heritage through thoughtful and
            creative pairings, while remaining connected to matcha's origin and
            traditions. Through every cup, we hope to create a sense of connection,
            community, and appreciation for the ritual behind matcha.
          </p>
          <p className="mt-8 font-serif text-xl font-light text-matcha italic">
            — glow hour
          </p>
        </div>
      </div>
    </div>
  )
}

function MeetUs() {
  return (
    // -scroll-mt-2.5 lands the Meet Us anchor 10px deeper than the global
    // 5rem scroll padding
    <section id="meet" className="flex -scroll-mt-2.5 items-center bg-blush pt-28 pb-32 md:pb-36">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-14 px-5 md:px-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <FramedImage
            src="/images/meetus.png"
            alt="Judy whisking matcha in a pink chawan"
            className="mx-auto max-w-sm lg:max-w-none"
          />
        </Reveal>

        <div className="lg:col-span-6 lg:col-start-7">
          <SectionHeading title={<>Meet <em>Judy</em></>} />
          <Reveal delay={200}>
            <p className="mt-8 text-[15px] leading-relaxed text-black/70">
              Judy is a full-time student and the founder of Glow Hour Matcha. Ever
              since discovering matcha, she has always been incredibly particular
              about how it should taste — believing that a good cup of matcha is all
              about quality, balance, and craftsmanship.
            </p>
            <p className="mt-5 text-[15px] leading-relaxed text-black/70">
              Originally from Toronto, she grew up surrounded by some of the city's
              best matcha spots and quickly developed a deep appreciation for what
              truly good matcha should taste like. After moving to Ottawa, she made it
              her mission to explore nearly every café in the city (and honestly, she
              still does), but found herself constantly feeling like something was
              missing.
            </p>
            <p className="mt-5 text-[15px] leading-relaxed text-black/70">
              She realized Ottawa lacked the kind of matcha experience she had grown
              to love — one that focused on quality, intention, and authenticity.
              Instead of settling, she decided to create it herself. That idea
              eventually became Glow Hour Matcha.
            </p>
            <p className="mt-5 text-[15px] leading-relaxed text-black/70">
              Born from the belief that Ottawa deserved better matcha, Glow Hour
              Matcha was created to share the experience she fell in love with while
              building something the community could connect over. We focus on quality
              above all else — from house-made syrups and carefully sourced tea leaves
              to premium first-harvest matcha sourced directly from Uji, Japan. Every
              cup is crafted with intention, because great matcha should never be
              compromised.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// `time` and `location` show as labelled lines in the event details —
// replace the TBA placeholders with the real details for each event.
const EVENTS = [
  { date: 'Jul 09', name: 'DistillerSR Corporate', time: 'TBA', location: 'TBA' },
  { date: 'Jul 11–12', name: 'Next Door Market Pop Up', time: 'TBA', location: 'TBA' },
  { date: 'Jul 14', name: "Letasha's Goodies Pop Up", time: 'TBA', location: 'TBA' },
  { date: 'Jul 18', name: 'Pilates with Zeinab Private Event', time: 'TBA', location: 'TBA' },
  { date: 'Jul 19', name: "Letasha's Goodies Pop Up", time: 'TBA', location: 'TBA' },
  { date: 'Jul 20', name: "Letasha's Goodies Pop Up", time: 'TBA', location: 'TBA' },
  { date: 'Jul 21', name: "Letasha's Goodies Pop Up", time: 'TBA', location: 'TBA' },
  { date: 'Jul 22', name: "Letasha's Goodies Pop Up", time: 'TBA', location: 'TBA' },
]

/* Derives the display type from the event name — no invented data. */
function eventTypeOf(name) {
  if (/corporate/i.test(name)) return 'Corporate Event'
  if (/private/i.test(name)) return 'Private Event'
  return 'Pop-Up'
}

/* "Jul 09" → "July 09" for display; the underlying data is unchanged. */
function displayDate(date) {
  return date.replace(/^Jul\b/, 'July')
}

/* Short, factual description assembled from the event's own name when no
   richer copy exists on the event — nothing invented. */
function eventDescriptionOf(event) {
  if (event.details) return event.details
  const { name } = event
  if (/corporate/i.test(name)) {
    return `Glow Hour Matcha brings the matcha bar experience to a corporate event with ${name.replace(/\s*Corporate\s*$/i, '')}.`
  }
  if (/private/i.test(name)) {
    return `A private Glow Hour Matcha experience for ${name.replace(/\s*Private Event\s*$/i, '')}.`
  }
  return `Join Glow Hour Matcha at ${name.replace(/\s*Pop Up\s*$/i, '')} for a local pop-up featuring our signature matcha and Vietnamese coffee drinks.`
}

function Schedule() {
  // Index into EVENTS of the open event, or null for the normal view.
  const [selected, setSelected] = useState(null)
  const rowRefs = useRef([])
  const selectedEvent = selected === null ? null : EVENTS[selected]
  const isOpen = selected !== null

  const closeDetail = () => {
    const i = selected
    setSelected(null)
    // Return keyboard focus to the row that was open
    if (i !== null) rowRefs.current[i]?.focus()
  }

  // Shared timing for every element that moves with the layout change
  const move = 'duration-600 ease-in-out motion-reduce:transition-none'

  return (
    <section id="schedule" className="relative isolate overflow-x-clip bg-blush pb-16 md:pb-20">
      {/* Architectural hairline separating two cream sections */}
      <div className="mx-auto w-[88%] border-t border-sage/30" aria-hidden="true" />

      {/* ---------- Desktop: animated two-state layout ---------- */}
      <div className="relative hidden h-160 px-16 pt-20 lg:block xl:px-24">
        {/* Title block — shrinks and tightens while an event is open */}
        <div className="max-w-[38%]">
          <Reveal>
            <p className="text-[13px] font-medium uppercase tracking-[0.3em] text-matcha">
              Our Schedule
            </p>
            <div className="mt-3 w-24 border-t border-matcha/50" aria-hidden="true" />
          </Reveal>
          <Reveal delay={100}>
            <h2
              className={`font-serif leading-none font-normal tracking-tight text-black transition-all ${move} ${
                isOpen ? 'mt-6 text-5xl' : 'mt-8 text-8xl xl:text-[110px]'
              }`}
            >
              Schedule
            </h2>
          </Reveal>
          <Reveal delay={180}>
            <p
              className={`font-sans leading-relaxed text-black/75 transition-all ${move} ${
                isOpen ? 'mt-4 text-[14px]' : 'mt-6 text-[16px]'
              }`}
            >
              Catch us at a pop-up or book us for your next event.
            </p>
          </Reveal>
        </div>

        {/* The divider — rotates from vertical (between the columns) to
            horizontal (between title and list) as the layout changes */}
        <div
          aria-hidden="true"
          className={`absolute h-96 w-px bg-sage/40 transition-all ${move} ${
            isOpen
              ? 'top-13.5 left-[23%] rotate-90 scale-y-90'
              : 'top-30 left-[46%] rotate-0 scale-y-100'
          }`}
        />

        {/* Event list — slides from the right column to under the title */}
        <div
          className={`absolute transition-all ${move} ${
            isOpen ? 'top-66 left-16 w-[34%] xl:left-24' : 'top-20 left-[52%] w-[42%]'
          }`}
        >
          <ul>
            {EVENTS.map((event, i) => {
              const isSelected = selected === i
              return (
                <li
                  key={`${event.date}-${i}`}
                  className={i < EVENTS.length - 1 ? 'border-b border-sage/20' : ''}
                >
                  <button
                    type="button"
                    ref={(el) => (rowRefs.current[i] = el)}
                    onClick={() => setSelected((cur) => (cur === i ? null : i))}
                    aria-expanded={isSelected}
                    aria-controls="schedule-detail"
                    className={`group relative flex w-full cursor-pointer items-baseline gap-6 text-left transition-all ${move} ${
                      isOpen ? 'py-2.5' : 'py-3.5'
                    } focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-matcha`}
                  >
                    {/* Small dot marking the selection — absolute, so rows never shift */}
                    {isSelected && (
                      <span
                        aria-hidden="true"
                        className="absolute top-1/2 -left-4 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-matcha"
                      />
                    )}
                    <span
                      className={`shrink-0 font-sans font-semibold tracking-[0.18em] text-matcha uppercase transition-all ${move} ${
                        isOpen ? 'w-20 text-[11px]' : 'w-28 text-[13px]'
                      }`}
                    >
                      {displayDate(event.date)}
                    </span>
                    <span
                      className={`font-sans underline-offset-4 transition-all ${move} ${
                        isOpen ? 'text-[13px]' : 'text-[16px]'
                      } ${
                        isSelected
                          ? 'text-matcha underline'
                          : 'text-black group-hover:text-matcha group-hover:underline'
                      }`}
                    >
                      {event.name}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>

          {/* Quiet wordmark from the reference composition — normal view only */}
          <div
            aria-hidden={isOpen}
            className={`mt-8 transition-opacity ${move} ${isOpen ? 'opacity-0' : 'opacity-100'}`}
          >
            <p className="text-[12px] font-semibold uppercase tracking-[0.3em] text-matcha">
              Glow Hour
            </p>
            <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.25em] text-matcha/70">
              Matcha &amp; Coffee Bar
            </p>
          </div>
        </div>

        {/* Selected event details — fades in on the right */}
        <div
          id="schedule-detail"
          aria-live="polite"
          className={`absolute top-20 left-[52%] w-[42%] transition-opacity ${move} ${
            isOpen ? 'opacity-100 delay-150' : 'pointer-events-none opacity-0 delay-0'
          }`}
        >
          {selectedEvent && (
            <div key={selected} className="motion-safe:animate-stage">
              <button
                type="button"
                onClick={closeDetail}
                className="group inline-flex min-h-11 cursor-pointer items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-forest/80 transition-colors duration-500 ease-lux hover:text-matcha focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-matcha"
              >
                <span
                  aria-hidden="true"
                  className="transition-transform duration-500 ease-lux group-hover:-translate-x-1"
                >
                  ←
                </span>
                Back to full schedule
              </button>

              <h3 className="mt-8 font-serif text-7xl leading-[0.95] font-normal tracking-tight text-black uppercase xl:text-[88px]">
                {displayDate(selectedEvent.date)}
              </h3>
              <p className="mt-6 font-sans text-xl text-black md:text-2xl">{selectedEvent.name}</p>
              <p className="mt-5 max-w-md font-sans text-[15px] leading-relaxed text-black/70">
                {eventDescriptionOf(selectedEvent)}
              </p>
              <p className="mt-6 text-[12px] font-medium uppercase tracking-[0.35em] text-matcha/80">
                {eventTypeOf(selectedEvent.name)}
              </p>
              {selectedEvent.time && (
                <p className="mt-4 font-sans text-[15px] text-black/70">
                  <span className="mr-3 text-[11px] font-medium tracking-[0.22em] text-forest/80 uppercase">
                    Time
                  </span>
                  {selectedEvent.time}
                </p>
              )}
              {selectedEvent.location && (
                <p className="mt-1 font-sans text-[15px] text-black/70">
                  <span className="mr-3 text-[11px] font-medium tracking-[0.22em] text-forest/80 uppercase">
                    Location
                  </span>
                  {selectedEvent.location}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ---------- Mobile: static stack with inline expansion ---------- */}
      <div className="px-5 pt-16 lg:hidden">
        <Reveal>
          <p className="text-[13px] font-medium uppercase tracking-[0.3em] text-matcha">
            Our Schedule
          </p>
          <div className="mt-3 w-24 border-t border-matcha/50" aria-hidden="true" />
        </Reveal>
        <Reveal delay={100}>
          <h2 className="mt-7 font-serif text-6xl leading-none font-normal tracking-tight text-black md:text-7xl">
            Schedule
          </h2>
        </Reveal>
        <Reveal delay={180}>
          <p className="mt-5 font-sans text-[15px] leading-relaxed text-black/75">
            Catch us at a pop-up or book us for your next event.
          </p>
        </Reveal>

        <ul className="mt-10">
          {EVENTS.map((event, i) => {
            const isSelected = selected === i
            return (
              <li
                key={`${event.date}-${i}`}
                className={i < EVENTS.length - 1 ? 'border-b border-sage/20' : ''}
              >
                <Reveal delay={i * 40}>
                  <button
                    type="button"
                    onClick={() => setSelected((cur) => (cur === i ? null : i))}
                    aria-expanded={isSelected}
                    aria-controls={`schedule-event-${i}`}
                    className="flex min-h-11 w-full cursor-pointer flex-wrap items-baseline gap-x-5 gap-y-1 py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-matcha"
                  >
                    <span className="w-24 shrink-0 font-sans text-[12px] font-semibold tracking-[0.18em] text-matcha uppercase">
                      {displayDate(event.date)}
                    </span>
                    <span
                      className={`font-sans text-[15px] ${
                        isSelected ? 'text-matcha underline underline-offset-4' : 'text-black'
                      }`}
                    >
                      {event.name}
                    </span>
                  </button>

                  {/* Details expand in place, directly below the tapped event */}
                  <div
                    id={`schedule-event-${i}`}
                    className={`grid transition-[grid-template-rows] duration-500 ease-in-out motion-reduce:transition-none ${
                      isSelected ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="pt-1 pb-6">
                        <p className="max-w-md font-sans text-[15px] leading-relaxed text-black/70">
                          {eventDescriptionOf(event)}
                        </p>
                        <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.25em] text-matcha/80">
                          {eventTypeOf(event.name)}
                        </p>
                        {event.time && (
                          <p className="mt-2 font-sans text-[14px] text-black/70">
                            <span className="mr-3 text-[10px] font-medium tracking-[0.22em] text-forest/80 uppercase">
                              Time
                            </span>
                            {event.time}
                          </p>
                        )}
                        {event.location && (
                          <p className="mt-1 font-sans text-[14px] text-black/70">
                            <span className="mr-3 text-[10px] font-medium tracking-[0.22em] text-forest/80 uppercase">
                              Location
                            </span>
                            {event.location}
                          </p>
                        )}
                        <a
                          href="#contact"
                          className="mt-3 inline-flex min-h-11 items-center gap-2 text-[12px] font-medium uppercase tracking-[0.22em] text-forest"
                        >
                          Book Glow Hour
                          <span aria-hidden="true">→</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

const MENU = [
  {
    number: '01',
    tag: 'Matcha',
    title: 'Matcha Signature Drinks',
    items: ['Ube Matcha', 'Coconut Cloud Matcha', 'Tokyo Fog Matcha', 'Banana Bread Matcha'],
    images: {
      ingredients: '/images/menu/matcha-ingredients.jpg',
      ingredientsAlt: 'Matcha powder and ingredients used in our matcha signature drinks',
      drink: '/images/menu/matcha-drink.jpg',
      drinkAlt: 'A finished Glow Hour matcha signature drink',
    },
  },
  {
    number: '02',
    tag: 'Specialty',
    title: 'Specialty Matcha Drinks',
    items: ['Mango Coconut Matcha', 'Lychee Matcha', 'Jasmine Matcha', 'Blueberry Matcha'],
    images: {
      ingredients: '/images/menu/specialty-ingredients.jpg',
      ingredientsAlt: 'Fruit and ingredients used in our specialty matcha drinks',
      drink: '/images/menu/specialty-drink.jpg',
      drinkAlt: 'A finished Glow Hour specialty matcha drink',
    },
  },
  {
    number: '03',
    tag: 'Viet Coffee',
    title: 'Vietnamese Iced Coffee Drinks',
    items: [
      'Signature Viet Coffee',
      'Ube Viet Coffee',
      'Salted Cold Foam Viet Coffee',
      'Coconut Cold Foam Viet Coffee',
    ],
    images: {
      ingredients: '/images/menu/coffee-ingredients.jpg',
      ingredientsAlt: 'Coffee beans and ingredients used in our Vietnamese iced coffee drinks',
      drink: '/images/menu/coffee-drink.jpg',
      drinkAlt: 'A finished Glow Hour Vietnamese iced coffee drink',
    },
  },
]

/* One menu category: an image pair (ingredients ⇄ finished drink) above the
   text. Desktop crossfades to the finished drink on hover; mobile shows the
   finished drink and switches via a real toggle button. Falls back to a quiet
   hatched placeholder until the photos exist in /images/menu/. */
function MenuCategory({ cat, delay }) {
  // Mobile toggle — false shows the finished drink (the mobile default)
  const [showIngredients, setShowIngredients] = useState(false)
  const [imgOk, setImgOk] = useState(true)

  const imgClass =
    'absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-350 ease-in-out motion-reduce:transition-none lg:group-hover:scale-[1.02]'

  return (
    <Reveal delay={delay}>
      <div className="group relative aspect-square w-full overflow-hidden">
        {imgOk ? (
          <>
            <img
              src={cat.images.ingredients}
              alt={cat.images.ingredientsAlt}
              loading="lazy"
              onError={() => setImgOk(false)}
              className={`${imgClass} lg:opacity-100 lg:group-hover:opacity-0 ${
                showIngredients ? 'opacity-100' : 'opacity-0'
              }`}
            />
            <img
              src={cat.images.drink}
              alt={cat.images.drinkAlt}
              loading="lazy"
              onError={() => setImgOk(false)}
              className={`${imgClass} lg:opacity-0 lg:group-hover:opacity-100 ${
                showIngredients ? 'opacity-0' : 'opacity-100'
              }`}
            />
          </>
        ) : (
          /* Obvious placeholder frame until the two photos are added */
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 border border-dashed border-sage/70 bg-[repeating-linear-gradient(135deg,rgba(142,182,145,0.10)_0px,rgba(142,182,145,0.10)_1px,transparent_1px,transparent_9px)] px-6 text-center">
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-matcha">
              {cat.tag} photos go here
            </span>
            <span className="font-sans text-[12px] leading-relaxed text-black/55">
              {cat.images.ingredients.split('/').pop()}
              <br />
              {cat.images.drink.split('/').pop()}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-black/40">
              in /public/images/menu/
            </span>
          </div>
        )}
      </div>

      {/* Mobile-only image switch */}
      {imgOk && (
        <button
          type="button"
          onClick={() => setShowIngredients((v) => !v)}
          aria-pressed={showIngredients}
          className="mt-4 inline-flex min-h-11 cursor-pointer items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-forest focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-matcha lg:hidden"
        >
          {showIngredients ? 'View finished drink' : 'View ingredients'}
        </button>
      )}

      <p className="mt-6 text-[13px] font-medium uppercase tracking-[0.25em] text-matcha">
        {cat.number}&ensp;—&ensp;{cat.tag}
      </p>
      <h3 className="mt-3 font-serif text-[26px] leading-snug font-normal tracking-tight text-black md:text-[28px]">
        {cat.title}
      </h3>
      <ul className="mt-6 flex flex-col gap-3">
        {cat.items.map((item) => (
          <li key={item} className="font-sans text-[15px] text-black/85">
            {item}
          </li>
        ))}
      </ul>
    </Reveal>
  )
}

function Menu() {
  return (
    <section id="menu" className="relative isolate overflow-x-clip bg-blush pt-14 pb-28 md:pb-32">
      {/* Architectural hairline separating two cream sections */}
      <div className="mx-auto w-[88%] border-t border-sage/30" aria-hidden="true" />

      <div className="px-5 pt-20 md:px-16 lg:px-24">
        {/* Header — eyebrow, title, and note kept tightly together */}
        <Reveal>
          <span className="text-[13px] font-medium uppercase tracking-[0.3em] text-matcha/80">
            Our Menu
          </span>
        </Reveal>
        <Reveal delay={100}>
          <h2 className="mt-3 font-serif text-6xl leading-none font-normal tracking-tight text-black md:text-7xl">
            Menu
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-3 font-sans text-[15px] text-black/70">
            Almost all of our drinks are served with oat milk.
          </p>
        </Reveal>

        {/* Three equal columns, one per category */}
        <div className="mt-14 grid gap-14 md:grid-cols-3 md:gap-10 lg:gap-12">
          {MENU.map((cat, i) => (
            <MenuCategory key={cat.number} cat={cat} delay={i * 120} />
          ))}
        </div>
      </div>
    </section>
  )
}

const BRAND_TILES = [
  { name: 'The Playground Pilates Collective', slug: 'playground-pilates' },
  { name: 'Hailey Jane Jewellery', slug: 'hailey-jane' },
  { name: 'Parle Viet Fresh', slug: 'parle-viet' },
  { name: 'Oh So Good', slug: 'oh-so-good' },
  { name: "Baked at Tiffany's", slug: 'baked-at-tiffanys' },
  { name: 'uOttawa Filipino Student Association', slug: 'uottawa-fsa' },
  { name: 'NextDoor Ottawa Market', slug: 'nextdoor-market' },
  { name: 'DistillerSR', slug: 'distillersr' },
  { name: 'KoW Connected', slug: 'kow-connected' },
  { name: 'Wild Flower Sketch Club', slug: 'wild-flower-sketch' },
  { name: 'Richcraft Rentals', slug: 'richcraft-rentals' },
]

/* Shows the collab photo when /images/brands/<slug>.jpg exists;
   falls back to a quiet hatched placeholder until then. */
function BrandTile({ brand, delay }) {
  const [hasPhoto, setHasPhoto] = useState(true)

  return (
    <Reveal delay={delay}>
      <div className="aspect-4/3 w-full overflow-hidden border border-sage/30">
        {hasPhoto ? (
          <img
            src={`/images/brands/${brand.slug}.jpg`}
            alt={brand.name}
            loading="lazy"
            onError={() => setHasPhoto(false)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className="h-full w-full bg-[repeating-linear-gradient(135deg,rgba(142,182,145,0.16)_0px,rgba(142,182,145,0.16)_1px,transparent_1px,transparent_9px)]"
          />
        )}
      </div>
      <p className="mt-3 text-center font-sans text-[13px] leading-snug text-black/60">
        {brand.name}
      </p>
    </Reveal>
  )
}

function BrandGallery() {
  return (
    <section id="collabs" className="relative isolate overflow-x-clip bg-blush pt-14 pb-24 md:pb-28">
      {/* Aura: muted green bloom behind the logo grid, warm peach behind the
          right-side heading, one sparing touch of matcha */}
      <Glow className="top-1/3 -left-24 h-120 w-152" color="rgba(142,182,145,0.28)" />
      <Glow className="top-10 -right-20 h-88 w-md" color="rgba(255,234,201,0.55)" />
      <Glow className="bottom-8 left-1/3 h-56 w-72" color="rgba(81,156,97,0.10)" />

      {/* Architectural hairline separating two cream sections */}
      <div className="mx-auto w-[88%] border-t border-sage/30" aria-hidden="true" />

      <div className="grid gap-14 px-5 pt-24 md:px-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.9fr)] lg:gap-16">
        {/* Left: giant stacked title */}
        <Reveal delay={120} className="self-end">
          <h2 className="font-serif text-7xl leading-[0.95] font-normal tracking-tight text-black md:text-9xl lg:text-[9rem]">
            Brands
            <br />
            We've
            <br />
            Worked
            <br />
            With
          </h2>
        </Reveal>

        {/* Right: label + photo wall */}
        <div>
          <Reveal>
            <span className="text-[13px] font-medium uppercase tracking-[0.3em] text-matcha/80">
              In Good Company
            </span>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
            {BRAND_TILES.map((brand, i) => (
              <BrandTile key={brand.slug} brand={brand} delay={i * 60} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    datetime: '',
    attendance: '',
    serviceStyle: '',
    details: '',
    comment: '',
  })

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const body = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone}`,
      `Event Date & Time: ${form.datetime}`,
      `Expected Attendance: ${form.attendance}`,
      `Service Style: ${form.serviceStyle}`,
      `Additional Event Details: ${form.details}`,
      `Question or Comment: ${form.comment}`,
    ].join('\n')
    window.location.href = `mailto:${BOOKING_EMAIL}?subject=${encodeURIComponent(
      `Event Booking Request — ${form.name}`,
    )}&body=${encodeURIComponent(body)}`
  }

  const labelClass =
    'flex flex-col gap-1 text-[12px] font-medium uppercase tracking-[0.18em] text-forest/75'
  const inputClass =
    'w-full border-0 border-b border-black/25 bg-transparent px-0 py-2 text-[15px] text-black outline-none transition-colors duration-500 ease-lux placeholder:text-black/40 focus:border-matcha'

  return (
    <section
      id="contact"
      className="relative isolate flex min-h-dvh flex-col overflow-x-clip bg-blush pt-14 pb-10"
    >
      {/* Aura: pale pink around the headline, fading into the ivory form area */}
      <Glow className="top-32 left-[8%] h-80 w-120" color="rgba(251,232,227,0.55)" />

      {/* Architectural hairline separating two cream sections */}
      <div className="mx-auto w-[88%] border-t border-sage/30" aria-hidden="true" />

      {/* Centered content column, vertically balanced within the viewport */}
      <div className="mx-auto flex w-full max-w-5xl grow flex-col justify-center px-5 pt-6 md:px-8">
        <Reveal>
          <span className="text-[13px] font-medium uppercase tracking-[0.3em] text-matcha/80">
            Private Event Inquiry
          </span>
        </Reveal>
        <Reveal delay={100}>
          <h2 className="mt-5 font-serif text-4xl leading-[1.05] font-normal tracking-tight text-black md:text-5xl">
            Bring the glow to <em className="text-forest">your</em> event
          </h2>
        </Reveal>

        {/* Short intentional rule bridging heading and form */}
        <Reveal delay={140}>
          <div className="mt-8 w-2/5 border-t border-sage/40" aria-hidden="true" />
        </Reveal>

        <Reveal delay={180}>
          <form onSubmit={handleSubmit} className="mt-8 w-full">
            <div className="grid gap-x-16 gap-y-5 md:grid-cols-2">
              <label className={labelClass}>
                Name (First and Last)
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={update('name')}
                  placeholder="Jane Doe"
                  className={inputClass}
                />
              </label>
              <label className={labelClass}>
                Email
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={update('email')}
                  placeholder="jane@email.com"
                  className={inputClass}
                />
              </label>
              <label className={labelClass}>
                Phone Number
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={update('phone')}
                  placeholder="(613) 555-0123"
                  className={inputClass}
                />
              </label>
              <div>
                <label className={labelClass}>
                  Event Date &amp; Time
                  <input
                    required
                    type="text"
                    value={form.datetime}
                    onChange={update('datetime')}
                    placeholder="August 2, 2:00 PM"
                    className={inputClass}
                  />
                </label>
                <p className="mt-2 text-[13px] leading-snug text-black/55 normal-case">
                  Please allow a minimum of <span className="text-matcha">10 days</span>{' '}
                  between booking confirmation and your event date.
                </p>
              </div>
              <label className={labelClass}>
                Expected Attendance
                <input
                  required
                  type="text"
                  value={form.attendance}
                  onChange={update('attendance')}
                  placeholder="e.g. 40 guests"
                  className={inputClass}
                />
              </label>
              <fieldset>
                <legend className="text-[12px] font-medium uppercase tracking-[0.18em] text-forest/75">
                  Service Style
                </legend>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {[
                    { value: 'Hosted', label: 'Hosted', hint: 'You cover drinks for your guests' },
                    {
                      value: 'Direct to customers',
                      label: 'Direct to Customers',
                      hint: 'Guests cover their own drinks',
                    },
                  ].map((option) => {
                    const selected = form.serviceStyle === option.value
                    return (
                      <label
                        key={option.value}
                        className={`flex cursor-pointer items-center gap-3 border px-4 py-2 transition-colors duration-500 ease-lux ${
                          selected ? 'border-forest' : 'border-black/25 hover:border-forest/50'
                        }`}
                      >
                        <input
                          required
                          type="radio"
                          name="serviceStyle"
                          value={option.value}
                          checked={selected}
                          onChange={update('serviceStyle')}
                          className="sr-only"
                        />
                        <span
                          aria-hidden="true"
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors duration-500 ease-lux ${
                            selected ? 'border-forest' : 'border-black/40'
                          }`}
                        >
                          {selected && <span className="h-2 w-2 rounded-full bg-forest" />}
                        </span>
                        <span>
                          <span className="block text-sm text-black">{option.label}</span>
                          <span className="block text-xs text-black/55">{option.hint}</span>
                        </span>
                      </label>
                    )
                  })}
                </div>
              </fieldset>
            </div>

            <label className={`${labelClass} mt-6`}>
              Any additional event details
              <textarea
                rows={2}
                value={form.details}
                onChange={update('details')}
                placeholder="Venue, theme, indoor / outdoor, power access…"
                className={`${inputClass} resize-none`}
              />
            </label>

            <label className={`${labelClass} mt-6`}>
              Question or Comment
              <textarea
                rows={2}
                value={form.comment}
                onChange={update('comment')}
                placeholder="Anything else you'd like us to know?"
                className={`${inputClass} resize-none`}
              />
            </label>

            <div className="mt-7 flex flex-col justify-between gap-8 sm:flex-row sm:items-center">
              <p className="max-w-xs text-[13px] leading-relaxed text-black/55">
                We'll be in touch shortly to coordinate the experience.
              </p>
              <button
                type="submit"
                className="group inline-flex items-center gap-4 border border-forest/60 px-12 py-3.5 text-[12px] font-medium uppercase tracking-[0.22em] text-forest transition-all duration-500 ease-lux hover:border-forest hover:bg-forest hover:text-cream active:scale-[0.99]"
              >
                Send booking request
                <span
                  aria-hidden="true"
                  className="transition-transform duration-500 ease-lux group-hover:translate-x-1.5"
                >
                  →
                </span>
              </button>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  )
}

function Shop() {
  return (
    <section id="shop" className="relative isolate overflow-hidden bg-blush py-24 md:py-32">
      {/* Aura: stronger warm peach and sage fields — the most product-focused block */}
      <Glow className="-top-16 left-[10%] h-96 w-lg" color="rgba(255,234,201,0.75)" />
      <Glow className="right-[5%] -bottom-24 h-104 w-136" color="rgba(142,182,145,0.40)" />

      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-5 text-center md:px-10">
        <Reveal>
          <h2 className="font-serif text-4xl leading-[1.05] font-normal tracking-tight md:text-6xl">
            Something is <em>brewing…</em>
          </h2>
        </Reveal>
        <Reveal delay={200}>
          <p className="max-w-lg text-[15px] leading-relaxed text-black/70">
            Our online shop is in the works — matcha tins, matcha accessories, and
            other thoughtfully curated items are coming soon. Stay tuned!
          </p>
        </Reveal>
        <Reveal delay={300} className="mt-2 flex flex-wrap justify-center gap-3">
          {['Matcha Tins', 'Whisks & Bowls', 'Accessories'].map((item) => (
            <span
              key={item}
              className="border border-sage/50 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-black/55"
            >
              {item}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

function InstagramIcon() {
  return (
    <svg {...iconProps}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="3.8" />
      <circle cx="16.9" cy="7.1" r="0.4" fill="currentColor" />
    </svg>
  )
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4.5 w-4.5" aria-hidden="true">
      <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  )
}

const SOCIAL_LINKS = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/glowhourmatcha/',
    Icon: InstagramIcon,
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@glowhourmatcha',
    Icon: TikTokIcon,
  },
  {
    label: 'Email',
    href: `mailto:${BOOKING_EMAIL}`,
    Icon: ContactIcon,
  },
]

function Footer({ onStory }) {
  return (
    <footer className="border-t border-sage/40 bg-white px-5 pt-20 pb-10 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
          <div>
            <p className="font-serif text-5xl font-light tracking-tight md:text-7xl">
              glow hour
              <span className="block font-serif text-xl text-matcha italic md:text-2xl">
                matcha bar
              </span>
            </p>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-black/60">
              An AAPI women-owned matcha bar bringing quality, intention, and
              community to Ottawa — one cup at a time.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  {...(href.startsWith('http')
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-sage/50 text-black/60 transition-colors duration-500 ease-lux hover:border-matcha hover:text-matcha"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            <button
              type="button"
              onClick={onStory}
              className="cursor-pointer text-sm text-black/60 transition-colors duration-500 ease-lux hover:text-matcha"
            >
              Our Story
            </button>
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-black/60 transition-colors duration-500 ease-lux hover:text-matcha"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="mt-16 flex flex-col justify-between gap-3 border-t border-sage/40 pt-8 text-xs text-black/50 md:flex-row">
          <span>© {new Date().getFullYear()} Glow Hour Matcha · Ottawa, Canada</span>
          <span>Founded on community, culture &amp; tradition</span>
          <span>
            Powered by{' '}
            <a
              href="https://weblume.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 transition-colors duration-500 ease-lux hover:text-matcha"
            >
              Weblume
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}

/* ---------- Aura — toggleable colour atmosphere ---------- */

/* Very blurred radial colour field. By default invisible until the
   page-level `aura` class is set by the bottom-left toggle; `always` marks
   a glow as part of the base art direction instead. Sections hosting a Glow
   need `isolate` so -z-10 sits above the section background but below its
   content. */
function Glow({ className, color, always = false }) {
  return (
    <div
      aria-hidden="true"
      style={{ background: `radial-gradient(closest-side, ${color}, transparent 72%)` }}
      className={`pointer-events-none absolute -z-10 rounded-full ${
        always ? '' : 'opacity-0 transition-opacity duration-1600 ease-lux in-[.aura]:opacity-100'
      } ${className}`}
    />
  )
}

/* Curated backgrounds shown as one-tap swatches — the brand palette */
const BG_PRESETS = [
  { name: 'White', value: '#ffffff' },
  { name: 'Ivory', value: '#fbf6ec' },
  { name: 'Cream', value: '#ffeac9' },
  { name: 'Blush', value: '#fbe8e3' },
  { name: 'Sage', value: '#8eb691' },
  { name: 'Matcha', value: '#519c61' },
]

/* Bottom-left colour picker — live-edits the section background. Every
   section uses `bg-blush`, which resolves to var(--color-blush), so
   overriding that variable on <html> recolours them all at once. The rainbow
   swatch toggles a popover with named brand-palette swatches, a custom
   picker, and the current hex code. */
function ColorWheel() {
  const [open, setOpen] = useState(false)
  const [color, setColor] = useState('#ffffff')
  const rootRef = useRef(null)

  useEffect(() => {
    document.documentElement.style.setProperty('--color-blush', color)
  }, [color])

  // Close the popover on outside click or Escape
  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={rootRef} className="fixed bottom-5 left-5 z-50">
      {open && (
        <div className="absolute bottom-16 left-0 w-64 rounded-2xl border border-sage/40 bg-white p-5 shadow-[0_20px_60px_-20px_rgba(17,17,15,0.35)]">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-forest/80">
            Background
          </p>
          <div className="mt-4 grid grid-cols-3 gap-x-2 gap-y-3">
            {BG_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => setColor(preset.value)}
                aria-pressed={color === preset.value}
                className="group flex cursor-pointer flex-col items-center gap-1.5"
              >
                <span
                  aria-hidden="true"
                  className={`h-9 w-9 rounded-full border border-black/10 transition-all duration-300 ease-lux group-hover:scale-110 ${
                    color === preset.value ? 'ring-2 ring-matcha ring-offset-2' : ''
                  }`}
                  style={{ backgroundColor: preset.value }}
                />
                <span className="text-[10px] font-medium tracking-[0.08em] text-black/60 uppercase">
                  {preset.name}
                </span>
              </button>
            ))}
          </div>

          {/* Anything-goes fallback — opens the browser's colour picker */}
          <label className="mt-5 flex cursor-pointer items-center gap-3 rounded-xl border border-sage/40 px-3 py-2.5 transition-colors duration-300 ease-lux hover:border-matcha">
            <span
              aria-hidden="true"
              className="h-6 w-6 shrink-0 rounded-full border border-black/10"
              style={{
                background:
                  'conic-gradient(#f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)',
              }}
            />
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-black/70">
              Custom colour…
            </span>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              aria-label="Pick a custom background colour"
              className="h-0 w-0 opacity-0"
            />
          </label>

          <p className="mt-4 text-center font-sans text-[13px] font-semibold tracking-[0.12em] text-black/70 uppercase">
            {color}
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Change section background colour"
        title="Change background colour"
        className="block h-12 w-12 cursor-pointer rounded-full p-1.25 shadow-[0_8px_30px_-12px_rgba(17,17,15,0.35)] transition-transform duration-500 ease-lux hover:scale-110"
        style={{
          background: 'conic-gradient(#f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)',
        }}
      >
        {/* Centre swatch shows the currently selected colour */}
        <span
          aria-hidden="true"
          className="block h-full w-full rounded-full border border-black/10"
          style={{ backgroundColor: color }}
        />
      </button>
    </div>
  )
}

/* ---------- App ---------- */

function App() {
  const [storyOpen, setStoryOpen] = useState(false)
  const openStory = () => setStoryOpen(true)

  return (
    <div>
      <Nav onStory={openStory} />
      <main>
        <Hero onStory={openStory} />
        <MeetUs />
        <Schedule />
        <Menu />
        <BrandGallery />
        <Contact />
        <Shop />
      </main>
      <Footer onStory={openStory} />
      <StoryModal open={storyOpen} onClose={() => setStoryOpen(false)} />
      <ColorWheel />
    </div>
  )
}

export default App
