import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Award, Target, Eye, Users, CheckCircle, Lightbulb,
  Shield, Handshake, Star, MapPin, ArrowRight, Sparkles,
  Crown, BookOpen, Zap
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/* ─── Brand palette ─────────────────────────────────── */
const GOLD   = '#f2c161';
const GREEN  = '#02110c';
const GOLD2  = '#e0a730';
const LIGHT  = '#faf7f0';

/* ─── Data ──────────────────────────────────────────── */
const BRANCHES = [
{ key: 'branch_1', icon: <Crown size={22} />, mapUrl: 'https://www.google.com/maps/place/%D9%85%D9%83%D8%AA%D8%A8%D8%A9+%D8%A7%D9%84%D8%B3%D9%84%D8%B7%D8%A7%D9%86%E2%80%AD/@31.5970461,-2.231672,17z/data=!3m1!4b1!4m6!3m5!1s0xd8ff7feb40b3981:0x32ff814b6aa38cf3!8m2!3d31.5970461!4d-2.231672!16s%2Fg%2F11jb0q19gl?entry=ttu&g_ep=EgoyMDI2MDcwOC4wIKXMDSoASAFQAw%3D%3D' },
  { key: 'branch_2', icon: <BookOpen size={22} />, mapUrl: 'https://maps.app.goo.gl/CQdoqYCWtFf5jqiW9' },
  { key: 'branch_3', icon: <Star size={22} />, mapUrl: 'https://maps.app.goo.gl/qLDcpt4eA9UXcrns5' },
];

const VALUES_EN = [
  { icon: <Crown size={28} />, title: 'Customer First', desc: 'Every decision starts with what the Sultan (customer) needs.', color: '#f2c161' },
  { icon: <Shield size={28} />, title: 'Honesty', desc: 'No exaggeration, no deceit. Transparency is the foundation of trust.', color: '#7ed8a4' },
  { icon: <Star size={28} />, title: 'Excellence', desc: 'Small details matter — they are what make greatness.', color: '#a78bfa' },
  { icon: <Handshake size={28} />, title: 'Keep Promises', desc: 'Our word is gold. Commitments are our contract with you.', color: '#f97316' },
  { icon: <Lightbulb size={28} />, title: 'Creativity', desc: 'We innovate thoughtfully — far from randomness.', color: '#38bdf8' },
  { icon: <Users size={28} />, title: 'Long-term Relations', desc: 'We aim for a lasting relationship, not just a transaction.', color: '#f43f5e' },
  { icon: <Award size={28} />, title: 'Service Prestige', desc: 'We deliver a noble, respectful experience worthy of the Sultan name.', color: '#fbbf24' },
];

const VALUES_AR = [
  { icon: <Crown size={28} />, title: 'الزبون أولاً', desc: 'قراراتنا وأفكارنا تبدأ من احتياج السلطان وتنتهي برضاه.', color: '#f2c161' },
  { icon: <Shield size={28} />, title: 'الصدق', desc: 'لا مبالغة فيها، لا خداع. الشفافية أساس الثقة.', color: '#7ed8a4' },
  { icon: <Star size={28} />, title: 'الإتقان', desc: 'نؤمن أن التفاصيل الصغيرة هي ما تصنع العظمة.', color: '#a78bfa' },
  { icon: <Handshake size={28} />, title: 'الوفاء بالوعد', desc: 'كلمتنا ذهب. الالتزامات انعكاس لاحترامنا لثقتك.', color: '#f97316' },
  { icon: <Lightbulb size={28} />, title: 'الإبداع', desc: 'نبتكر بأسلوب راقٍ ومدروس، بعيد عن العشوائية.', color: '#38bdf8' },
  { icon: <Users size={28} />, title: 'بناء علاقة', desc: 'هدفنا علاقة طويلة المدى، لا بيع لحظي.', color: '#f43f5e' },
  { icon: <Award size={28} />, title: 'الهيبة في الخدمة', desc: 'نقدم تجربة راقية، فخمة، ومحترمة تليق بمقام السلطان.', color: '#fbbf24' },
];

/* ─── Sub-components ─────────────────────────────────── */

