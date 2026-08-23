import type { BankQuestion } from '../types.js';

const SUBJECT = 'hindi-course-a';

type SeedQuestionInput = Omit<BankQuestion, 'subjectSlug' | 'verificationStatus'>;

function q(input: SeedQuestionInput): BankQuestion {
  return { ...input, subjectSlug: SUBJECT, verificationStatus: 'unverified' };
}

/**
 * Curated CBSE Class 10 Hindi Course A (002) Question Bank.
 * Units:
 * 1. unseen-comprehension (14m)
 * 2. grammar (16m)
 * 3. literature (30m)
 * 4. creative-writing (20m)
 * Total: 80 Marks across 34 questions.
 */
export const HINDI_002_SEED: BankQuestion[] = [
  // ── UNIT 1: UNSEEN COMPREHENSION (14 MARKS) ──────────────────────────────
  q({
    bankKey: 'hindi-002-unseen-mcq-1',
    chapterSlug: 'unseen-prose-passages',
    unitId: 'unseen-comprehension',
    topicId: 'unseen-prose-passage-a',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'गद्यांश के अनुसार, किसी भी राष्ट्र की सच्ची उन्नति और पहचान किस बात पर निर्भर करती है?',
        answerKey: {
          options: [
            'केवल भौतिक और आर्थिक संसाधनों के विस्तार पर',
            'नागरिकों के नैतिक मूल्यों, श्रमनिष्ठा और चरित्र निर्माण पर',
            'विदेशी तकनीकों के अंधानुकरण पर',
            'केवल सैन्य शक्ति के विस्तार पर',
          ],
          correctOptionIndex: 1,
          valuePoints: ['[+1.0 Mark] गद्यांश स्पष्ट करता है कि नैतिक मूल्य, श्रमनिष्ठा और चरित्र ही राष्ट्र की वास्तविक आधारशिला हैं।'],
          modelAnswer: 'नागरिकों के नैतिक मूल्यों, श्रमनिष्ठा और चरित्र निर्माण पर',
        },
      },
    ],
  }),
  q({
    bankKey: 'hindi-002-unseen-mcq-2',
    chapterSlug: 'unseen-poetry-passages',
    unitId: 'unseen-comprehension',
    topicId: 'unseen-poetry-passage-a',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'काव्यांश में कवि ने विपत्तियों और संघर्षों के समक्ष मनुष्य को किस प्रकार का दृष्टिकोण अपनाने का संदेश दिया है?',
        answerKey: {
          options: [
            'भाग्य के भरोसे बैठकर पलायन करने का',
            'धैर्य, आत्मबल और कर्मनिष्ठा से जूझने का',
            'दूसरों पर निर्भर होकर सहायता की प्रतीक्षा करने का',
            'क्रोध और अधीरता प्रदर्शित करने का',
          ],
          correctOptionIndex: 1,
          valuePoints: ['[+1.0 Mark] काव्यांश में आत्मबल और अविचल धैर्य से विपत्तियों का सामना करने का भाव निहित है।'],
          modelAnswer: 'धैर्य, आत्मबल और कर्मनिष्ठा से जूझने का',
        },
      },
    ],
  }),
  q({
    bankKey: 'hindi-002-unseen-extract-case-5',
    chapterSlug: 'unseen-prose-passages',
    unitId: 'unseen-comprehension',
    topicId: 'unseen-prose-passage-a',
    questionType: 'case-study',
    marks: 5,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'अपठित गद्यांश को पढ़कर पूछे गए प्रश्नों के सटीक उत्तर दीजिए:\n"प्रकृति और मानव का संबंध आदिकाल से अत्यंत घनिष्ठ रहा है। प्रकृति मानव को जीवनदायिनी ऊर्जा, अन्न-जल और शुद्ध वायु प्रदान करती है। परंतु औद्योगीकरण की अंधी दौड़ और भौतिक सुख-सुविधाओं की लालसा में मनुष्य ने पर्यावरण का अंधाधुंध दोहन किया है। वनों की कटाई, प्रदूषण और ग्लोबल वार्मिंग जैसी चुनौतियाँ आज समूची मानवता के अस्तित्व पर संकट बनकर खड़ी हैं।"\n(i) प्रकृति और मानव के घनिष्ठ संबंध का क्या आधार है? (1 अंक)\n(ii) वर्तमान समय में पर्यावरण पर संकट उत्पन्न होने का मुख्य कारण क्या है? (2 अंक)\n(iii) पर्यावरण संरक्षण हेतु मनुष्य को कौन से दो ठोस कदम उठाने चाहिए? (2 अंक)',
        answerKey: {
          options: [],
          valuePoints: [
            '[+1.0 Mark] (i) प्रकृति मानव को जीवनदायिनी ऊर्जा, पोषण, शुद्ध वायु और जल प्रदान करती है।',
            '[+2.0 Marks] (ii) औद्योगीकरण की अंधी दौड़, वनों की अंधाधुंध कटाई और भौतिक सुख-सुविधाओं की असीमित लालसा।',
            '[+2.0 Marks] (iii) सघन पौधरोपण करना, प्राकृतिक संसाधनों का विवेकपूर्ण उपयोग तथा प्रदूषण नियंत्रण के नियमों का कड़ाई से पालन।',
          ],
          modelAnswer: '(i) जीवनदायिनी ऊर्जा व पोषण; (ii) अनियंत्रित औद्योगीकरण व दोहन; (iii) वृक्षारोपण व विवेकपूर्ण उपभोग।',
        },
      },
    ],
  }),

  // ── UNIT 2: GRAMMAR (16 MARKS) ───────────────────────────────────────────
  q({
    bankKey: 'hindi-002-gram-vakya-mcq-1',
    chapterSlug: 'vakya-bhed',
    unitId: 'grammar',
    topicId: 'grammar-vakya-bhed-a',
    questionType: 'grammar',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: '"जैसे ही सूर्योदय हुआ, वैसे ही पक्षी चहचहाने लगे।" रचना के आधार पर यह वाक्य किस भेद के अंतर्गत आता है?',
        answerKey: {
          options: ['सरल वाक्य', 'संयुक्त वाक्य', 'मिश्र वाक्य', 'विधानवाचक वाक्य'],
          correctOptionIndex: 2,
          valuePoints: ['[+1.0 Mark] \'जैसे ही... वैसे ही\' योजक से जुड़े एक प्रधान व एक आश्रित उपवाक्य के कारण यह मिश्र वाक्य है।'],
          modelAnswer: 'मिश्र वाक्य',
        },
      },
    ],
  }),
  q({
    bankKey: 'hindi-002-gram-vachya-mcq-2',
    chapterSlug: 'vachya',
    unitId: 'grammar',
    topicId: 'grammar-vachya-a',
    questionType: 'grammar',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: '"रोहन पत्र लिखता है।" इस वाक्य का कर्मवाच्य में सही रूपांतरण क्या होगा?',
        answerKey: {
          options: [
            'रोहन द्वारा पत्र लिखा जाता है।',
            'रोहन से पत्र नहीं लिखा गया।',
            'रोहन पत्र लिखने लगा।',
            'रोहन ने पत्र लिख लिया।',
          ],
          correctOptionIndex: 0,
          valuePoints: ['[+1.0 Mark] कर्ता के साथ \'द्वारा\' तथा क्रिया कर्म के लिंग/वचन के अनुसार \'लिखा जाता है\' होगी।'],
          modelAnswer: 'रोहन द्वारा पत्र लिखा जाता है।',
        },
      },
    ],
  }),
  q({
    bankKey: 'hindi-002-gram-pad-mcq-3',
    chapterSlug: 'pad-parichay',
    unitId: 'grammar',
    topicId: 'grammar-pad-parichay-a',
    questionType: 'grammar',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: '"**परिश्रमी** छात्र सदा सफल होते हैं।" रेखांकित पद का सही पद-परिचय चुनिए:',
        answerKey: {
          options: [
            'गुणवाचक विशेषण, पुल्लिंग, बहुवचन, विशेष्य \'छात्र\'',
            'जातिवाचक संज्ञा, पुल्लिंग, एकवचन',
            'सार्वनामिक विशेषण, स्त्रीलिंग, बहुवचन',
            'रीतिवाचक क्रियाविशेषण, एकवचन',
          ],
          correctOptionIndex: 0,
          valuePoints: ['[+1.0 Mark] \'परिश्रमी\' गुणवाचक विशेषण है, जो बहुवचन पुल्लिंग विशेष्य \'छात्र\' की विशेषता बता रहा है।'],
          modelAnswer: 'गुणवाचक विशेषण, पुल्लिंग, बहुवचन, विशेष्य \'छात्र\'',
        },
      },
    ],
  }),
  q({
    bankKey: 'hindi-002-gram-alankar-mcq-4',
    chapterSlug: 'alankar',
    unitId: 'grammar',
    topicId: 'grammar-alankar-a',
    questionType: 'grammar',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: '"सुबरन को खोजत फिरत, कवि, व्यभिचारी, चोर।" इस पंक्ति में कौन-सा अलंकार प्रयुक्त हुआ है?',
        answerKey: {
          options: ['अनुप्रास अलंकार', 'श्लेष अलंकार', 'उत्प्रेक्षा अलंकार', 'अतिशयोक्ति अलंकार'],
          correctOptionIndex: 1,
          valuePoints: ['[+1.0 Mark] \'सुबरन\' शब्द एक बार आया है परंतु कवि (सुंदर अक्षर), व्यभिचारी (सुंदर रूप) और चोर (स्वर्ण) के संदर्भ में तीन भिन्न अर्थ देता है। अतः श्लेष अलंकार है।'],
          modelAnswer: 'श्लेष अलंकार',
        },
      },
    ],
  }),

  // ── UNIT 3: LITERATURE (30 MARKS) ─────────────────────────────────────────
  q({
    bankKey: 'hindi-002-lit-netaji-sa-1',
    chapterSlug: 'netaji-ka-chashma',
    unitId: 'literature',
    topicId: 'hindi-a-netaji-ka-chashma-official-text',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'हालदार साहब हमेशा चौराहे पर रुककर नेताजी की मूर्ति को क्यों देखते थे और कैप्टन की मृत्यु के बाद उन्होंने मूर्ति पर क्या देखकर राहत की साँस ली?',
        answerKey: {
          options: [],
          valuePoints: [
            '[+1.5 Marks] हालदार साहब देशभक्त थे और कैप्टन चश्मेवाले की नेताजी के प्रति अगाध श्रद्धा व देशप्रेम की भावना का सम्मान करते हुए प्रतिदिन मूर्ति का चश्मा बदलते देखते थे।',
            '[+1.5 Marks] कैप्टन की मृत्यु के बाद मूर्ति पर बच्चों द्वारा सरकंडे से बना छोटा चश्मा लगा देखकर उन्हें यह संतोष हुआ कि देश की भावी पीढ़ी में भी देशभक्ति की भावना जीवित है।',
          ],
          modelAnswer: 'हालदार साहब देशभक्ति के सम्मान हेतु मूर्ति देखते थे। बच्चों द्वारा सरकंडे का चश्मा लगाने से उन्हें भावी पीढ़ी में देशभक्ति सुरक्षित होने का विश्वास हुआ।',
        },
      },
    ],
  }),
  q({
    bankKey: 'hindi-002-lit-balgobin-sa-2',
    chapterSlug: 'balgobin-bhagat',
    unitId: 'literature',
    topicId: 'hindi-a-balgobin-bhagat-official-text',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'बालगोबिन भगत गृहस्थ होते हुए भी सच्चे अर्थों में \'साधु\' क्यों कहे जाते थे? उनके आचरण की किन्हीं दो विशेषताओं के आधार पर स्पष्ट कीजिए।',
        answerKey: {
          options: [],
          valuePoints: [
            '[+1.0 Mark] भगत जी कबीर को अपना \'साहब\' मानते थे, उनके आदेशों पर चलते थे और कभी झूठ नहीं बोलते थे।',
            '[+1.0 Mark] वे बिना पूछे किसी की वस्तु नहीं छूते थे और खेत में जो भी उपज होती, उसे पहले कबीरपंथी मठ में भेंट स्वरूप अर्पित करते थे।',
            '[+1.0 Mark] पुत्र की मृत्यु पर रोने के स्थान पर आत्मा का परमात्मा से मिलन मानकर उत्सव मनाने का वैराग्य भाव रखते थे।',
          ],
          modelAnswer: 'सत्यवादिता, निष्काम कर्म, कबीर के प्रति पूर्ण समर्पण और मोह-माया से विरक्ति के कारण वे गृहस्थ साधु थे।',
        },
      },
    ],
  }),
  q({
    bankKey: 'hindi-002-lit-surdas-sa-3',
    chapterSlug: 'pad-surdas',
    unitId: 'literature',
    topicId: 'hindi-a-pad-surdas-official-text',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'गोपियों ने उद्धव के योग संदेश को किन-किन उदाहरणों द्वारा \'कड़वी ककड़ी\' और \'व्याधि\' (रोग) के समान सिद्ध किया?',
        answerKey: {
          options: [],
          valuePoints: [
            '[+1.0 Mark] गोपियों ने उद्धव के शुष्क ज्ञान व योग संदेश को प्रेम मार्ग की तुलना में अरुचिकर व त्याज्य बताते हुए कड़वी ककड़ी जैसा कहा।',
            '[+1.0 Mark] उन्होंने इसे ऐसा असाध्य रोग (व्याधि) बताया जिसे उन्होंने न कभी पहले देखा, न सुना और न भोगा था।',
            '[+1.0 Mark] गोपियों ने कहा कि योग संदेश उन लोगों को दिया जाना चाहिए जिनका मन चंचल और अस्थिर है, उनका मन तो कृष्ण प्रेम में स्थिर है।',
          ],
          modelAnswer: 'योग संदेश को अरुचिकर कड़वी ककड़ी, अपरिचित रोग और चंचल मन वालों के लिए उपयुक्त बताकर अस्वीकार किया।',
        },
      },
    ],
  }),
  q({
    bankKey: 'hindi-002-lit-mata-aanchal-sa-4',
    chapterSlug: 'mata-ka-aanchal',
    unitId: 'literature',
    topicId: 'hindi-a-mata-ka-aanchal-official-text',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'भोलानाथ अपने पिता से अत्यधिक स्नेह और जुड़ाव रखने के बावजूद विपत्ति के समय माँ के आँचल में ही शरण क्यों लेता है?',
        answerKey: {
          options: [],
          valuePoints: [
            '[+1.5 Marks] यद्यपि भोलानाथ अधिकांश समय पिता के साथ खेलता और सोता था, परंतु साँप के भय से अत्यधिक आतंकित होने पर उसे माँ की गोद में ही परम सुरक्षा और शांति का अनुभव हुआ।',
            '[+1.5 Marks] माँ का आँचल ममता, वात्सल्य और सुरक्षा का वह आश्रय स्थल है जहाँ बालक अपने समस्त भय और पीड़ा को भूलकर निश्चिंत हो जाता है।',
          ],
          modelAnswer: 'माँ का आँचल ममतामयी सुरक्षा और आत्मिक शांति का वह परम धाम है जहाँ बालक भयमुक्त हो जाता है।',
        },
      },
    ],
  }),
  q({
    bankKey: 'hindi-002-lit-lakhnavi-la-1',
    chapterSlug: 'lakhnavi-andaz',
    unitId: 'literature',
    topicId: 'hindi-a-lakhnavi-andaz-official-text',
    questionType: 'long-answer',
    marks: 6,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: '\'लखनवी अंदाज़\' पाठ के माध्यम से लेखक यशपाल ने सामंती वर्ग की किस खोखली जीवन-शैली और दिखावे की प्रवृत्ति पर तीखा व्यंग्य किया है? अपने शब्दों में सविस्तार विवेचना कीजिए।',
        answerKey: {
          options: [],
          valuePoints: [
            '[+2.0 Marks] नवाब साहब द्वारा सेकंड क्लास में अकेले यात्रा करना और खीरे को धो-पोंछकर, करीने से काटकर, नमक-मिर्च बुरककर केवल सूंघकर खिड़की से बाहर फेंक देना बनावटी नवाबी नफासत को दर्शाता है।',
            '[+2.0 Marks] लेखक यह स्पष्ट करते हैं कि सामंतवादी व्यवस्था समाप्त हो चुकी है, परंतु उस वर्ग के अवशेष आज भी यथार्थ से आँखें मूंदकर कृत्रिम और दिखावटी जीवन जीने का ढोंग करते हैं।',
            '[+2.0 Marks] यह प्रसंग साहित्य में भी \'बिना विचार, घटना और पात्रों के नई कहानी\' रचने वाले खोखले दावों पर सटीक वैचारिक प्रहार करता है।',
          ],
          modelAnswer: 'नवाब साहब की खीरा-प्रक्रिया सामंती वर्ग के यथार्थविहीन दिखावे, बनावटी नफासत और साहित्य में नई कहानी के खोखलेपन पर व्यंग्य करती है।',
        },
      },
    ],
  }),
  q({
    bankKey: 'hindi-002-lit-ram-parshuram-la-2',
    chapterSlug: 'ram-lakshman-parshuram-samvad',
    unitId: 'literature',
    topicId: 'hindi-a-ram-lakshman-parshuram-samvad-official-text',
    questionType: 'long-answer',
    marks: 6,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: '\'राम-लक्ष्मण-परशुराम संवाद\' प्रसंग में राम के स्वभाव की विनम्रता और लक्ष्मण के तार्किक-तेजस्वी स्वभाव की तुलना करते हुए स्पष्ट कीजिए कि संकट के समय कौन-सा गुण अधिक प्रभावकारी सिद्ध होता है।',
        answerKey: {
          options: [],
          valuePoints: [
            '[+2.0 Marks] श्रीराम का चरित्र अगाध धैर्य, शील, मर्यादा और विनम्रता से परिपूर्ण है; वे परशुराम के भीषण क्रोध को शीतल जल के समान वचनों से शांत करते हैं।',
            '[+2.0 Marks] लक्ष्मण का स्वभाव निडर, वाक्पटु और व्यंग्यपूर्ण है; वे धनुष टूटने को स्वाभाविक घटना मानकर परशुराम के गर्व का तर्कों से खंडन करते हैं।',
            '[+2.0 Marks] जीवन के गंभीर संकटों और विवादों को सुलझाने में श्रीराम जैसी विनम्रता, सहनशीलता और मधुर वाणी ही स्थायी समाधान लाती है।',
          ],
          modelAnswer: 'श्रीराम की विनम्रता व मर्यादा और लक्ष्मण की वाक्पटुता का तुलनात्मक विश्लेषण; संकट में विनम्रता व विवेक ही सर्वाधिक फलदायी होता है।',
        },
      },
    ],
  }),
  q({
    bankKey: 'hindi-002-lit-extract-case-5',
    chapterSlug: 'netaji-ka-chashma',
    unitId: 'literature',
    topicId: 'hindi-a-netaji-ka-chashma-official-text',
    questionType: 'case-study',
    marks: 5,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'पठित गद्यांश को पढ़कर दिए गए प्रश्नों के उत्तर दीजिए:\n"बार-बार सोचते, क्या होगा उस कौम का जो अपने देश की खातिर घर-गृहस्थी-जवानी-जिंदगी सब कुछ होम कर देने वालों पर भी हँसती है और अपने लिए बिकने के मौके ढूँढ़ती है? दुखी हो गए। पंद्रह दिन बाद फिर उसी कस्बे से गुजरे। कस्बे में घुसने से पहले ही ख्याल आया कि कस्बे की हृदयस्थली में सुभाष की प्रतिमा अवश्य ही प्रतिष्ठापित होगी, लेकिन सुभाष की आँखों पर चश्मा नहीं होगा... क्योंकि मास्टर बनाना भूल गया... और कैप्टन मर गया।"\n(i) हालदार साहब किस बात पर अत्यंत दुखी हो गए थे? (1 अंक)\n(ii) "घर-गृहस्थी-जवानी सब कुछ होम कर देने वाले" से क्या अभिप्राय है? (2 अंक)\n(iii) कस्बे में घुसने से पहले हालदार साहब के मन में क्या निराशाजनक विचार आया और क्यों? (2 अंक)',
        answerKey: {
          options: [],
          valuePoints: [
            '[+1.0 Mark] (i) उन स्वार्थी लोगों की संकीर्ण मानसिकता पर जो देश के लिए सर्वस्व न्योछावर करने वाले वीरों का उपहास उड़ाते हैं।',
            '[+2.0 Marks] (ii) देश की स्वाधीनता और संप्रभुता के लिए अपना सुख, परिवार, युवावस्था और प्राण न्योछावर करने वाले सच्चे देशभक्त व क्रांतिकारी।',
            '[+2.0 Marks] (iii) यह विचार आया कि कैप्टन की मृत्यु के बाद अब नेताजी की मूर्ति बिना चश्मे के अधूरी खड़ी होगी, क्योंकि मूर्तिकार चश्मा बनाना भूल गया था।',
          ],
          modelAnswer: '(i) देशद्रोही उपहास पर दुख; (ii) सर्वस्व न्योछावर करने वाले अमर शहीद; (iii) कैप्टन के अभाव में अधूरी मूर्ति का संशय।',
        },
      },
    ],
  }),

  // ── UNIT 4: CREATIVE WRITING (20 MARKS) ───────────────────────────────────
  q({
    bankKey: 'hindi-002-write-anuched-5',
    chapterSlug: 'anuched-lekhan-a',
    unitId: 'creative-writing',
    topicId: 'creative-writing-anuched-a',
    questionType: 'creative-writing',
    marks: 5,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'दिए गए संकेत-बिंदुओं के आधार पर लगभग 100-120 शब्दों में सारगर्भित अनुच्छेद लिखिए:\n**विषय: "डिजिटल भारत और युवा पीढ़ी"**\nसंकेत बिंदु:\n• डिजिटल क्रांति का स्वरूप\n• शिक्षा और कौशल विकास में उपयोग\n• साइबर सुरक्षा एवं संयमित उपयोग\n• निष्कर्ष व संदेश',
        answerKey: {
          options: [],
          valuePoints: [
            '[+1.0 Mark] विषय-वस्तु की स्पष्टता, भूमिका एवं संकेत बिंदुओं का संतुलित समावेश।',
            '[+2.0 Marks] भाषा-शैली की शुद्धता, प्रवाह, प्रासंगिक शब्दावली एवं तार्किक विचार।',
            '[+1.0 Mark] डिजिटल युग के लाभों एवं खतरों का यथार्थपरक विश्लेषण।',
            '[+1.0 Mark] प्रभावी निष्कर्ष, भविष्योन्मुखी दृष्टिकोण एवं निर्धारित शब्द-सीमा का पालन।',
          ],
          modelAnswer: 'भूमिका, संकेत बिंदुओं पर क्रमबद्ध विचार, शुद्ध व परिमार्जित भाषा में संतुलित अनुच्छेद।',
        },
      },
    ],
  }),
  q({
    bankKey: 'hindi-002-write-patra-5',
    chapterSlug: 'patra-lekhan-a',
    unitId: 'creative-writing',
    topicId: 'creative-writing-patra-a',
    questionType: 'creative-writing',
    marks: 5,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'अपने क्षेत्र में नियमित रूप से हो रही अनियंत्रित विद्युत कटौती की समस्या की ओर ध्यान आकर्षित करते हुए विद्युत वितरण निगम के मुख्य अभियंता को लगभग 100 शब्दों में औपचारिक शिकायती पत्र लिखिए।',
        answerKey: {
          options: [],
          valuePoints: [
            '[+1.0 Mark] पत्र का औपचारिक प्रारूप: प्रेषक का पता, दिनांक, सेवा में पदनाम/कार्यालय का पता, सटीक विषय।',
            '[+2.0 Marks] मुख्य विषय-वस्तु: परीक्षा के समय विद्यार्थियों की पढ़ाई में बाधा, पेयजल आपूर्ति पर असर, सुरक्षा की चिंता।',
            '[+1.0 Mark] शिष्टाचारपूर्ण भाषा, समाधान का स्पष्ट व विनम्र अनुरोध।',
            '[+1.0 Mark] पत्र का औपचारिक समापन: भवदीय/हस्ताक्षर/नाम।',
          ],
          modelAnswer: 'मानक औपचारिक पत्र प्रारूप, समस्या का तार्किक विवरण एवं समाधान की प्रार्थना।',
        },
      },
    ],
  }),
  q({
    bankKey: 'hindi-002-write-email-5',
    chapterSlug: 'swavritt-email-lekhan-a',
    unitId: 'creative-writing',
    topicId: 'creative-writing-swavritt-email-a',
    questionType: 'creative-writing',
    marks: 5,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'विद्यालय में आयोजित होने वाले अंतर-विद्यालयी वाद-विवाद प्रतियोगिता में मुख्य अतिथि के रूप में पधारने हेतु नगर के प्रसिद्ध शिक्षाविद् को लगभग 80-100 शब्दों में औपचारिक ई-मेल (E-mail) लिखिए।',
        answerKey: {
          options: [],
          valuePoints: [
            '[+1.0 Mark] मानक ई-मेल प्रारूप: To (ई-मेल आईडी), Subject (स्पष्ट व संक्षिप्त विषय)।',
            '[+2.0 Marks] विषय-वस्तु: कार्यक्रम का उद्देश्य, दिनांक, समय, स्थान तथा मुख्य अतिथि के रूप में आमंत्रण का आदरपूर्ण विवरण।',
            '[+1.0 Mark] गरिमामयी, शिष्ट और प्रभावशाली भाषा-शैली।',
            '[+1.0 Mark] समापन, धन्यवाद, प्रेषक का नाम व पदनाम।',
          ],
          modelAnswer: 'शुद्ध ई-मेल फॉर्मेट, सम्मानजनक आमंत्रण एवं कार्यक्रम की स्पष्ट सूचना।',
        },
      },
    ],
  }),
  q({
    bankKey: 'hindi-002-write-vigyapan-5',
    chapterSlug: 'vigyapan-sandesh-lekhan-a',
    unitId: 'creative-writing',
    topicId: 'creative-writing-vigyapan-sandesh-a',
    questionType: 'creative-writing',
    marks: 5,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'स्वदेशी खादी वस्त्रों की प्रदर्शनी एवं बिक्री को बढ़ावा देने हेतु लगभग 50 शब्दों में एक आकर्षक एवं सुरुचिपूर्ण विज्ञापन तैयार कीजिए।',
        answerKey: {
          options: [],
          valuePoints: [
            '[+1.0 Mark] सुस्पष्ट एवं कलात्मक बॉक्स/सीमा रेखा (Border) में प्रस्तुति।',
            '[+1.5 Marks] आकर्षक शीर्षक, प्रेरक स्लोगन (उदा. \'खादी पहनो, देश गढ़ो\') तथा मुख्य विशेषताओं का बिंदुवार उल्लेख (100% शुद्ध सूत, विशेष छूट)।',
            '[+1.5 Marks] आकर्षक व संक्षिप्त भाषा, चित्रों/प्रतीकों का सांकेतिक प्रयोग।',
            '[+1.0 Mark] संपर्क विवरण, प्रदर्शनी का स्थान, दिनांक व समय।',
          ],
          modelAnswer: 'सुंदर बॉर्डर, प्रेरक नारा, खादी की विशेषताएं, छूट व संपर्क विवरण सहित विज्ञापन।',
        },
      },
    ],
  }),
];
