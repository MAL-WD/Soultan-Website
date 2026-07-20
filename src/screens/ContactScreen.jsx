import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Mail, Phone, MapPin, Send, Facebook, Instagram,
  MessageCircle, ArrowRight, Sparkles, Clock,
  CheckCircle, Crown
} from 'lucide-react';
import { toast } from 'react-toastify';

gsap.registerPlugin(ScrollTrigger);

const GOLD  = '#f2c161';
const GOLD2 = '#e0a730';
const GREEN = '#02110c';

/* ── TikTok SVG icon ─────────────────────────────────── */
const TikTokIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.29 6.29 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.05a8.12 8.12 0 0 0 4.76 1.52V7.12a4.85 4.85 0 0 1-.99-.43z"/>
  </svg>
);

/* ── Input component ──────────────────────────────────── */
function FloatingInput({ label, name, type = 'text', value, onChange, required, multiline, rows = 5 }) {
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;
  const active = focused || hasValue;

  const baseStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: `1.5px solid ${active ? GOLD : 'rgba(255,255,255,0.10)'}`,
    color: 'white',
    borderRadius: '16px',
    padding: '20px 18px 8px',
    width: '100%',
    outline: 'none',
    fontSize: '15px',
    transition: 'border-color 0.25s, box-shadow 0.25s',
    boxShadow: focused ? `0 0 0 4px ${GOLD}15` : 'none',
    resize: 'none',
    fontFamily: 'inherit',
  };

  const labelStyle = {
    position: 'absolute',
    top: active ? '8px' : '50%',
    transform: active ? 'none' : (multiline ? 'translateY(-50%)' : 'translateY(-50%)'),
    left: '18px',
    fontSize: active ? '11px' : '15px',
    color: active ? GOLD : 'rgba(255,255,255,0.45)',
    pointerEvents: 'none',
    transition: 'all 0.2s ease',
    fontWeight: active ? '600' : '400',
    letterSpacing: active ? '0.05em' : '0',
    zIndex: 1,
  };

  if (multiline) labelStyle.top = active ? '8px' : '16px';

  return (
    <div style={{ position: 'relative' }}>
      <label style={labelStyle}>{label}</label>
      {multiline ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          rows={rows}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ ...baseStyle, paddingTop: '22px' }}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={baseStyle}
        />
      )}
    </div>
  );
}

