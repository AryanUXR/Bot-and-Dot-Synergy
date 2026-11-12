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
    id: "rekha-citizen",
    name: "Rekha",
    fullName: "Rekha D.",
    location: "THE CITIZEN",
    locationColor: "#5E4306",
    gradientCSS: "linear-gradient(135deg, #5E4306 0%, #A8790F 100%)",
    featured: true,
    imagePosition: "30% 20%",
    traits: [
      "44, sells vegetables at the haat in Phulwari Sharif",
      "Keeps hearing about health cards and pensions on the radio",
      "Doesn't know which ones her family qualifies for",
      "Doesn't know who will fill the forms without charging her",
    ],
    about: [
      "Rekha is 44 and sells vegetables at the haat near her home in Phulwari Sharif.",
      "She has heard of free hospital treatment cards and a scheme for informal workers. She doesn't know which ones her family can get, what papers she needs, or where to apply without paying an agent.",
      "She calls Sahayika to find out what she may be eligible for, which documents to carry, and who nearby can help her apply.",
    ],
    questions: {
      hindi: [
        "मुझे कौन सी सरकारी योजनाएँ मिल सकती हैं?",
        "आयुष्मान कार्ड कहाँ बनता है, और क्या-क्या कागज़ लगेगा?",
        "पास में कोई दीदी है जो फ़ॉर्म भरने में मदद करे?",
        "एक आदमी पैसे माँग रहा है कार्ड बनवाने के, दे दूँ क्या?",
      ],
    },
    defaultQuestionLang: "hindi",
    dropdownLabel: "Rekha D. · Citizen (Schemes and documents)",
    experience: "Rekha has heard of schemes but doesn't know who to ask. Sahayika will find the nearest help desks and didis who can check what she qualifies for and fill her forms.",
  },
  {
    id: "ravi-small-business",
    name: "Ravi",
    fullName: "Ravi K.",
    location: "THE SMALL BUSINESS",
    locationColor: "#7A5A0C",
    gradientCSS: "linear-gradient(135deg, #7A5A0C 0%, #C9961C 100%)",
    imagePosition: "50% 20%",
    traits: [
      "31, runs a mobile repair shop in Kankarbagh",
      "Wants a loan to open a second counter",
      "The bank asked for a business registration he doesn't have",
      "Doesn't know which loan scheme fits a shop like his",
    ],
    about: [
      "Ravi is 31 and has run a mobile repair shop in Kankarbagh for six years, with one helper.",
      "He wants a small loan to open a second counter and stock accessories. The bank said he needs a business registration first. He doesn't know where to get it, or which loan scheme fits a shop like his.",
      "He calls Sahayika to find who can help him register, which loan schemes he can try, and where to get help with the paperwork.",
    ],
    questions: {
      hindi: [
        "दुकान का रजिस्ट्रेशन कहाँ और कैसे होगा?",
        "छोटे दुकानदार के लिए कौन सा लोन मिलता है?",
        "मुद्रा लोन में कितना पैसा मिल सकता है?",
        "फ़ॉर्म भरवाने में कोई मदद करेगा क्या?",
      ],
    },
    defaultQuestionLang: "hindi",
    dropdownLabel: "Ravi K. · Small business (Registration and loan)",
    experience: "Ravi needs papers before the bank will lend. Sahayika will find a registration help desk and a bank nearby, and explain the loan schemes in plain words.",
  },
  {
    id: "kiran-shg-leader",
    name: "Kiran",
    fullName: "Kiran S.",
    location: "THE SHG LEADER",
    locationColor: "#4A3405",
    gradientCSS: "linear-gradient(135deg, #4A3405 0%, #A8790F 100%)",
    imagePosition: "25% 20%",
    traits: [
      "38, leads a 12-woman self-help group in Danapur",
      "Helps neighbours with forms, bank visits and scheme applications",
      "Her group makes sattu and pickles but has no steady buyers",
      "Wants a packaging training course for the group",
    ],
    about: [
      "Kiran is 38 and leads a 12-member self-help group in Danapur. Over the years she has become the person neighbours ask for help with forms, bank visits and scheme applications.",
      "She wants more people nearby to know she can help. Her group also has its own needs: it makes sattu and pickles but sells only at village fairs, and wants a packaging training course and regular buyers.",
      "She calls Sahayika to get her help-desk on the map, to see who nearby needs help, and to find training and buyers for her group.",
    ],
    questions: {
      hindi: [
        "मैं लोगों की फ़ॉर्म भरने में मदद करती हूँ, मेरा नाम नक्शे पर कैसे आएगा?",
        "आसपास किसे मदद चाहिए?",
        "हमारे समूह के अचार और सत्तू के लिए खरीदार कहाँ मिलेंगे?",
        "पैकेजिंग की ट्रेनिंग कहाँ होती है?",
      ],
    },
    defaultQuestionLang: "hindi",
    dropdownLabel: "Kiran S. · SHG leader (Helper with her own needs)",
    experience: "Kiran helps others but her group needs help too. Sahayika will put her help-desk on the map, show her who nearby needs help, and find buyers and training for her group.",
  },
];
