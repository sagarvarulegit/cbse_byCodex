import type { BankQuestion } from '../types.js';

const SUBJECT = 'hindi-course-b';

type SeedQuestionInput = Omit<BankQuestion, 'subjectSlug' | 'verificationStatus'>;

function q(input: SeedQuestionInput): BankQuestion {
  return { ...input, subjectSlug: SUBJECT, verificationStatus: 'unverified' };
}

/**
 * Curated CBSE Class 10 Hindi Course B (085) Question Bank.
 * Units:
 * 1. unseen-comprehension (14m)
 * 2. grammar (16m)
 * 3. literature (28m)
 * 4. creative-writing (22m)
 * Total: 80 Marks across 34 questions.
 */
export const HINDI_085_SEED: BankQuestion[] = [
  // ── UNIT 1: UNSEEN COMPREHENSION (14 MARKS) ──────────────────────────────
  q({
    bankKey: 'hindi-085-unseen-mcq-1',
    chapterSlug: 'unseen-prose-passages',
    unitId: 'unseen-comprehension',
    topicId: 'unseen-prose-comprehension-analysis',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'गद्यांश के अनुसार, कर्मयोगी मनुष्य का प्रमुख लक्षण क्या है?',
        answerKey: {
          options: [
            'विपत्तियों को देखकर भयभीत होकर रुक जाना',
            'फल की अत्यधिक चिंता किए बिना निरंतर कर्तव्य पथ पर अग्रसर रहना',
            'केवल अपने व्यक्तिगत स्वार्थों की सिद्धि करना',
            'दूसरों के परिश्रम पर निर्भर रहना',
          ],
          correctOptionIndex: 1,
          valuePoints: ['[+1.0 Mark] कर्मयोगी निष्काम भाव से निरंतर कर्तव्य पथ पर दृढ़ रहता है।'],
          modelAnswer: 'फल की अत्यधिक चिंता किए बिना निरंतर कर्तव्य पथ पर अग्रसर रहना',
        },
      },
    ],
  }),
  q({
    bankKey: 'hindi-085-unseen-extract-case-5',
    chapterSlug: 'unseen-prose-passages',
    unitId: 'unseen-comprehension',
    topicId: 'unseen-prose-comprehension-analysis',
    questionType: 'case-study',
    marks: 5,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'अपठित गद्यांश को पढ़कर पूछे गए प्रश्नों के उत्तर दीजिए:\n"आत्मविश्वास मनुष्य की वह आंतरिक शक्ति है जो कठिन से कठिन परिस्थिति में भी उसे पराजित नहीं होने देती। जिस व्यक्ति के पास आत्मविश्वास है, वह असंभव को भी संभव बना लेता है। इसके विपरीत, हीनभावना और संशय से ग्रस्त व्यक्ति सब साधन होते हुए भी असफल रहता है। जीवन में सफलता प्राप्त करने के लिए आत्म-अवलोकन और सकारात्मक सोच अनिवार्य है।"\n(i) आत्मविश्वास को मनुष्य की आंतरिक शक्ति क्यों कहा गया है? (1 अंक)\n(ii) साधन संपन्न होने पर भी व्यक्ति कब असफल हो जाता है? (2 अंक)\n(iii) जीवन में निरंतर सफलता हेतु किन दो तत्वों को आवश्यक बताया गया है? (2 अंक)',
        answerKey: {
          options: [],
          valuePoints: [
            '[+1.0 Mark] (i) क्योंकि यह विपत्ति और संकट में भी मनुष्य को अविचल रखकर आगे बढ़ने का संबल देती है।',
            '[+2.0 Marks] (ii) जब व्यक्ति के मन में हीनभावना, संशय और आत्मविश्वास का अभाव हो जाता है।',
            '[+2.0 Marks] (iii) आत्म-अवलोकन (स्वयं की क्षमताओं का सही आकलन) और सकारात्मक दृष्टिकोण।',
          ],
          modelAnswer: '(i) आंतरिक संबल प्रदान करने के कारण; (ii) हीनभावना व संशय के कारण; (iii) आत्म-अवलोकन व सकारात्मक सोच।',
        },
      },
    ],
  }),

  // ── UNIT 2: GRAMMAR (16 MARKS) ───────────────────────────────────────────
  q({
    bankKey: 'hindi-085-gram-padbandh-mcq-1',
    chapterSlug: 'padbandh',
    unitId: 'grammar',
    topicId: 'grammar-padbandh',
    questionType: 'grammar',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: '"**दशरथ पुत्र राम** ने रावण का वध किया।" रेखांकित पदबंध का सही भेद क्या है?',
        answerKey: {
          options: ['संज्ञा पदबंध', 'विशेषण पदबंध', 'क्रिया पदबंध', 'क्रियाविशेषण पदबंध'],
          correctOptionIndex: 0,
          valuePoints: ['[+1.0 Mark] शीर्ष पद \'राम\' (संज्ञा) होने के कारण यह संज्ञा पदबंध है।'],
          modelAnswer: 'संज्ञा पदबंध',
        },
      },
    ],
  }),
  q({
    bankKey: 'hindi-085-gram-vakya-mcq-2',
    chapterSlug: 'vakya-rupantaran',
    unitId: 'grammar',
    topicId: 'grammar-vakya-rupantaran',
    questionType: 'grammar',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: '"सूर्योदय होने पर कुहासा छंट गया।" इस सरल वाक्य का संयुक्त वाक्य में सही रूपांतरण क्या होगा?',
        answerKey: {
          options: [
            'जैसे ही सूर्योदय हुआ, वैसे ही कुहासा छंट गया।',
            'सूर्योदय हुआ और कुहासा छंट गया।',
            'जब सूर्योदय हुआ तब कुहासा छंट गया।',
            'सूर्योदय के साथ ही कुहासा छंटने लगा।',
          ],
          correctOptionIndex: 1,
          valuePoints: ['[+1.0 Mark] समानाधिकरण समुच्चयबोधक \'और\' द्वारा जुड़े दो स्वतंत्र उपवाक्यों के कारण यह संयुक्त वाक्य है।'],
          modelAnswer: 'सूर्योदय हुआ और कुहासा छंट गया।',
        },
      },
    ],
  }),
  q({
    bankKey: 'hindi-085-gram-samas-mcq-3',
    chapterSlug: 'samaas',
    unitId: 'grammar',
    topicId: 'grammar-samaas',
    questionType: 'grammar',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: '\'नीलकंठ\' (नीला है कंठ जिसका अर्थात् शिव) में कौन-सा समास है?',
        answerKey: {
          options: ['कर्मधारय समास', 'द्विगु समास', 'बहुव्रीहि समास', 'तत्पुरुष समास'],
          correctOptionIndex: 2,
          valuePoints: ['[+1.0 Mark] दोनों पद मिलकर किसी तीसरे विशेष पद (भगवान शिव) की ओर संकेत करते हैं, अतः बहुव्रीहि समास है।'],
          modelAnswer: 'बहुव्रीहि समास',
        },
      },
    ],
  }),
  q({
    bankKey: 'hindi-085-gram-muhavare-mcq-4',
    chapterSlug: 'muhavare',
    unitId: 'grammar',
    topicId: 'grammar-muhavare',
    questionType: 'grammar',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: '"अत्यंत कठिन परिश्रम करना" अर्थ के लिए उपयुक्त मुहावरा चुनिए:',
        answerKey: {
          options: [
            'दाँतों तले उँगली दबाना',
            'खून-पसीना एक करना',
            'अंगारे उगलना',
            'गागर में सागर भरना',
          ],
          correctOptionIndex: 1,
          valuePoints: ['[+1.0 Mark] \'खून-पसीना एक करना\' का अर्थ अत्यधिक कठोर श्रम करना होता है।'],
          modelAnswer: 'खून-पसीना एक करना',
        },
      },
    ],
  }),

  // ── UNIT 3: LITERATURE (28 MARKS) ─────────────────────────────────────────
  q({
    bankKey: 'hindi-085-lit-bade-bhai-sa-1',
    chapterSlug: 'bade-bhai-sahab',
    unitId: 'literature',
    topicId: 'hindi-bade-bhai-sahab-official-text',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'बड़े भाई साहब छोटे भाई को क्या सलाह देते थे और उनके स्वयं के बार-बार अनुत्तीर्ण होने पर भी उनका बड़प्पन कैसे बना रहता था?',
        answerKey: {
          options: [],
          valuePoints: [
            '[+1.5 Marks] बड़े भाई साहब छोटे भाई को खेलकूद छोड़कर एकाग्रचित्त होकर पढ़ाई करने और घमंड न करने की सीख देते थे।',
            '[+1.5 Marks] उम्र में बड़े होने, पारिवारिक दायित्व का बोध रखने और अनुभव की श्रेष्ठता के कारण वे छोटे भाई के नैतिक संरक्षक बने रहते थे।',
          ],
          modelAnswer: 'अध्ययनशीलता और निरहंकार की सीख देते थे; उम्र व अनुभव की वरिष्ठता से उनका बड़प्पन अक्षुण्ण रहता था।',
        },
      },
    ],
  }),
  q({
    bankKey: 'hindi-085-lit-tantara-sa-2',
    chapterSlug: 'tantara-vamiro-katha',
    unitId: 'literature',
    topicId: 'hindi-tantara-vamiro-katha-official-text',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: '\'तताँरा-वामीरो कथा\' समाज की किस रूढ़िवादी परंपरा पर प्रहार करती है और तताँरा-वामीरो के आत्मोत्सर्ग से द्वीप में क्या क्रांतिकारी परिवर्तन आया?',
        answerKey: {
          options: [],
          valuePoints: [
            '[+1.5 Marks] यह कथा एक गाँव के युवक का दूसरे गाँव की युवती से विवाह न होने देने की संकीर्ण रूढ़िवादी प्रथा पर प्रहार करती है।',
            '[+1.5 Marks] दोनों के आत्मोत्सर्ग ने रूढ़ियों को तोड़ दिया और बाद में निकोबार के सभी गाँवों में आपस में वैवाहिक संबंध स्थापित होने लगे।',
          ],
          modelAnswer: 'विवाह की संकीर्ण गाँव-सीमा प्रथा का अंत हुआ और आपसी वैवाहिक रिश्ते शुरू हुए।',
        },
      },
    ],
  }),
  q({
    bankKey: 'hindi-085-lit-sakhi-sa-3',
    chapterSlug: 'sakhiyaan',
    unitId: 'literature',
    topicId: 'hindi-sakhiyaan-official-text',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'कबीरदास जी के अनुसार "मीठी वाणी बोलने से औरों को सुख और अपने तन को शीतलता" कैसे प्राप्त होती है?',
        answerKey: {
          options: [],
          valuePoints: [
            '[+1.5 Marks] अहंकार त्यागकर मधुर वाणी बोलने से श्रोता का हृदय प्रसन्न होता है, कटुता समाप्त होती है और आपसी प्रेम बढ़ता है।',
            '[+1.5 Marks] वक्ता के मन से क्रोध, ईर्ष्या और उत्तेजना शांत होती है जिससे उसके अपने शरीर व अंतःकरण को आत्मिक शांति प्राप्त होती है।',
          ],
          modelAnswer: 'अहंकाररहित मधुर वाणी श्रोता को आनंद और वक्ता के मन को क्रोधमुक्त शांति देती है।',
        },
      },
    ],
  }),
  q({
    bankKey: 'hindi-085-lit-harihar-kaka-sa-4',
    chapterSlug: 'harihar-kaka',
    unitId: 'literature',
    topicId: 'hindi-harihar-kaka-official-text',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'हरिहर काका को अपने सगे भाइयों और महंत दोनों से किस प्रकार का कटु अनुभव हुआ? इसने समाज के किस गिरते मूल्य को उजागर किया?',
        answerKey: {
          options: [],
          valuePoints: [
            '[+1.5 Marks] सगे भाइयों और मंदिर के महंत दोनों ने ही हरिहर काका की 15 बीघे ज़मीन हड़पने के लिए उनके साथ छल, कपट, हिंसा और प्रलोभन का खेल खेला।',
            '[+1.5 Marks] इसने आधुनिक समाज में स्वार्थ, लालच और संपत्ति के आगे पारिवारिक रिश्तों एवं धार्मिक संस्थाओं के नैतिक पतन को उजागर किया।',
          ],
          modelAnswer: 'ज़मीन के लालच में पारिवारिक रिश्तों और धर्म के नाम पर स्वार्थ व क्रूरता का यथार्थ सामने आया।',
        },
      },
    ],
  }),
  q({
    bankKey: 'hindi-085-lit-manushyata-la-1',
    chapterSlug: 'manushyata',
    unitId: 'literature',
    topicId: 'hindi-manushyata-official-text',
    questionType: 'long-answer',
    marks: 6,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: '\'मनुष्यता\' कविता में कवि मैथिलीशरण गुप्त ने किन पौराणिक महापुरुषों (दधीचि, कर्ण, रंतिदेव, उशीनर) के उदाहरण देकर सच्ची मानवता और परोपकार का संदेश दिया है? सविस्तार स्पष्ट कीजिए।',
        answerKey: {
          options: [],
          valuePoints: [
            '[+2.0 Marks] महर्षि दधीचि ने देवताओं की रक्षा हेतु अपनी अस्थियों का दान दिया और कर्ण ने कवच-कुंडल दान कर अद्वितीय त्याग दर्शाया।',
            '[+2.0 Marks] भूख से व्याकुल राजा रंतिदेव ने अपना भोजन याचक को दे दिया और राजा उशीनर (शिबि) ने कबूतर की रक्षा हेतु अपने शरीर का मांस दे दिया।',
            '[+2.0 Marks] कवि संदेश देते हैं कि नश्वर देह की चिंता किए बिना परोपकार, उदारता और विश्व-बंधुत्व की भावना से जीना ही सच्ची मनुष्यता है।',
          ],
          modelAnswer: 'दधीचि, कर्ण, रंतिदेव और शिबि के त्याग के माध्यम से परोपकार व विश्व-बंधुत्व को ही सच्ची मानवता निरूपित किया गया है।',
        },
      },
    ],
  }),
  q({
    bankKey: 'hindi-085-lit-ab-kahan-la-2',
    chapterSlug: 'ab-kahan-doosron-ke-dukh-se-dukhi-hone-wale',
    unitId: 'literature',
    topicId: 'hindi-ab-kahan-doosron-ke-dukh-se-dukhi-hone-wale-official-text',
    questionType: 'long-answer',
    marks: 6,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: '\'अब कहाँ दूसरे के दुख से दुखी होने वाले\' पाठ में लेखक ने पर्यावरण असंतुलन और मनुष्य की स्वार्थी संवेदनहीनता का जो चित्रण किया है, वर्तमान संदर्भ में उसकी प्रासंगिकता स्पष्ट कीजिए।',
        answerKey: {
          options: [],
          valuePoints: [
            '[+2.0 Marks] मनुष्य ने अपनी बस्तियाँ बसाने के लिए समुद्र को पीछे धकेला, वनों को उजाड़ा और बेजुबान पशु-पक्षियों के आशियाने छीन लिए।',
            '[+2.0 Marks] प्रकृति के इस असंतुलन का दुष्परिणाम आज बेमौसम वर्षा, चक्रवात, अत्यधिक गर्मी और प्राकृतिक आपदाओं के रूप में भुगतना पड़ रहा है।',
            '[+2.0 Marks] शेख अयाज़ और नूह जैसे संवेदनशीलों की भांति सभी जीवों के प्रति करुणा और सह-अस्तित्व का भाव अपनाना आज परमावश्यक है।',
          ],
          modelAnswer: 'मनुष्य के स्वार्थी दोहन से प्रकृति का विनाश और आपदाओं का संकट; जीवों के प्रति सह-अस्तित्व व करुणा की अनिवार्य प्रासंगिकता।',
        },
      },
    ],
  }),
  q({
    bankKey: 'hindi-085-lit-extract-case-5',
    chapterSlug: 'bade-bhai-sahab',
    unitId: 'literature',
    topicId: 'hindi-bade-bhai-sahab-official-text',
    questionType: 'case-study',
    marks: 5,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'पठित गद्यांश को पढ़कर पूछे गए प्रश्नों के उत्तर दीजिए:\n"मेरे भाई साहब मुझसे पाँच साल बड़े थे, लेकिन केवल तीन दरजे आगे। उन्होंने भी उसी उम्र में पढ़ना शुरू किया था जब मैंने शुरू किया था; लेकिन तालीम जैसे महत्त्व के मामले में वह जल्दबाजी से काम लेना पसंद न करते थे। इस भवन की बुनियाद खूब मजबूत डालना चाहते थे, जिस पर एक आलीशान महल बन सके। एक साल का काम दो साल में करते थे। कभी-कभी तीन साल भी लग जाते थे। बुनियाद ही पुख्ता न हो, तो मकान पायेदार कैसे बने?"\n(i) लेखक के भाई साहब लेखक से कितने साल बड़े थे और पढ़ाई में कितने दर्जे आगे थे? (1 अंक)\n(ii) "तालीम जैसे महत्त्व के मामले में वह जल्दबाजी पसंद न करते थे" - इस पंक्ति में क्या व्यंग्य छिपा है? (2 अंक)\n(iii) भाई साहब द्वारा बुनियाद मजबूत करने का क्या परिणाम निकलता था? (2 अंक)',
        answerKey: {
          options: [],
          valuePoints: [
            '[+1.0 Mark] (i) भाई साहब उम्र में 5 साल बड़े थे परंतु कक्षा में केवल 3 दर्जे आगे थे।',
            '[+2.0 Marks] (ii) इसमें भाई साहब के बार-बार फेल होने पर भी स्वयं को सही ठहराने और अपनी विफलता पर पर्दा डालने का हास्य-व्यंग्य छिपा है।',
            '[+2.0 Marks] (iii) परिणाम यह होता था कि वे एक ही कक्षा में दो या तीन साल तक अटके रहते थे।',
          ],
          modelAnswer: '(i) 5 वर्ष बड़े, 3 दर्जे आगे; (ii) बार-बार अनुत्तीर्ण होने पर दार्शनिक तर्क का व्यंग्य; (iii) एक ही कक्षा में कई वर्षों तक रुकना।',
        },
      },
    ],
  }),

  // ── UNIT 4: CREATIVE WRITING (22 MARKS) ───────────────────────────────────
  q({
    bankKey: 'hindi-085-write-anuched-5',
    chapterSlug: 'anucched-lekhan',
    unitId: 'creative-writing',
    topicId: 'creative-writing-anucched',
    questionType: 'creative-writing',
    marks: 5,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'दिए गए संकेत-बिंदुओं के आधार पर लगभग 100-120 शब्दों में अनुच्छेद लिखिए:\n**विषय: "समय नियोजन: सफलता की कुंजी"**\nसंकेत बिंदु:\n• समय का महत्व\n• अनुशासन और समय सारणी\n• समय की बर्बादी के दुष्परिणाम\n• निष्कर्ष व सीख',
        answerKey: {
          options: [],
          valuePoints: [
            '[+1.0 Mark] भूमिका, विषय प्रवेश एवं समय की अमूल्यता का प्रतिपादन।',
            '[+2.0 Marks] संकेत बिंदुओं का समुचित विकास, सटीक उदाहरण एवं भाषा प्रवाह।',
            '[+1.0 Mark] दैनिक जीवन में समय प्रबंधन का महत्व व अनुशासनात्मक दृष्टिकोण।',
            '[+1.0 Mark] सारगर्भित निष्कर्ष एवं शुद्ध वर्तनी।',
          ],
          modelAnswer: 'समय की महत्ता, समय-सारणी का पालन और अनुशासन पर विचारपरक अनुच्छेद।',
        },
      },
    ],
  }),
  q({
    bankKey: 'hindi-085-write-patra-5',
    chapterSlug: 'patra-lekhan',
    unitId: 'creative-writing',
    topicId: 'creative-writing-formal-letter',
    questionType: 'creative-writing',
    marks: 5,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'नगर निगम के स्वास्थ्य अधिकारी को अपने मोहल्ले में व्याप्त गंदगी और नालियों के जाम होने से मच्छरों के बढ़ते प्रकोप की शिकायत करते हुए लगभग 100 शब्दों में औपचारिक पत्र लिखिए।',
        answerKey: {
          options: [],
          valuePoints: [
            '[+1.0 Mark] औपचारिक पत्र प्रारूप: प्रेषक, दिनांक, सेवा में, स्वास्थ्य अधिकारी का पता, विषय।',
            '[+2.0 Marks] समस्या का यथार्थ विवरण: जलजमाव, दुर्गंध, डेंगू/मलेरिया का भय, सफाई कर्मचारियों की अनुपस्थिति।',
            '[+1.0 Mark] त्वरित छिड़काव व सफाई हेतु विनम्र आग्रह।',
            '[+1.0 Mark] शिष्ट समापन, भवदीय, हस्ताक्षर व नाम।',
          ],
          modelAnswer: 'मानक शिकायती पत्र प्रारूप, स्वच्छता की मांग एवं उचित समापन।',
        },
      },
    ],
  }),
  q({
    bankKey: 'hindi-085-write-suchna-5',
    chapterSlug: 'soochna-lekhan',
    unitId: 'creative-writing',
    topicId: 'creative-writing-notice',
    questionType: 'creative-writing',
    marks: 5,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'आप अपने विद्यालय के सांस्कृतिक सचिव हैं। विद्यालय में आगामी सप्ताह आयोजित होने वाले \'वार्षिक नाट्य उत्सव\' में भाग लेने हेतु इच्छुक विद्यार्थियों के लिए लगभग 50 शब्दों में सूचना तैयार कीजिए।',
        answerKey: {
          options: [],
          valuePoints: [
            '[+1.0 Mark] स्पष्ट बॉक्स में संस्था का नाम, \'सूचना\' शीर्षक एवं दिनांक।',
            '[+2.5 Marks] मुख्य विवरण: नाट्य उत्सव का विषय, दिनांक, समय, स्थान, ऑडिशन की तिथि व अंतिम पंजीकरण समय।',
            '[+1.5 Marks] संपर्क सूत्र, प्रेषक का नाम व पदनाम (सांस्कृतिक सचिव)।',
          ],
          modelAnswer: 'बॉक्स में विद्यालय का नाम, स्पष्ट सूचना, ऑडिशन विवरण व सचिव का पदनाम।',
        },
      },
    ],
  }),
  q({
    bankKey: 'hindi-085-write-vigyapan-5',
    chapterSlug: 'vigyapan-lekhan',
    unitId: 'creative-writing',
    topicId: 'creative-writing-advertisement',
    questionType: 'creative-writing',
    marks: 5,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'सड़क सुरक्षा और हेलमेट पहनने के प्रति जागरूकता फैलाने हेतु यातायात पुलिस की ओर से लगभग 50 शब्दों में एक प्रभावशाली विज्ञापन तैयार कीजिए।',
        answerKey: {
          options: [],
          valuePoints: [
            '[+1.0 Mark] आकर्षक बॉर्डर, प्रेरक शीर्षक (उदा. \'सावधानी हटी, दुर्घटना घटी\')।',
            '[+2.0 Marks] महत्वपूर्ण नियम: ISI मार्का हेलमेट का प्रयोग, गति सीमा का पालन, नशे में वाहन न चलाना।',
            '[+1.0 Mark] प्रभावी स्लोगन (उदा. \'सुरक्षित चलिए, सपरिवार घर पहुंचिए\')।',
            '[+1.0 Mark] जारीकर्ता: यातायात पुलिस विभाग।',
          ],
          modelAnswer: 'आकर्षक विज्ञापन, सड़क सुरक्षा नियम, स्लोगन व जारीकर्ता विवरण।',
        },
      },
    ],
  }),
];