function HeroSection({ t, isRTL }) {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subRef = useRef(null);
  const orb1 = useRef(null);
  const orb2 = useRef(null);
  const badgeRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.fromTo(badgeRef.current, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'back.out(1.7)' })
      .fromTo(titleRef.current.children, { y: 60, opacity: 0, clipPath: 'inset(100% 0 0 0)' },
        { y: 0, opacity: 1, clipPath: 'inset(0% 0 0 0)', stagger: 0.15, duration: 1, ease: 'power3.out' }, '-=0.3')
      .fromTo(subRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.4');

    // Floating orbs
    gsap.to(orb1.current, { y: -30, x: 20, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to(orb2.current, { y: 25, x: -25, duration: 5.5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1 });
  }, { scope: heroRef });

  return (
    <section ref={heroRef} className="relative min-h-[85vh] flex items-center justify-center overflow-hidden" style={{ background: GREEN }}>
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?q=80&w=2048&auto=format&fit=crop"
          alt="About Hero"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${GREEN}f0 0%, ${GREEN}a0 50%, ${GREEN}f0 100%)` }} />
      </div>

      {/* Animated grid overlay */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: `linear-gradient(${GOLD} 1px, transparent 1px), linear-gradient(90deg, ${GOLD} 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />

      {/* Glow orbs */}
      <div ref={orb1} className="absolute w-[600px] h-[600px] rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: `radial-gradient(circle, ${GOLD} 0%, transparent 70%)`, top: '-10%', right: '-5%' }} />
      <div ref={orb2} className="absolute w-[400px] h-[400px] rounded-full opacity-8 blur-3xl pointer-events-none"
        style={{ background: `radial-gradient(circle, ${GOLD2} 0%, transparent 70%)`, bottom: '10%', left: '-5%' }} />

      <div className="container relative z-10 text-center px-6 max-w-5xl mx-auto">
        <div ref={badgeRef} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8"
          style={{ borderColor: `${GOLD}50`, background: `${GOLD}15`, color: GOLD }}>
          <Sparkles size={14} />
          <span className="text-sm font-semibold tracking-widest uppercase">{isRTL ? 'من نحن' : 'About Us'}</span>
        </div>

        <div ref={titleRef} className="overflow-hidden">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.05] mb-3">
            {t('aboutHeroTitle')}
          </h1>
        </div>

        <p ref={subRef} className="text-lg md:text-xl mt-6 max-w-2xl mx-auto leading-relaxed" style={{ color: '#c5bfb0' }}>
          {t('aboutHeroSubtitle')}
        </p>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
          <div className="w-px h-12 animate-pulse" style={{ background: `linear-gradient(to bottom, transparent, ${GOLD})` }} />
          <div className="w-2 h-2 rounded-full" style={{ background: GOLD }} />
        </div>
      </div>
    </section>
  );
}

