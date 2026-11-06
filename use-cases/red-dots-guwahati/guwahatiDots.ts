// Red Dots Guwahati: provider and road-report dots for the Sahai Line map.
// Real organisations carry a "// source:" line (full list in research-notes.md).
// Rows with verified: "Unverified" are fictional or unconfirmed.
// Coordinates are neighbourhood-level approximations; "// CHECK coords" rows need a pin check.
// No hospital is labelled cashless: no public list of Assam Golden Hour or PM RAHAT hospitals was found.
// Police rows use 112 rather than officer mobiles, which rotate.

export const SECTORS = [
  "Trauma & Emergency Hospitals",
  "Ambulance & 108",
  "Police & Traffic",
  "Two-wheeler Mechanics",
  "Car Workshops",
  "Heavy Vehicle & Tyres",
  "Towing & Cranes",
  "Schemes & Help Desks",
  "Road Reports",
] as const;

export interface RedDot {
  id: number;
  type: "provider" | "seeker";
  name: string;
  area: string;
  lat: number;
  lng: number;
  sector: string;
  org_type?: string;
  offers?: string[];
  address?: string;
  contact?: string;
  description: string;
  verified?: string; // "Unverified" on fictional or unconfirmed rows
}

const PROVIDERS: RedDot[] = [
  // ───────────── Trauma & Emergency Hospitals ─────────────
  // source: https://hfw.assam.gov.in/node/93114
  {
    id: 1, type: "provider", sector: "Trauma & Emergency Hospitals",
    name: "GMCH Emergency, Gauhati Medical College",
    area: "Bhangagarh",
    lat: 26.1556, lng: 91.7672, // CHECK coords
    org_type: "Government Hospital · Level-II Trauma",
    offers: ["24x7 emergency", "Head and trauma care", "Free or low cost"],
    address: "GMCH, Bhangagarh, Guwahati 781032",
    description: "Assam's main government referral hospital, listed by the state as a Level-II trauma centre. It treated over 19,000 road-accident cases in 2024. Serious head injuries are referred here.",
  },
  // source: https://gnrchospitals.com/gnrc-hospitals/dispur/accident-emergency
  {
    id: 2, type: "provider", sector: "Trauma & Emergency Hospitals",
    name: "GNRC Hospital, Dispur",
    area: "Dispur",
    lat: 26.1388, lng: 91.7935, // CHECK coords
    org_type: "Private Hospital",
    offers: ["Accident & emergency unit", "Own ambulance fleet", "Open 24 hours"],
    address: "Super Market, GNRC Road, Dispur, Guwahati 781006",
    contact: "18003450011",
    description: "Private multispeciality hospital with a dedicated accident and emergency unit. The number is GNRC's toll-free ambulance line.",
  },
  // source: https://apollohospitals.com/hospitals/apollo-excelcare-guwahati
  {
    id: 3, type: "provider", sector: "Trauma & Emergency Hospitals",
    name: "Apollo Excelcare Hospital",
    area: "Paschim Boragaon, NH-27",
    lat: 26.1205, lng: 91.7105, // CHECK coords
    org_type: "Private Hospital",
    offers: ["24x7 emergency", "Tertiary care", "Closest big hospital to Gorchuk"],
    address: "NH-37, near Ganesh Mandir, Paschim Boragaon, Guwahati 781033",
    contact: "03617140101",
    description: "Large private hospital on NH-27, about 2 km from Gorchuk. Apollo's emergency line 1066 also dispatches from here.",
  },
  // source: https://cghshospitals.com/facility/health-city-hospital-a-unit-of-north-east-health-city-private-limited-1544
  {
    id: 4, type: "provider", sector: "Trauma & Emergency Hospitals",
    name: "Health City Hospital",
    area: "Khanapara, NH-27",
    lat: 26.1205, lng: 91.8270, // CHECK coords
    org_type: "Private Hospital",
    offers: ["Emergency", "Ambulance", "Nearest big hospital to Jorabat"],
    address: "Opp. Bodoland Guest House, Uday Nagar, Khanapara, Guwahati 781022",
    contact: "03617105000",
    description: "Private hospital on the Shillong road, 6 to 7 km before Jorabat. For a serious head injury, ask whether they will stabilise and refer to GMCH.",
  },
  // source: https://cghshospitals.com/facility/down-town-hospital-ltd-1538
  {
    id: 5, type: "provider", sector: "Trauma & Emergency Hospitals",
    name: "Down Town Hospital",
    area: "GS Road, Dispur",
    lat: 26.1365, lng: 91.8005, // CHECK coords
    org_type: "Private Hospital",
    offers: ["Open 24 hours", "Emergency", "Multispeciality"],
    address: "GS Road, Dispur, Guwahati 781006",
    description: "Long-established private hospital on GS Road, open round the clock.",
  },
  // source: https://www.bajajfinservhealth.in/hospitals/kamrup-metropolitan/nemcare-hospital-bhangagarh
  {
    id: 6, type: "provider", sector: "Trauma & Emergency Hospitals",
    name: "Nemcare Hospital",
    area: "Bhangagarh",
    lat: 26.1530, lng: 91.7715, // CHECK coords
    org_type: "Private Hospital",
    offers: ["24x7 emergency", "Ambulance", "Near Ulubari"],
    address: "GMC Hospital Road, Bhangagarh, Guwahati 781005",
    description: "Private super-speciality hospital a short way from GMCH, serving the Bhangagarh and Ulubari area.",
  },
  // source: https://www.syllad.com/savelife-foundation-and-skoda-auto-india-strengthen-trauma-care-in-assam-to-reduce-road-crash-fatalities
  {
    id: 7, type: "provider", sector: "Trauma & Emergency Hospitals",
    name: "District Hospital, Sonapur",
    area: "Sonapur, NH-27",
    lat: 26.1170, lng: 91.9770, // CHECK coords
    org_type: "Government Hospital",
    offers: ["Emergency stabilisation", "Referral to GMCH"],
    address: "Near NH-27, Sonapur, Kamrup (Metro)",
    description: "Government district hospital past the Jorabat junction. SaveLIFE Foundation is upgrading it for trauma stabilisation; whether that unit is running now is not confirmed.",
  },
  // source: https://www.publicservicesmap.in/hospitals/centre/boko-chc-kamrup-assam-hosp18g106728
  {
    id: 8, type: "provider", sector: "Trauma & Emergency Hospitals",
    name: "Boko Community Health Centre",
    area: "Boko, NH-17",
    lat: 25.9800, lng: 91.2350, // CHECK coords
    org_type: "Government Health Centre",
    offers: ["Emergency first aid", "Admission", "Referral to GMCH"],
    address: "Boko, Kamrup (Rural)",
    description: "Nearest government health centre on the Guwahati to Goalpara highway near Boko. Serious cases are sent on to GMCH, about 50 km away.",
  },

  // ───────────── Ambulance & 108 ─────────────
  // source: https://www.sentinelassam.com/cities/guwahati-city/mrityunjoy-108-marks-17-years-91-lakh-served-224-lakh-lives-saved
  {
    id: 11, type: "provider", sector: "Ambulance & 108",
    name: "108 Mrityunjoy Ambulance",
    area: "All of Assam",
    lat: 26.1445, lng: 91.7362,
    org_type: "Government Ambulance",
    offers: ["Free ambulance", "Free first aid on the way", "24x7"],
    contact: "108",
    description: "Assam's free emergency ambulance, run by EMRI Green Health Services with the National Health Mission since 2008. Works anywhere in the state; this pin is symbolic.",
  },
  // source: https://gnrchospitals.com/gnrc-ambulance-service
  {
    id: 12, type: "provider", sector: "Ambulance & 108",
    name: "GNRC Ambulance Service",
    area: "Dispur",
    lat: 26.1400, lng: 91.7915, // CHECK coords
    org_type: "Hospital Ambulance",
    offers: ["24x7", "Life-support ambulances", "Takes you to GNRC"],
    contact: "18003450011",
    description: "GNRC's own toll-free ambulance line, running round the clock across its Guwahati hospitals.",
  },
  // source: https://www.apollohospitals.com/ambulance-services/guwahati
  {
    id: 13, type: "provider", sector: "Ambulance & 108",
    name: "Apollo Emergency 1066",
    area: "Paschim Boragaon",
    lat: 26.1215, lng: 91.7090, // CHECK coords
    org_type: "Hospital Ambulance",
    offers: ["24x7", "Takes you to Apollo Excelcare", "West Guwahati"],
    contact: "1066",
    description: "Apollo's emergency and ambulance number, dispatched from the Boragaon hospital on NH-27.",
  },

  // ───────────── Police & Traffic ─────────────
  // source: https://www.pratidintime.com/guwahati-news-breaking-latest/guwahati-traffic-police-advises-public-to-avoid-key-roads-amid-heavy-rainfall
  {
    id: 21, type: "provider", sector: "Police & Traffic",
    name: "Guwahati Traffic Control Room",
    area: "Pan Bazar",
    lat: 26.1850, lng: 91.7460, // CHECK coords
    org_type: "Traffic Police",
    offers: ["Road blockages", "Diversions", "Accident on a city road"],
    contact: "03612730989",
    description: "Control room of Guwahati Traffic Police. For an emergency, call 112.",
  },
  // source: https://www.pratidintime.com/technology/complete-list-of-guwahati-police-stations-with-contact-details-9079117
  {
    id: 22, type: "provider", sector: "Police & Traffic",
    name: "Gorchuk Police Station",
    area: "Gorchuk, NH-27",
    lat: 26.1140, lng: 91.7030, // CHECK coords
    org_type: "Police Station",
    offers: ["Accident report (FIR)", "NH-27 patrol"],
    contact: "112",
    description: "Station for the Gorchuk to Betkuchi stretch of NH-27. A police report within 24 hours is what makes a crash victim eligible for cashless treatment.",
  },
  // source: https://sentinelassam.com/guwahati-city/east-guwahati-police-district-held-minor-with-stolen-items-664838
  {
    id: 23, type: "provider", sector: "Police & Traffic",
    name: "Jorabat Police Outpost",
    area: "Jorabat junction",
    lat: 26.1030, lng: 91.8700, // CHECK coords
    org_type: "Police Outpost",
    offers: ["Accident report", "Highway patrol"],
    contact: "112",
    description: "Outpost under Basistha Police Station at the NH-27 and Shillong road junction. Crashes past the junction on the Meghalaya side go to Ri-Bhoi police.",
  },
  // source: https://www.pratidintime.com/technology/complete-list-of-guwahati-police-stations-with-contact-details-9079117
  {
    id: 24, type: "provider", sector: "Police & Traffic",
    name: "Maligaon Police Outpost",
    area: "Maligaon, AT Road",
    lat: 26.1600, lng: 91.6960, // CHECK coords
    org_type: "Police Outpost",
    offers: ["Night help on AT Road", "Incident report"],
    contact: "112",
    description: "Police outpost for Maligaon, near the Nilachal flyover.",
  },
  // source: https://www.pratidintime.com/technology/complete-list-of-guwahati-police-stations-with-contact-details-9079117
  {
    id: 25, type: "provider", sector: "Police & Traffic",
    name: "Jalukbari Police Station",
    area: "Jalukbari",
    lat: 26.1555, lng: 91.6680, // CHECK coords
    org_type: "Police Station",
    offers: ["Accident report (FIR)", "NH-17 entry to the city"],
    contact: "112",
    description: "Station at the western entry of Guwahati, where NH-17 from Goalpara meets the city highway.",
  },
  // source: https://eastmojo.com/assam/2023/01/24/assam-two-vehicles-collide-in-kamrups-boko-both-drivers-dead/
  {
    id: 26, type: "provider", sector: "Police & Traffic",
    name: "Boko Police Station",
    area: "Boko, NH-17",
    lat: 25.9810, lng: 91.2330, // CHECK coords
    org_type: "Police Station",
    offers: ["Accident report", "NH-17 Boko to Mirza stretch"],
    contact: "112",
    description: "Kamrup (Rural) station that handles crashes on NH-17 around Boko.",
  },
  // source: https://www.pratidintime.com/technology/complete-list-of-guwahati-police-stations-with-contact-details-9079117
  {
    id: 27, type: "provider", sector: "Police & Traffic",
    name: "Bhangagarh Police Station",
    area: "Bhangagarh",
    lat: 26.1575, lng: 91.7655, // CHECK coords
    org_type: "Police Station",
    offers: ["Incident report", "Ulubari and Bhangagarh flyovers"],
    contact: "112",
    description: "Station near the Ulubari and Bhangagarh flyovers.",
  },

  // ───────────── Two-wheeler Mechanics ─────────────
  // source: https://dealers.heromotocorp.com/locator/guwahati/maligaon/premia-guwahati-ms-hi-speed-bikes-hero-motocorp-in-maligaon-guwahati--6AdMcE/reviews
  {
    id: 31, type: "provider", sector: "Two-wheeler Mechanics",
    name: "Hi Speed Bikes (Hero)",
    area: "AT Road, Maligaon",
    lat: 26.1605, lng: 91.6890, // CHECK coords
    org_type: "Authorised Service Centre",
    offers: ["Hero service", "Spares", "Closes about 8:30 pm"],
    address: "Mangaldeep Building, AT Road, Maligaon, Guwahati 781011",
    description: "Authorised Hero dealer and service centre on AT Road, near LCB College.",
  },
  // source: https://bikewale.com/service-centers/royalenfield/guwahati
  {
    id: 32, type: "provider", sector: "Two-wheeler Mechanics",
    name: "Chirag Enfield (Royal Enfield)",
    area: "Maligaon",
    lat: 26.1625, lng: 91.7010, // CHECK coords
    org_type: "Authorised Service Centre",
    offers: ["Royal Enfield service", "Chain and drive parts"],
    address: "Opp. Railway Gate No. 1, Maligaon, Guwahati",
    description: "Authorised Royal Enfield service centre in Maligaon.",
  },
  // source: https://bikedekho.com/service-centers/honda/guwahati
  {
    id: 33, type: "provider", sector: "Two-wheeler Mechanics",
    name: "Bimal Honda",
    area: "Adabari, Jalukbari",
    lat: 26.1650, lng: 91.6790, // CHECK coords
    org_type: "Authorised Service Centre",
    offers: ["Honda scooter and bike service"],
    address: "Opp. Adabari Bus Stop, Jalukbari, Guwahati 781014",
    description: "Honda two-wheeler dealer about 2 km from Maligaon towards Jalukbari.",
  },
  // source: https://bikewale.com/service-centers/royalenfield/guwahati
  {
    id: 34, type: "provider", sector: "Two-wheeler Mechanics",
    name: "4Aces Enfield (Royal Enfield)",
    area: "Zoo Road",
    lat: 26.1720, lng: 91.7800, // CHECK coords
    org_type: "Authorised Service Centre",
    offers: ["Royal Enfield service"],
    address: "Plot 2, Bylane 3, Zoo Road, near V Mart, Bhaskar Nagar, Guwahati",
    contact: "7099028555",
    description: "Royal Enfield service centre in central-east Guwahati.",
  },
  {
    id: 35, type: "provider", sector: "Two-wheeler Mechanics",
    name: "Das Two-Wheeler Repair",
    area: "AT Road, Maligaon",
    lat: 26.1680, lng: 91.7150,
    org_type: "Roadside Mechanic",
    offers: ["Open till midnight", "Chain and puncture repair", "Any brand"],
    description: "Small roadside garage on AT Road that stays open late for delivery riders. Example listing for this prototype.",
    verified: "Unverified",
  },
  {
    id: 36, type: "provider", sector: "Two-wheeler Mechanics",
    name: "Beltola Puncture & Scooter Repair",
    area: "Beltola",
    lat: 26.1180, lng: 91.7930,
    org_type: "Roadside Mechanic",
    offers: ["Puncture repair", "Scooter service", "Open till 10 pm"],
    description: "Roadside scooter mechanic near Beltola Chariali. Example listing for this prototype.",
    verified: "Unverified",
  },

  // ───────────── Car Workshops ─────────────
  // source: https://www.cardekho.com/Maruti/Guwahati/car-service-center.htm
  {
    id: 41, type: "provider", sector: "Car Workshops",
    name: "Mittal Maruti Workshop",
    area: "Lokhra",
    lat: 26.1145, lng: 91.7430, // CHECK coords
    org_type: "Authorised Workshop",
    offers: ["Maruti service", "Accident and body repair"],
    address: "Mittal Autozone, near Central Jail, Lokhra, Guwahati 781029",
    description: "Maruti Suzuki authorised workshop on the Lokhra side of NH-27.",
  },
  // source: https://carhp.in/service-centres/hyundai/guwahati
  {
    id: 42, type: "provider", sector: "Car Workshops",
    name: "Lohia Hyundai",
    area: "Lokhra, NH-27",
    lat: 26.1245, lng: 91.7470, // CHECK coords
    org_type: "Authorised Workshop",
    offers: ["Hyundai service", "Near Sarusajai"],
    address: "Subham Square, opp. Sarusajai Stadium, NH-27, Lokhra, Guwahati 781040",
    description: "Hyundai dealer on NH-27 opposite Sarusajai Stadium.",
  },
  // source: https://www.cardekho.com/Hyundai/Guwahati/cardealers
  {
    id: 43, type: "provider", sector: "Car Workshops",
    name: "Mukesh Hyundai",
    area: "GS Road, Ganeshguri",
    lat: 26.1490, lng: 91.7860, // CHECK coords
    org_type: "Authorised Workshop",
    offers: ["Hyundai service"],
    address: "Kushan Plaza, GS Road, Ganeshguri, Guwahati 781007",
    description: "Hyundai dealer on GS Road at Ganeshguri.",
  },
  // source: https://carhp.in/service-centres/hyundai/guwahati
  {
    id: 44, type: "provider", sector: "Car Workshops",
    name: "Oja Hyundai",
    area: "Basistha Chariali, NH-27",
    lat: 26.1100, lng: 91.7960, // CHECK coords
    org_type: "Authorised Workshop",
    offers: ["Hyundai service", "On the way to Jorabat"],
    address: "NH-37, Basistha Chariali, Guwahati 781029",
    description: "Hyundai outlet at Basistha Chariali on the Khanapara to Jorabat side.",
  },
  // source: https://www.cardekho.com/Honda/Guwahati/car-service-center.htm
  {
    id: 45, type: "provider", sector: "Car Workshops",
    name: "Paramount Honda",
    area: "AT Road, Maligaon",
    lat: 26.1612, lng: 91.6982, // CHECK coords
    org_type: "Authorised Workshop",
    offers: ["Honda car service"],
    address: "AT Road, Railway Gate No. 1, Maligaon, Guwahati 781014",
    description: "Honda car dealer and workshop on AT Road, Maligaon.",
  },

  // ───────────── Heavy Vehicle & Tyres ─────────────
  // source: https://www.trucksbuses.com/dealers/tata/assam/guwahati/gargo-motors-guwahati
  {
    id: 51, type: "provider", sector: "Heavy Vehicle & Tyres",
    name: "Gargo Motors (Tata trucks)",
    area: "Gorchuk, NH-27",
    lat: 26.1150, lng: 91.7150, // CHECK coords
    org_type: "Truck Workshop",
    offers: ["Tata truck and bus service", "Spare parts"],
    address: "NH-37, Gorchuk, Lokhra, Guwahati",
    description: "Authorised Tata commercial vehicle dealer and workshop on the city highway.",
  },
  // source: https://www.91trucks.com/hi/truck-servicecenters/ashok-leyland/guwahati
  {
    id: 52, type: "provider", sector: "Heavy Vehicle & Tyres",
    name: "Skylight Automotive (Ashok Leyland)",
    area: "North Jalukbari, NH-27",
    lat: 26.1560, lng: 91.6600, // CHECK coords
    org_type: "Truck Workshop",
    offers: ["Ashok Leyland truck service", "First big workshop from NH-17"],
    description: "Ashok Leyland workshop behind Gauhati University, the first major truck workshop for traffic coming in from Goalpara.",
  },
  // source: https://dealers.mrftyres.com/mrf-t-s-swastik-tyres-tyre-shop-adabari-guwahati-470178/Home
  {
    id: 53, type: "provider", sector: "Heavy Vehicle & Tyres",
    name: "MRF Swastik Tyres",
    area: "Adabari, Jalukbari",
    lat: 26.1662, lng: 91.6765, // CHECK coords
    org_type: "Tyre Shop",
    offers: ["MRF tyres", "Tyre service", "9 am to 8 pm"],
    description: "MRF tyre and service outlet beside the Adabari transport hub.",
  },
  // source: https://brandshops.jktyre.com/jk-tyre-steel-wheels-kamrup-tyres-tyre-shop-basistha-charali-guwahati-102334/Home
  {
    id: 54, type: "provider", sector: "Heavy Vehicle & Tyres",
    name: "Kamrup Tyres (JK Tyre)",
    area: "Basistha Chariali, NH-27",
    lat: 26.1123, lng: 91.7978,
    org_type: "Tyre Shop",
    offers: ["JK tyres", "Wheel service"],
    description: "JK Tyre shop at Basistha Chariali on the way to Jorabat.",
  },
  // source: https://store.apollotyres.com/apollo-tyres-sartyres-tyre-shop-beharbari-kamrup-81932/Home
  {
    id: 55, type: "provider", sector: "Heavy Vehicle & Tyres",
    name: "SAR Tyres (Apollo Tyres)",
    area: "Beharbari, NH-27",
    lat: 26.1135, lng: 91.7780, // CHECK coords
    org_type: "Tyre Shop",
    offers: ["Apollo tyres", "Tyre service"],
    description: "Apollo Tyres dealer on NH-27 at Beharbari.",
  },
  {
    id: 56, type: "provider", sector: "Heavy Vehicle & Tyres",
    name: "Rabha Truck Tyre & Puncture",
    area: "Boko, NH-17",
    lat: 25.9870, lng: 91.2480,
    org_type: "Roadside Truck Mechanic",
    offers: ["Truck tyre change", "Puncture repair", "Comes to the highway"],
    description: "Roadside truck tyre mechanic next to a dhaba on NH-17 near Boko. Example listing for this prototype; no truck tyre shop in Boko could be confirmed.",
    verified: "Unverified",
  },

  // ───────────── Towing & Cranes ─────────────
  // source: https://www.indiatvnews.com/business/news/nhai-rolls-out-multi-platform-grievance-redressal-system-to-boost-highway-user-safety-transparency-2025-07-16-999117
  {
    id: 61, type: "provider", sector: "Towing & Cranes",
    name: "NHAI Highway Helpline 1033",
    area: "NH-27 and NH-17",
    lat: 26.1410, lng: 91.7885, // CHECK coords
    org_type: "Highway Helpline",
    offers: ["24x7, free", "Stuck vehicle on a national highway", "Highway potholes"],
    contact: "1033",
    description: "National highway helpline. It passes your call to the team that clears the highway. This pin is the NHAI regional office on GS Road.",
  },
  {
    id: 62, type: "provider", sector: "Towing & Cranes",
    name: "Kalita Towing Service",
    area: "Jalukbari",
    lat: 26.1500, lng: 91.6720,
    org_type: "Tow Truck",
    offers: ["Car and bike towing", "Open 24 hours"],
    description: "Tow truck based at Jalukbari for breakdowns in west Guwahati. Example listing for this prototype.",
    verified: "Unverified",
  },
  {
    id: 63, type: "provider", sector: "Towing & Cranes",
    name: "Lokhra Crane & Recovery",
    area: "Lokhra, NH-27",
    lat: 26.1100, lng: 91.7350,
    org_type: "Crane & Recovery",
    offers: ["Heavy vehicle recovery", "Crane on call"],
    description: "Crane and recovery truck for trucks and buses on the NH-27 bypass. Example listing for this prototype.",
    verified: "Unverified",
  },
  {
    id: 64, type: "provider", sector: "Towing & Cranes",
    name: "Boko Highway Recovery",
    area: "Boko, NH-17",
    lat: 25.9760, lng: 91.2250,
    org_type: "Crane & Recovery",
    offers: ["Truck towing", "45 to 60 min to reach on NH-17"],
    description: "Recovery truck covering the NH-17 widening stretch around Boko. Example listing for this prototype.",
    verified: "Unverified",
  },

  // ───────────── Schemes & Help Desks ─────────────
  // source: https://en.vikaspedia.in/viewcontent/schemesall/central-government-schemes/pm-rahat
  {
    id: 71, type: "provider", sector: "Schemes & Help Desks",
    name: "PM RAHAT: cashless accident treatment",
    area: "Ask at GMCH",
    lat: 26.1585, lng: 91.7640, // CHECK coords
    org_type: "Central Scheme",
    offers: ["Up to ₹1.5 lakh", "First 7 days after the crash", "Insured or not"],
    contact: "112",
    description: "Cashless treatment for road-accident victims, launched in February 2026 and linked to 112. A police report is part of the claim. Whether it runs in Assam yet is not confirmed; ask the hospital.",
  },
  // source: https://assamtribune.com/assam/assams-golden-hour-scheme-saves-2650-lives-offers-model-for-road-accident-care-1583232
  {
    id: 72, type: "provider", sector: "Schemes & Help Desks",
    name: "Assam Golden Hour scheme",
    area: "46 hospitals in Assam",
    lat: 26.1530, lng: 91.7600, // CHECK coords
    org_type: "State Scheme",
    offers: ["Up to ₹1.5 lakh", "7 days of treatment", "Hospitals with trauma units"],
    description: "Assam's cashless trauma care scheme for road-accident victims, running since May 2024. The list of 46 hospitals is not public, so ask the hospital whether it is covered.",
  },
  // source: https://indiatodayne.in/assam/story/assam-kamrup-m-administration-issues-helpline-numbers-to-report-damaged-roads-and-open-pits-574418-2023-06-11
  {
    id: 73, type: "provider", sector: "Schemes & Help Desks",
    name: "Damaged road helpline, Kamrup (Metro)",
    area: "DC Office, Panbazar",
    lat: 26.1860, lng: 91.7440, // CHECK coords
    org_type: "District Control Room",
    offers: ["Report potholes", "Report open pits", "Phone or WhatsApp"],
    contact: "9365429314",
    description: "District administration line for reporting damaged roads and open pits in Guwahati. The control room is also on 1077.",
  },
  // source: https://kamrupmetro.dcourts.gov.in/?p=721
  {
    id: 74, type: "provider", sector: "Schemes & Help Desks",
    name: "District Legal Services Authority",
    area: "Near Dighalipukhuri",
    lat: 26.1872, lng: 91.7520, // CHECK coords
    org_type: "Free Legal Aid",
    offers: ["Free legal help", "Accident compensation claims", "Lok Adalat"],
    contact: "6901281635",
    description: "Free legal aid for Guwahati. The first stop for a family claiming accident compensation.",
  },
  // source: https://kamrupmetro.dcourts.gov.in/?p=721
  {
    id: 75, type: "provider", sector: "Schemes & Help Desks",
    name: "Motor Accident Claims Tribunal",
    area: "Bharalumukh",
    lat: 26.1720, lng: 91.7330, // CHECK coords
    org_type: "Tribunal",
    offers: ["Compensation for injury or death"],
    description: "Tribunal that decides motor-accident compensation claims in Guwahati. Another bench sits at Ulubari.",
  },
  // source: https://comtransport.assam.gov.in/node/92396
  {
    id: 76, type: "provider", sector: "Schemes & Help Desks",
    name: "District Transport Office (AS-01)",
    area: "Betkuchi, NH-27",
    lat: 26.1190, lng: 91.7280, // CHECK coords
    org_type: "Transport Office",
    offers: ["Accident vehicle inspection", "Licence and RC", "Complaints about buses"],
    contact: "03612431376",
    description: "Guwahati's transport office at Betkuchi.",
  },
];

