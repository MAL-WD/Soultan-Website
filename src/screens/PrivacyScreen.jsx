import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Shield, Mail, Phone } from 'lucide-react';

const GOLD = '#f2c161';
const GREEN = '#023C12';

const policySections = [
  {
    titleEn: '1. Information We Collect',
    titleAr: '1. المعلومات التي نجمعها',
    contentEn:
      'We collect your name, email address, phone number, and physical shipping address when you create an account or place an order. We also collect transaction data, including payment proof uploads (CCP or Baridimob transfer slips), to verify your orders.',
    contentAr:
      'نقوم بجمع اسمك وبريدك الإلكتروني ورقم هاتفك وعنوان الشحن الفعلي عند إنشاء حساب أو تقديم طلب. نجمع أيضًا بيانات المعاملات بما فيها إيصالات الدفع (CCP أو بريد موب) للتحقق من طلباتك.',
  },
  {
    titleEn: '2. How We Use Your Information',
    titleAr: '2. كيف نستخدم معلوماتك',
    contentEn:
      "Your data is used to process and deliver your orders, manage your account, verify payments, respond to support queries, and improve your experience on the Soultan platform. We don't use your data for automated profiling or targeted advertising.",
    contentAr:
      'تُستخدم بياناتك لمعالجة طلباتك وتوصيلها، وإدارة حسابك، والتحقق من المدفوعات، والرد على استفسارات الدعم، وتحسين تجربتك على منصة سلطان. لا نستخدم بياناتك للتنميط الآلي أو الإعلانات المستهدفة.',
  },
  {
    titleEn: '3. Data Sharing & Third Parties',
    titleAr: '3. مشاركة البيانات مع أطراف ثالثة',
    contentEn:
      "We do not sell, trade, or rent your personal information to third parties. We only share the necessary delivery details (name, address, phone) with our logistics and delivery partners. Our website may use cookies for analytics purposes only — we don't share this data externally.",
    contentAr:
      'لا نبيع أو نتاجر أو نؤجر معلوماتك الشخصية لأطراف ثالثة. نشارك فقط تفاصيل التوصيل الضرورية مع شركائنا اللوجستيين. قد يستخدم موقعنا ملفات تعريف الارتباط لأغراض تحليلية فقط.',
  },
  {
    titleEn: '4. Data Security',
    titleAr: '4. أمان البيانات',
    contentEn:
      'We take data protection seriously. All communications between your browser/app and our servers are encrypted. Your account password is hashed and never stored in plain text. Payment proof images are stored securely and only accessed by authorized staff.',
    contentAr:
      'نأخذ حماية البيانات بجدية. جميع الاتصالات بين متصفحك/تطبيقك وخوادمنا مشفرة. كلمة مرور حسابك مشفرة ولا تُحفظ بنص عادي. صور إيصالات الدفع مخزنة بشكل آمن ولا يصل إليها إلا الموظفون المخولون.',
  },
  {
    titleEn: '5. Your Rights',
    titleAr: '5. حقوقك',
    contentEn:
      'You have the right to access, update, or request deletion of your personal data at any time. You can update your profile directly from your account page. For data deletion requests, contact us at the information below.',
    contentAr:
      'يحق لك الوصول إلى بياناتك الشخصية أو تحديثها أو طلب حذفها في أي وقت. يمكنك تحديث ملفك الشخصي مباشرة من صفحة الحساب. لطلبات حذف البيانات، تواصل معنا على المعلومات أدناه.',
  },
  {
    titleEn: '6. Changes to This Policy',
    titleAr: '6. التغييرات على هذه السياسة',
    contentEn:
      'We may update this Privacy Policy from time to time. We will notify users of significant changes via email or a prominent notice on our platform. Continued use of our services after such changes constitutes your acceptance of the updated policy.',
    contentAr:
      'قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سنخطر المستخدمين بالتغييرات المهمة عبر البريد الإلكتروني أو إشعار بارز على منصتنا.',
  },
];

