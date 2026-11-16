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
    id: "arjun-son",
    name: "Arjun M.",
    fullName: "Arjun M.",
    location: "SON IN ANOTHER CITY",
    locationColor: "#2563EB",
    gradientCSS: "linear-gradient(135deg, #0A3D8F 0%, #2563EB 100%)",
    featured: true,
    imagePosition: "40% 20%",
    traits: ["38, works in Bengaluru", "His mother, 72, lives alone in Kothrud", "Wants someone to help her a few hours every day", "Needs staff he can trust from far away"],
    about: ["Arjun is 38 and works in Bengaluru. His mother, 72, lives alone in Kothrud, Pune.", "She manages on her own, but needs help for a few hours every day, and Arjun can't be there.", "He calls Saathi Seva to find a trusted attendant service close to her home."],
    questions: {"hindi": ["माँ के लिए कुछ घंटे का अटेंडेंट कोथरूड में मिलेगा?", "स्टाफ़ वेरिफ़ाइड होता है क्या?", "रात में भी कोई रुक सकता है?"]},
    defaultQuestionLang: "hindi",
    dropdownLabel: "Arjun M. · Son in another city (Attendant for his mother)",
    experience: "Arjun needs a trusted attendant for his mother in Kothrud. Saathi Seva will find checked attendant services near her home.",
  },
  {
    id: "vimal-elder",
    name: "Vimal P.",
    fullName: "Vimal P.",
    location: "RETIRED",
    locationColor: "#0D9488",
    gradientCSS: "linear-gradient(135deg, #0A3D8F 0%, #0D9488 100%)",
    imagePosition: "40% 20%",
    traits: ["68, retired teacher, lives in Aundh with his son", "His son works long hours; the days are long and quiet", "Wants a day centre nearby with company and activities", "Can't travel far on his own"],
    about: ["Vimal is 68, a retired teacher who lives in Aundh with his son.", "His son works long hours, and the days at home are long and quiet.", "He calls Saathi Seva to find a day centre nearby with company and activities."],
    questions: {"hindi": ["औंध के पास कोई डे केयर सेंटर है?", "वहाँ खाना और योगा होता है?", "लेने-छोड़ने की सुविधा है?"]},
    defaultQuestionLang: "hindi",
    dropdownLabel: "Vimal P. · Retired (Day centre near home)",
    experience: "Vimal wants company during the day. Saathi Seva will find day centres for seniors near Aundh.",
  },
  {
    id: "kavita-caregiver",
    name: "Kavita S.",
    fullName: "Kavita S.",
    location: "CAREGIVER",
    locationColor: "#7C3AED",
    gradientCSS: "linear-gradient(135deg, #0A3D8F 0%, #7C3AED 100%)",
    imagePosition: "35% 20%",
    traits: ["31, lives in Baner", "Trained general duty assistant", "Five years of caring for elders at home", "Wants steady work within a short ride of Baner"],
    about: ["Kavita is 31 and lives in Baner. She is a trained general duty assistant with five years of caring for elders at home.", "Today she finds work only by word of mouth.", "She calls Saathi Seva to find families near Baner who need a caregiver, and to get her own service seen."],
    questions: {"hindi": ["बानेर के पास किसी को केयरगिवर चाहिए?", "दिन की शिफ़्ट का काम मिलेगा?", "मैं अपनी सर्विस कैसे दिखाऊँ?"]},
    defaultQuestionLang: "hindi",
    dropdownLabel: "Kavita S. · Caregiver (Finding work nearby)",
    experience: "Kavita is a trained caregiver. Saathi Seva will find families near Baner who need her, and show how to get her service on the map.",
  },
];
