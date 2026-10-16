import { Language } from './i18n';
import { Project, LegislativeRecord, EmpowermentProgram, NewsArticle } from '../types';

export function getLocalizedProject(p: Project, lang: Language): { title: string; description: string; location: string } {
  if (lang === 'ha') {
    if (p.id === 'proj-1') {
      return {
        title: 'Shirin Samar da Ruwan Sha Mai Amfani da Hasken Rana na Yabo',
        description: 'Kafa manyan rijiyoyin burtsatse masu aiki da hasken rana tare da tankunan ruwa na sama don samar da ruwa mai tsafta ga mutane sama da 15,000 da cibiyoyin gwamnati a garin Yabo.',
        location: 'Tsakiyar Garin Yabo, Karamar Hukumar Yabo'
      };
    }
    if (p.id === 'proj-2') {
      return {
        title: 'Sabunta Dakunan Kimiyya a Makarantar Sakandare ta Shagari',
        description: 'Gyara da kayata dakunan gwaje-gwajen kimiyya na physics, chemistry, da biology tare da kayan aiki na zamani da kwamfutoci don karfafa ilimin STEM ga daliban Karamar Hukumar Shagari.',
        location: 'Makarantar Sakandare ta Gwamnati, Shagari'
      };
    }
    if (p.id === 'proj-3') {
      return {
        title: 'Fadada da Gyaran Hanyoyin Noma na Yabo zuwa Shagari',
        description: 'Gyara, zuba kasa da share magudanan ruwa na tsawon kilomita 35 na hanyoyin gona don saukaka jigilar kayan amfanin gona zuwa kasuwannin birane da rage asarar amfanin gona.',
        location: 'Hanyoyin da ke hada yankunan noman Yabo da Shagari'
      };
    }
    if (p.id === 'proj-4') {
      return {
        title: 'Fadada Asibitin Haihuwa da Kula da Lafiyar Mata da Yara a Mazabar Torankawa',
        description: 'Gina sabon dakin haihuwa mai gadaje 20, dakin kiyaye magunguna, da kayan aikin hasken rana a Cibiyar Lafiya ta Farko a Torankawa, Karamar Hukumar Yabo.',
        location: 'Cibiyar Lafiya ta Farko ta Torankawa, Yabo'
      };
    }
  }

  if (lang === 'ar') {
    if (p.id === 'proj-1') {
      return {
        title: 'مشروع إمداد المياه بالطاقة الشمسية في مركز يابو',
        description: 'إنشاء آبار أنبوبية عالية السعة تعمل بالطاقة الشمسية مع خزانات علوية ونقاط توزيع متعددة لتوفير مياه شرب نظيفة لأكثر من ١٥,٠٠٠ نسمة والمؤسسات العامة في مدينة يابو.',
        location: 'وسط مدينة يابو، مقاطعة يابو'
      };
    }
    if (p.id === 'proj-2') {
      return {
        title: 'تطوير وتحديث المختبرات العلمية بثانوية شاغاري النموذجية',
        description: 'إعادة تأهيل وتحديث مختبرات الفيزياء والكيمياء والأحياء وتجهيزها بأحدث الأجهزة العلمية والحواسيب لدعم تعليم العلوم والابتكار لطلاب مقاطعة شاغاري.',
        location: 'المدرسة الثانوية الحكومية، شاغاري'
      };
    }
    if (p.id === 'proj-3') {
      return {
        title: 'تمهيد وتعبيد الطرق الزراعية الريفية بين يابو وشاغاري',
        description: 'تمهيد وردم وفتح مصارف لمسافة ٣٥ كيلومتراً من المسارات الزراعية الاستراتيجية لتسهيل نقل المحاصيل الزراعية إلى الأسواق الحضرية وتفادي تلف المحاصيل.',
        location: 'المسارات الرابطة بين التجمعات الزراعية في يابو وشاغاري'
      };
    }
    if (p.id === 'proj-4') {
      return {
        title: 'توسعة جناح الولادة ورعاية الأمومة والطفولة في تورانكاوا',
        description: 'بناء جناح ولادة حديث بسعة ٢٠ سريراً ومخزن مبرد للقاحات ومنظومة طاقة شمسية بمركز الرعاية الصحية الأولية في تورانكاوا، مقاطعة يابو.',
        location: 'مركز تورانكاوا للرعاية الصحية، يابو'
      };
    }
  }

  return { title: p.title, description: p.description, location: p.location };
}