function StorySection({ t, isRTL }) {
  const secRef = useRef(null);
  const textRef = useRef(null);
  const imgRef = useRef(null);
  const numRefs = useRef([]);

  const stats = [
    { val: '28+', label: isRTL ? 'سنوات' : 'Years', sub: isRTL ? 'من الخبرة' : 'Experience' },
    { val: '3', label: isRTL ? 'فروع' : 'Branches', sub: isRTL ? 'في بشار' : 'In Bechar' },
    { val: '100K+', label: isRTL ? 'عميل' : 'Clients', sub: isRTL ? 'سعيد' : 'Happy' },
  ];

  useGSAP(() => {
    gsap.fromTo(textRef.current,
      { x: isRTL ? 80 : -80, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: secRef.current, start: 'top 75%' } });

    gsap.fromTo(imgRef.current,
      { x: isRTL ? -80 : 80, opacity: 0, scale: 0.92 },
      { x: 0, opacity: 1, scale: 1, duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: secRef.current, start: 'top 75%' } });
  }, { scope: secRef });

  return (
    <section ref={secRef} className="py-28 relative overflow-hidden" style={{ background: '#060f0a' }}>
      <div className="absolute inset-0 opacity-30"
        style={{ backgroundImage: `radial-gradient(ellipse at 20% 50%, ${GOLD}18 0%, transparent 60%)` }} />

      <div className="container px-6 max-w-6xl mx-auto">
        <div className={`flex flex-col ${isRTL ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-16`}>

          {/* Text */}
          <div ref={textRef} className="md:w-1/2 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
              style={{ background: `${GOLD}20`, color: GOLD, border: `1px solid ${GOLD}40` }}>
              <BookOpen size={12} /> {isRTL ? 'قصتنا' : 'Our Story'}
            </div>
            <h2 className="text-4xl md:text-5xl font-black leading-tight text-white">
              {t('aboutStoryTitle')}
            </h2>
            <div className="w-16 h-1 rounded-full" style={{ background: `linear-gradient(90deg, ${GOLD}, ${GOLD2})` }} />
            <p className="text-lg leading-relaxed" style={{ color: '#9ea89e' }}>
              {t('aboutStoryText')}
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              {stats.map((s, i) => (
                <div key={i} className="text-center p-4 rounded-2xl border"
                  style={{ background: `${GOLD}08`, borderColor: `${GOLD}20` }}>
                  <div className="text-2xl font-black" style={{ color: GOLD }}>{s.val}</div>
                  <div className="text-xs font-bold text-white mt-1">{s.label}</div>
                  <div className="text-xs mt-0.5" style={{ color: '#666' }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div ref={imgRef} className="md:w-1/2 relative">
            <div className="absolute -inset-4 rounded-3xl blur-2xl opacity-30"
              style={{ background: `linear-gradient(135deg, ${GOLD}, transparent)` }} />
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/5">
              <img
                src="/logo.png"
                alt="Our Story"
                className="w-full h-[420px] object-contain p-8 bg-[#02110c]"
              />
              {/* Overlay badge */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl backdrop-blur-md border"
                style={{ background: `${GREEN}cc`, borderColor: `${GOLD}30` }}>
                <div className="text-sm font-bold" style={{ color: GOLD }}>
                  {isRTL ? '🏆 مكتبة السلطان — بشار، الجزائر' : '🏆 Soultan Stationery — Bechar, Algeria'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MissionVisionSection({ t, isRTL }) {
  const secRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo('.mv-card',
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.25, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: secRef.current, start: 'top 80%' } });
  }, { scope: secRef });

  const cards = [
    {
      icon: <Target size={32} />,
      title: t('aboutMissionTitle'),
      text: t('aboutMissionText'),
      gradient: `linear-gradient(135deg, ${GOLD}25 0%, transparent 100%)`,
      accent: GOLD,
      badge: isRTL ? 'مهمتنا' : 'Mission',
    },
    {
      icon: <Eye size={32} />,
      title: t('aboutVisionTitle'),
      text: t('aboutVisionText'),
      gradient: `linear-gradient(135deg, #7ed8a425 0%, transparent 100%)`,
      accent: '#7ed8a4',
      badge: isRTL ? 'رؤيتنا' : 'Vision',
    },
  ];

  return (
    <section ref={secRef} className="py-28 relative" style={{ background: GREEN }}>
      <div className="absolute inset-0 opacity-20"
        style={{ backgroundImage: `radial-gradient(ellipse at 80% 20%, ${GOLD}30 0%, transparent 50%)` }} />

      <div className="container px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5"
            style={{ background: `${GOLD}15`, border: `1px solid ${GOLD}40`, color: GOLD }}>
            <Zap size={14} />
            <span className="text-sm font-bold tracking-widest uppercase">{isRTL ? 'هويتنا' : 'Identity'}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white">
            {isRTL ? 'مهمتنا ورؤيتنا' : 'Mission & Vision'}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {cards.map((c, i) => (
            <div key={i} className="mv-card group relative p-8 md:p-10 rounded-3xl border overflow-hidden cursor-default transition-transform duration-300 hover:-translate-y-2"
              style={{ background: c.gradient, borderColor: `${c.accent}30` }}>
              {/* Glow on hover */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ boxShadow: `inset 0 0 60px ${c.accent}20` }} />

              <div className="flex items-start gap-5 mb-6">
                <div className="shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: `${c.accent}20`, color: c.accent }}>
                  {c.icon}
                </div>
                <div>
                  <span className="text-xs font-bold tracking-widest uppercase px-2 py-1 rounded-full"
                    style={{ background: `${c.accent}20`, color: c.accent }}>{c.badge}</span>
                  <h3 className="text-2xl md:text-3xl font-black text-white mt-2">{c.title}</h3>
                </div>
              </div>
              <p className="text-base leading-relaxed" style={{ color: '#9ea89e' }}>{c.text}</p>

              <div className="absolute bottom-6 right-6 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1"
                style={{ background: `${c.accent}30`, color: c.accent }}>
                <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ValuesSection({ t, isRTL }) {
  const secRef = useRef(null);
  const titleRef = useRef(null);
  const values = isRTL ? VALUES_AR : VALUES_EN;

  useGSAP(() => {
    gsap.fromTo(titleRef.current.children,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.15, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: titleRef.current, start: 'top 85%' } });

    gsap.fromTo('.val-card',
      { y: 50, opacity: 0, scale: 0.92 },
      { y: 0, opacity: 1, scale: 1, stagger: 0.1, duration: 0.7, ease: 'back.out(1.3)',
        scrollTrigger: { trigger: '.val-grid', start: 'top 80%' } });
  }, { scope: secRef });

  return (
    <section ref={secRef} className="py-28 relative overflow-hidden" style={{ background: '#060f0a' }}>
      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}50, transparent)` }} />
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}50, transparent)` }} />

      <div className="container px-6 max-w-6xl mx-auto">
        <div ref={titleRef} className="text-center mb-16 space-y-4 overflow-hidden">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
            style={{ background: `${GOLD}15`, border: `1px solid ${GOLD}40`, color: GOLD }}>
            <Crown size={14} />
            <span className="text-sm font-bold tracking-widest uppercase">{isRTL ? 'قيمنا' : 'Values'}</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white">
            {t('aboutValuesTitle')}
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: '#7a8a7a' }}>
            {isRTL
              ? 'المبادئ التي تقود كل قرار نتخذه وكل خدمة نقدمها'
              : 'The principles that guide every decision we make and every service we deliver'}
          </p>
        </div>

        <div className="val-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {values.map((v, i) => (
            <div key={i}
              className="val-card group relative p-6 rounded-2xl border overflow-hidden cursor-default transition-all duration-400 hover:-translate-y-3 hover:shadow-2xl"
              style={{ background: `${GREEN}`, borderColor: `${v.color}25` }}>

              {/* Background glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at top left, ${v.color}15 0%, transparent 60%)` }} />

              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl"
                style={{ background: `linear-gradient(90deg, transparent, ${v.color}, transparent)` }} />

              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${v.color}20`, color: v.color }}>
                  {v.icon}
                </div>
                <h4 className="text-lg font-black text-white mb-2 leading-tight">{v.title}</h4>
                <p className="text-sm leading-relaxed" style={{ color: '#7a8a7a' }}>{v.desc}</p>
              </div>

              {/* Number badge */}
              <div className="absolute top-4 right-4 text-xs font-black opacity-20 group-hover:opacity-60 transition-opacity"
                style={{ color: v.color }}>{String(i + 1).padStart(2, '0')}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BranchesSection({ t, isRTL }) {
  const secRef = useRef(null);
  const branches = [
    { nameKey: 'branch_1_name', addrKey: 'branch_1_addr', icon: <Crown size={24} />, mapUrl: 'https://maps.google.com/?q=Centre+Ville+Bechar+Algeria', color: GOLD },
    { nameKey: 'branch_2_name', addrKey: 'branch_2_addr', icon: <BookOpen size={24} />, mapUrl: 'https://maps.google.com/?q=Bidando+Bechar+Algeria', color: '#7ed8a4' },
    { nameKey: 'branch_3_name', addrKey: 'branch_3_addr', icon: <Star size={24} />, mapUrl: 'https://maps.google.com/?q=CNEP+Bechar+Algeria', color: '#a78bfa' },
  ];

  useGSAP(() => {
    gsap.fromTo('.branch-card',
      { y: 60, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, stagger: 0.2, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: secRef.current, start: 'top 80%' } });
  }, { scope: secRef });

  return (
    <section ref={secRef} className="py-28 relative" style={{ background: GREEN }}>
      <div className="absolute inset-0 opacity-30"
        style={{ backgroundImage: `radial-gradient(ellipse at 50% 100%, ${GOLD}20 0%, transparent 60%)` }} />

      <div className="container px-6 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5"
            style={{ background: `${GOLD}15`, border: `1px solid ${GOLD}40`, color: GOLD }}>
            <MapPin size={14} />
            <span className="text-sm font-bold tracking-widest uppercase">{t('locationsBadge')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white">{t('locationsTitle')}</h2>
          <p className="mt-4 text-lg max-w-xl mx-auto" style={{ color: '#7a8a7a' }}>{t('locationsDescription')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {branches.map((b, i) => (
            <a key={i} href={b.mapUrl} target="_blank" rel="noopener noreferrer"
              className="branch-card group relative p-6 rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              style={{ background: '#060f0a', borderColor: `${b.color}25` }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at top, ${b.color}12 0%, transparent 70%)` }} />

              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: `${b.color}20`, color: b.color }}>
                  {b.icon}
                </div>
                <h3 className="text-lg font-black text-white mb-1">{t(b.nameKey)}</h3>
                <p className="text-sm flex items-center gap-1" style={{ color: '#7a8a7a' }}>
                  <MapPin size={12} style={{ color: b.color }} />
                  {t(b.addrKey)}
                </p>
              </div>

              <div className="absolute bottom-4 right-4 flex items-center gap-1 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: b.color }}>
                {t('viewOnMap')} <ArrowRight size={12} />
              </div>
            </a>
          ))}
        </div>

        <div className="text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-semibold"
            style={{ background: `${GOLD}15`, border: `1px solid ${GOLD}30`, color: GOLD }}>
            🚀 {t('deliveryInfo')}
          </div>
        </div>
      </div>
    </section>
  );
}

