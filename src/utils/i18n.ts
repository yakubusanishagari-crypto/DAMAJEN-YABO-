export type Language = 'en' | 'ha' | 'ar';

export interface Translations {
  [key: string]: {
    en: string;
    ha: string;
    ar: string;
  };
}

export const DEFAULT_TRANSLATIONS: Translations = {
  home: {
    en: 'Home',
    ha: 'Gida',
    ar: 'الرئيسية'
  },
  about: {
    en: 'Biography',
    ha: 'Tarihin Rayuwa',
    ar: 'السيرة الذاتية'
  },
  biography: {
    en: 'Biography',
    ha: 'Tarihin Rayuwa',
    ar: 'السيرة الذاتية'
  },
  projects: {
    en: 'Projects & Development',
    ha: 'Ayruka da Cigaba',
    ar: 'المشاريع والتنمية'
  },
  legislative: {
    en: 'Legislative Work',
    ha: 'Ayyukan Dokoki',
    ar: 'العمل التشريعي'
  },
  empowerment: {
    en: 'Empowerment',
    ha: 'Karfafawa',
    ar: 'التمكين'
  },
  news: {
    en: 'News & Updates',
    ha: 'Labarai da Sabuntawa',
    ar: 'الأخبار والتحديثات'
  },
  gallery: {
    en: 'Media & Gallery',
    ha: 'Bidiyo da Hotuna',
    ar: 'الوسائط والمعرض'
  },
  media: {
    en: 'Media & Gallery',
    ha: 'Bidiyo da Hotuna',
    ar: 'الوسائط والمعرض'
  },
  contact: {
    en: 'Constituency Contact',
    ha: 'Tuntubar Mazabu',
    ar: 'اتصال الدائرة'
  },
  townhall: {
    en: 'Town Hall',
    ha: 'Dandalin Jama\'a',
    ar: 'المنبر الشعبي'
  },
  petitions: {
    en: 'Petitions',
    ha: 'Korafe-korafe',
    ar: 'العرائض والشكاوى'
  },
  exploreProjects: {
    en: 'EXPLORE PROJECTS',
    ha: 'Bincika Ayruka',
    ar: 'استكشاف المشاريع'
  },
  contactOffice: {
    en: 'CONTACT OFFICE',
    ha: 'Tuntubi Ofishin',
    ar: 'اتصل بالمكتب'
  },
  constituencyTitle: {
    en: 'Member, House of Representatives, National Assembly, Abuja',
    ha: 'Dan Majalisar Wakilai, Majalisar Tarayya, Abuja',
    ar: 'عضو مجلس النواب، الجمعية الوطنية، أبوجا'
  },
  constituencySubtitle: {
    en: 'Representing Yabo/Shagari Federal Constituency, Sokoto State',
    ha: 'Mai wakiltar mazabar Yabo da Shagari, Jihar Sakkwato',
    ar: 'يمثل دائرة يابو وشاغاري الفيدرالية، ولاية سوكوكتو'
  },
  heroWelcome: {
    en: 'Official Representative Portal',
    ha: 'Kofar Wakilin Hukumomi',
    ar: 'بوابة الممثل الرسمي'
  },
  heroDescription: {
    en: 'Dedicated to purposeful legislation, transparent accountability, infrastructural development, and robust empowerment programmes that touch every ward and community.',
    ha: 'An sadaukar da kai ga ingantattun dokoki, rikon amana, ci gaban ababen more rayuwa, da shirye-shiryen karfafawa.',
    ar: 'ملتزمون بالتشريع الهادف والمساءلة الشفافة والتنمية البنية التحتية وبرامج التمكين القوية.'
  },
  statsProjects: {
    en: 'Constituency Projects Executed',
    ha: 'Ayruka da aka Kammala',
    ar: 'المشاريع المنفذة في الدائرة'
  },
  statsBills: {
    en: 'Bills & Motions Sponsored',
    ha: 'Kudade da Motoci da aka gabatar',
    ar: 'مشاريع القوانين والملتمسات'
  },
  statsCitizens: {
    en: 'Empowered Citizens & Farmers',
    ha: '\'Yan Kasa da Manoma da aka Karfafa',
    ar: 'المواطنون والمزارعون المستفيدون'
  },
  statsWards: {
    en: 'Wards Fully Represented',
    ha: 'Unguwanni da aka Wakilta',
    ar: 'الدوائر الممثلة بالكامل'
  },
  areasOfImpact: {
    en: 'Areas of Impact',
    ha: 'Bangaren Tasiri',
    ar: 'مجالات التأثير'
  },
  grassrootsTransformation: {
    en: 'COMMITTED TO GRASSROOTS TRANSFORMATION',
    ha: 'An Sadaukar da Kai Ga Cigaban Al’umma',
    ar: 'ملتزمون بالتحول على مستوى القاعدة الشعبية'
  },
  viewAllProjects: {
    en: 'VIEW ALL PROJECTS',
    ha: 'Duba Duk Ayruka',
    ar: 'عرض جميع المشاريع'
  },
  readMore: {
    en: 'READ MORE',
    ha: 'Karanta Cikakken Labari',
    ar: 'قراءة المقال كاملاً'
  },
  submitMessage: {
    en: 'SUBMIT OFFICIAL MESSAGE',
    ha: 'Aika Sakon Hukumomi',
    ar: 'إرسال رسالة رسمية'
  },
  fullName: {
    en: 'Full Name',
    ha: 'Cikakken Suna',
    ar: 'الاسم الكامل'
  },
  emailAddress: {
    en: 'Email Address',
    ha: 'Adireshin Imel',
    ar: 'عنوان البريد الإلكتروني'
  },
  phoneNumber: {
    en: 'Phone Number',
    ha: 'Lambar Waya',
    ar: 'رقم الهاتف'
  },
  messageContent: {
    en: 'Your Message or Community Issue',
    ha: 'Sakonka Ko Matsalar Al’umma',
    ar: 'رسالتك أو مشكلة المجتمع'
  },
  searchPlaceholder: {
    en: 'Search projects, news, or keywords...',
    ha: 'Bincika ayruka, labarai, ko kalmomi...',
    ar: 'البحث عن مشاريع أو أخبار أو كلمات مفتاحية...'
  },
  viewDetails: {
    en: 'VIEW PROJECT DETAILS',
    ha: 'Duba Cikakken Aiki',
    ar: 'عرض تفاصيل المشروع'
  },
  applyNow: {
    en: 'APPLY NOW',
    ha: 'Neman Wannan Taimako',
    ar: 'قدم الآن'
  },
  citizenEngagementTitle: {
    en: 'HAVE AN ENQUIRY OR COMMUNITY CONCERN?',
    ha: 'Kuna da Tambaya Ko Korafe-Korafe?',
    ar: 'هل لديك استفسار أو مشكلة مجتمعية؟'
  },
  citizenEngagementDesc: {
    en: 'Our constituency office in Abuja and ward liaison desks are open to receive enquiries, project requests, and community feedback. We are here to serve you.',
    ha: 'Ofishinmu na Abuja da mazabu a bude suke don karbar korafi da bukatun ayruka.',
    ar: 'مكتبنا في أبوجا ومكاتب الاتصال في الدوائر مفتوحة لتلقي الاستفسارات وطلبات المشاريع.'
  },
  submitEnquiryBtn: {
    en: 'SUBMIT ENQUIRY / REPORT ISSUE',
    ha: 'Aika Kori Ko Bayar da Rahoto',
    ar: 'إرسال استفسار أو الإبلاغ عن مشكلة'
  },
  applyEmpowermentBtn: {
    en: 'APPLY FOR EMPOWERMENT PROGRAMMES',
    ha: 'Nemi Shirye-shiryen Karfafawa',
    ar: 'التقدم بطلب لبرامج التمكين'
  },
  aboutBriefTitle: {
    en: 'About the Representative',
    ha: 'Game da Wakili',
    ar: 'عن النائب'
  },
  aboutBriefSubtitle: {
    en: 'A LIFE DEDICATED TO PUBLIC SERVICE AND PEOPLE-CENTRED REPRESENTATION',
    ha: 'Rayuwa da Aka Sadaukar Domin Aikin Al\'umma da Wakilci na Gari',
    ar: 'حياة مكرسة للخدمة العامة والتمثيل المرتكز على خدمة الشعب'
  },
  readFullBio: {
    en: 'READ FULL BIOGRAPHY & PROFILE',
    ha: 'Karanta Cikakken Tarihin Rayuwa',
    ar: 'قراءة السيرة الذاتية الكاملة'
  },
  legislativeSectionTitle: {
    en: 'LEGISLATIVE WORK & NATIONAL ASSEMBLY ACTIVITIES',
    ha: 'Ayyukan Dokoki a Majalisar Tarayya',
    ar: 'العمل التشريعي وأنشطة الجمعية الوطنية'
  },
  legislativeSectionDesc: {
    en: 'Sponsoring high-impact bills, moving motions of urgent public importance, and representing the sovereign interests of Yabo and Shagari.',
    ha: 'Gabatar da kudurori masu muhimmanci ga jama\'a, da wakiltar muradun al\'ummar Yabo da Shagari a zauren majalisa.',
    ar: 'رعاية مشاريع القوانين المؤثرة وتقديم الملتمسات ذات الأهمية الوطنية العاجلة وتمثيل مصالح يابو وشاغاري.'
  },
  viewAllLegislative: {
    en: 'EXPLORE LEGISLATIVE TRACKER',
    ha: 'Duba Jerin Ayyukan Dokoki',
    ar: 'استكشاف سجل التشريعات'
  },
  empowermentSectionTitle: {
    en: 'CONSTITUENCY EMPOWERMENT & WELFARE INITIATIVES',
    ha: 'Shirye-shiryen Tallafi da Karfafa Al\'umma',
    ar: 'مبادرات التمكين والرعاية الاجتماعية في الدائرة'
  },
  empowermentSectionDesc: {
    en: 'Direct grassroots interventions targeting agricultural productivity, youth technical skills, and women micro-enterprise capital.',
    ha: 'Tallafin kai tsaye ga manoma, matasa masu koyon sana\'a, da jari ga mata \'yan kasuwa a mazabunmu.',
    ar: 'تدخلات قاعدية مباشرة تستهدف الإنتاجية الزراعية والمهارات الفنية للشباب ومشاريع المرأة.'
  },
  viewAllEmpowerment: {
    en: 'EXPLORE ALL PROGRAMMES & APPLY',
    ha: 'Bincika Duk Shirye-shirye da Neman Shiga',
    ar: 'استكشاف جميع البرامج والتقديم'
  },
  privacyPolicy: {
    en: 'Privacy Policy',
    ha: 'Tsarin Tsaro da Sirri',
    ar: 'سياسة الخصوصية'
  },
  termsOfUse: {
    en: 'Terms of Use',
    ha: "Ka'idojin Amfani",
    ar: 'شروط الاستخدام'
  },
  accessibility: {
    en: 'Accessibility Statement',
    ha: 'Sanarwar Shiga Mai Sauki',
    ar: 'بيان إمكانية الوصول'
  },
  bioTagline: {
    en: 'A principled lawmaker, seasoned public administrator, and committed community builder dedicated to people-first legislation, agricultural transformation, and accountable public service across all 22 wards.',
    ha: "Dan majalisar dokoki mai kishin al'umma, gogaggen ma'aikacin gwamnati kuma mai fafutukar gina al'umma wanda ya sadaukar da kansa ga dokoki masu amfanar talakawa, bunkasa aikin gona da rikon amana a dukkan gundumomi 22.",
    ar: 'مشرع مبدئي وإداري عام محنك ومخلص لخدمة المجتمع، مكرس لسن تشريعات تخدم الشعب والنهوض بالقطاع الزراعي والخدمة العامة الخاضعة للمساءلة في جميع الدوائر الـ 22.'
  },
  bioDeliverables: {
    en: 'VIEW CONSTITUENCY DELIVERABLES',
    ha: 'Duba Ayyukan da aka Bayar',
    ar: 'عرض إنجازات الدائرة'
  },
  contactRep: {
    en: 'CONTACT REPRESENTATIVE',
    ha: 'Tuntubi Wakili',
    ar: 'الاتصال بالنائب'
  },
  execFactsTitle: {
    en: 'Official Executive Facts',
    ha: 'Kayan Tarihi da Bayanan Hukumomi',
    ar: 'حقائق ومعلومات تنفيذية رسمية'
  },
  committeeAssignments: {
    en: 'Key Committee Assignments',
    ha: 'Kwamitocin da Aka Bada Aiki a Kai',
    ar: 'عضويات اللجان البرلمانية الرئيسية'
  },
  rootsTitle: {
    en: 'Roots, Heritage & Early Life',
    ha: "Asali, Al'ada da Farkon Rayuwa",
    ar: 'الجذور والتراث والنشأة الأولى'
  },
  rootsSubtitle: {
    en: 'Grounded in traditional Sokoto Caliphate civic responsibility',
    ha: "Dabi'u da aka gada daga Daular Usmaniyya ta Sakkwato",
    ar: 'متجذر في المسؤولية المدنية التقليدية لخلافة صكتو'
  },
  rootsP1: {
    en: 'Hon. Umar Yusuf was born and raised in Yabo, Sokoto State. Known affectionately across the constituency by his traditional title, Danmaje Yabo, his character was shaped by the enduring cultural heritage of humility, discipline, service to fellow humans, and fidelity to public trust that characterizes the historical Sokoto Caliphate.',
    ha: "An haifi Hon. Umar Yusuf kuma ya tashi a garin Yabo, Jihar Sakkwato. Al'ummar mazabarsa na kiransa da lakabinsa na sarauta, Danmaje Yabo. Halayensa sun ginu a kan kyawawan dabi'u na tawali'u, da'a, hidimtawa mutane, da rikon amana na Daular Sakkwato.",
    ar: 'ولد النائب عمر يوسف ونشأ في يابو بولاية سوكوتو. ويُعرف بمحبة في جميع أنحاء الدائرة بلقبه التقليدي "دانماجي يابو"، وتشكلت شخصيته من التراث الثقافي الأصيل القائم على التواضع والانضباط وخدمة الناس والوفاء بالأمانة العامة التي تميز خلافة صكتو التاريخية.'
  },
  rootsP2: {
    en: 'Growing up in an agrarian community, he gained early firsthand understanding of the everyday joys, struggles, and aspirations of rural families. Witnessing the hard work of smallholder farmers, village artisans, and community elders instilled in him an enduring passion to dedicate his adult career to community development and public advocacy.',
    ha: "Ganin yadda ya tashi a yankin manoma, ya san dukkan wahalhalu da burin iyalai da talakawa. Ganin kokarin manoma, masu sana'o'in hannu da dattawan gari ya sanya masa kwadayin sadaukar da rayuwarsa wajen ciyar da al'umma gaba.",
    ar: 'بنشأته في مجتمع زراعي، اكتسب فهماً مباشراً ومبكراً للأفراح اليومية وتطلعات وصعوبات الأسر الريفية. إن معايشته لكدح صغار المزارعين والحرفيين جعلته يكرس مسيرته المهنية لتنمية المجتمع والدفاع عن مصالحه.'
  },
  eduTitle: {
    en: 'Education & Governance Capacity',
    ha: 'Ilimi da Kwarewar Jagoranci',
    ar: 'التعليم وبناء القدرات القيادية'
  },
  eduSubtitle: {
    en: 'Rigorous preparation for public administration and lawmaking',
    ha: 'Kyakkyawan shiri don gudanar da aikin gwamnati da dokoki',
    ar: 'إعداد دقيق للإدارة العامة والتشريع'
  },
  eduP1: {
    en: 'Hon. Danmaje pursued his education with diligence, focusing on public administration, leadership, and public policy formulation. Throughout his tertiary academic journey, he actively participated in student governance and civic volunteer groups.',
    ha: "Hon. Danmaje ya yi karatu da himma da kwazo a fannin tafiyar da gwamnati, jagoranci da tsara manufofin al'umma. A lokacin karatunsa, ya shiga harkokin kungiyoyin dalibai da aikin sa-kai na al'umma.",
    ar: 'واصل النائب دانماجي تعليمه بجد واجتهاد مركزاً على الإدارة العامة والقيادة وصياغة السياسات. وخلال دراسته الجامعية شارك بنشاط في الأنشطة الطلابية والعمل التطوعي المدني.'
  },
  eduP2: {
    en: 'Since his election to the National Assembly, he has continuously enhanced his capacity through specialized parliamentary seminars on legislative drafting, budgetary oversight, public procurement ethics, and sustainable rural development strategies.',
    ha: "Tun bayan zabensa a matsayin dan majalisar tarayya, ya ci gaba da halartar tarurruka na kwarewa kan tsara dokoki, sa ido kan kasafin kudi, da dabarun ci gaban yankunan karkara.",
    ar: 'منذ انتخابه للجمعية الوطنية، عمل باستمرار على صقل مهاراته من خلال ندوات برلمانية متخصصة في الصياغة التشريعية، والرقابة على الموازنة، واستراتيجيات التنمية الريفية المستدامة.'
  },
  impactTitle: {
    en: 'Grassroots Impact & Community Service',
    ha: "Ayyukan Jin Dadin Jama'a da Tallafi",
    ar: 'الأثر القاعدي والخدمة المجتمعية'
  },
  impactSubtitle: {
    en: 'Empowering families long before elective public office',
    ha: 'Taimakawa iyalai tun kafin shiga majalisar dokoki',
    ar: 'تمكين الأسر الريفية قبل تولي المنصب النيابي'
  },
  impactP1: {
    en: 'Prior to his victory at the federal parliamentary polls, Hon. Danmaje had already established an outstanding record of community philanthropy across both Yabo and Shagari Local Government Areas. He championed dry-season irrigation initiatives, organized micro-credit facilities for rural women trading co-operatives, and sponsored tuition grants for indigent tertiary students.',
    ha: "Kafin zabensa a zaben majalisar tarayya, Hon. Danmaje ya riga ya kafa tarihi mai kyau na taimakon jama'a a Yabo da Shagari. Ya tallafawa aikin noman rani, bada tallafin jari ga matan karkara, da biyan kudaden makaranta ga dalibai masu karamin karfi.",
    ar: 'قبل فوزه في الانتخابات البرلمانية، كان للنائب دانماجي سجل حافل في العمل الخيري عبر منطقتي يابو وشاغاري، حيث دعم مبادرات الري في موسم الجفاف، ونظم قروضاً صغيرة لتعاونيات النساء، ومنحاً دراسية للطلاب المحتاجين.'
  },
  impactP2: {
    en: 'His consistent presence during both celebrations and moments of communal need earned him widespread respect, culminating in his conferment with the prestigious traditional title of Danmaje Yabo by community custodians.',
    ha: "Koyaushe yana tare da jama'arsa a lokacin farin ciki da na bukata, wanda hakan ya sa sarakuna da dattawan gari suka ba shi sarautar gargajiya mai daraja ta Danmaje Yabo.",
    ar: 'إن تواجده الدائم إلى جانب الأهالي في مناسباتهم وأوقات الحاجة أكسبه احتراماً واسعاً توج بمنحه اللقب التقليدي الرفيع "دانماجي يابو" من قبل وجهاء وقادة المجتمع.'
  },
  nassTitle: {
    en: 'National Assembly Stewardship',
    ha: 'Ayyukan Dokoki a Majalisar Tarayya',
    ar: 'المسؤولية البرلمانية في الجمعية الوطنية'
  },
  nassSubtitle: {
    en: 'Vigorous legislative advocacy in the Green Chamber',
    ha: "Fafutukar kare muradun jama'a a zauren majalisa",
    ar: 'الدفاع التشريعي القوي في قاعة مجلس النواب'
  },
  nassP1: {
    en: 'Sworn in as Member representing Yabo/Shagari Federal Constituency in the 10th National Assembly, Hon. Danmaje immediately distinguished himself by sponsoring transformative legislation. Chief among these is the bill seeking to establish the Federal College of Agricultural Technology, Yabo, which has successfully passed second reading.',
    ha: "Bayan rantsar da shi a matsayin dan majalisa mai wakiltar Yabo/Shagari a Majalisa ta 10, Hon. Danmaje ya gabatar da kudurin kafa Kwalejin Kimiyyar Noma ta Tarayya a Yabo, wanda ya riga ya tsallake karatu na biyu.",
    ar: 'عقب أدائه اليمين الدستورية نائباً عن دائرة يابو/شاغاري في الجمعية الوطنية العاشرة، تميز بتقديم مشاريع قوانين نوعية، وفي مقدمتها مشروع قانون إنشاء كلية التكنولوجيا الزراعية الفيدرالية في يابو.'
  },
  nassP2: {
    en: 'He has also moved urgent motions on federal ecological funding to remediate severe gully erosion affecting agrarian communities in Sokoto State, as well as motions for the rehabilitation of dilapidated federal road links connecting agrarian hubs to regional commercial centers.',
    ha: "Ya kuma gabatar da kudurori na gaggawa kan kudaden muhalli don magance zaizayar kasa a gonakin Sakkwato, da gyaran manyan hanyoyin gwamnatin tarayya da suka hada kauyuka da manyan birane.",
    ar: 'كما قدم ملتمسات عاجلة لتخصيص صناديق بيئية لمعالجة انجراف التربة وتآكل الأراضي الزراعية في سوكوتو، وإعادة تأهيل الطرق الفيدرالية الحيوية.'
  },
  fivePillarsTitle: {
    en: 'Five Pillars of Representation',
    ha: 'Rukunai Biyar na Wakilci',
    ar: 'الركائز الخمس للتمثيل النيابي'
  },
  fivePillarsSubtitle: {
    en: 'A targeted framework delivering tangible socio-economic results across all 22 wards.',
    ha: 'Shirye-shiryen da ke kawo sakamako na zahiri a dukkan gundumomi 22.',
    ar: 'إطار عمل مستهدف يحقق نتائج ملموسة في جميع الدوائر الـ 22.'
  },
  pillarWater: {
    en: 'Clean Potable Water',
    ha: 'Ruwan Sha Mai Tsabta',
    ar: 'المياه النقية الصالحة للشرب'
  },
  pillarWaterDesc: {
    en: 'Drilling high-yield solar-powered motorized boreholes with large storage overhead tanks to eliminate waterborne diseases.',
    ha: 'Gina rijiyoyin burtsatse masu amfani da hasken rana da manyan tankuna don magance cututtuka.',
    ar: 'حفر آبار ارتوازية تعمل بالطاقة الشمسية مع خزانات علوية للقضاء على الأمراض المنقولة بالمياه.'
  },
  pillarEdu: {
    en: 'Modern STEM Education',
    ha: 'Ilimin Kimiyya da Fasaha',
    ar: 'التعليم والتقنية الحديثة'
  },
  pillarEduDesc: {
    en: 'Renovating physics, chemistry, and biology secondary school laboratories and equipping classrooms with computers and modern desks.',
    ha: 'Gyaran dakin gwaje-gwajen kimiyya a makarantun sakandare da kayan aikin kwamfuta.',
    ar: 'تجديد مختبرات الفيزياء والكيمياء وتزويد الفصول بأجهزة الحاسوب والمقاعد الحديثة.'
  },
  pillarRoads: {
    en: 'Agrarian Access Roads',
    ha: 'Hanyoyin Saukaka Noma',
    ar: 'الطرق الزراعية الرابطة'
  },
  pillarRoadsDesc: {
    en: 'Grading and culvert construction along crucial farm corridors to reduce transport overheads and post-harvest losses.',
    ha: 'Gyaran hanyoyin gonaki da gina magudanan ruwa domin rage asarar amfanin gona.',
    ar: 'تمهيد الطرق الريفية وبناء الجسور المائية لتسهيل نقل المحاصيل والحد من خسائر ما بعد الحصاد.'
  },
  pillarFarmers: {
    en: 'Farmer Empowerment',
    ha: 'Tallafin Manoma',
    ar: 'تمكين ودعم المزارعين'
  },
  pillarFarmersDesc: {
    en: 'Direct distribution of subsidized fertilizers, high-yield seeds, and solar irrigation pumps to over 2,000 cooperative farmers.',
    ha: 'Raba takin zamani mai sauki, ingantaccen iri, da injinan ban ruwa ga manoma sama da 2,000.',
    ar: 'توزيع الأسمدة المدعومة والبذور المحسنة ومضخات الري بالطاقة الشمسية لأكثر من 2000 مزارع.'
  },
  pillarYouth: {
    en: 'Youth & Women Toolkits',
    ha: 'Kayan Aikin Matasa da Mata',
    ar: 'تأهيل الشباب والنساء'
  },
  pillarYouthDesc: {
    en: 'Vocational skills certification, smartphone repair toolkits, and micro-business seed grants for self-reliance.',
    ha: "Koyar da sana'o'in dogaro da kai, kayan gyaran waya, da tallafin jari ga mata da matasa.",
    ar: 'شهادات مهنية، ومعدات صيانة الهواتف، ومنح تأسيس المشاريع الصغيرة لتعزيز الاعتماد على النفس.'
  },
  openGovTitle: {
    en: 'A Representative Accountable to the People',
    ha: "Wakili Mai Rikon Amana da Yin Bayani Ga Jama'a",
    ar: 'نائب مسؤول وخاضع للمساءلة أمام الشعب'
  },
  openGovDesc: {
    en: 'Hon. Umar Yusuf Danmaje operates a permanent open-door liaison system. Citizens, ward elders, and youth delegates from Yabo and Shagari can submit petitions, community requests, or appointment queries at any time through our digital portal or physical liaison desks.',
    ha: "Hon. Umar Yusuf Danmaje na aiki da kofar bude kofa ga kowa. 'Yan kasa, dattawan unguwanni, da wakilan matasa daga Yabo da Shagari za su iya gabatar da korafe-korafe da bukatunsu a kowane lokaci ta wannan shafi ko a ofisoshinmu.",
    ar: 'يعتمد النائب عمر يوسف دانماجي سياسة الباب المفتوح الدائم. يمكن للمواطنين ووجهاء الدوائر والشباب تقديم العرائض وطلبات المشاريع في أي وقت عبر بوابتنا الرقمية أو مكاتب الاتصال.'
  },
  officeLocationsTitle: {
    en: 'Office Locations & Liaison Desks',
    ha: 'Wuraren Ofisoshi da Sadarwa',
    ar: 'مواقع المكاتب ومراكز الاتصال'
  },
  natAssemblyOffice: {
    en: 'National Assembly: Three Arms Zone, Abuja',
    ha: 'Majalisar Tarayya: Three Arms Zone, Abuja',
    ar: 'الجمعية الوطنية: منطقة الأسلحة الثلاثة، أبوجا'
  },
  yaboDesk: {
    en: 'Yabo Liaison Desk: Yabo Town Central, Sokoto State',
    ha: 'Ofishin Yabo: Tsakiyar Garin Yabo, Jihar Sakkwato',
    ar: 'مكتب اتصال يابو: وسط مدينة يابو، ولاية سوكوتو'
  },
  shagariDesk: {
    en: 'Shagari Liaison Desk: Shagari LGA Headquarters',
    ha: 'Ofishin Shagari: Hedikwatar Karamar Hukumar Shagari',
    ar: 'مكتب اتصال شاغاري: مقر الحكم المحلي لشاعاري'
  },
  visionHeading: {
    en: 'Our Vision & Strategic Mission',
    ha: 'Hangen Nesa da Manufarmu',
    ar: 'رؤيتنا ورسالتنا الاستراتيجية'
  },
  coreValuesHeading: {
    en: 'Guiding Values & Principles',
    ha: "Ka'idoji da Dabi'un Jagoranci",
    ar: 'القيم والمبادئ التوجيهية'
  },
  transparencyHeading: {
    en: 'Commitment to Transparency & Open Governance',
    ha: 'Alkawarin Gaskiya da Rikon Amana',
    ar: 'الالتزام بالشفافية والحكم الرشيد'
  },
  // Footer 4 Quick-Action Icons
  footerWhatsappTitle: {
    en: 'WhatsApp Liaison',
    ha: 'Sadarwar WhatsApp',
    ar: 'مكتب واتساب للتواصل'
  },
  footerWhatsappSubtitle: {
    en: 'Chat with Constituency Desk',
    ha: 'Yi Magana da Ofishin Mazaba',
    ar: 'محادثة مباشرة مع مكتب الدائرة'
  },
  footerGalleryTitle: {
    en: 'Media & Gallery',
    ha: 'Dakin Bidiyo da Hotuna',
    ar: 'معرض الوسائط والخطابات'
  },
  footerGallerySubtitle: {
    en: 'Photos, Speeches & Videos',
    ha: 'Hotuna, Jawabi da Bidiyoyi',
    ar: 'الصور والخطابات والتسجيلات'
  },
  footerProjectsTitle: {
    en: 'Constituency Projects',
    ha: 'Ayyukan Mazaba',
    ar: 'مشاريع الدائرة'
  },
  footerProjectsSubtitle: {
    en: 'Track 24+ Capital Works',
    ha: 'Duba Ayyuka 24+ na Ci Gaba',
    ar: 'متابعة أكثر من 24 مشروعاً رأسمالياً'
  },
  footerEmailTitle: {
    en: 'Official Email Desk',
    ha: 'Imel na Ofis',
    ar: 'البريد الإلكتروني الرسمي'
  },
  footerEmailSubtitle: {
    en: 'Formal Petitions & Letters',
    ha: 'Korafe-korafe da Wasiku',
    ar: 'العرائض والمراسلات الرسمية'
  },

  // Projects Page
  projectsPageBadge: {
    en: 'Constituency Development & Infrastructure',
    ha: 'Ci Gaban Mazaba da Ababen More Rayuwa',
    ar: 'تنمية الدائرة والبنية التحتية'
  },
  projectsPageTitle: {
    en: 'Projects & Infrastructure Directory',
    ha: 'Kundin Ayyukan Raya Kasa da Mazaba',
    ar: 'دليل مشاريع البنية التحتية والتنمية'
  },
  projectsPageDesc: {
    en: 'A comprehensive, transparent record of capital interventions, solar-powered boreholes, educational upgrades, and rural agrarian roads executed across Yabo and Shagari Federal Constituency.',
    ha: 'Cikakken bayani mai inganci da gaskiya game da manyan ayyukan rijiyoyin burtsatse masu hasken rana, gyaran makarantu, da hanyoyin gonaki a fadin mazabar Yabo da Shagari.',
    ar: 'سجل شامل وشفاف للتدخلات الرأسمالية ومشاريع الآبار الارتوازية بالطاقة الشمسية وتطوير المدارس والطرق الزراعية في دائرة يابو وشاغاري.'
  },
  allCategories: {
    en: 'All Infrastructure Categories',
    ha: 'Duk Bangarorin Ayyuka',
    ar: 'جميع فئات البنية التحتية'
  },
  allStatuses: {
    en: 'All Delivery Statuses',
    ha: 'Duk Matsayin Ayyuka',
    ar: 'جميع حالات التنفيذ'
  },
  searchProjectsPlaceholder: {
    en: 'Search projects by keyword, ward, or location...',
    ha: 'Bincika aiki da sunan wuri, unguwa ko kalma...',
    ar: 'البحث عن المشاريع بالكلمة المفتاحية أو الحي أو الموقع...'
  },
  noProjectsFound: {
    en: 'No projects match your filter criteria.',
    ha: 'Babu aikin da ya dace da abin da ka zaba.',
    ar: 'لا توجد مشاريع تطابق معايير التصفية.'
  },
  noProjectsFoundSub: {
    en: 'Try resetting the status or category dropdowns.',
    ha: 'Gwada sake saita zaɓin bangare ko matsayin aiki.',
    ar: 'يرجى تجربة إعادة ضبط قوائم التصفية.'
  },
  statusCompleted: {
    en: 'Completed',
    ha: 'An Kammala',
    ar: 'مكتمل'
  },
  statusOngoing: {
    en: 'Ongoing',
    ha: 'Ana Kan Yi',
    ar: 'قيد التنفيذ'
  },
  statusProposed: {
    en: 'Proposed',
    ha: 'An Tsara',
    ar: 'مقترح'
  },
  fundingSource: {
    en: 'Funding Source',
    ha: 'Hanyar Samun Kudi',
    ar: 'مصدر التمويل'
  },
  startDate: {
    en: 'Commencement Date',
    ha: 'Ranar Farawa',
    ar: 'تاريخ البدء'
  },
  completionDate: {
    en: 'Completion Date',
    ha: 'Ranar Kammalawa',
    ar: 'تاريخ الإنجاز'
  },
  projectLocation: {
    en: 'Location / Ward',
    ha: 'Wuri / Unguwa',
    ar: 'الموقع / الدائرة'
  },
  viewVerifiedRecord: {
    en: 'VIEW VERIFIED RECORD',
    ha: 'Duba Cikakken Rahoto',
    ar: 'عرض السجل الموثق'
  },

  // Legislative Page
  legPageBadge: {
    en: 'National Assembly of Nigeria',
    ha: 'Majalisar Tarayya ta Najeriya',
    ar: 'الجمعية الوطنية لجمهورية نيجيريا'
  },
  legPageTitle: {
    en: 'Legislative Work & Bills Tracker',
    ha: 'Ayyukan Dokoki da Bibiyar Kudurori',
    ar: 'سجل العمل التشريعي ومتابعة القوانين'
  },
  legPageDesc: {
    en: 'An open parliamentary registry documenting bills sponsored, substantive motions moved, and committee oversight led by Hon. Umar Yusuf (Danmaje Yabo) at the House of Representatives.',
    ha: 'Bude kundin majalisa mai nuna kudurorin doka da aka gabatar, motoci masu muhimmanci da aikin kwamitoci da Hon. Umar Yusuf (Danmaje Yabo) ya jagoranta.',
    ar: 'سجل برلماني مفتوح يوثق مشاريع القوانين والملتمسات وأعمال اللجان التي يقودها النائب عمر يوسف (دانماجي يابو) في مجلس النواب.'
  },
  allLegCategories: {
    en: 'All Parliamentary Categories',
    ha: 'Duk Nau\'ikan Dokoki',
    ar: 'جميع الفئات البرلمانية'
  },
  allLegStatuses: {
    en: 'All Legislative Statuses',
    ha: 'Duk Matsayin Dokoki',
    ar: 'جميع الحالات التشريعية'
  },
  searchLegPlaceholder: {
    en: 'Search bills, motions, or keywords...',
    ha: 'Bincika kudurori, motoci ko kalmomi...',
    ar: 'البحث عن مشاريع القوانين أو الملتمسات...'
  },
  noLegFound: {
    en: 'No legislative records found.',
    ha: 'Ba a sami wani bayanin doka ba.',
    ar: 'لم يتم العثور على سجلات تشريعية.'
  },
  billStagePassed: {
    en: 'Passed / Concurred',
    ha: 'An Amince / An Zartar',
    ar: 'تمت إجازته'
  },
  billStagePending: {
    en: 'Pending Committee / 2nd Reading',
    ha: 'A gaban Kwamiti / Karatu na Biyu',
    ar: 'قيد دراسة اللجنة / القراءة الثانية'
  },
  billStageIntroduced: {
    en: 'Introduced / 1st Reading',
    ha: 'An Gabatar / Karatu na Farko',
    ar: 'تم تقديمه / القراءة الأولى'
  },
  gazetteNotice: {
    en: 'Official Gazette Documentation',
    ha: 'Bayanin Kundin Sanarwa na Kasa',
    ar: 'وثيقة الجريدة الرسمية'
  },
  coSponsorsLabel: {
    en: 'Co-Sponsors & Parliamentary Allies',
    ha: 'Masu Tallafa Kuduri a Majalisa',
    ar: 'النواب المشاركون في الرعاية'
  },

  // Empowerment Page
  empowerPageBadge: {
    en: 'Socio-Economic Development Initiative',
    ha: 'Shirin Bunkasa Tattalin Arziki da Walwala',
    ar: 'مبادرة التنمية الاجتماعية والاقتصادية'
  },
  empowerPageTitle: {
    en: 'Empowerment Programmes & Grants',
    ha: 'Shirye-shiryen Karfafawa da Tallafin Jari',
    ar: 'برامج التمكين والمنح التنموية'
  },
  empowerPageDesc: {
    en: 'Direct grassroots interventions providing agricultural inputs, vocational toolkits, business grants, and scholarships across all 22 wards of Yabo and Shagari.',
    ha: 'Tallafin kai tsaye da ke samar da kayan aikin gona, kayan sana\'o\'in hannu, tallafin jari, da tallafin karatu a dukkan gundumomi 22 na Yabo da Shagari.',
    ar: 'تدخلات مباشرة على مستوى القاعدة الشعبية لتوفير المدخلات الزراعية، ومعدات التدريب المهني، والمنح المالية، والمنح الدراسية في جميع الدوائر الـ 22.'
  },
  slotsLabel: {
    en: 'Slots Allocated',
    ha: 'Gurbin da Aka Bada',
    ar: 'المقاعد المخصصة'
  },
  eligibilityLabel: {
    en: 'Eligibility Criteria',
    ha: 'Ka\'idojin Shiga',
    ar: 'شروط الأهلية'
  },
  deadlineLabel: {
    en: 'Application Deadline',
    ha: 'Ranar Rufewa',
    ar: 'آخر موعد للتقديم'
  },
  requirementsLabel: {
    en: 'Required Documentation',
    ha: 'Takardun da Ake Bukata',
    ar: 'الوثائق المطلوبة'
  },
  applyForSchemeBtn: {
    en: 'APPLY FOR THIS SCHEME',
    ha: 'Nemi Wannan Tallafin',
    ar: 'التقدم بطلب لهذا البرنامج'
  },
  applicationModalTitle: {
    en: 'Official Programme Application Form',
    ha: 'Fom din Neman Shirin Tallafi na Hukumomi',
    ar: 'استمارة التقديم الرسمية للبرنامج'
  },
  applicantWardPlaceholder: {
    en: 'Ward & LGA (e.g. Yabo Town / Shagari Central)',
    ha: 'Unguwa da Karamar Hukuma (misali Yabo Town / Shagari)',
    ar: 'الحي والمجلس المحلي (مثال: وسط يابو / شاغاري)'
  },
  qualificationsPlaceholder: {
    en: 'Education or Trade Background (e.g. Smallholder Farmer, Tailor, Student)',
    ha: 'Sana\'a ko Matakin Karatu (misali Manomi, Dinki, Dalibi)',
    ar: 'المؤهل التعليمي أو المهنة (مثال: مزارع، خياط، طالب)'
  },
  statementPlaceholder: {
    en: 'How will this empowerment intervention benefit your livelihood or community?',
    ha: 'Ta yaya wannan tallafi zai inganta rayuwarka ko al\'ummarka?',
    ar: 'كيف سيفيد هذا التدخل التمكيني معيشتك أو مجتمعك؟'
  },
  submitApplicationBtn: {
    en: 'SUBMIT VERIFIED APPLICATION',
    ha: 'Aika Cikakkiyar Takarda',
    ar: 'إرسال الطلب المعتمد'
  },

  // News Page
  newsPageBadge: {
    en: 'Media & Press Centre',
    ha: 'Cibiyar Yada Labarai da Jaridu',
    ar: 'المركز الإعلامي والصحفي'
  },
  newsPageTitle: {
    en: 'News, Announcements & Updates',
    ha: 'Labarai, Sanarwa da Sababbin Bayanai',
    ar: 'الأخبار والإعلانات والمستجدات'
  },
  newsPageDesc: {
    en: 'Official press releases, constituency tour updates, legislative debates, and public service announcements from the office of Hon. Umar Yusuf (Danmaje Yabo).',
    ha: 'Sanarwar manema labarai ta hukumomi, ziyarar duba aiki a mazabu, muhawarar majalisa da bayanan hidimar jama\'a daga ofishin Hon. Umar Yusuf (Danmaje Yabo).',
    ar: 'بيانات صحفية رسمية، ومستجدات الجولات الميدانية في الدائرة، والمناقشات التشريعية، وإعلانات الخدمة العامة من مكتب النائب عمر يوسف (دانماجي يابو).'
  },
  searchNewsPlaceholder: {
    en: 'Search news articles or press releases...',
    ha: 'Bincika labarai ko sanarwar manema labarai...',
    ar: 'البحث في الأخبار والبيانات الصحفية...'
  },
  featuredNewsLabel: {
    en: 'Featured Dispatch',
    ha: 'Babban Labarin Musamman',
    ar: 'خبر مميز'
  },
  officialPressLabel: {
    en: 'Official Press Release',
    ha: 'Sanarwar Manema Labarai ta Kasa',
    ar: 'بيان صحفي رسمي'
  },

  // Gallery Page
  galleryPageBadge: {
    en: 'Official Media & Visual Archive',
    ha: 'Rumbun Bidiyo da Hotuna na Kasa',
    ar: 'الأرشيف المرئي والإعلامي الرسمي'
  },
  galleryPageTitle: {
    en: 'Video & Photographic Gallery',
    ha: 'Dakin Kallo na Bidiyo da Hotuna',
    ar: 'معرض الصور ومقاطع الفيديو'
  },
  galleryPageDesc: {
    en: 'Watch official speeches and parliamentary debates from the Green Chamber, and view verified photographic documentation of constituency projects and empowerment flag-offs.',
    ha: 'Kalli jawabai na musamman da muhawarori a zauren majalisa, da hotunan ayyukan mazaba da kaddamar da shirye-shiryen tallafi.',
    ar: 'شاهد الخطابات والمناقشات الرسمية في مجلس النواب، واطلع على التوثيق المصور لمشاريع الدائرة ومبادرات التمكين.'
  },
  allMediaLabel: {
    en: 'All Media Records',
    ha: 'Duk Abubuwan Kallo',
    ar: 'جميع الوسائط'
  },
  videosOnlyLabel: {
    en: 'Videos & Speeches',
    ha: 'Bidiyoyi da Jawabai',
    ar: 'مقاطع الفيديو والخطابات'
  },
  photosOnlyLabel: {
    en: 'Photographs',
    ha: 'Hotuna',
    ar: 'الصور الفوتوغرافية'
  },
  clickToPlayVideo: {
    en: 'Click to Play Video',
    ha: 'Latsa Don Kallon Bidiyo',
    ar: 'انقر لتشغيل الفيديو'
  },
  viewHighResPhoto: {
    en: 'VIEW HIGH-RES PHOTO',
    ha: 'Duba Cikakken Hoto Mai Kyau',
    ar: 'عرض الصورة بدقة عالية'
  },

  // Contact Page
  contactPageBadge: {
    en: 'Constituency Liaison & Citizen Desk',
    ha: 'Ofishin Sadarwa da Hidimar Al\'umma',
    ar: 'مكتب التواصل وخدمة المواطنين'
  },
  contactPageTitle: {
    en: 'Contact Constituency Office',
    ha: 'Tuntubi Ofishin Mazaba',
    ar: 'الاتصال بمكتب الدائرة الانتخابية'
  },
  contactPageDesc: {
    en: 'Get in touch with the office of Hon. Umar Yusuf (Danmaje Yabo). Submit enquiries, community feedback, or project support requests.',
    ha: 'Sadu da ofishin Hon. Umar Yusuf (Danmaje Yabo). Aika tambayoyi, korafe-korafe, ko bukatun ayyukan raya unguwa.',
    ar: 'تواصل مع مكتب النائب عمر يوسف (دانماجي يابو). أرسل استفساراتك أو مقترحاتك أو طلبات دعم المشاريع في دائرتك.'
  },
  officialContactDetailsTitle: {
    en: 'Official Contact Information',
    ha: 'Bayanin Sadarwa na Hukumomi',
    ar: 'معلومات الاتصال الرسمية'
  },
  abujaOfficeTitle: {
    en: 'National Assembly Abuja Office',
    ha: 'Ofishin Majalisar Tarayya Abuja',
    ar: 'مكتب الجمعية الوطنية في أبوجا'
  },
  abujaOfficeAddress: {
    en: 'House of Representatives, Three Arms Zone, PMB 141, Abuja, FCT, Nigeria',
    ha: 'Majalisar Wakilai, Three Arms Zone, PMB 141, Abuja, Najeriya',
    ar: 'مجلس النواب، منطقة الأسلحة الثلاثة، ص.ب 141، أبوجا، نيجيريا'
  },
  yaboOfficeTitle: {
    en: 'Yabo Constituency Liaison Desk',
    ha: 'Ofishin Sadarwa na Yabo',
    ar: 'مكتب اتصال دائرة يابو'
  },
  yaboOfficeAddress: {
    en: 'Yabo Town Central, Yabo LGA, Sokoto State',
    ha: 'Tsakiyar Garin Yabo, Karamar Hukumar Yabo, Jihar Sakkwato',
    ar: 'وسط مدينة يابو، مجلس يابو المحلي، ولاية سوكوتو'
  },
  shagariOfficeTitle: {
    en: 'Shagari Constituency Liaison Desk',
    ha: 'Ofishin Sadarwa na Shagari',
    ar: 'مكتب اتصال دائرة شاغاري'
  },
  shagariOfficeAddress: {
    en: 'Shagari LGA Headquarters, Sokoto State',
    ha: 'Hedikwatar Karamar Hukumar Shagari, Jihar Sakkwato',
    ar: 'مقر الحكم المحلي لشاعاري، ولاية سوكوتو'
  },
  sendMessageFormTitle: {
    en: 'Send an Official Message',
    ha: 'Aika Sakon Hukumomi',
    ar: 'إرسال رسالة رسمية'
  },
  inquiryCategoryLabel: {
    en: 'Category of Inquiry',
    ha: 'Bangaren Sakonka',
    ar: 'نوع الاستفسار'
  },
  catGeneral: {
    en: 'General Inquiry',
    ha: 'Bayanai na Bai-Daya',
    ar: 'استفسار عام'
  },
  catProjectSupport: {
    en: 'Project Support / Nomination',
    ha: 'Bukatun Aikin Raya Kasa',
    ar: 'دعم أو اقتراح مشروع'
  },
  catCommunityIssue: {
    en: 'Community Issue / Petition',
    ha: 'Matsalar Al\'umma / Korafi',
    ar: 'قضية مجتمعية أو عريضة'
  },
  catEmpowermentInquiry: {
    en: 'Empowerment Programme Inquiry',
    ha: 'Tambayoyi kan Shirin Tallafi',
    ar: 'استفسار عن برامج التمكين'
  },
  catMediaRequest: {
    en: 'Media / Interview Request',
    ha: 'Bukatar Hira ko Labari',
    ar: 'طلب إعلامي أو مقابلة'
  },
  messageSentSuccess: {
    en: 'Thank you! Your official message has been received and routed to our constituent service desk.',
    ha: 'Mun gode! Sakonka ya isa ofishinmu kuma an mika shi ga jami\'an da ke kula da bukatun al\'umma.',
    ar: 'شكراً لك! تم استلام رسالتك وتوجيهها إلى مكتب خدمة المواطنين.'
  },
  closeBtn: {
    en: 'CLOSE',
    ha: 'Rufe',
    ar: 'إغلاق'
  },
  backToHome: {
    en: 'BACK TO HOME',
    ha: 'Koma Gida',
    ar: 'العودة للرئيسية'
  },

  // Legal - Header & Meta
  legalOfficeCharter: {
    en: 'Official Parliamentary Transparency & Public Charter',
    ha: 'Hukumar Rikon Amana da Dokokin Mazaba',
    ar: 'الشفافية البرلمانية الرسمية وميثاق المواطن'
  },
  legalOfficeSub: {
    en: 'Office of Hon. Umar Yusuf (Danmaje Yabo) • 10th National Assembly, Abuja',
    ha: 'Ofishin Hon. Umar Yusuf (Danmaje Yabo) • Majalisar Tarayya ta 10, Abuja',
    ar: 'مكتب سعادة النائب عمر يوسف (دانماجي يابو) • الجمعية الوطنية العاشرة، أبوجا'
  },
  legalInquiriesTitle: {
    en: 'Inquiries & Official Assistance',
    ha: 'Neman Karin Bayani da Taimako',
    ar: 'الاستفسارات والدعم والمساعدة'
  },
  legalInquiriesDesc: {
    en: 'Direct all legal, privacy, and accessibility questions to the Constituency Secretariat:',
    ha: 'Aika duk wasu tambayoyi game da tsari, sirri da shiga mai sauki zuwa sakatariyar mazaba:',
    ar: 'يُرجى توجيه جميع الاستفسارات القانونية والخصوصية إلى أمانة الدائرة:'
  },

  // Privacy Policy Full Sections
  privacyAssuranceTitle: {
    en: 'Constitutional Assurance',
    ha: 'Alkawari a Karkashin Doka',
    ar: 'ضمانة دستورية وقانونية'
  },
  privacyAssuranceText: {
    en: 'We respect citizen privacy and ensure all public submissions through this portal adhere to the Nigeria Data Protection Act (NDPA) and strict parliamentary ethics.',
    ha: 'Muna mutunta sirrin kowane dan kasa kuma muna tabbatar da cewa duk bayanai da aka aika ta wannan kafa suna bin Dokar Kare Bayanai ta Najeriya (NDPA) da ka\'idojin majalisa.',
    ar: 'نحترم خصوصية المواطنين ونضمن امتثال جميع البيانات المرسلة عبر هذه البوابة لقانون حماية البيانات النيجيري (NDPA) والمعايير البرلمانية الصارمة.'
  },
  privacySec1Title: {
    en: '1. Scope & Information Collected',
    ha: '1. Nau\'ikan Bayanan da Muke Tarawa',
    ar: '١. نطاق ونوعية البيانات المجمعة'
  },
  privacySec1Text: {
    en: 'When you submit inquiries, community petitions, or empowerment applications through this portal, we may securely record your full name, email address, phone number, ward/constituency address, and application statements.',
    ha: 'Idan ka aiko da koke, bukatun ci gaban gari, ko neman shiga shirin tallafi, muna adana sunanka, lambar waya, adireshin imel, unguwa ko gari, da bayanan aikace-aikacenka cikin tsaro.',
    ar: 'عند تقديمك للاستفسارات، أو العرائض المجتمعية، أو طلبات التمكين عبر هذه البوابة، فإننا نسجل اسمك الكامل، ورقم الهاتف، والبريد الإلكتروني، والدائرة/الحي، وبيانات الطلب بأعلى معايير الأمان.'
  },
  privacySec2Title: {
    en: '2. Purpose of Data Processing',
    ha: '2. Dalilin Amfani da Bayananku',
    ar: '٢. الغرض من معالجة واستخدام البيانات'
  },
  privacySec2Text: {
    en: 'Your data is used solely to verify eligibility for empowerment programs, dispatch notifications regarding community projects in your ward, and facilitate responsive constituent liaison services.',
    ha: 'Ana amfani da bayanan ne kawai wajen tabbatar da cancanta a shirye-shiryen tallafi, sanar da ku game da ayyukan raya kasa a yankinku, da inganta sadarwa tsakanin wakili da al\'ummarsa.',
    ar: 'تُستخدم بياناتك حصرياً للتحقق من الأهلية لبرامج التمكين، وإرسال إشعارات حول المشاريع في منطقتك، وتسهيل التواصل الفعال بين النائب والمواطنين.'
  },
  privacySec3Title: {
    en: '3. Data Security & Confidentiality',
    ha: '3. Tsaro da Rikon Amanar Bayanai',
    ar: '٣. أمان البيانات والسرية التامة'
  },
  privacySec3Text: {
    en: 'Records are maintained with state-of-the-art encryption and access-controlled databases. We do not sell, rent, or distribute personal information to commercial third parties.',
    ha: 'Ana adana duk bayanai da tsarin boye bayanai na zamani da kuma kariya ta musamman. Ba ma siyarwa ko bayar da bayanan sirri ga kowace kungiya ta kasuwanci.',
    ar: 'تُحفظ السجلات بتقنيات تشفير متطورة وقواعد بيانات خاضعة لرقابة صارمة. نحن لا نبيع ولا نؤجر ولا نشارك البيانات الشخصية مع أي جهات تجارية.'
  },
  privacySec4Title: {
    en: '4. Citizen Rights & Control',
    ha: '4. Hakkokin Dan Kasa Kan Bayanansa',
    ar: '٤. حقوق المواطن والتحكم في البيانات'
  },
  privacySec4Text: {
    en: 'You hold the right to inspect, update, or request the deletion of your personal submissions at any time by writing directly to our constituency communications office in Abuja, Yabo, or Shagari.',
    ha: 'Kuna da ikon dubawa, gyarawa, ko neman a goge bayanan da kuka gabatar a kowane lokaci ta hanyar rubuta wasika zuwa ofisoshinmu a Abuja, Yabo, ko Shagari.',
    ar: 'يحق لك في أي وقت مراجعة بياناتك المسجلة أو تحديثها أو طلب حذفها من خلال التواصل المباشر مع مكاتب الاتصال التابعة للدائرة في أبوجا أو يابو أو شاغاري.'
  },

  // Terms of Use Full Sections
  termsProtocolTitle: {
    en: 'Official Protocol & Citizen Charter',
    ha: 'Ka\'idojin Hukuma da Yarjejeniyar Jama\'a',
    ar: 'البروتوكول الرسمي وميثاق المواطن'
  },
  termsProtocolText: {
    en: 'This platform is the verified online portal of Hon. Umar Yusuf (Danmaje Yabo), Member of the House of Representatives representing Yabo/Shagari Federal Constituency.',
    ha: 'Wannan kafa ita ce sahihiyar kafar yanar gizo ta Hon. Umar Yusuf (Danmaje Yabo), Dan Majalisar Wakilai mai wakiltar Mazabar Yabo da Shagari.',
    ar: 'هذه المنصة هي البوابة الرقمية الرسمية المعتمدة لسعادة النائب عمر يوسف (دانماجي يابو)، عضو مجلس النواب عن دائرة يابو وشاغاري الفيدرالية.'
  },
  termsSec1Title: {
    en: '1. Authorized Usage',
    ha: '1. Sharuɗɗan Amfani da Kafa',
    ar: '١. شروط الاستخدام المصرح به'
  },
  termsSec1Text: {
    en: 'Constituents and members of the public are welcomed to browse records, track legislative bills, download gazettes, and apply for verified empowerment initiatives in good faith.',
    ha: 'Ana maraba da al\'ummar mazaba da sauran jama\'a su binciki ayyuka, su bi sawun kudurorin dokoki, su saukar da takardun majalisa, kuma su nemi tallafi bisa gaskiya da amana.',
    ar: 'نرحب بجميع أهالي الدائرة والجمهور لتصفح السجلات ومتابعة مشاريع القوانين وتحميل الجرائد الرسمية والتقديم على مبادرات التمكين المعتمدة بحسن نية.'
  },
  termsSec2Title: {
    en: '2. Official Media & Integrity',
    ha: '2. Hotuna, Bidiyoyi da Mallakar Fasaha',
    ar: '٢. الوسائط الرسمية والملكية الفكرية'
  },
  termsSec2Text: {
    en: 'Photographs, video recordings, official speeches, and project reports published on this website are authentic records of the representative\'s office. Malicious alteration or misrepresentation is prohibited.',
    ha: 'Duk hotuna, bidiyo, jawabai na hukuma, da rahotannin ayyuka da aka wallafa a nan mallakar ofishin wakili ne. An haramta sauya su ko yin amfani da su ta hanyar bata suna.',
    ar: 'الصور الفوتوغرافية وتسجيلات الفيديو والخطابات الرسمية وتقارير المشاريع المنشورة هي سجلات موثقة لمكتب النائب. يُحظر التلاعب بها أو تشويهها.'
  },
  termsSec3Title: {
    en: '3. Empowerment & Scheme Guidelines',
    ha: '3. Ka\'idojin Shirye-shiryen Tallafi',
    ar: '٣. إرشادات برامج ومبادرات التمكين'
  },
  termsSec3Text: {
    en: 'Participation in empowerment programs is subject to transparent verification by the constituency welfare board. All applications are completely free of charge. No fee will ever be required.',
    ha: 'Duk wani shiga shirin tallafi yana karkashin tantancewa ta gaskiya daga kwamitin jin dadin mazaba. Neman shiga kyauta ne gaba daya; babu wani kudi da ake bukata ko kadan.',
    ar: 'يخضع القبول في برامج التمكين للتحقق والتدقيق الشفاف من قِبل لجنة التنمية بالدائرة. جميع الطلبات مجانية بالكامل، ولن يُطلب أي مقابل مالي إطلاقاً.'
  },

  // Accessibility Statement Full Sections
  accessPrincipleTitle: {
    en: 'Equal Access Principle',
    ha: 'Ka\'idar Shiga da Amfani ga Kowa',
    ar: 'مبدأ المساواة في الوصول الرقمي'
  },
  accessPrincipleText: {
    en: 'Our legislative mandate serves all citizens equally, including persons with disabilities and varying internet connectivity across our communities.',
    ha: 'Aikinmu na wakilci yana hidimtawa kowane dan kasa ba tare da nuna bambanci ba, har da masu bukata ta musamman da kuma masu raunin intanet.',
    ar: 'رسالتنا النيابية تخدم جميع المواطنين على قدم المساواة، بما في ذلك ذوو الاحتياجات الخاصة ومستخدمو شبكات الإنترنت المتفاوتة في مجتمعاتنا.'
  },
  accessSec1Title: {
    en: '1. Technical Accessibility Standards',
    ha: '1. Ka\'idojin Fasahar Shiga ga Kowa',
    ar: '١. المعايير التقنية لإمكانية الوصول'
  },
  accessSec1Text: {
    en: 'This portal is engineered to conform with Web Content Accessibility Guidelines (WCAG 2.2 AA), providing high-contrast color choices, readable typography, and full keyboard navigation support.',
    ha: 'An kera wannan kafar yanar gizo bisa ka\'idojin WCAG 2.2 AA, tare da launuka masu saukin gani, rubutu mai fito-na-fito, da saukin lilo a waya ko kwamfuta.',
    ar: 'تم تصميم البوابة وفقاً لمعايير إمكانية الوصول للويب (WCAG 2.2 AA)، موفرة تبايناً لونياً ممتازاً وخطوطاً واضحة ودعماً شاملاً للتنقل عبر لوحة المفاتيح وشاشات اللمس.'
  },
  accessSec2Title: {
    en: '2. Multilingual Inclusivity',
    ha: '2. Hadawa da Harsuna Daban-Daban',
    ar: '٢. الشمولية اللغوية المتكاملة'
  },
  accessSec2Text: {
    en: 'To ensure accessibility for all constituents across Yabo and Shagari, this portal provides native translation support in English, Hausa (the primary language of our communities), and Arabic.',
    ha: 'Domin tabbatar da cewa kowa ya fahimci abin da ke gudana, wannan kafa tana da cikakken tsarin harsuna uku: Turanci, Hausa (harshen mutanenmu), da Larabci.',
    ar: 'لضمان وصول جميع الأهالي في يابو وشاغاري للمعلومات، توفر المنصة دعماً لغوياً متكاملاً باللغات الإنجليزية، والهوسا (اللغة الأم لمجتمعاتنا)، والعربية.'
  },
  accessSec3Title: {
    en: '3. Accessible Assistance Desks',
    ha: '3. Ofisoshin Taimako ga Jama\'a',
    ar: '٣. مكاتب المساعدة والدعم المباشر'
  },
  accessSec3Text: {
    en: 'Should you experience any challenge accessing any document or applying for any scheme, our liaison desks in Yabo, Shagari, and Abuja are staffed to offer personal assistance.',
    ha: 'Idan ka fuskanci wata matsala wajen duba takardu ko neman tallafi, jami\'anmu a ofisoshin Yabo, Shagari, da Abuja a shirye suke su taimaka maka kai tsaye.',
    ar: 'إذا واجهت أي صعوبة في الوصول لأي وثيقة أو تقديم أي طلب، فإن موظفينا في مكاتب يابو وشاغاري وأبوجا جاهزون لتقديم المساعدة الشخصية الفورية.'
  },

  // Homepage Leadership & Impact Pillars
  grassrootsFirstTitle: {
    en: 'Grassroots First',
    ha: 'Jama\'ar Karkara a Gaba',
    ar: 'الأولوية للمجتمع والقاعدة الشعبية'
  },
  grassrootsFirstDesc: {
    en: 'Continuous liaison across all 22 wards of Yabo and Shagari',
    ha: 'Sadarwa da tuntubar jama\'a a dukkan gundumomi 22 na Yabo da Shagari',
    ar: 'تواصل دائم ومباشر عبر جميع الدوائر الـ ٢٢ في يابو وشاغاري'
  },
  agrarianFocusTitle: {
    en: 'Agrarian Focus',
    ha: 'Bunkasa Noma da Manoma',
    ar: 'التركيز على التنمية الزراعية'
  },
  agrarianFocusDesc: {
    en: 'Subsidized fertilizers, farm toolkits & rural access roads',
    ha: 'Takin zamani mai saukin kudi, kayan aiki, da gyaran hanyoyin gona',
    ar: 'أسمدة مدعومة، ومعدات زراعية، وتمهيد الطرق الريفية'
  },
  humanCapitalTitle: {
    en: 'Human Capital',
    ha: 'Gina Kwarewar Al\'umma',
    ar: 'الاستثمار في رأس المال البشري'
  },
  humanCapitalDesc: {
    en: 'STEM secondary laboratories, scholarships & women co-operatives',
    ha: 'Dakunan gwaje-gwajen kimiyya, tallafin karatu, da hadin gwiwar mata',
    ar: 'مختبرات علمية متقدمة، ومنح دراسية، وجمعيات تعاونية نسائية'
  },

  // Areas of Impact Cards on Homepage
  impactCardLegTitle: {
    en: 'Legislative Representation',
    ha: 'Ayyukan Dokoki a Majalisa',
    ar: 'التمثيل والتشريع البرلماني'
  },
  impactCardLegDesc: {
    en: 'Advocating robust agricultural development bills, basic education enhancements, and urgent motions for federal ecological intervention in gully erosion sites across Sokoto State.',
    ha: 'Kudurin dokoki kan bunkasa aikin noma, inganta ilimin bai-daya, da gabatar da korafe-korafe kan zaizayar kasa domin tallafin gwamnatin tarayya a Jihar Sakkwato.',
    ar: 'رعاية مشاريع قوانين التنمية الزراعية، وتطوير التعليم الأساسي، وتقديم ملتمسات عاجلة للتدخل الفيدرالي لمكافحة انجراف التربة والسيول في ولاية سوكوتو.'
  },
  impactCardLegBtn: {
    en: 'VIEW BILLS & MOTIONS',
    ha: 'Duba Kudurori da Motsi',
    ar: 'عرض القوانين والملتمسات'
  },
  impactCardInfraTitle: {
    en: 'Constituency Infrastructure',
    ha: 'Ayyukan More Rayuwa na Mazaba',
    ar: 'البنية التحتية في الدائرة'
  },
  impactCardInfraDesc: {
    en: 'Delivering high-capacity solar-powered water schemes, science laboratory upgrades in secondary schools, maternity clinic extensions, and agricultural farm road grading.',
    ha: 'Kafa rijiyoyin burtsatse masu aiki da hasken rana, sabunta dakunan kimiyya a makarantun gaba da sakandare, asibitocin haihuwa, da hanyoyin mota zuwa gonaki.',
    ar: 'تنفيذ شبكات مياه بالطاقة الشمسية، وتحديث المختبرات العلمية في المدارس، وتوسعة المراكز الصحية، وتمهيد الطرق الزراعية الحيوية.'
  },
  impactCardInfraBtn: {
    en: 'EXPLORE PROJECT DIRECTORY',
    ha: 'Bincika Kundin Ayyuka',
    ar: 'استكشاف دليل المشاريع'
  },
  impactCardWelfareTitle: {
    en: 'Empowerment & Welfare',
    ha: 'Karfafa Al\'umma da Jin Dadi',
    ar: 'التمكين والرفاه الاجتماعي'
  },
  impactCardWelfareDesc: {
    en: 'Supporting smallholder farmers with dry-season fertilizer subsidies, empowering unemployed youth with ICT toolkits, and financing rural women micro-cooperatives.',
    ha: 'Tallafawa manoma da takin noman rani, bai wa matasa kayan aikin fasahar zamani (ICT), da ba wa matan karkara kudaden jarin sana\'o\'i.',
    ar: 'دعم صغار المزارعين بأسمدة الزراعة المروية، وتزويد الشباب بحقائب التكنولوجيا المهنية، وتمويل الجمعيات التعاونية لنساء الريف.'
  },
  impactCardWelfareBtn: {
    en: 'VIEW PROGRAMMES & APPLY',
    ha: 'Duba Shirye-shirye da Neman Shiga',
    ar: 'عرض البرامج والتقديم'
  },

  // Featured Projects Section on Homepage
  featuredProjectsBadge: {
    en: 'Verified Deliverables',
    ha: 'Ayyukan da aka Tabbatar',
    ar: 'إنجازات ومشاريع موثقة'
  },
  featuredProjectsHeading: {
    en: 'Featured Constituency Projects',
    ha: 'Manyan Ayyukan Raya Mazaba',
    ar: 'مشاريع الدائرة النموذجية'
  },
  featuredProjectsSubheading: {
    en: 'Direct evidence of infrastructure, water, and human capacity projects across Yabo and Shagari.',
    ha: 'Shaidar zahiri ta ayyukan samar da ruwa, ilimi, da gine-gine a Yabo da Shagari.',
    ar: 'شواهد ميدانية ملموسة لمشاريع المياه والتعليم والبنية التحتية في يابو وشاغاري.'
  },
  sectorFilterLabel: {
    en: 'Sector:',
    ha: 'Bangare:',
    ar: 'القطاع:'
  },
  allInterventions: {
    en: 'ALL INTERVENTIONS',
    ha: 'Duk Ayyuka',
    ar: 'جميع التدخلات'
  },

  // Parliamentary Broadcast Section
  parliamentaryBroadcastBadge: {
    en: 'National Assembly Chamber',
    ha: 'Zauren Majalisar Tarayya',
    ar: 'قاعة الجمعية الوطنية'
  },
  parliamentaryBroadcastHeading: {
    en: 'Plenary Motion & Constituency Presentation',
    ha: 'Motsi a Zauren Majalisa da Magana Kan Mazaba',
    ar: 'مداخلة برلمانية وملتمس لصالح الدائرة'
  },
  parliamentaryBroadcastDesc: {
    en: 'Watch Hon. Umar Yusuf (Danmaje Yabo) address the House of Representatives on critical agricultural access roads, dry-season irrigation support, and flood mitigation for Sokoto agrarian communities.',
    ha: 'Kalli yadda Hon. Umar Yusuf (Danmaje Yabo) ya gabatar da jawabi a Majalisar Wakilai kan muhimmancin hanyoyin gona, noman rani, da kariya daga ambaliyar ruwa ga manoman Sakkwato.',
    ar: 'شاهد كلمة سعادة النائب عمر يوسف (دانماجي يابو) في مجلس النواب حول الطرق الزراعية ودعم الري الموسمي ومواجهة الفيضانات في ولاية سوكوتو.'
  },
  watchInTheaterBtn: {
    en: 'WATCH IN INTERACTIVE VIDEO THEATER',
    ha: 'Kalli a Zauren Bidiyo na Musamman',
    ar: 'المشاهدة في منصة العرض التفاعلية'
  },
  browseMediaLibraryBtn: {
    en: 'BROWSE MEDIA LIBRARY',
    ha: 'Duba Kundin Bidiyo da Hotuna',
    ar: 'تصفح مكتبة الوسائط'
  },
  officialDebateLabel: {
    en: 'Official 10th Assembly Plenary Record',
    ha: 'Tabbataccen Kundin Majalisa ta 10',
    ar: 'تسجيل رسمي من الجلسة العامة للجمعية العاشرة'
  },
  openCitizenDiscussionBtn: {
    en: 'OPEN CITIZEN DISCUSSION & TRANSCRIPT',
    ha: 'Bude Tattaunawar Jama\'a da Rubutun Jawabi',
    ar: 'فتح نقاش المواطنين ونص الخطاب'
  },

  // About Preview Spotlight on Homepage
  aboutBioPreviewP1: {
    en: 'Hon. Umar Yusuf (Danmaje Yabo) represents Yabo and Shagari Federal Constituency in the House of Representatives of Nigeria. Guided by a leadership philosophy rooted in humility, accessibility, and purposeful service, his legislative agenda focuses on empowering farming families, rehabilitating grassroots educational infrastructure, expanding clean water supply, and advancing high-impact national bills.',
    ha: 'Hon. Umar Yusuf (Danmaje Yabo) yana wakiltar Mazabar Yabo da Shagari a Majalisar Wakilai ta Najeriya. Da manufar jagoranci mai cike da kaskantar da kai, kofofin bude, da sadaukarwa, tsarin aikinsa ya maida hankali ne kan tallafawa manoma, gyara makarantu, samar da ruwa mai tsafta, da kudurorin dokoki masu amfanar al\'umma.',
    ar: 'يمثل سعادة النائب عمر يوسف (دانماجي يابو) دائرة يابو وشاغاري الفيدرالية في مجلس النواب النيجيري. وبنهج قيادي قائم على التواضع والانفتاح والخدمة المخلصة، تركز أجندته التشريعية على دعم الأسر الزراعية وتأهيل المدارس وتوفير مياه الشرب النقية وسن القوانين الوطنية المؤثرة.'
  },
  verifiedRepBadge: {
    en: 'Verified Federal Representation',
    ha: 'Wakilcin Tarayya Tabbatacce',
    ar: 'تمثيل برلماني فيدرالي موثق'
  },
  servingYaboShagari: {
    en: 'Serving Yabo LGA & Shagari LGA',
    ha: 'Yana Aiki ga Kananan Hukumomin Yabo da Shagari',
    ar: 'في خدمة مقاطعتي يابو وشاغاري'
  },
  officialPublicRecordNotice: {
    en: 'Official Public Record • Direct Constituency Service',
    ha: 'Shaidar Hukuma ga Jama\'a • Aikin Mazaba Kai Tsaye',
    ar: 'سجل عام رسمي • خدمة مباشرة لمواطني الدائرة'
  },
  configurableAdminNotice: {
    en: 'Verified by Office of the Honourable Representative',
    ha: 'An Tabbatar Daga Ofishin Mai Girma Wakili',
    ar: 'معتمد رسمياً من مكتب سعادة النائب الموقر'
  }
};

export function t(key: string, lang: Language, customTranslations?: Translations): string {
  const dictionary = customTranslations || DEFAULT_TRANSLATIONS;
  if (dictionary[key] && dictionary[key][lang]) {
    return dictionary[key][lang];
  }
  return DEFAULT_TRANSLATIONS[key]?.[lang] || key;
}