export function getLocalizedLegislative(l: LegislativeRecord, lang: Language): { title: string; description: string } {
  if (lang === 'ha') {
    if (l.id === 'leg-1') {
      return {
        title: 'Kudurin Kafa Kwalejin Noma ta Tarayya a Yabo (Kudurin Majalisa HB. 892)',
        description: 'Kudurin doka da ke neman kafa Kwalejin Noma ta Tarayya a Yabo, Jihar Sakkwato, don bayar da horon aikin gona na zamani da fasahar ban-ruwa.'
      };
    }
    if (l.id === 'leg-2') {
      return {
        title: 'Motsin Gaggawa Kan Magance Zaizayar Kasa a Mazabun Yabo da Shagari',
        description: 'Motsin gaggawa a zauren majalisa da ke kiran Hukumar Kula da Asusun Muhalli (Ecological Project Office) ta kawo dauki kan mummunar zaizayar kasa da ta lalata gonaki.'
      };
    }
    if (l.id === 'leg-3') {
      return {
        title: 'Kudurin Gyaran Dokar Bankin Noma ta Najeriya (Kudurin HB. 1044)',
        description: 'Kudurin da ke ba da shawarar saukaka ka\'idojin samun bashi ga manoman rani da kungiyoyin mata ba tare da bukatar manyan takardun jingina ba.'
      };
    }
  }

  if (lang === 'ar') {
    if (l.id === 'leg-1') {
      return {
        title: 'مشروع قانون إنشاء الكلية الفيدرالية للزراعة في يابو (HB. 892)',
        description: 'مشروع قانون لإنشاء كلية فيدرالية للزراعة في يابو بولاية سوكوتو لتدريب الشباب على تقنيات الري والزراعة المتقدمة والإنتاج الحيواني.'
      };
    }
    if (l.id === 'leg-2') {
      return {
        title: 'ملتمس برلماني عاجل لمعالجة انجراف التربة والسيول في يابو وشاغاري',
        description: 'ملتمس في الجلسة العامة لمجلس النواب يدعو صندوق المشاريع البيئية والوزارة الفيدرالية للتدخل العاجل لحماية القرى الزراعية من انجراف التربة.'
      };
    }
    if (l.id === 'leg-3') {
      return {
        title: 'مشروع قانون تعديل قانون البنك الزراعي النيجيري (HB. 1044)',
        description: 'مشروع تشريعي يهدف إلى تسهيل حصول صغار المزارعين والتعاونيات النسائية على القروض الموسمية الميسرة بفوائد مخفضة ودون ضمانات معقدة.'
      };
    }
  }

  return { title: l.title, description: l.description };
}

