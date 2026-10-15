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
  exploreProjects: {
    en: 'Explore Projects',
    ha: 'Bincika Ayruka',
    ar: 'استكشاف المشاريع'
  },
  contactOffice: {
    en: 'Contact the Office',
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
    en: 'Committed to Grassroots Transformation',
    ha: 'An Sadaukar da Kai Ga Cigaban Al’umma',
    ar: 'ملتزمون بالتحول على مستوى القاعدة الشعبية'
  },
  viewAllProjects: {
    en: 'View All Projects',
    ha: 'Duba Duk Ayruka',
    ar: 'عرض جميع المشاريع'
  },
  readMore: {
    en: 'Read Full Article',
    ha: 'Karanta Cikakken Labari',
    ar: 'قراءة المقال كاملاً'
  },
  submitMessage: {
    en: 'Submit Official Message',
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
    en: 'View Project Details',
    ha: 'Duba Cikakken Aiki',
    ar: 'عرض تفاصيل المشروع'
  },
  applyNow: {
    en: 'Apply Now',
    ha: 'Neman Wannan Taimako',
    ar: 'قدم الآن'
  },
  citizenEngagementTitle: {
    en: 'Have an Enquiry or Community Concern?',
    ha: 'Kuna da Tambaya Ko Korafe-Korafe?',
    ar: 'هل لديك استفسار أو مشكلة مجتمعية؟'
  },
  citizenEngagementDesc: {
    en: 'Our constituency office in Abuja and ward liaison desks are open to receive enquiries, project requests, and community feedback. We are here to serve you.',
    ha: 'Ofishinmu na Abuja da mazabu a bude suke don karbar korafi da bukatun ayruka.',
    ar: 'مكتبنا في أبوجا ومكاتب الاتصال في الدوائر مفتوحة لتلقي الاستفسارات وطلبات المشاريع.'
  },
  submitEnquiryBtn: {
    en: 'Submit Enquiry / Report Issue',
    ha: 'Aika Kori Ko Bayar da Rahoto',
    ar: 'إرسال استفسار أو الإبلاغ عن مشكلة'
  },
  applyEmpowermentBtn: {
    en: 'Apply for Empowerment Programmes',
    ha: 'Nemi Shirye-shiryen Karfafawa',
    ar: 'التقدم بطلب لبرامج التمكين'
  },
  aboutBriefTitle: {
    en: 'About the Representative',
    ha: 'Game da Wakili',
    ar: 'عن النائب'
  },
  aboutBriefSubtitle: {
    en: 'A Life Dedicated to Public Service and People-Centred Representation',
    ha: 'Rayuwa da Aka Sadaukar Domin Aikin Al\'umma da Wakilci na Gari',
    ar: 'حياة مكرسة للخدمة العامة والتمثيل المرتكز على خدمة الشعب'
  },
  readFullBio: {
    en: 'Read Full Biography & Profile',
    ha: 'Karanta Cikakken Tarihin Rayuwa',
    ar: 'قراءة السيرة الذاتية الكاملة'
  },
  legislativeSectionTitle: {
    en: 'Legislative Work & National Assembly Activities',
    ha: 'Ayyukan Dokoki a Majalisar Tarayya',
    ar: 'العمل التشريعي وأنشطة الجمعية الوطنية'
  },
  legislativeSectionDesc: {
    en: 'Sponsoring high-impact bills, moving motions of urgent public importance, and representing the sovereign interests of Yabo and Shagari.',
    ha: 'Gabatar da kudurori masu muhimmanci ga jama\'a, da wakiltar muradun al\'ummar Yabo da Shagari a zauren majalisa.',
    ar: 'رعاية مشاريع القوانين المؤثرة وتقديم الملتمسات ذات الأهمية الوطنية العاجلة وتمثيل مصالح يابو وشاغاري.'
  },
  viewAllLegislative: {
    en: 'Explore Legislative Tracker',
    ha: 'Duba Jerin Ayyukan Dokoki',
    ar: 'استكشاف سجل التشريعات'
  },
  empowermentSectionTitle: {
    en: 'Constituency Empowerment & Welfare Initiatives',
    ha: 'Shirye-shiryen Tallafi da Karfafa Al\'umma',
    ar: 'مبادرات التمكين والرعاية الاجتماعية في الدائرة'
  },
  empowermentSectionDesc: {
    en: 'Direct grassroots interventions targeting agricultural productivity, youth technical skills, and women micro-enterprise capital.',
    ha: 'Tallafin kai tsaye ga manoma, matasa masu koyon sana\'a, da jari ga mata \'yan kasuwa a mazabunmu.',
    ar: 'تدخلات قاعدية مباشرة تستهدف الإنتاجية الزراعية والمهارات الفنية للشباب ومشاريع المرأة.'
  },
  viewAllEmpowerment: {
    en: 'Explore All Programmes & Apply',
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
    en: 'View Constituency Deliverables',
    ha: 'Duba Ayyukan da aka Bayar',
    ar: 'عرض إنجازات الدائرة'
  },
  contactRep: {
    en: 'Contact Representative',
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
  }
};

export function t(key: string, lang: Language, customTranslations?: Translations): string {
  const dictionary = customTranslations || DEFAULT_TRANSLATIONS;
  if (dictionary[key] && dictionary[key][lang]) {
    return dictionary[key][lang];
  }
  return DEFAULT_TRANSLATIONS[key]?.[lang] || key;
}
