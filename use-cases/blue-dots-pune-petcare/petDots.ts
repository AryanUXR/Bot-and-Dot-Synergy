// All rows are fictional sample data for this prototype. Names, services and requests are made up;
// the localities are real Pune areas. No addresses or phone numbers.

export const SECTORS = ["Vets & Pet Hospitals", "Pet Sitters & Boarding", "Pet Shops", "Grooming", "Training & Adoption"] as const;

export const SECTOR_COLOURS: Record<string, string> = {
  "Vets & Pet Hospitals": "#2563EB",
  "Pet Sitters & Boarding": "#0D9488",
  "Pet Shops": "#D97706",
  "Grooming": "#DB2777",
  "Training & Adoption": "#7C3AED"
};

export interface PetDot {
  id: number;
  type: "provider" | "seeker";
  name: string;
  area: string;
  lat: number;
  lng: number;
  sector: string;
  org_type?: string;
  offers?: string[];
  description: string;
}

// The map's "You" marker: Kothrud
export const HOME = { label: "You", area: "Kothrud", lat: 18.5074, lng: 73.8077 };

export const PUNE_PET_DOTS: PetDot[] = [
  {
    "id": 1,
    "type": "provider",
    "sector": "Vets & Pet Hospitals",
    "name": "Paws & Care 24x7 Pet Hospital",
    "area": "Kothrud",
    "lat": 18.5062,
    "lng": 73.8087,
    "org_type": "Pet Hospital",
    "offers": [
      "24x7 emergency",
      "X-ray",
      "Open Sundays"
    ],
    "description": "Pet hospital open round the clock, with X-ray and surgery."
  },
  {
    "id": 2,
    "type": "provider",
    "sector": "Vets & Pet Hospitals",
    "name": "Baner Vet Clinic",
    "area": "Baner",
    "lat": 18.5626,
    "lng": 73.7838,
    "org_type": "Vet Clinic",
    "offers": [
      "Vaccination",
      "Check-ups",
      "Sunday morning OPD"
    ],
    "description": "Neighbourhood vet clinic, open on Sunday mornings."
  },
  {
    "id": 3,
    "type": "provider",
    "sector": "Vets & Pet Hospitals",
    "name": "Aundh Animal Clinic",
    "area": "Aundh",
    "lat": 18.5532,
    "lng": 73.8115,
    "org_type": "Vet Clinic",
    "offers": [
      "Check-ups",
      "Lab tests",
      "Home visits"
    ],
    "description": "Clinic for dogs and cats; the vet visits homes on weekday evenings."
  },
  {
    "id": 4,
    "type": "provider",
    "sector": "Vets & Pet Hospitals",
    "name": "Deccan Pet Hospital",
    "area": "Deccan",
    "lat": 18.5167,
    "lng": 73.8417,
    "org_type": "Pet Hospital",
    "offers": [
      "24x7 emergency",
      "ICU",
      "Dental care"
    ],
    "description": "Large pet hospital with an ICU, open all night."
  },
  {
    "id": 5,
    "type": "provider",
    "sector": "Vets & Pet Hospitals",
    "name": "Bavdhan Mobile Vet",
    "area": "Bavdhan",
    "lat": 18.5168,
    "lng": 73.766,
    "org_type": "Mobile Vet",
    "offers": [
      "Home visits",
      "Vaccination at home",
      "Weekends"
    ],
    "description": "A vet who comes home, including weekends."
  },
  {
    "id": 6,
    "type": "provider",
    "sector": "Pet Sitters & Boarding",
    "name": "Happy Tails Home Boarding",
    "area": "Baner",
    "lat": 18.5554,
    "lng": 73.7898,
    "org_type": "Home Boarding",
    "offers": [
      "Dog and cat boarding",
      "Daily photo updates",
      "Pickup on request"
    ],
    "description": "Small home boarding with daily photo updates for owners."
  },
  {
    "id": 7,
    "type": "provider",
    "sector": "Pet Sitters & Boarding",
    "name": "Pashan Pet Sitters Circle",
    "area": "Pashan",
    "lat": 18.5422,
    "lng": 73.792,
    "org_type": "Pet Sitters",
    "offers": [
      "Home visits for cats",
      "Feeding",
      "Litter cleaning"
    ],
    "description": "Group of sitters who visit homes to feed and care for cats."
  },
  {
    "id": 8,
    "type": "provider",
    "sector": "Pet Sitters & Boarding",
    "name": "Kothrud Dog Walkers",
    "area": "Kothrud",
    "lat": 18.5134,
    "lng": 73.8027,
    "org_type": "Dog Walkers",
    "offers": [
      "Morning walks",
      "Evening walks",
      "Small and large dogs"
    ],
    "description": "Daily dog walks in Kothrud, mornings and evenings."
  },
  {
    "id": 9,
    "type": "provider",
    "sector": "Pet Sitters & Boarding",
    "name": "Whiskers Cat Hostel",
    "area": "Aundh",
    "lat": 18.5556,
    "lng": 73.8095,
    "org_type": "Cat Boarding",
    "offers": [
      "Cats only",
      "Separate rooms",
      "Vet on call"
    ],
    "description": "A quiet cats-only stay with separate rooms."
  },
  {
    "id": 10,
    "type": "provider",
    "sector": "Pet Sitters & Boarding",
    "name": "Balewadi Pet Daycare",
    "area": "Balewadi",
    "lat": 18.5785,
    "lng": 73.7746,
    "org_type": "Day Care",
    "offers": [
      "Day care",
      "Play area",
      "Weekday hours"
    ],
    "description": "Weekday day care with a play area."
  },
  {
    "id": 11,
    "type": "provider",
    "sector": "Pet Sitters & Boarding",
    "name": "Anjali D. · Pet caretaker",
    "area": "Aundh",
    "lat": 18.552,
    "lng": 73.8125,
    "org_type": "Independent Caretaker",
    "offers": [
      "Dog walks",
      "Home visits",
      "Weekend sitting",
      "Pet first aid"
    ],
    "description": "Walks dogs and sits pets around Aundh; pet first-aid trained."
  },
  {
    "id": 12,
    "type": "provider",
    "sector": "Pet Shops",
    "name": "Furry Basket Pet Store",
    "area": "Kothrud",
    "lat": 18.5062,
    "lng": 73.8087,
    "org_type": "Pet Shop",
    "offers": [
      "Dog and cat food",
      "Toys",
      "Home delivery"
    ],
    "description": "Pet food and supplies with same-day delivery nearby."
  },
  {
    "id": 13,
    "type": "provider",
    "sector": "Pet Shops",
    "name": "Aundh Pet Mart",
    "area": "Aundh",
    "lat": 18.5616,
    "lng": 73.8045,
    "org_type": "Pet Shop",
    "offers": [
      "Food",
      "Medicines on prescription",
      "Accessories"
    ],
    "description": "Pet shop that also stocks medicines on a vet's prescription."
  },
  {
    "id": 14,
    "type": "provider",
    "sector": "Pet Shops",
    "name": "Baner Pet Supplies",
    "area": "Baner",
    "lat": 18.5542,
    "lng": 73.7908,
    "org_type": "Pet Shop",
    "offers": [
      "Food",
      "Cat litter",
      "Carriers"
    ],
    "description": "Food, litter and travel carriers for cats and dogs."
  },
  {
    "id": 15,
    "type": "provider",
    "sector": "Pet Shops",
    "name": "Shivajinagar Aquarium & Pets",
    "area": "Shivajinagar",
    "lat": 18.5308,
    "lng": 73.8475,
    "org_type": "Pet Shop",
    "offers": [
      "Fish",
      "Bird food",
      "Aquarium supplies"
    ],
    "description": "Fish, birds and aquarium supplies."
  },
  {
    "id": 16,
    "type": "provider",
    "sector": "Grooming",
    "name": "Snip & Wag Grooming",
    "area": "Baner",
    "lat": 18.5638,
    "lng": 73.7828,
    "org_type": "Grooming Salon",
    "offers": [
      "Bath and haircut",
      "Nail trim",
      "Tick treatment"
    ],
    "description": "Grooming salon for dogs and cats."
  },
  {
    "id": 17,
    "type": "provider",
    "sector": "Grooming",
    "name": "Karve Nagar Pet Spa",
    "area": "Karve Nagar",
    "lat": 18.4857,
    "lng": 73.8233,
    "org_type": "Grooming Salon",
    "offers": [
      "Grooming",
      "Bath",
      "Pickup and drop"
    ],
    "description": "Grooming with pickup and drop."
  },
  {
    "id": 18,
    "type": "provider",
    "sector": "Grooming",
    "name": "Groom-on-Wheels Pune",
    "area": "Wakad",
    "lat": 18.6002,
    "lng": 73.761,
    "org_type": "Mobile Grooming",
    "offers": [
      "Grooming van at home",
      "Weekends"
    ],
    "description": "A grooming van that comes to your building."
  },
  {
    "id": 19,
    "type": "provider",
    "sector": "Training & Adoption",
    "name": "Good Dog Training School",
    "area": "Pashan",
    "lat": 18.547,
    "lng": 73.788,
    "org_type": "Trainer",
    "offers": [
      "Puppy classes",
      "Obedience",
      "Leash training"
    ],
    "description": "Group and one-on-one dog training."
  },
  {
    "id": 20,
    "type": "provider",
    "sector": "Training & Adoption",
    "name": "Erandwane Behaviour Clinic",
    "area": "Erandwane",
    "lat": 18.5076,
    "lng": 73.836,
    "org_type": "Behaviour Trainer",
    "offers": [
      "Barking and biting help",
      "One-on-one sessions"
    ],
    "description": "Help for dogs that bark, bite or get anxious."
  },
  {
    "id": 21,
    "type": "provider",
    "sector": "Training & Adoption",
    "name": "Pune Animal Rescue & Adoption",
    "area": "Koregaon Park",
    "lat": 18.5386,
    "lng": 73.891,
    "org_type": "Rescue Group",
    "offers": [
      "Adopt dogs and cats",
      "Foster care",
      "Volunteer days"
    ],
    "description": "Rescue group that rehomes dogs and cats and needs foster homes."
  },
  {
    "id": 22,
    "type": "provider",
    "sector": "Training & Adoption",
    "name": "Viman Nagar Adoption Camp",
    "area": "Viman Nagar",
    "lat": 18.5619,
    "lng": 73.9193,
    "org_type": "Adoption Camp",
    "offers": [
      "Monthly adoption camp",
      "Vaccinated pets"
    ],
    "description": "Monthly camp where vaccinated rescues meet new families."
  },
  {
    "id": 101,
    "type": "seeker",
    "sector": "Pet Sitters & Boarding",
    "name": "Kavya R. · Dog owner",
    "area": "Aundh",
    "lat": 18.5616,
    "lng": 73.8045,
    "org_type": "Needs: Evening dog walker",
    "offers": [
      "Labrador",
      "Weekdays"
    ],
    "description": "Works late and wants someone to walk her Labrador in the evenings."
  },
  {
    "id": 102,
    "type": "seeker",
    "sector": "Pet Sitters & Boarding",
    "name": "Nikhil P. · Cat owner",
    "area": "Baner",
    "lat": 18.5542,
    "lng": 73.7908,
    "org_type": "Needs: Weekend cat sitter",
    "offers": [
      "Two cats",
      "Home visits"
    ],
    "description": "Away most weekends and wants someone to feed his cats at home."
  },
  {
    "id": 103,
    "type": "seeker",
    "sector": "Pet Sitters & Boarding",
    "name": "Priyanka D. · Two dogs",
    "area": "Balewadi",
    "lat": 18.5761,
    "lng": 73.7766,
    "org_type": "Needs: Weekday day care",
    "offers": [
      "Two indie dogs"
    ],
    "description": "Wants day care for two dogs on office days."
  },
  {
    "id": 104,
    "type": "seeker",
    "sector": "Vets & Pet Hospitals",
    "name": "Sana M. · New puppy",
    "area": "Pashan",
    "lat": 18.5458,
    "lng": 73.789,
    "org_type": "Needs: Puppy vaccination",
    "offers": [
      "Eight-week puppy"
    ],
    "description": "Brought home a puppy and needs its first vaccines."
  },
  {
    "id": 105,
    "type": "seeker",
    "sector": "Vets & Pet Hospitals",
    "name": "Arjun T. · Senior dog",
    "area": "Kothrud",
    "lat": 18.5038,
    "lng": 73.8107,
    "org_type": "Needs: Home vet visit",
    "offers": [
      "Fourteen-year-old dog"
    ],
    "description": "His old dog can't travel easily and needs a vet at home."
  },
  {
    "id": 106,
    "type": "seeker",
    "sector": "Training & Adoption",
    "name": "Rahul S. · Rescue kitten",
    "area": "Shivajinagar",
    "lat": 18.532,
    "lng": 73.8465,
    "org_type": "Needs: Foster home",
    "offers": [
      "Kitten",
      "Two weeks"
    ],
    "description": "Found a kitten and needs a foster home for two weeks."
  },
  {
    "id": 107,
    "type": "seeker",
    "sector": "Pet Sitters & Boarding",
    "name": "Lata J. · Older pet owner",
    "area": "Erandwane",
    "lat": 18.516,
    "lng": 73.829,
    "org_type": "Needs: Help with walks",
    "offers": [
      "Beagle",
      "Mornings"
    ],
    "description": "Finds long walks hard and wants help walking her beagle."
  },
  {
    "id": 108,
    "type": "seeker",
    "sector": "Training & Adoption",
    "name": "Kunal V. · Puppy owner",
    "area": "Wakad",
    "lat": 18.5966,
    "lng": 73.764,
    "org_type": "Needs: Puppy training",
    "offers": [
      "Five-month puppy"
    ],
    "description": "Wants leash and toilet training for a young puppy."
  }
];