export default function PrivacyScreen() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f7f8ff',
        fontFamily: isArabic
          ? 'ThmanyahSerifDisplay, ThmanyahSerifText, Arial, sans-serif'
          : 'Satoshi, Inter, sans-serif',
        direction: isArabic ? 'rtl' : 'ltr',
      }}
    >
      {/* Hero */}
      <div
        style={{
          background: `linear-gradient(135deg, ${GREEN} 0%, #055228 100%)`,
          padding: '80px 24px 60px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'backOut' }}
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: `${GOLD}22`,
            border: `2px solid ${GOLD}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Shield size={36} color={GOLD} />
        </motion.div>
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{ color: '#ffffff', fontSize: 'clamp(28px, 5vw, 48px)', margin: 0 }}
        >
          {isArabic ? 'سياسة الخصوصية' : 'Privacy Policy'}
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, margin: 0 }}
        >
          {isArabic ? 'آخر تحديث: يوليو 2025' : 'Last updated: July 2025'}
        </motion.p>
      </div>

      {/* Content */}
      <div
        style={{
          maxWidth: 800,
          margin: '0 auto',
          padding: '48px 24px 80px',
          display: 'flex',
          flexDirection: 'column',
          gap: 32,
        }}
      >
        {/* Intro */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            backgroundColor: '#fff',
            borderRadius: 16,
            padding: '28px 32px',
            boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
            borderLeft: `4px solid ${GREEN}`,
          }}
        >
          <p style={{ color: '#555', lineHeight: 1.8, margin: 0, fontSize: 15 }}>
            {isArabic
              ? 'مكتبة السلطان ملتزمة تمامًا بحماية خصوصية مستخدمي تطبيقنا وموقعنا الإلكتروني. توضح هذه الصفحة ممارساتنا بشأن جمع البيانات الشخصية وحمايتها واستخدامها.'
              : 'Soultan Stationery is fully committed to protecting the privacy of our app and website users. This page outlines our practices regarding the collection, protection, and use of your personal information.'}
          </p>
        </motion.div>

        {/* Sections */}
        {policySections.map((sec, i) => (
          <motion.div
            key={i}
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
            style={{
              backgroundColor: '#fff',
              borderRadius: 16,
              padding: '28px 32px',
              boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
            }}
          >
            <h2
              style={{
                color: GREEN,
                fontSize: 18,
                fontWeight: 700,
                margin: '0 0 12px 0',
              }}
            >
              {isArabic ? sec.titleAr : sec.titleEn}
            </h2>
            <p style={{ color: '#444', lineHeight: 1.8, margin: 0, fontSize: 15 }}>
              {isArabic ? sec.contentAr : sec.contentEn}
            </p>
          </motion.div>
        ))}

        {/* Contact Card */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            background: `linear-gradient(135deg, ${GREEN} 0%, #055228 100%)`,
            borderRadius: 20,
            padding: '32px',
            color: '#fff',
          }}
        >
          <h3 style={{ margin: '0 0 8px 0', fontSize: 20 }}>
            {isArabic ? 'تواصل معنا' : 'Contact Us'}
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.75)', margin: '0 0 20px 0', fontSize: 14 }}>
            {isArabic
              ? 'لأي أسئلة تخص الخصوصية أو لطلب حذف بياناتك'
              : 'For any privacy-related questions or to request data deletion'}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <a
              href="mailto:soltanestationery@gmail.com"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                color: GOLD,
                textDecoration: 'none',
                fontSize: 15,
              }}
            >
              <Mail size={18} />
              soltanestationery@gmail.com
            </a>
            <a
              href="tel:0656975404"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                color: GOLD,
                textDecoration: 'none',
                fontSize: 15,
                direction: 'ltr',
              }}
            >
              <Phone size={18} />
              0656 97 54 04
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