// Road Reports: fictional people, real places. Seeker pins sit 400 to 800 m from the
// nearest provider or hazard anchor so they do not overlap.
const ROAD_REPORTS: RedDot[] = [
  {
    id: 101, type: "seeker", sector: "Road Reports",
    name: "Pothole · reported by Dipankar B.", area: "Gorchuk, NH-27",
    lat: 26.1175, lng: 91.6985,
    org_type: "Hazard: Pothole", offers: ["Deep pothole in the left lane", "Hard to see after dark", "Two-wheelers fall here"],
    description: "A pothole about a metre wide on the city-bound lane near Gorchuk. He has seen two scooters go down here this month.",
  },
  {
    id: 102, type: "seeker", sector: "Road Reports",
    name: "Hazard · reported by Ritu S.", area: "Ulubari flyover",
    lat: 26.1680, lng: 91.7595,
    org_type: "Hazard: Pothole + no lights", offers: ["Potholes under the flyover", "Street lights out", "Pedestrians cross here"],
    description: "Potholed, unlit road under the Ulubari flyover. Repairs were ordered in October 2024 and the road is broken again.",
  },
  {
    id: 103, type: "seeker", sector: "Road Reports",
    name: "Open ditch · reported by a trucker", area: "Boko, NH-17",
    lat: 25.9840, lng: 91.2420,
    org_type: "Hazard: Construction ditch", offers: ["Open ditch beside the lane", "No barricade", "Widening work"],
    description: "Open trench from the NH-17 widening work with no barrier. A vehicle fell into a ditch on this stretch in May 2026.",
  },
  {
    id: 104, type: "seeker", sector: "Road Reports",
    name: "Pranjal K. · Truck driver", area: "Near Boko, NH-17",
    lat: 25.9720, lng: 91.2550,
    org_type: "Needs: Truck tyre", offers: ["Rear tyre burst", "Loaded 10-wheeler", "Needs a mechanic who comes out"],
    description: "His loaded truck has a burst rear tyre 2 km past Boko. The nearest truck tyre shops he knows are in Jalukbari, 50 km back.",
  },
  {
    id: 105, type: "seeker", sector: "Road Reports",
    name: "Nayan D. · Delivery rider", area: "Maligaon flyover",
    lat: 26.1570, lng: 91.7040,
    org_type: "Needs: Bike mechanic", offers: ["Clutch cable snapped", "10:30 pm", "Any garage still open"],
    description: "His clutch cable snapped coming off the Maligaon flyover. Most service centres here close by 8:30 pm.",
  },
  {
    id: 106, type: "seeker", sector: "Road Reports",
    name: "Ankita R. · Car broke down", area: "Khanapara",
    lat: 26.1255, lng: 91.8140,
    org_type: "Needs: Tow", offers: ["Hatchback, engine won't start", "Parked on the shoulder", "Tow to a workshop"],
    description: "Her car stopped on the NH-27 shoulder near Khanapara junction and won't restart. She wants it towed to a workshop.",
  },
  {
    id: 107, type: "seeker", sector: "Road Reports",
    name: "Speeding at the underpass · reported by Bikash N.", area: "Basistha Chariali",
    lat: 26.1060, lng: 91.7920,
    org_type: "Hazard: Dangerous junction", offers: ["Cars speed out of the underpass", "No zebra crossing", "School children cross"],
    description: "Since the Basistha flyover opened, cars come out of the underpass fast and children cross at the same spot.",
  },
  {
    id: 108, type: "seeker", sector: "Road Reports",
    name: "Trucks parked on the highway · reported by Mridul H.", area: "Betkuchi, NH-27",
    lat: 26.1220, lng: 91.7320,
    org_type: "Hazard: Parked trucks", offers: ["Trucks parked in the lane at night", "No reflectors"],
    description: "Trucks park in the outer lane near Betkuchi after dark without lights. Two people died here when a truck hit a parked vehicle.",
  },
  {
    id: 109, type: "seeker", sector: "Road Reports",
    name: "Juri P. · Scooter puncture", area: "Six Mile",
    lat: 26.1310, lng: 91.8090,
    org_type: "Needs: Puncture repair", offers: ["Rear tyre flat", "Near Six Mile", "Evening"],
    description: "Her scooter's rear tyre is flat near Six Mile and she can't push it far.",
  },
  {
    id: 110, type: "seeker", sector: "Road Reports",
    name: "Sharp bend · reported by Hemanta G.", area: "Jorabat",
    lat: 26.1065, lng: 91.8650,
    org_type: "Hazard: Accident-prone bend", offers: ["Bikers skid here", "Tankers turn wide", "Poor signage"],
    description: "Bend near the Jorabat junction where bikers have died and a gas tanker overturned in 2024.",
  },
  {
    id: 111, type: "seeker", sector: "Road Reports",
    name: "Rupam S. · Car needs a workshop", area: "Jalukbari",
    lat: 26.1515, lng: 91.6760,
    org_type: "Needs: Car mechanic", offers: ["Overheating", "Coming in on NH-17", "Workshop open today"],
    description: "His car is overheating as he enters the city from Goalpara. He needs a workshop that can see it today.",
  },
  {
    id: 112, type: "seeker", sector: "Road Reports",
    name: "Nilachal flyover · reported by Kabita M.", area: "Maligaon",
    lat: 26.1630, lng: 91.6930,
    org_type: "Hazard: Speeding trucks", offers: ["Trucks speed downhill", "Bikes in the same lane"],
    description: "Trucks come down the Nilachal flyover fast with bikes in the same lane. A truck hit four bikes here.",
  },
];

export const GUWAHATI_DOTS: RedDot[] = [...PROVIDERS, ...ROAD_REPORTS];
