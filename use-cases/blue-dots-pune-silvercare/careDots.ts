// All rows are fictional sample data for this prototype. Names, services and requests are made up;
// the localities are real Pune areas. No addresses or phone numbers.

export const SECTORS = ["Home Care & Attendants", "Elder Day Care", "Assisted Living", "Nursing & Physio at Home", "Clinics & Pharmacies"] as const;

export const SECTOR_COLOURS: Record<string, string> = {
  "Home Care & Attendants": "#2563EB",
  "Elder Day Care": "#2563EB",
  "Assisted Living": "#2563EB",
  "Nursing & Physio at Home": "#2563EB",
  "Clinics & Pharmacies": "#2563EB"
};

export interface CareDot {
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

export const PUNE_CARE_DOTS: CareDot[] = [
  {
    "id": 1,
    "type": "provider",
    "sector": "Home Care & Attendants",
    "name": "CareNest Home Attendants",
    "area": "Kothrud",
    "lat": 18.5062,
    "lng": 73.8087,
    "org_type": "Care Agency",
    "offers": [
      "Day attendants",
      "Few hours or full day",
      "Background-checked staff"
    ],
    "description": "Attendants who help elders at home with meals, walks and daily routines."
  },
  {
    "id": 2,
    "type": "provider",
    "sector": "Home Care & Attendants",
    "name": "Saksham Elder Care Services",
    "area": "Baner",
    "lat": 18.5626,
    "lng": 73.7838,
    "org_type": "Care Agency",
    "offers": [
      "Live-in attendants",
      "Short-term cover",
      "Background-checked staff"
    ],
    "description": "Live-in and short-term attendants for elders."
  },
  {
    "id": 3,
    "type": "provider",
    "sector": "Home Care & Attendants",
    "name": "Aundh Home Helpers for Seniors",
    "area": "Aundh",
    "lat": 18.5532,
    "lng": 73.8115,
    "org_type": "Care Agency",
    "offers": [
      "Few hours a day",
      "Help with meals and walks"
    ],
    "description": "Part-time helpers who visit elders at home."
  },
  {
    "id": 4,
    "type": "provider",
    "sector": "Home Care & Attendants",
    "name": "Karve Nagar Care Agency",
    "area": "Karve Nagar",
    "lat": 18.4893,
    "lng": 73.8203,
    "org_type": "Care Agency",
    "offers": [
      "Night attendants",
      "Weekly plans",
      "Background-checked staff"
    ],
    "description": "Night and weekly attendant plans."
  },
  {
    "id": 5,
    "type": "provider",
    "sector": "Home Care & Attendants",
    "name": "Kavita S. · Caregiver",
    "area": "Baner",
    "lat": 18.5638,
    "lng": 73.7828,
    "org_type": "Independent Caregiver",
    "offers": [
      "Home visits",
      "Help with bathing and meals",
      "Trained general duty assistant"
    ],
    "description": "Trained caregiver with five years of elder care, working around Baner."
  },
  {
    "id": 6,
    "type": "provider",
    "sector": "Elder Day Care",
    "name": "Sukhad Senior Day Centre",
    "area": "Aundh",
    "lat": 18.5544,
    "lng": 73.8105,
    "org_type": "Day Centre",
    "offers": [
      "Day care",
      "Lunch",
      "Games and yoga",
      "Pickup on request"
    ],
    "description": "A day centre with lunch, yoga and games for seniors."
  },
  {
    "id": 7,
    "type": "provider",
    "sector": "Elder Day Care",
    "name": "Kothrud Seniors Club Day Care",
    "area": "Kothrud",
    "lat": 18.5086,
    "lng": 73.8067,
    "org_type": "Day Centre",
    "offers": [
      "Weekday day care",
      "Reading room",
      "Group outings"
    ],
    "description": "A weekday club and day centre for seniors."
  },
  {
    "id": 8,
    "type": "provider",
    "sector": "Elder Day Care",
    "name": "Pashan Golden Years Centre",
    "area": "Pashan",
    "lat": 18.547,
    "lng": 73.788,
    "org_type": "Day Centre",
    "offers": [
      "Day care",
      "Memory activities",
      "Nurse on site"
    ],
    "description": "Day care with a nurse on site and memory activities."
  },
  {
    "id": 9,
    "type": "provider",
    "sector": "Elder Day Care",
    "name": "Baner Evening Companions",
    "area": "Baner",
    "lat": 18.5566,
    "lng": 73.7888,
    "org_type": "Companion Service",
    "offers": [
      "Evening company",
      "Walks",
      "Phone check-ins"
    ],
    "description": "Volunteers and staff who keep elders company in the evenings."
  },
  {
    "id": 10,
    "type": "provider",
    "sector": "Assisted Living",
    "name": "Shanti Kunj Assisted Living",
    "area": "Bavdhan",
    "lat": 18.5144,
    "lng": 73.768,
    "org_type": "Assisted Living",
    "offers": [
      "Assisted living",
      "Respite stays",
      "Weekly doctor visits"
    ],
    "description": "Assisted living with short respite stays."
  },
  {
    "id": 11,
    "type": "provider",
    "sector": "Assisted Living",
    "name": "Deccan Senior Residency",
    "area": "Deccan",
    "lat": 18.5107,
    "lng": 73.8467,
    "org_type": "Senior Residency",
    "offers": [
      "Long stays",
      "Short respite stays",
      "Meals"
    ],
    "description": "Senior residency for long or short stays."
  },
  {
    "id": 12,
    "type": "provider",
    "sector": "Assisted Living",
    "name": "Balewadi Care Home",
    "area": "Balewadi",
    "lat": 18.5749,
    "lng": 73.7776,
    "org_type": "Care Home",
    "offers": [
      "Care home",
      "Memory care",
      "Family visiting hours"
    ],
    "description": "A care home with memory care and open visiting hours."
  },
  {
    "id": 13,
    "type": "provider",
    "sector": "Nursing & Physio at Home",
    "name": "Kothrud Home Nursing",
    "area": "Kothrud",
    "lat": 18.511,
    "lng": 73.8047,
    "org_type": "Home Nursing",
    "offers": [
      "Nurse visits",
      "Wound dressing",
      "Injections at home"
    ],
    "description": "Nurses who visit elders at home."
  },
  {
    "id": 14,
    "type": "provider",
    "sector": "Nursing & Physio at Home",
    "name": "Aundh Physio at Home",
    "area": "Aundh",
    "lat": 18.5532,
    "lng": 73.8115,
    "org_type": "Physiotherapy",
    "offers": [
      "Physiotherapy at home",
      "Recovery after a fall"
    ],
    "description": "Physiotherapists who come home."
  },
  {
    "id": 15,
    "type": "provider",
    "sector": "Nursing & Physio at Home",
    "name": "Erandwane Home Health",
    "area": "Erandwane",
    "lat": 18.51,
    "lng": 73.834,
    "org_type": "Home Health",
    "offers": [
      "Nurse visits",
      "Lab tests at home",
      "Equipment on rent"
    ],
    "description": "Home nursing, lab tests and equipment on rent."
  },
  {
    "id": 16,
    "type": "provider",
    "sector": "Nursing & Physio at Home",
    "name": "Wakad Rehab Physio",
    "area": "Wakad",
    "lat": 18.6038,
    "lng": 73.758,
    "org_type": "Physiotherapy",
    "offers": [
      "Physiotherapy",
      "Walking aids advice"
    ],
    "description": "Physiotherapy and advice on walking aids."
  },
  {
    "id": 17,
    "type": "provider",
    "sector": "Clinics & Pharmacies",
    "name": "Shivajinagar Elder Clinic",
    "area": "Shivajinagar",
    "lat": 18.5272,
    "lng": 73.8505,
    "org_type": "Clinic",
    "offers": [
      "Elder check-ups",
      "Memory clinic",
      "Weekday OPD"
    ],
    "description": "A clinic for elders with a weekday OPD."
  },
  {
    "id": 18,
    "type": "provider",
    "sector": "Clinics & Pharmacies",
    "name": "Kothrud Medicines Home Delivery",
    "area": "Kothrud",
    "lat": 18.5086,
    "lng": 73.8067,
    "org_type": "Pharmacy",
    "offers": [
      "Medicine delivery",
      "Monthly refills"
    ],
    "description": "Pharmacy that delivers medicines and monthly refills."
  },
  {
    "id": 19,
    "type": "provider",
    "sector": "Clinics & Pharmacies",
    "name": "Baner Family Clinic",
    "area": "Baner",
    "lat": 18.565,
    "lng": 73.7818,
    "org_type": "Clinic",
    "offers": [
      "Check-ups",
      "Blood pressure and sugar checks",
      "Sunday morning OPD"
    ],
    "description": "Family clinic with a Sunday morning OPD."
  },
  {
    "id": 20,
    "type": "provider",
    "sector": "Clinics & Pharmacies",
    "name": "Deccan 24x7 Hospital",
    "area": "Deccan",
    "lat": 18.5143,
    "lng": 73.8437,
    "org_type": "Hospital",
    "offers": [
      "24x7 emergency",
      "Ambulance"
    ],
    "description": "Hospital with a round-the-clock emergency ward."
  },
  {
    "id": 101,
    "type": "seeker",
    "sector": "Home Care & Attendants",
    "name": "Leela K. · Lives alone",
    "area": "Aundh",
    "lat": 18.5616,
    "lng": 73.8045,
    "org_type": "Needs: Daytime attendant",
    "offers": [
      "Weekdays",
      "Few hours"
    ],
    "description": "Lives alone and wants help for a few hours each weekday."
  },
  {
    "id": 102,
    "type": "seeker",
    "sector": "Nursing & Physio at Home",
    "name": "Prakash D. · Retired",
    "area": "Kothrud",
    "lat": 18.5026,
    "lng": 73.8117,
    "org_type": "Needs: Physiotherapy at home",
    "offers": [
      "Three times a week"
    ],
    "description": "Recovering after a fall and wants physiotherapy at home."
  },
  {
    "id": 103,
    "type": "seeker",
    "sector": "Home Care & Attendants",
    "name": "Nalini R. · Family in another city",
    "area": "Baner",
    "lat": 18.559,
    "lng": 73.7868,
    "org_type": "Needs: Weekly check-in visits",
    "offers": [
      "Weekly visits",
      "Help with errands"
    ],
    "description": "Her family lives in another city and wants someone to visit weekly."
  },
  {
    "id": 104,
    "type": "seeker",
    "sector": "Elder Day Care",
    "name": "Suresh B. · Retired",
    "area": "Pashan",
    "lat": 18.5458,
    "lng": 73.789,
    "org_type": "Needs: Day care with a nurse",
    "offers": [
      "Weekdays"
    ],
    "description": "Wants a day centre with a nurse on site."
  },
  {
    "id": 105,
    "type": "seeker",
    "sector": "Home Care & Attendants",
    "name": "Usha M. · Back from hospital",
    "area": "Erandwane",
    "lat": 18.5064,
    "lng": 73.837,
    "org_type": "Needs: Night attendant",
    "offers": [
      "Two weeks"
    ],
    "description": "Back home after a hospital stay and needs a night attendant for two weeks."
  },
  {
    "id": 106,
    "type": "seeker",
    "sector": "Elder Day Care",
    "name": "Ramesh J. · Retired",
    "area": "Balewadi",
    "lat": 18.5773,
    "lng": 73.7756,
    "org_type": "Needs: Company and walks",
    "offers": [
      "Evenings"
    ],
    "description": "Wants company and an evening walk."
  },
  {
    "id": 107,
    "type": "seeker",
    "sector": "Home Care & Attendants",
    "name": "Meena V. · Family in another city",
    "area": "Kothrud",
    "lat": 18.5134,
    "lng": 73.8027,
    "org_type": "Needs: Help with meals",
    "offers": [
      "Lunch and dinner"
    ],
    "description": "Wants help cooking and serving meals at home."
  },
  {
    "id": 108,
    "type": "seeker",
    "sector": "Clinics & Pharmacies",
    "name": "Ashok P. · Retired",
    "area": "Wakad",
    "lat": 18.5966,
    "lng": 73.764,
    "org_type": "Needs: Medicine delivery",
    "offers": [
      "Monthly"
    ],
    "description": "Wants monthly medicines delivered home."
  }
];
