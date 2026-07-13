// Parent categories (top-level)
const parentCategories = [
    {
        name_en: 'Articles',
        name_ar: 'أدوات',
        slug: 'articles',
        description_en: 'Writing supplies, school and office tools',
        description_ar: 'لوازم الكتابة، الأدوات المدرسية والمكتبية',
        icon: '✏️',
        order: 1,
    },
    {
        name_en: 'Desktops',
        name_ar: 'مكاتب',
        slug: 'desktops',
        description_en: 'Office furniture and desk solutions',
        description_ar: 'أثاث مكتبي وحلول مكتبية',
        icon: '🪑',
        order: 2,
    },
    {
        name_en: 'Tech',
        name_ar: 'تقنية',
        slug: 'tech',
        description_en: 'Electronics, computers and tech accessories',
        description_ar: 'إلكترونيات، حواسيب وملحقات تقنية',
        icon: '💻',
        order: 3,
    },
    {
        name_en: 'Games',
        name_ar: 'ألعاب',
        slug: 'games',
        description_en: 'Educational and fun games for all ages',
        description_ar: 'ألعاب تعليمية وممتعة لجميع الأعمار',
        icon: '🎮',
        order: 4,
    },
    {
        name_en: 'Bags',
        name_ar: 'حقائب',
        slug: 'bags',
        description_en: 'School, office and laptop bags',
        description_ar: 'حقائب مدرسية، مكتبية وللحاسوب',
        icon: '🎒',
        order: 5,
    },
    {
        name_en: 'Books',
        name_ar: 'كتب',
        slug: 'books',
        description_en: 'Educational and literary books',
        description_ar: 'كتب تعليمية وأدبية',
        icon: '📚',
        order: 6,
    },
    {
        name_en: 'Gifts and others',
        name_ar: 'هدايا وأخرى',
        slug: 'gifts',
        description_en: 'Perfect gifts for your loved ones',
        description_ar: 'هدايا مثالية لأحبائك',
        icon: '🎁',
        order: 7,
    },
];

// Subcategories - linked via parentSlug
const subcategoriesData = [
    // Articles (أدوات)
    { name_en: 'School Stationery', name_ar: 'ادوات مدرسية', slug: 'school-stationery', parentSlug: 'articles', order: 1 },
    { name_en: 'Craft Tools', name_ar: 'ادوات حرفية', slug: 'craft-tools', parentSlug: 'articles', order: 2 },
    { name_en: 'Office Stationery', name_ar: 'ادوات مكتبية', slug: 'office-stationery', parentSlug: 'articles', order: 3 },

    // Desktops (مكاتب)
    { name_en: 'Administrative Desks', name_ar: 'مكاتب ادارية', slug: 'admin-desks', parentSlug: 'desktops', order: 1 },
    { name_en: 'Home Desks', name_ar: 'مكاتب منزلية', slug: 'home-desks', parentSlug: 'desktops', order: 2 },
    { name_en: 'Study Desks', name_ar: 'مكاتب دراسية', slug: 'study-desks', parentSlug: 'desktops', order: 3 },

    // Tech (تقنية)
    { name_en: 'Office Accessories', name_ar: 'اكسيسوارات مكتبية', slug: 'office-tech-accessories', parentSlug: 'tech', order: 1 },
    { name_en: 'Phone Accessories', name_ar: 'اكسيسوارات هاتفية', slug: 'phone-accessories', parentSlug: 'tech', order: 2 },
    { name_en: 'Computers', name_ar: 'حواسيب', slug: 'computers', parentSlug: 'tech', order: 3 },
    { name_en: 'Cables', name_ar: 'خيوط (كابلات)', slug: 'cables', parentSlug: 'tech', order: 4 },
    { name_en: 'Printer', name_ar: 'طابعة', slug: 'printer', parentSlug: 'tech', order: 5 },
    { name_en: 'Printer Ink', name_ar: 'حبر طابعة', slug: 'printer-ink', parentSlug: 'tech', order: 6 },
    { name_en: 'Cartridges', name_ar: 'ليكارتوش', slug: 'cartridges', parentSlug: 'tech', order: 7 },

    // Games (ألعاب)
    { name_en: 'Children Games', name_ar: 'ألعاب أطفال', slug: 'children-games', parentSlug: 'games', order: 1 },
    { name_en: 'Educational Games', name_ar: 'ألعاب تعليمية', slug: 'educational-games', parentSlug: 'games', order: 2 },
    { name_en: 'Intelligence Games', name_ar: 'ألعاب ذكاء', slug: 'intelligence-games', parentSlug: 'games', order: 3 },

    // Bags (حقائب)
    { name_en: 'School Bags', name_ar: 'حقائب مدرسية', slug: 'school-bags', parentSlug: 'bags', order: 1 },
    { name_en: 'Portfolio', name_ar: 'محفظة أوراق', slug: 'portfolio', parentSlug: 'bags', order: 2 },
    { name_en: 'Port PC', name_ar: 'حقيبة حاسوب', slug: 'port-pc', parentSlug: 'bags', order: 3 },
    { name_en: 'PC Backpack', name_ar: 'حقيبة ظهر للحاسوب', slug: 'pc-backpack', parentSlug: 'bags', order: 4 },
    { name_en: 'Administrative Case', name_ar: 'حقيبة إدارية', slug: 'admin-bag', parentSlug: 'bags', order: 5 },
    { name_en: 'Handbag', name_ar: 'حقيبة يد', slug: 'handbag', parentSlug: 'bags', order: 6 },

    // Books (كتب)
    { name_en: 'School Books', name_ar: 'كتب مدرسية', slug: 'school-books', parentSlug: 'books', order: 1 },
    { name_en: 'School Support Books', name_ar: 'كتب الدعم المدرسي', slug: 'school-support-books', parentSlug: 'books', order: 2 },
    { name_en: 'Novels', name_ar: 'روايات', slug: 'novels', parentSlug: 'books', order: 3 },
    { name_en: 'Children Books', name_ar: 'كتب أطفال', slug: 'children-books', parentSlug: 'books', order: 4 },
    { name_en: 'Law Books', name_ar: 'كتب القانون', slug: 'law-books', parentSlug: 'books', order: 5 },
    { name_en: 'Quran', name_ar: 'مصحف', slug: 'quran', parentSlug: 'books', order: 6 },
    { name_en: 'Islamic Books', name_ar: 'كتب إسلامية', slug: 'islamic-books', parentSlug: 'books', order: 7 },
    { name_en: 'Self-development Books', name_ar: 'كتب التطوير الذاتي', slug: 'self-development-books', parentSlug: 'books', order: 8 },


];

export { parentCategories, subcategoriesData };
export default parentCategories;