const ContactScreen = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const formRef = useRef(null);
  const infoRef = useRef(null);
  const [sent, setSent] = useState(false);

  const [formData, setFormData] = useState({
    name: '', email: '', subject: '', message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactInfo = [
    {
      icon: <Phone size={22} />,
      title: isArabic ? 'الهاتف' : 'Phone',
      value: '0656 97 54 04',
      link: 'tel:0656975404',
      color: '#7ed8a4',
      note: isArabic ? 'متاح 9ص – 10م' : 'Available 9am – 10pm',
    },
    {
      icon: <Mail size={22} />,
      title: isArabic ? 'البريد الإلكتروني' : 'Email',
      value: 'soltanestationery@gmail.com',
      link: 'mailto:soltanestationery@gmail.com',
      color: GOLD,
      note: isArabic ? 'رد خلال 24 ساعة' : 'Reply within 24 hrs',
    },
    {
      icon: <MapPin size={22} />,
      title: isArabic ? 'الفرع الرئيسي' : 'Main Branch',
      value: isArabic ? 'وسط المدينة، بشار' : 'Centre Ville, Bechar',
      link: 'https://www.google.com/maps/place/%D9%85%D9%83%D8%AA%D8%A8%D8%A9+%D8%A7%D9%84%D8%B3%D9%84%D8%B7%D8%A7%D9%86%E2%80%AD/@31.5970461,-2.231672,17z/data=!3m1!4b1!4m6!3m5!1s0xd8ff7feb40b3981:0x32ff814b6aa38cf3!8m2!3d31.5970461!4d-2.231672!16s%2Fg%2F11jb0q19gl?entry=ttu&g_ep=EgoyMDI2MDcwOC4wIKXMDSoASAFQAw%3D%3D',
      color: '#f2c161',
      note: isArabic ? 'افتح في خرائط جوجل' : 'Open in Google Maps',
    },
    {
      icon: <MapPin size={22} />,
      title: isArabic ? 'فرع بيداندو' : 'Bidando Branch',
      value: isArabic ? 'بيداندو، بشار' : 'Bidando, Bechar',
      link: 'https://maps.app.goo.gl/CQdoqYCWtFf5jqiW9',
      color: '#71b83e',
      note: isArabic ? 'افتح في خرائط جوجل' : 'Open in Google Maps',
    },
    {
      icon: <MapPin size={22} />,
      title: isArabic ? 'فرع لا كناب' : 'La Kenab Branch',
      value: isArabic ? 'لا كناب، بشار' : 'La Kenab, Bechar',
      link: 'https://maps.app.goo.gl/qLDcpt4eA9UXcrns5',
      color: '#a78bfa',
      note: isArabic ? 'افتح في خرائط جوجل' : 'Open in Google Maps',
    },
  ];

  const socials = [
    {
      icon: <Facebook size={20} />,
      href: 'https://www.facebook.com/PapetrieelSoltane?locale=fr_FR',
      label: 'Facebook',
      color: '#1877F2',
      bg: '#1877F210',
    },
    {
      icon: <Instagram size={20} />,
      href: 'https://www.instagram.com/soultan_stationery/',
      label: 'Instagram',
      color: '#E4405F',
      bg: '#E4405F10',
    },
    {
      icon: <TikTokIcon size={20} />,
      href: 'https://www.tiktok.com/@soultan_stationery',
      label: 'TikTok',
      color: '#ffffff',
      bg: '#ffffff10',
    },
  ];

  /* ── Animations ───────────────────────────────────── */
  useGSAP(() => {
    // Hero
    gsap.fromTo('.hero-badge', { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'back.out(2)' });
    gsap.fromTo('.hero-title', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 });
    gsap.fromTo('.hero-sub', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.5 });

    // Floating orbs
    gsap.to('.contact-orb-1', { y: -25, duration: 4.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.contact-orb-2', { y: 20, x: -15, duration: 5.5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.5 });

    // Info cards
    gsap.fromTo('.info-card',
      { x: isArabic ? 50 : -50, opacity: 0 },
      { x: 0, opacity: 1, stagger: 0.15, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: infoRef.current, start: 'top 80%' } });

    // Form
    gsap.fromTo(formRef.current,
      { x: isArabic ? -60 : 60, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: formRef.current, start: 'top 80%' } });
  }, { scope: pageRef });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const emailData = {
      service_id: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_placeholder',
      template_id: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_placeholder',
      user_id: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'public_key_placeholder',
      template_params: {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_name: 'Soltane Team',
      },
    };

    try {
      // 1. Send via EmailJS (existing)
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData),
      });

      // 2. Send to backend for Telegram notification (fire-and-forget)
      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        })
      }).catch(err => console.error('Telegram notification fetch error:', err));

      if (response.ok) {
        setSent(true);
        toast.success(isArabic ? 'تم إرسال رسالتك بنجاح!' : 'Message sent successfully!');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setSent(false), 5000);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast.error(isArabic ? 'فشل إرسال الرسالة. حاول مرة أخرى.' : 'Failed to send message. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <div ref={pageRef} style={{ background: GREEN, color: 'white', minHeight: '100vh' }} dir={isArabic ? 'rtl' : 'ltr'}>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1596526131083-e8c633c948d2?q=80&w=1974&auto=format&fit=crop"
            alt="Contact" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0"
            style={{ background: `linear-gradient(180deg, ${GREEN}90 0%, ${GREEN}f5 100%)` }} />
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: `linear-gradient(${GOLD} 1px, transparent 1px), linear-gradient(90deg, ${GOLD} 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />

        {/* Orbs */}
        <div className="contact-orb-1 absolute w-[500px] h-[500px] rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: `radial-gradient(circle, ${GOLD} 0%, transparent 70%)`, top: '-10%', right: '-5%' }} />
        <div className="contact-orb-2 absolute w-[350px] h-[350px] rounded-full opacity-8 blur-3xl pointer-events-none"
          style={{ background: `radial-gradient(circle, ${GOLD2} 0%, transparent 70%)`, bottom: '5%', left: '-5%' }} />

        <div className="container relative z-10 text-center px-6 max-w-4xl mx-auto py-24">
          <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8"
            style={{ borderColor: `${GOLD}50`, background: `${GOLD}15`, color: GOLD }}>
            <Sparkles size={14} />
            <span className="text-sm font-semibold tracking-widest uppercase">
              {isArabic ? 'تواصل معنا' : 'Contact Us'}
            </span>
          </div>

          <h1 className="hero-title text-5xl md:text-7xl font-black text-white leading-tight mb-6">
            {isArabic ? "نحن هنا\u00A0" : "Let's\u00A0"}
            <span style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD2})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {isArabic ? 'لمساعدتك' : 'Talk'}
            </span>
          </h1>

          <p className="hero-sub text-lg md:text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: '#c5bfb0' }}>
            {isArabic
              ? 'نحن هنا لمساعدتكم في أي استفسار أو طلب. لا تترددوا في التواصل معنا.'
              : 'We are here to help with any inquiry or request. Feel free to reach out to us anytime.'}
          </p>

          {/* Quick stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-10">
            {[
              { icon: <Clock size={14} />, label: isArabic ? 'رد سريع' : 'Quick Response' },
              { icon: <CheckCircle size={14} />, label: isArabic ? 'خدمة موثوقة' : 'Reliable Service' },
              { icon: <Crown size={14} />, label: isArabic ? 'تجربة ملكية' : 'Royal Experience' },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-sm" style={{ color: '#9ea89e' }}>
                <span style={{ color: GOLD }}>{s.icon}</span> {s.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ──────────────────────────────────── */}
      <section className="py-20 relative">
        <div className="container px-6 max-w-6xl mx-auto">
          <div className={`grid grid-cols-1 lg:grid-cols-5 gap-12`}>

            {/* ── INFO SIDEBAR ─────────────────────────── */}
            <div ref={infoRef} className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white mb-1">{isArabic ? 'ابق على تواصل' : 'Get in Touch'}</h2>
                <div className="w-12 h-0.5 rounded-full mt-2" style={{ background: `linear-gradient(90deg, ${GOLD}, ${GOLD2})` }} />
              </div>

              {/* Contact info cards */}
              {contactInfo.map((info, idx) => (
                <a key={idx} href={info.link}
                  className="info-card group flex items-start gap-4 p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  style={{ background: 'rgba(255,255,255,0.03)', borderColor: `${info.color}25` }}
                  target={info.link.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer">
                  <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `${info.color}20`, color: info.color }}>
                    {info.icon}
                  </div>
                  <div>
                    <div className="text-xs font-bold tracking-widest uppercase mb-0.5" style={{ color: info.color }}>{info.title}</div>
                    <div className="text-white font-semibold text-sm" dir="ltr" style={{ textAlign: isArabic ? 'right' : 'left' }}>{info.value}</div>
                    <div className="text-xs mt-0.5" style={{ color: '#5a6a5a' }}>{info.note}</div>
                  </div>
                </a>
              ))}

              {/* Social Links */}
              <div className="pt-4">
                <h3 className="text-sm font-bold tracking-widest uppercase mb-4" style={{ color: '#7a8a7a' }}>
                  {isArabic ? 'تابعنا' : 'Follow Us'}
                </h3>
                <div className="flex gap-3">
                  {socials.map((s, i) => (
                    <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                      title={s.label}
                      className="w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                      style={{ background: s.bg, borderColor: `${s.color}30`, color: s.color }}>
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* Hours */}
              <div className="p-5 rounded-2xl border"
                style={{ background: `${GOLD}08`, borderColor: `${GOLD}20` }}>
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={16} style={{ color: GOLD }} />
                  <span className="text-sm font-bold" style={{ color: GOLD }}>
                    {isArabic ? 'ساعات العمل' : 'Working Hours'}
                  </span>
                </div>
                <div className="space-y-1.5 text-sm" style={{ color: '#9ea89e' }}>
                  <div className="flex justify-between">
                    <span>{isArabic ? 'السبت – الخميس' : 'Sat – Thu'}</span>
                    <span className="text-white font-semibold">8:00 – 22:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isArabic ? 'الجمعة' : 'Friday'}</span>
                    <span className="text-white font-semibold">16:00 – 22:00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── CONTACT FORM ─────────────────────────── */}
            <div ref={formRef} className="lg:col-span-3">
              <div className="relative p-8 md:p-10 rounded-3xl border overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}>

                {/* Corner decoration */}
                <div className="absolute top-0 right-0 w-40 h-40 rounded-bl-full opacity-30 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at top right, ${GOLD}40, transparent)` }} />
                <div className="absolute bottom-0 left-0 w-32 h-32 rounded-tr-full opacity-20 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at bottom left, ${GOLD}40, transparent)` }} />

                {/* Success state */}
                {sent ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                      style={{ background: `${GOLD}20` }}>
                      <CheckCircle size={40} style={{ color: GOLD }} />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2">
                      {isArabic ? 'تم الإرسال! 🎉' : 'Message Sent! 🎉'}
                    </h3>
                    <p style={{ color: '#9ea89e' }}>
                      {isArabic ? 'سنتواصل معك قريباً' : "We'll get back to you soon"}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mb-8 relative z-10">
                      <h3 className="text-2xl font-black text-white">{isArabic ? 'أرسل رسالتك' : 'Send a Message'}</h3>
                      <p className="text-sm mt-1" style={{ color: '#7a8a7a' }}>
                        {isArabic ? 'سنرد عليك في أقرب وقت ممكن' : "We'll respond as soon as possible"}
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <FloatingInput
                          label={isArabic ? 'الاسم' : 'Your Name'}
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                        <FloatingInput
                          label={isArabic ? 'البريد الإلكتروني' : 'Email Address'}
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <FloatingInput
                        label={isArabic ? 'الموضوع' : 'Subject'}
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                      />

                      <FloatingInput
                        label={isArabic ? 'رسالتك' : 'Your Message'}
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        multiline
                        rows={5}
                      />

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group relative flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-black text-base transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden"
                        style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD2})`, color: GREEN }}>

                        {/* Shimmer effect */}
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 opacity-30"
                          style={{ background: 'linear-gradient(90deg, transparent, white, transparent)' }} />

                        {isSubmitting ? (
                          <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
                            style={{ borderColor: GREEN, borderTopColor: 'transparent' }} />
                        ) : (
                          <>
                            <Send size={18} />
                            {isArabic ? 'إرسال الرسالة' : 'Send Message'}
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── MAP / LOCATION CTA ───────────────────────────── */}
      <section className="pb-20 relative">
        <div className="container px-6 max-w-6xl mx-auto">
          <div className="relative p-8 rounded-3xl border overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.02)', borderColor: `${GOLD}20` }}>
            <div className="absolute inset-0 opacity-20 pointer-events-none"
              style={{ backgroundImage: `radial-gradient(ellipse at 50% 50%, ${GOLD}25 0%, transparent 70%)` }} />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-black text-white mb-1">
                  {isArabic ? '🚀 نوصل لجميع ولايات الجزائر!' : '🚀 We deliver to all of Algeria!'}
                </h3>
                <p className="text-sm" style={{ color: '#7a8a7a' }}>
                  {isArabic ? 'أو قم بزيارة أحد فروعنا في بشار' : 'Or visit one of our branches in Bechar'}
                </p>
              </div>
              <a href="/about"
                className="shrink-0 inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-sm transition-all duration-300 hover:scale-105 border"
                style={{ borderColor: `${GOLD}50`, color: GOLD, background: `${GOLD}10` }}>
                {isArabic ? 'عرض الفروع' : 'View Branches'} <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ContactScreen;