function CtaSection({ t, isRTL }) {
  const secRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo('.cta-inner',
      { scale: 0.88, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: secRef.current, start: 'top 80%' } });
  }, { scope: secRef });

  return (
    <section ref={secRef} className="py-28 relative overflow-hidden" style={{ background: '#060f0a' }}>
      <div className="absolute inset-0 opacity-40"
        style={{ backgroundImage: `radial-gradient(ellipse at 50% 50%, ${GOLD}20 0%, transparent 60%)` }} />

      <div className="container px-6 max-w-4xl mx-auto text-center">
        <div className="cta-inner relative p-12 md:p-16 rounded-[3rem] border overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${GREEN} 0%, #0a1f14 100%)`, borderColor: `${GOLD}35` }}>

          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
            style={{ background: GOLD }} />
          <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full opacity-10 blur-3xl pointer-events-none"
            style={{ background: GOLD2 }} />

          <Crown className="mx-auto mb-6 opacity-80" size={48} style={{ color: GOLD }} />
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">{t('welcome')}</h2>
          <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: '#9ea89e' }}>
            {isRTL ? 'اكتشف عالماً من القرطاسية الراقية والأدوات التعليمية المنتقاة بعناية.' : 'Discover a world of premium stationery and carefully curated educational tools.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/products"
              className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-black text-base transition-all duration-300 hover:scale-105 hover:shadow-xl"
              style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD2})`, color: GREEN }}>
              {t('getStarted')} <ArrowRight size={18} />
            </a>
            <a href="/contact"
              className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-black text-base transition-all duration-300 hover:scale-105 border"
              style={{ borderColor: `${GOLD}50`, color: GOLD, background: `${GOLD}10` }}>
              {isRTL ? 'تواصل معنا' : 'Contact Us'}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Main Component ─────────────────────────────────── */
const AboutScreen = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <div style={{ background: GREEN, color: 'white' }} dir={isRTL ? 'rtl' : 'ltr'}>
      <HeroSection t={t} isRTL={isRTL} />
      <StorySection t={t} isRTL={isRTL} />
      <MissionVisionSection t={t} isRTL={isRTL} />
      <ValuesSection t={t} isRTL={isRTL} />
      <BranchesSection t={t} isRTL={isRTL} />
      <CtaSection t={t} isRTL={isRTL} />
    </div>
  );
};

export default AboutScreen;
