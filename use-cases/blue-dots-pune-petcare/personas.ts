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
    id: "rohan-dog-owner",
    name: "Rohan K.",
    fullName: "Rohan K.",
    location: "DOG OWNER",
    locationColor: "#2563EB",
    gradientCSS: "linear-gradient(135deg, #0A3D8F 0%, #2563EB 100%)",
    featured: true,
    imagePosition: "35% 20%",
    traits: ["29, works in an office in Kothrud", "His beagle Bruno has been limping since morning", "It's Sunday and his usual clinic is closed", "Wants a vet open today, close to home"],
    about: ["Rohan is 29 and lives in Kothrud with his beagle, Bruno.", "Bruno has been limping since morning. It's Sunday, and the clinic Rohan always uses is closed.", "He calls Pet Saathi to find a vet that is open today, close to home."],
    questions: {"hindi": ["संडे को कौन सा वेट खुला है पास में?", "ब्रूनो का एक्स-रे कहाँ हो सकता है?", "रात को इमरजेंसी में कहाँ ले जाऊँ?"]},
    defaultQuestionLang: "hindi",
    dropdownLabel: "Rohan K. · Dog owner (Vet open today)",
    experience: "Rohan's dog is limping on a Sunday. Pet Saathi will find vets near Kothrud that are open today.",
  },
  {
    id: "meera-cat-owner",
    name: "Meera S.",
    fullName: "Meera S.",
    location: "CAT OWNER",
    locationColor: "#0D9488",
    gradientCSS: "linear-gradient(135deg, #0A3D8F 0%, #0D9488 100%)",
    imagePosition: "28% 20%",
    traits: ["34, lives in Baner with two cats", "Travels for work for four days next week", "Doesn't want to leave the cats in a noisy kennel", "Wants a sitter who visits home, or a cats-only stay"],
    about: ["Meera is 34 and lives in Baner with her two cats.", "She travels for work for four days next week and doesn't want to leave the cats in a noisy kennel.", "She calls Pet Saathi to find someone nearby who can visit home and feed them, or a quiet cats-only stay."],
    questions: {"hindi": ["घर आकर कैट्स को खाना देने वाला कोई मिलेगा?", "बानेर के पास सिर्फ़ कैट्स के लिए बोर्डिंग है क्या?", "लिटर और फ़ूड भी देख लेंगे?"]},
    defaultQuestionLang: "hindi",
    dropdownLabel: "Meera S. · Cat owner (Sitter while she travels)",
    experience: "Meera needs her cats looked after while she travels. Pet Saathi will find home-visit sitters and a cats-only stay near Baner.",
  },
  {
    id: "anjali-caretaker",
    name: "Anjali D.",
    fullName: "Anjali D.",
    location: "PET CARETAKER",
    locationColor: "#7C3AED",
    gradientCSS: "linear-gradient(135deg, #0A3D8F 0%, #7C3AED 100%)",
    imagePosition: "35% 15%",
    traits: ["26, lives in Aundh", "Has walked and looked after dogs for three years", "Has a pet first-aid certificate", "Wants more clients within a short ride of Aundh"],
    about: ["Anjali is 26 and lives in Aundh. She has walked dogs and looked after pets for three years, and has a pet first-aid certificate.", "Today she finds work only by word of mouth.", "She calls Pet Saathi to find owners near Aundh who need a walker or a sitter, and to get her own service seen."],
    questions: {"hindi": ["औंध के पास किसी को डॉग वॉकर चाहिए क्या?", "वीकेंड पेट सिटिंग का काम कहाँ मिलेगा?", "मैं अपनी सर्विस लोगों को कैसे दिखाऊँ?"]},
    defaultQuestionLang: "hindi",
    dropdownLabel: "Anjali D. · Pet caretaker (Finding clients)",
    experience: "Anjali walks dogs and sits pets. Pet Saathi will find owners near Aundh who need her, and show how to get her service on the map.",
  },
];