export function getLocalizedProgram(pr: EmpowermentProgram, lang: Language): { title: string; description: string; eligibility: string } {
  if (lang === 'ha') {
    if (pr.id === 'prog-1') {
      return {
        title: 'Shirin Tallafin Takin Noman Rani da Irin Zamani na Danmaje 2025',
        description: 'Raba buhunan takin NPK da Urea kyauta, injunan ban-ruwa, da ingantaccen irin masara da shinkafa ga manoman rani 2,000 masu rijista a Yabo da Shagari.',
        eligibility: 'Kowane manomi mazaunin Karamar Hukumar Yabo ko Shagari mai shaidar gonar noman rani.'
      };
    }
    if (pr.id === 'prog-2') {
      return {
        title: 'Shirin Horar da Matasa Fasahar Zamani da Kayan Aiki (ICT & Solar)',
        description: 'Horon makonni 8 kan gyaran na\'urorin hasken rana, kera wayoyi, da fasahar kwamfuta, tare da ba wa kowane dalibi kwamfuta da kayan aiki bayan kammalawa.',
        eligibility: 'Matasa \'yan asalin Yabo/Shagari masu shekaru 18 zuwa 35 masu sha\'awar koyon sana\'a.'
      };
    }
    if (pr.id === 'prog-3') {
      return {
        title: 'Asusun Jarin Kananan Sana\'o\'i ga Matan Karkara',
        description: 'Tallafin kudi na kai tsaye (N50,000 ga kowace mace) ba tare da biyan ruwa ko mayarwa ba ga mata 1,500 da ke sana\'ar sarrafa amfanin gona da dinki.',
        eligibility: 'Matan da ke da kananan sana\'o\'i a dukkan gundumomi 22 na mazabar Yabo da Shagari.'
      };
    }
  }

  if (lang === 'ar') {
    if (pr.id === 'prog-1') {
      return {
        title: 'مبادرة دعم الري والزراعة المروية والأسمدة لعام ٢٠٢٥',
        description: 'توزيع أسمدة مجانية ومضخات ري وبذور محسنة عالية الجودة لأكثر من ٢,٠٠٠ مزارع مسجل في مقاطعتي يابو وشاغاري لدعم الأمن الغذائي.',
        eligibility: 'مزارعو مقاطعتي يابو وشاغاري المقيمون مع إثبات النشاط الزراعي الموسمي.'
      };
    }
    if (pr.id === 'prog-2') {
      return {
        title: 'برنامج تمكين الشباب في التكنولوجيا والطاقة الشمسية',
        description: 'دورة تدريبية مكثفة لمدة ٨ أسابيع في تركيب وصيانة منظومات الطاقة الشمسية وتقنية المعلومات مع منح حقيبة معدات وحاسوب لكل خريج.',
        eligibility: 'الشباب والشابات من سن ١٨ إلى ٣٥ عاماً من أبناء دائرة يابو وشاغاري.'
      };
    }
    if (pr.id === 'prog-3') {
      return {
        title: 'صندوق المنح التنموية والتمويل الأصغر للمرأة الريفية',
        description: 'منح مالية غير مستردة (٥٠ ألف نيرة لكل مستفيدة) لـ ١,٥٠٠ امرأة لدعم المشاريع المنزلية والحرفية وتجارة المنتجات الزراعية.',
        eligibility: 'رائدات الأعمال وصاحبات المشاريع الصغيرة في جميع الدوائر الـ ٢٢.'
      };
    }
  }

  return { title: pr.title, description: pr.description, eligibility: pr.eligibility };
}

export function getLocalizedNews(n: NewsArticle, lang: Language): { title: string; excerpt: string } {
  if (lang === 'ha') {
    if (n.id === 'news-1') {
      return {
        title: 'Hon. Umar Yusuf Ya Kaddamar da Ayyukan Samar da Ruwan Sha a Gundumomin Yabo da Shagari',
        excerpt: 'Mai Girma Wakili ya jagoranci kaddamar da rijiyoyin burtsatse masu aiki da hasken rana a garuruwa 8 tare da alwashin ci gaba da kawo ayyukan more rayuwa.'
      };
    }
    if (n.id === 'news-2') {
      return {
        title: 'Zauren Majalisar Wakilai Ya Karbi Kudurin Kafa Kwalejin Noma a Yabo',
        excerpt: 'Kudurin da Hon. Danmaje Yabo ya gabatar ya tsallake karatu na farko cikin nasara a Majalisar Wakilai ta Kasa da ke Abuja.'
      };
    }
  }

  if (lang === 'ar') {
    if (n.id === 'news-1') {
      return {
        title: 'سعادة النائب عمر يوسف يدشن مشاريع مياه الشرب النقية في يابو وشاغاري',
        excerpt: 'قام سعادة النائب بافتتاح شبكات مياه حديثة تعمل بالطاقة الشمسية في ٨ بلدات، مؤكداً استمرار مسيرة البناء والتنمية الشاملة.'
      };
    }
    if (n.id === 'news-2') {
      return {
        title: 'مجلس النواب يناقش مشروع قانون إنشاء الكلية الفيدرالية للزراعة في يابو',
        excerpt: 'اجتاز مشروع القانون المقدم من سعادة النائب القراءة الأولى بنجاح وسط ترحيب واسع من النواب ولجان التعليم والزراعة.'
      };
    }
  }

  return { title: n.title, excerpt: n.excerpt };
}
