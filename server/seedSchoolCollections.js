import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import Collection from './models/Collection.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const findBestMatch = (products, keywords, excludeKw = []) => {
  for (const p of products) {
    if (!p.name_ar) continue;
    
    // Must match ALL keywords
    let match = true;
    for (const kw of keywords) {
      if (!p.name_ar.toLowerCase().includes(kw.toLowerCase())) {
        match = false;
        break;
      }
    }
    
    // Must NOT match exclude keywords
    if (match && excludeKw.length > 0) {
      for (const ex of excludeKw) {
        if (p.name_ar.toLowerCase().includes(ex.toLowerCase())) {
          match = false;
          break;
        }
      }
    }
    
    if (match) return p._id;
  }
  return null;
};

const createCollections = async () => {
  await connectDB();
  
  // Clean up ALL Back to School collections first
  await Collection.deleteMany({ isBackToSchool: true });
  console.log('Cleared old Back to School collections');

  const products = await Product.find({ isActive: true }).select('name_ar price').lean();
  
  // Define item mappings (keywords to search for)
  const itemMap = {
    notebook_64: { kw: ['64', 'صفحة'], ex: ['أعمال', 'تطبيقية', 'رسم'] },
    notebook_48: { kw: ['48', 'صفحة'], ex: ['أعمال', 'تطبيقية', 'رسم'] },
    notebook_96: { kw: ['96', 'صفحة'], ex: ['أعمال', 'تطبيقية', 'رسم'] },
    notebook_120: { kw: ['120', 'صفحة'], ex: ['أعمال', 'تطبيقية', 'رسم'] },
    notebook_192: { kw: ['192', 'صفحة'], ex: ['أعمال', 'تطبيقية', 'رسم'] },
    notebook_32: { kw: ['32', 'صفحة'], ex: ['أعمال', 'تطبيقية', 'رسم', 'موسيقى'] },
    tp_notebook: { kw: ['أعمال تطبيقية', '64'] },
    tp_notebook_large: { kw: ['أعمال تطبيقية', '120'] }, // Assuming 120 or 192 for large
    music_notebook: { kw: ['موسيقى'] },
    drawing_notebook: { kw: ['رسم', 'كراس'], ex: ['بلاستيكية', 'قماشة'] },
    
    board: { kw: ['لوحة', 'تعليمية'] },
    eraser_board: { kw: ['ممسحة'] }, // Board eraser
    
    pen_blue: { kw: ['سيالة', 'زرقاء'] }, // Or قلم جاف أزرق
    pen_green: { kw: ['سيالة', 'خضراء'] },
    pencil: { kw: ['قلم رصاص'] },
    sharpener: { kw: ['مبراة'] },
    eraser: { kw: ['ممحاة'], ex: ['سبورة'] },
    colored_pencils: { kw: ['أقلام ملونة'] },
    ruler: { kw: ['مسطرة'], ex: ['حروف'] },
    dough: { kw: ['عجينة'] },
    colored_paper: { kw: ['ورق', 'ملون'] },
    
    // Middle school tools
    glue: { kw: ['غراء'] },
    set_square: { kw: ['كوس'] },
    protractor: { kw: ['منقلة'] },
    compass: { kw: ['مدور'] },
    folder: { kw: ['حافظة', 'بلاستيكية'] },
    millimeter_paper: { kw: ['ميليمتري'] },
    tracing_paper: { kw: ['شفاف', 'ورق'] },
    calculator: { kw: ['حاسبة', 'إلكترونية'] },
    
    // Art tools
    drawing_paper: { kw: ['ورق رسم', 'كونسون'] },
    pencil_hb: { kw: ['قلم', 'HB'] },
    markers: { kw: ['لباد'] },
    watercolors: { kw: ['مائية'] },
    brush: { kw: ['فرشاة'] },
  };

  const matchedItems = {};
  const missingItems = new Set();

  for (const [key, mapping] of Object.entries(itemMap)) {
    const id = findBestMatch(products, mapping.kw, mapping.ex);
    if (id) {
      matchedItems[key] = id;
    } else {
      missingItems.add(mapping.kw.join(' + '));
    }
  }

  const helperAdd = (arr, key, qty) => {
    if (matchedItems[key]) {
      arr.push({ product: matchedItems[key], defaultQuantity: qty });
    }
  };

  const buildPrimaryKit = (grade) => {
    const prods = [];
    if (grade <= 2) {
      helperAdd(prods, 'notebook_64', 2);
      helperAdd(prods, 'drawing_notebook', 1);
      helperAdd(prods, 'board', 1);
      helperAdd(prods, 'eraser_board', 1);
      helperAdd(prods, 'pen_blue', 1);
      helperAdd(prods, 'pen_green', 1);
      helperAdd(prods, 'pencil', 1);
      helperAdd(prods, 'sharpener', 1);
      helperAdd(prods, 'eraser', 1);
      helperAdd(prods, 'colored_pencils', 1);
      helperAdd(prods, 'ruler', 1);
      helperAdd(prods, 'dough', 1);
      helperAdd(prods, 'colored_paper', 1);
    } else if (grade === 3) {
      helperAdd(prods, 'notebook_64', 7);
      helperAdd(prods, 'tp_notebook', 2);
      helperAdd(prods, 'board', 1);
      helperAdd(prods, 'eraser_board', 1);
      helperAdd(prods, 'pen_blue', 1);
      helperAdd(prods, 'pen_green', 1);
      helperAdd(prods, 'pencil', 1);
      helperAdd(prods, 'sharpener', 1);
      helperAdd(prods, 'eraser', 1);
      helperAdd(prods, 'colored_pencils', 1);
      helperAdd(prods, 'ruler', 1);
      helperAdd(prods, 'set_square', 1);
    } else {
      helperAdd(prods, 'notebook_64', 10);
      helperAdd(prods, 'tp_notebook', 3);
      helperAdd(prods, 'board', 1);
      helperAdd(prods, 'eraser_board', 1);
      helperAdd(prods, 'pen_blue', 1);
      helperAdd(prods, 'pen_green', 1);
      helperAdd(prods, 'pencil', 1);
      helperAdd(prods, 'sharpener', 1);
      helperAdd(prods, 'eraser', 1);
      helperAdd(prods, 'colored_pencils', 1);
      helperAdd(prods, 'ruler', 1);
      helperAdd(prods, 'set_square', 1);
      helperAdd(prods, 'protractor', 1);
      helperAdd(prods, 'compass', 1);
    }
    return prods;
  };

  const buildMiddleKit = () => {
    const prods = [];
    helperAdd(prods, 'notebook_192', 2);
    helperAdd(prods, 'notebook_120', 4);
    helperAdd(prods, 'notebook_96', 1);
    helperAdd(prods, 'notebook_64', 4);
    helperAdd(prods, 'notebook_48', 2);
    helperAdd(prods, 'notebook_32', 2);
    helperAdd(prods, 'tp_notebook_large', 3);
    helperAdd(prods, 'music_notebook', 1);
    
    helperAdd(prods, 'pen_blue', 1);
    helperAdd(prods, 'pen_green', 1);
    helperAdd(prods, 'pencil', 1);
    helperAdd(prods, 'sharpener', 1);
    helperAdd(prods, 'eraser', 1);
    helperAdd(prods, 'colored_pencils', 1);
    helperAdd(prods, 'glue', 1);
    helperAdd(prods, 'ruler', 1);
    helperAdd(prods, 'set_square', 1);
    helperAdd(prods, 'protractor', 1);
    helperAdd(prods, 'compass', 1);
    
    helperAdd(prods, 'folder', 1);
    helperAdd(prods, 'tracing_paper', 1);
    helperAdd(prods, 'calculator', 1);
    helperAdd(prods, 'drawing_paper', 1);
    helperAdd(prods, 'watercolors', 1);
    
    return prods;
  };

  const collectionsData = [
    {
      level: 'primary_1', name_ar: 'مجموعة السنة الأولى ابتدائي', name_en: '1st Grade Primary Collection', name_fr: 'Collection 1ère Année Primaire',
      desc_ar: 'المجموعة الرسمية الشاملة وفق مدونة الأدوات المدرسية لوزارة التربية الوطنية.',
      products: buildPrimaryKit(1),
      image: 'https://res.cloudinary.com/do1e7foww/image/upload/v1731671957/collections/e0r5vlyfks3znt6a8dox.webp'
    },
    {
      level: 'primary_2', name_ar: 'مجموعة السنة الثانية ابتدائي', name_en: '2nd Grade Primary Collection', name_fr: 'Collection 2ème Année Primaire',
      desc_ar: 'المجموعة الرسمية الشاملة وفق مدونة الأدوات المدرسية لوزارة التربية الوطنية.',
      products: buildPrimaryKit(2),
      image: 'https://res.cloudinary.com/do1e7foww/image/upload/v1731671957/collections/e0r5vlyfks3znt6a8dox.webp'
    },
    {
      level: 'primary_3', name_ar: 'مجموعة السنة الثالثة ابتدائي', name_en: '3rd Grade Primary Collection', name_fr: 'Collection 3ème Année Primaire',
      desc_ar: 'المجموعة الرسمية الشاملة وفق مدونة الأدوات المدرسية لوزارة التربية الوطنية.',
      products: buildPrimaryKit(3),
      image: 'https://res.cloudinary.com/do1e7foww/image/upload/v1731671957/collections/e0r5vlyfks3znt6a8dox.webp'
    },
    {
      level: 'primary_4', name_ar: 'مجموعة السنة الرابعة ابتدائي', name_en: '4th Grade Primary Collection', name_fr: 'Collection 4ème Année Primaire',
      desc_ar: 'المجموعة الرسمية الشاملة وفق مدونة الأدوات المدرسية لوزارة التربية الوطنية.',
      products: buildPrimaryKit(4),
      image: 'https://res.cloudinary.com/do1e7foww/image/upload/v1731671957/collections/e0r5vlyfks3znt6a8dox.webp'
    },
    {
      level: 'primary_5', name_ar: 'مجموعة السنة الخامسة ابتدائي', name_en: '5th Grade Primary Collection', name_fr: 'Collection 5ème Année Primaire',
      desc_ar: 'المجموعة الرسمية الشاملة وفق مدونة الأدوات المدرسية لوزارة التربية الوطنية.',
      products: buildPrimaryKit(5),
      image: 'https://res.cloudinary.com/do1e7foww/image/upload/v1731671957/collections/e0r5vlyfks3znt6a8dox.webp'
    },
    // MIDDLE SCHOOL
    {
      level: 'middle_1', name_ar: 'مجموعة السنة الأولى متوسط', name_en: '1st Grade Middle School', name_fr: 'Collection 1ère Année Moyen',
      desc_ar: 'المجموعة الرسمية الشاملة وفق مدونة الأدوات المدرسية لوزارة التربية الوطنية - مرحلة التعليم المتوسط.',
      products: buildMiddleKit(),
      image: 'https://res.cloudinary.com/do1e7foww/image/upload/v1731671957/collections/e0r5vlyfks3znt6a8dox.webp' // Placeholder for middle school document
    },
    {
      level: 'middle_2', name_ar: 'مجموعة السنة الثانية متوسط', name_en: '2nd Grade Middle School', name_fr: 'Collection 2ème Année Moyen',
      desc_ar: 'المجموعة الرسمية الشاملة وفق مدونة الأدوات المدرسية لوزارة التربية الوطنية - مرحلة التعليم المتوسط.',
      products: buildMiddleKit(),
      image: 'https://res.cloudinary.com/do1e7foww/image/upload/v1731671957/collections/e0r5vlyfks3znt6a8dox.webp'
    },
    {
      level: 'middle_3', name_ar: 'مجموعة السنة الثالثة متوسط', name_en: '3rd Grade Middle School', name_fr: 'Collection 3ème Année Moyen',
      desc_ar: 'المجموعة الرسمية الشاملة وفق مدونة الأدوات المدرسية لوزارة التربية الوطنية - مرحلة التعليم المتوسط.',
      products: buildMiddleKit(),
      image: 'https://res.cloudinary.com/do1e7foww/image/upload/v1731671957/collections/e0r5vlyfks3znt6a8dox.webp'
    },
    {
      level: 'middle_4', name_ar: 'مجموعة السنة الرابعة متوسط', name_en: '4th Grade Middle School', name_fr: 'Collection 4ème Année Moyen',
      desc_ar: 'المجموعة الرسمية الشاملة وفق مدونة الأدوات المدرسية لوزارة التربية الوطنية - مرحلة التعليم المتوسط.',
      products: buildMiddleKit(),
      image: 'https://res.cloudinary.com/do1e7foww/image/upload/v1731671957/collections/e0r5vlyfks3znt6a8dox.webp'
    }
  ];

  let orderCount = 10;
  for (const c of collectionsData) {
    if (c.products.length === 0) continue; // Skip if completely empty

    const versions = [
      { name_en: 'Standard', name_ar: 'المتكاملة', name_fr: 'Standard', products: c.products }
    ];

    await Collection.create({
      name_en: c.name_en,
      name_ar: c.name_ar,
      name_fr: c.name_fr,
      description_ar: c.desc_ar,
      image: c.image,
      isActive: true,
      isBackToSchool: true,
      schoolLevel: c.level,
      targetGender: 'any',
      governmentDocImages: [c.image], // Using the same image for the badge proof for now
      versions,
      order: orderCount++
    });
    console.log(`Created: ${c.name_ar}`);
  }

  console.log("\n--- Missing Items in DB ---");
  for (const item of missingItems) {
    console.log("- " + item);
  }

  console.log("\nSuccess!");
  process.exit(0);
};

createCollections();
