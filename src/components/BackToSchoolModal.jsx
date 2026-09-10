import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { X, GraduationCap, BookOpen, Layers, Target, Library, User } from 'lucide-react';
import { useGetCollectionBySchoolLevelQuery } from '../slices/collectionsApiSlice';

const BackToSchoolModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedGender, setSelectedGender] = useState('boy'); // 'boy' or 'girl'
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  
  const isArabic = i18n.language === 'ar';
  const isFrench = i18n.language === 'fr';

  const t = (ar, fr, en) => isArabic ? ar : isFrench ? fr : en;

  const schoolStages = [
    { id: 'preparatory', icon: Target, label: t('تحضيري', 'Préparatoire', 'Preparatory') },
    { id: 'primary', icon: BookOpen, label: t('ابتدائي', 'Primaire', 'Primary') },
    { id: 'middle', icon: Layers, label: t('متوسط', 'Moyen', 'Middle') },
    { id: 'high', icon: GraduationCap, label: t('ثانوي', 'Secondaire', 'High School') },
    { id: 'university', icon: Library, label: t('جامعي / أستاذ', 'Universitaire', 'University') }
  ];

  const gradeLevels = {
    preparatory: [{ id: 'preparatory', label: t('القسم التحضيري', 'Classe Préparatoire', 'Preparatory Class') }],
    primary: [
      { id: 'primary_1', label: t('السنة الأولى ابتدائي', '1ère Année Primaire', '1st Grade Primary') },
      { id: 'primary_2', label: t('السنة الثانية ابتدائي', '2ème Année Primaire', '2nd Grade Primary') },
      { id: 'primary_3', label: t('السنة الثالثة ابتدائي', '3ème Année Primaire', '3rd Grade Primary') },
      { id: 'primary_4', label: t('السنة الرابعة ابتدائي', '4ème Année Primaire', '4th Grade Primary') },
      { id: 'primary_5', label: t('السنة الخامسة ابتدائي', '5ème Année Primaire', '5th Grade Primary') }
    ],
    middle: [
      { id: 'middle_1', label: t('السنة الأولى متوسط', '1ère Année Moyen', '1st Grade Middle') },
      { id: 'middle_2', label: t('السنة الثانية متوسط', '2ème Année Moyen', '2nd Grade Middle') },
      { id: 'middle_3', label: t('السنة الثالثة متوسط', '3ème Année Moyen', '3rd Grade Middle') },
      { id: 'middle_4', label: t('السنة الرابعة متوسط', '4ème Année Moyen', '4th Grade Middle') }
    ],
    high: [
      { id: 'high_1', label: t('السنة الأولى ثانوي', '1ère Année Secondaire', '1st Grade High') },
      { id: 'high_2', label: t('السنة الثانية ثانوي', '2ème Année Secondaire', '2nd Grade High') },
      { id: 'high_3', label: t('السنة الثالثة ثانوي', '3ème Année Secondaire (BAC)', '3rd Grade High') }
    ],
    university: [
      { id: 'university', label: t('طالب جامعي', 'Universitaire', 'University Student') },
      { id: 'teacher', label: t('أستاذ', 'Professeur', 'Teacher') }
    ]
  };

  const { data: colData, isFetching } = useGetCollectionBySchoolLevelQuery(
    { level: selectedGrade, gender: selectedGender },
    { skip: !selectedGrade }
  );

  const collection = colData?.data;

  useEffect(() => {
    const dismissed = sessionStorage.getItem('bts_modal_dismissed');
    if (!dismissed) {
      const timer = setTimeout(() => setIsOpen(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem('bts_modal_dismissed', 'true');
    setIsOpen(false);
  };

  const handleProceed = () => {
    if (collection) {
      navigate(`/collections/${collection._id}`);
      handleDismiss();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm p-0 md:p-4" dir={isArabic ? 'rtl' : 'ltr'}>
        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="bg-white w-full max-w-2xl md:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          
          <div className="relative bg-gradient-to-r from-[#012b0d] to-[#023c12] pt-8 pb-6 px-6 text-center text-white shrink-0">
            <button onClick={handleDismiss} className={`absolute top-4 ${isArabic ? 'left-4' : 'right-4'} w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors`}>
              <X className="w-4 h-4" />
            </button>
            <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 mb-3">
              <GraduationCap className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-wider">{t('العودة إلى المدرسة', 'Rentrée Scolaire', 'Back to School')}</span>
            </div>
            <h2 className="text-2xl font-black mb-1">{t('اختر المرحلة الدراسية لطفلك', 'Choisissez le niveau de votre enfant', 'Choose Your Child\'s Grade Level')}</h2>
            <p className="text-white/70 text-sm">{t('سنعرض لك المجموعة الرسمية وفق قرار وزارة التربية الوطنية', 'Nous afficherons le pack officiel selon le Ministère de l\'Éducation', 'We\'ll show the official kit based on Ministry requirements')}</p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 space-y-6">
            
            {/* Stage Selector */}
            <div>
              <h3 className="text-sm font-bold text-gray-500 mb-3">{t('1. المرحلة التعليمية', '1. Niveau Scolaire', '1. School Stage')}</h3>
              <div className="flex flex-wrap gap-2">
                {schoolStages.map(stage => {
                  const Icon = stage.icon;
                  const isActive = selectedStage === stage.id;
                  return (
                    <button key={stage.id} onClick={() => { setSelectedStage(stage.id); setSelectedGrade(null); }} className={`flex flex-col items-center justify-center w-24 h-24 rounded-2xl border-2 transition-all ${isActive ? 'border-[#023c12] bg-[#023c12]/5 text-[#023c12]' : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200 hover:bg-gray-50'}`}>
                      <Icon className={`w-8 h-8 mb-2 ${isActive ? 'text-[#023c12]' : 'text-gray-300'}`} />
                      <span className="text-xs font-bold text-center leading-tight px-1">{stage.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Grade Selector */}
            <AnimatePresence mode="wait">
              {selectedStage && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <h3 className="text-sm font-bold text-gray-500 mb-3">{t('2. السنة الدراسية', '2. Classe', '2. Grade Level')}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {gradeLevels[selectedStage].map(grade => {
                      const isActive = selectedGrade === grade.id;
                      return (
                        <button key={grade.id} onClick={() => setSelectedGrade(grade.id)} className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all ${isActive ? 'border-[#023c12] bg-[#023c12] text-white shadow-md' : 'border-gray-100 bg-white text-gray-600 hover:border-gray-200'}`}>
                          <span className="text-sm font-bold">{grade.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Gender Selector (Boy / Girl) */}
            {selectedGrade && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h3 className="text-sm font-bold text-gray-500 mb-3">{t('3. تلميذ أم تلميذة؟', '3. Garçon ou Fille?', '3. Boy or Girl?')}</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSelectedGender('boy')}
                    className={`flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl border-2 font-bold transition-all ${selectedGender === 'boy' ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}`}
                  >
                    <span className="text-xl">👦</span>
                    <span>{t('ولد (بنين)', 'Garçon', 'Boy')}</span>
                  </button>
                  <button
                    onClick={() => setSelectedGender('girl')}
                    className={`flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl border-2 font-bold transition-all ${selectedGender === 'girl' ? 'border-pink-500 bg-pink-50 text-pink-700 shadow-sm' : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}`}
                  >
                    <span className="text-xl">👧</span>
                    <span>{t('بنت (بنات)', 'Fille', 'Girl')}</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Selected Kit Status / Preview */}
            {selectedGrade && (
              <motion.div initial={{ opacity: 0, mt: 0 }} animate={{ opacity: 1, mt: 16 }} className="bg-white border border-gray-100 rounded-2xl p-4 text-center shadow-sm">
                {isFetching ? (
                  <div className="py-4">
                    <div className="w-6 h-6 border-2 border-[#023c12] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-xs text-gray-500">{t('جاري البحث عن المجموعة...', 'Recherche du pack...', 'Searching for kit...')}</p>
                  </div>
                ) : collection ? (
                  <div className={`flex items-center gap-4 ${isArabic ? 'text-right' : 'text-left'}`}>
                    {collection.governmentDocImages?.[0] && (
                      <img src={collection.governmentDocImages[0]} alt="Doc" className="w-16 h-20 object-cover rounded-lg border border-gray-200 shadow-sm" />
                    )}
                    <div>
                      <h4 className="font-black text-gray-900 mb-1">
                        {isArabic ? collection.name_ar : isFrench ? (collection.name_fr || collection.name_en) : collection.name_en}
                      </h4>
                      <p className="text-xs text-green-600 font-bold bg-green-50 inline-block px-2 py-1 rounded">
                        {t('متوفرة الآن', 'Disponible', 'Available Now')}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm py-2">
                    {t('لا توجد مجموعة متاحة لهذا المستوى حالياً. تحقق مجدداً قريباً.', 'Aucun pack disponible pour le moment.', 'No kit available for this level currently.')}
                  </p>
                )}
              </motion.div>
            )}

          </div>

          <div className="p-4 bg-white border-t border-gray-100 shrink-0">
            <button onClick={handleProceed} disabled={!collection} className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${collection ? 'bg-[#023c12] text-white hover:bg-[#012b0d] shadow-lg shadow-[#023c12]/20' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
              {t('عرض مجموعة طفلك', 'Voir le pack de votre enfant', 'View your child\'s kit')}
            </button>
            <button onClick={handleDismiss} className="w-full mt-3 py-2 text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors">
              {t('تصفح المجموعات العادية', 'Parcourir les packs standards', 'Browse standard collections')}
            </button>
          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BackToSchoolModal;