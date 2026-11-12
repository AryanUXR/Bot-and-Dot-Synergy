export interface Persona {
  id: string;
  name: string;
  fullName: string;
  location: string;
  locationColor: string;
  gradientCSS: string;
  traits: string[];
  about: string[];
  questions: { hindi: string[] };
  defaultQuestionLang: "hindi";
  dropdownLabel: string;
  experience: string;
  featured?: boolean;
  imagePosition?: string;
}

export const personas: Persona[] = [
  {
    id: "aman-son",
    name: "Aman",
    fullName: "Aman S.",
    location: "THE SON",
    locationColor: "#C99700",
    gradientCSS: "linear-gradient(135deg, #1F2937 0%, #C99700 100%)",
    featured: true,
    imagePosition: "30% 20%",
    traits: ["19, passed Class 12 last year", "Fixes neighbours' wiring and fans, but has no certificate", "Wants a short course that leads to a job", "Hasn't heard of the free government training schemes"],
    about: ["Aman is 19 and lives with his family in Alambagh. He passed Class 12 last year.", "He already fixes wiring and fans for neighbours, but without a certificate no company will hire him as an electrician.", "He calls Parivar Saathi to find a short course near home that leads to a real job."],
    questions: {"hindi": ["बारहवीं के बाद कौन सा कोर्स करूँ जिससे जल्दी नौकरी मिले?", "इलेक्ट्रीशियन का कोर्स कहाँ होता है?", "फ़्री में ट्रेनिंग मिलती है क्या?"]},
    defaultQuestionLang: "hindi",
    dropdownLabel: "Aman S. · The son (Course that leads to a job)",
    experience: "Aman wants a course that gets him hired. Parivar Saathi will find training centres near Alambagh and explain the free schemes.",
  },
  {
    id: "priya-daughter",
    name: "Priya",
    fullName: "Priya S.",
    location: "THE DAUGHTER",
    locationColor: "#2F6FD6",
    gradientCSS: "linear-gradient(135deg, #1F2937 0%, #2F6FD6 100%)",
    imagePosition: "60% 20%",
    traits: ["24, B.Com graduate, knows Tally and Excel", "Has been tutoring children at home for two years", "Wants an accounts job within a safe commute", "Keeps seeing jobs that ask for experience she can't get"],
    about: ["Priya is 24 and finished her B.Com two years ago. She knows Tally and Excel and tutors children at home.", "She wants an accounts job that uses her degree, close enough to travel safely every day.", "She calls Parivar Saathi to find openings near Alambagh that take freshers."],
    questions: {"hindi": ["अकाउंट्स की नौकरी आसपास कहाँ मिलेगी?", "पहली नौकरी के लिए कहाँ अप्लाई करूँ?", "लड़कियों के लिए कोई सुरक्षित ऑफ़िस है पास में?"]},
    defaultQuestionLang: "hindi",
    dropdownLabel: "Priya S. · The daughter (Accounts job)",
    experience: "Priya wants a job that uses her degree. Parivar Saathi will find accounts and office openings near home that take freshers.",
  },
  {
    id: "rakesh-father",
    name: "Rakesh",
    fullName: "Rakesh S.",
    location: "THE FATHER",
    locationColor: "#8B5A2B",
    gradientCSS: "linear-gradient(135deg, #1F2937 0%, #8B5A2B 100%)",
    imagePosition: "25% 20%",
    traits: ["50, runs a sweet shop in Alambagh with two workers", "Wants to sell boxed sweets to offices and shops", "Needs a packaging supplier, a food licence and a small loan", "Does his accounts in a notebook"],
    about: ["Rakesh is 50 and has run a sweet shop in Alambagh for twenty years, with two workers.", "He wants to sell boxed sweets to offices, but needs cheaper boxes, a food licence and a small loan to do it.", "He calls Parivar Saathi to find suppliers, licence help and a bank nearby."],
    questions: {"hindi": ["मिठाई के डिब्बे सस्ते कहाँ मिलेंगे?", "दुकान बढ़ाने के लिए लोन कैसे मिलेगा?", "फ़ूड लाइसेंस कहाँ बनता है?"]},
    defaultQuestionLang: "hindi",
    dropdownLabel: "Rakesh S. · The father (Grow his shop)",
    experience: "Rakesh wants to grow his sweet shop. Parivar Saathi will find packaging, licence help and a loan desk near Alambagh.",
  },
  {
    id: "sunita-mother",
    name: "Sunita",
    fullName: "Sunita S.",
    location: "THE MOTHER",
    locationColor: "#A8790F",
    gradientCSS: "linear-gradient(135deg, #1F2937 0%, #A8790F 100%)",
    imagePosition: "25% 20%",
    traits: ["46, in a 10-woman chikan embroidery self-help group", "The group wants a loan for two more machines", "Has heard of a scheme for groups but not where to apply", "Wants buyers beyond the local market"],
    about: ["Sunita is 46 and belongs to a self-help group of ten women who do chikan embroidery.", "The group wants a loan for two more machines and buyers beyond the local market, but doesn't know where to apply.", "She calls Parivar Saathi to find the group loan, the scheme desk and new buyers."],
    questions: {"hindi": ["हमारे समूह को लोन कैसे मिलेगा?", "चिकनकारी के लिए खरीदार कहाँ मिलेंगे?", "समूह की योजना कहाँ अप्लाई होती है?"]},
    defaultQuestionLang: "hindi",
    dropdownLabel: "Sunita S. · The mother (Scheme for her SHG)",
    experience: "Sunita's group needs a loan and buyers. Parivar Saathi will find the SHG bank counter, the scheme desk and buyers in Lucknow.",
  },
];
