// Pink Dots Tiruppur: provider dots.
// Real organisations carry a "// source:" line. Rows with verified: "Unverified" are
// fictional personas or placeholders whose exact location is not confirmed.
// Coordinates are neighbourhood-level approximations.
// Rows marked "// CHECK coords" need a pin check on Google Maps before launch.
// Private hostels and day-care centres come from online directories. Sakhi must say
// "listed, not checked" for these and never call them safe or verified.

export const SECTORS = [
  "Women's Hostels & PGs",
  "Creches & Child Care",
  "Anganwadis & Govt Child Care",
  "Jobs: Garment & Knitwear",
  "Skills & Training",
  "Safety & Support",
  "Health",
  "Finance & SHGs",
  "Women Requests",
] as const;

export interface PinkDot {
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

export const TIRUPPUR_PROVIDER_DOTS: PinkDot[] = [
  // ───────────── Women's Hostels & PGs ─────────────
  // source: https://apparelresources.com/business-news/manufacturing/tea-seeks-worker-housing-to-ease-tiruppurs-labour-crunch/
  {
    id: 1, type: "provider", sector: "Women's Hostels & PGs",
    name: "Women's Hostel, Neruperichal (government)",
    area: "Neruperichal",
    lat: 11.1600, lng: 77.3380, // CHECK coords
    org_type: "Government Women's Hostel",
    offers: ["Women-only stay", "Government-built", "Ask about vacancy"],
    description: "Existing government women's hostel at Neruperichal named in 2026 news reports. The Tiruppur Exporters' Association has asked for it to be handed over to house garment workers, so who runs it and who can apply is not confirmed.",
  },
  // source: https://in.worldorgs.com/catalog/tiruppur/hostel
  {
    id: 2, type: "provider", sector: "Women's Hostels & PGs",
    name: "YWCA Ladies Hostel",
    area: "Pethichettipuram, Rayapuram",
    lat: 11.1125, lng: 77.3385, // CHECK coords
    org_type: "NGO Ladies Hostel",
    offers: ["Women-only stay", "Near railway station", "Run by YWCA"],
    address: "Nanjappa School Road, Pethichettipuram, Rayapuram, Tiruppur 641687",
    description: "Ladies hostel listed under the YWCA name near Tiruppur railway station. Listed in an online directory, so check fees, curfew and vacancy by phone or visit.",
  },
  // source: https://in.worldorgs.com/catalog/tiruppur/hostel
  {
    id: 3, type: "provider", sector: "Women's Hostels & PGs",
    name: "Vidhya Ladies Hostel",
    area: "Bungalow Stop, Tiruppur North",
    lat: 11.1155, lng: 77.3410, // CHECK coords
    org_type: "Private Ladies Hostel",
    offers: ["Women-only stay", "Town centre", "Near bus routes"],
    address: "75/76 Linge Kuppanna Gounder Street, Bungalow Stop, Tiruppur 641602",
    description: "Private ladies hostel near the Bungalow bus stop in the town centre. Listed in an online directory, not checked in person.",
  },
  // source: https://in.worldorgs.com/catalog/tiruppur/hostel
  {
    id: 4, type: "provider", sector: "Women's Hostels & PGs",
    name: "Annai Ladies Hostel",
    area: "Ram Nagar, Kumar Nagar",
    lat: 11.1205, lng: 77.3330, // CHECK coords
    org_type: "Private Ladies Hostel",
    offers: ["Women-only stay", "Near Avinashi Road", "Call to check vacancy"],
    address: "1st Street, Ram Nagar Main Road, Kumar Nagar, Tiruppur 641602",
    description: "Private ladies hostel off Avinashi Road in Kumar Nagar, close to units along the road. Listed in an online directory, not checked in person.",
  },
  // source: https://in.worldorgs.com/catalog/tiruppur/hostel
  {
    id: 5, type: "provider", sector: "Women's Hostels & PGs",
    name: "Sree Sai Ladies Hostel",
    area: "Gandhi Nagar, Velampalayam",
    lat: 11.1335, lng: 77.3210, // CHECK coords
    org_type: "Private Ladies Hostel",
    offers: ["Women-only stay", "Avinashi Road side", "Near Anupparpalayam units"],
    address: "15 Gandhi Nagar 5th Street, Avinashi-Tiruppur Road, Velampalayam, Tiruppur 641603",
    description: "Private ladies hostel in Gandhi Nagar with more than one listed branch in the area. Workers in Anupparpalayam and Velampalayam units can walk or take a short bus ride.",
  },
  // source: https://in.worldorgs.com/catalog/tiruppur/hostel
  {
    id: 6, type: "provider", sector: "Women's Hostels & PGs",
    name: "Sara Ladies Hostel",
    area: "Lakshmi Nagar, PN Road",
    lat: 11.1225, lng: 77.3480, // CHECK coords
    org_type: "Private Ladies Hostel",
    offers: ["Women-only stay", "PN Road", "Call to check vacancy"],
    address: "Lakshmi Nagar, PN Road, Tiruppur 641602",
    description: "Private ladies hostel on Perumanallur (PN) Road north of the town centre. Listed in an online directory, not checked in person.",
  },
  // source: https://in.worldorgs.com/catalog/tiruppur/hostel
  {
    id: 7, type: "provider", sector: "Women's Hostels & PGs",
    name: "Rumana Ladies Hostel",
    area: "Duraisamy Puram, near Railway Station",
    lat: 11.1100, lng: 77.3450, // CHECK coords
    org_type: "Private Ladies Hostel",
    offers: ["Women-only stay", "Near railway station", "Town centre"],
    address: "11 Duraisamy Puram 2nd Street, near Railway Station, PN Road, Tiruppur 641602",
    description: "Private ladies hostel a short walk from Tiruppur railway station. Useful for women who have just arrived by train and need a first room.",
  },
  // source: https://in.worldorgs.com/catalog/tiruppur/hostel
  {
    id: 8, type: "provider", sector: "Women's Hostels & PGs",
    name: "Kathiravan Women's Hostel",
    area: "KVR Nagar, Mangalam Road",
    lat: 11.0985, lng: 77.3255, // CHECK coords
    org_type: "Private Ladies Hostel",
    offers: ["Women-only stay", "Mangalam Road", "West Tiruppur"],
    address: "Mangalam Road, KVR Nagar, Karuvampalayam, Tiruppur 641604",
    description: "Private women's hostel on Mangalam Road in west Tiruppur. Listed in an online directory, not checked in person.",
  },
  // source: https://in.worldorgs.com/catalog/tiruppur/hostel
  {
    id: 9, type: "provider", sector: "Women's Hostels & PGs",
    name: "Aiswarya Ladies Shelter",
    area: "Kuppusamypuram, Dharapuram Road",
    lat: 11.0920, lng: 77.3475, // CHECK coords
    org_type: "Private Ladies Hostel",
    offers: ["Women-only stay", "Dharapuram Road", "Near Govt hospital"],
    address: "Dharapuram Main Road, Kuppusamypuram, Renganathapuram, Tiruppur 641604",
    description: "Private ladies hostel on Dharapuram Road, south of the town centre. Listed in an online directory, not checked in person.",
  },
  // source: https://in.worldorgs.com/catalog/tiruppur/hostel
  {
    id: 10, type: "provider", sector: "Women's Hostels & PGs",
    name: "Meenakshi Ladies Hostel",
    area: "Ramraj Nagar, Puliyamara Thottam",
    lat: 11.1015, lng: 77.3330, // CHECK coords
    org_type: "Private Ladies Hostel",
    offers: ["Women-only stay", "Near old bus stand", "Call to check vacancy"],
    address: "New Market Street, Ramraj Nagar, Puliyamara Thottam, Tiruppur 641604",
    description: "Private ladies hostel in Puliyamara Thottam, near the old bus stand side of town. Listed in an online directory, not checked in person.",
  },

  {
    id: 41, type: "provider", sector: "Women's Hostels & PGs",
    name: "Sunita Majhi",
    area: "Anupparpalayam",
    lat: 11.1310, lng: 77.3260,
    org_type: "Room Finder (Hindi-speaking)",
    offers: ["Shared rooms for women", "Rs 2,000 to 3,500 a month", "Checks landlord first"],
    contact: "+91 90000 00004",
    verified: "Unverified",
    description: "Former knitwear checker from Sundargarh in Odisha who helps new women workers find shared rooms and ladies hostels near Avinashi Road. Takes no fee from the women and visits each room before suggesting it.",
  },

  // ───────────── Creches & Child Care ─────────────
  // source: https://www.proeves.com/tirupur/gandhi-nagar/preschool-gandhi-nagar/rainbow-kids-play-school-and-day-care-7408
  {
    id: 11, type: "provider", sector: "Creches & Child Care",
    name: "Rainbow Kids Play School and Day Care",
    area: "Pichampalayam Cross, Gandhi Nagar",
    lat: 11.1365, lng: 77.3255, // CHECK coords
    org_type: "Private Day Care",
    offers: ["Day care 8:30 am to 8:30 pm", "Ages 1.5 to 6", "Mon to Fri"],
    address: "6/2 Pichampalayam Cross, Gandhi Nagar, Velampalayam, Tiruppur 641603",
    description: "Play school with a listed day-care service from 8:30 am to 8:30 pm on weekdays, for children aged 1.5 to 6. These hours cover a full garment shift, but fees and current hours need a phone check.",
  },
  // source: https://www.proeves.com/tamil-nadu/tiruppur/ayappan-kovil/creche-ayappan-kovil/hello-kids-haven-3275
  {
    id: 12, type: "provider", sector: "Creches & Child Care",
    name: "Hello Kids Haven",
    area: "College Road, opp. Ayyappan Kovil",
    lat: 11.1165, lng: 77.3285, // CHECK coords
    org_type: "Private Day Care",
    offers: ["Full-day care 9 am to 6 pm", "Hourly care", "From age 1.5"],
    address: "11, 2nd Cross Street, opposite Ayyappan Kovil, College Road, Tiruppur",
    description: "Preschool that lists full-day, half-day and hourly day care from 9 am to 6 pm on weekdays. Children from 1.5 years are taken.",
  },
  // source: https://proeves.com//tirupur/kangeyam-road/daycare-kangeyam-road/kangaroo-kids-international-preschool-7409
  {
    id: 13, type: "provider", sector: "Creches & Child Care",
    name: "Kangaroo Kids International Preschool (Day Care)",
    area: "Amarjothi A.S. Nagar, Kangeyam Road",
    lat: 11.0985, lng: 77.3680, // CHECK coords
    org_type: "Private Day Care",
    offers: ["Day care 8:30 am to 7:30 pm", "From age 1.5", "Mon to Fri"],
    address: "37, 1st Street, Amarjothi A.S. Nagar, Kangeyam Road, Tiruppur 641604",
    description: "Preschool chain branch with a listed day care from 8:30 am to 7:30 pm on weekdays. Fees are likely higher than home-based day care.",
  },
  // source: https://lentlo.com/businesses/little-mahilam-preschool-play-school-pre-school-in-tiruppur-day-care-tiruppur-montessori-nursery-school-in-tiruppur
  {
    id: 14, type: "provider", sector: "Creches & Child Care",
    name: "Little Mahilam Preschool and Day Care",
    area: "Amarjothi A.S. Nagar, Kangeyam Road",
    lat: 11.1005, lng: 77.3715, // CHECK coords
    org_type: "Private Day Care",
    offers: ["Day care", "Montessori preschool", "Kangeyam Road"],
    address: "No. 56/11A, Amarjothi A.S. Nagar, Kangeyam Road, Tiruppur 641604",
    description: "Preschool that lists day care along with Montessori classes. Day-care hours are not published, so ask whether it covers a full shift.",
  },
  // source: https://give.do/discover/7PU/social-awareness-and-voluntary-education/
  // source: https://agritech.tnau.ac.in/govt_schemes_services/pdf/NGOs-APPROVED%20BY%20MAHALIR%20THITTAM.pdf
  {
    id: 15, type: "provider", sector: "Creches & Child Care",
    name: "SAVE (Social Awareness and Voluntary Education)",
    area: "K.N.P. Colony, Dharapuram Road",
    lat: 11.0850, lng: 77.3580, // CHECK coords
    org_type: "NGO Child Care",
    offers: ["Centres for under-5s of working mothers", "Bridge schools for migrant children", "Women workers' help"],
    address: "No. 5, Iswarya Nagar, Dharapuram Road, K.N.P. Colony Post, Tiruppur 641608",
    description: "Tiruppur NGO that has worked with garment workers and migrant children for over 25 years. It reports running centres for under-5 children of working mothers and bridge schools that move migrant children into regular school.",
  },
  {
    id: 16, type: "provider", sector: "Creches & Child Care",
    name: "Meena Devi",
    area: "15 Velampalayam",
    lat: 11.1450, lng: 77.3080, // CHECK coords
    org_type: "Home Day Care",
    offers: ["7 am to 7 pm", "Rs 1,500 a month with lunch", "Hindi spoken"],
    contact: "+91 90000 00001",
    verified: "Unverified",
    description: "Runs a home day care for 6 migrant workers' children aged 1 to 5 and has room for 6 more. Came from Gaya in Bihar 9 years ago and worked in a knitwear unit before her son was born.",
  },
  {
    id: 17, type: "provider", sector: "Creches & Child Care",
    name: "Lalita Munda",
    area: "Veerapandi",
    lat: 11.0675, lng: 77.3420,
    org_type: "Home Day Care",
    offers: ["8 am to 8 pm", "Ages 1 to 6", "Hindi and Tamil spoken"],
    contact: "+91 90000 00002",
    verified: "Unverified",
    description: "Minds up to 8 children at home near Veerapandi Pirivu, with 5 years of experience. Mothers on Palladam Road units drop children before the 8 am shift.",
  },

  // ───────────── Anganwadis & Govt Child Care ─────────────
  // source: https://afternoonnews.in/article/tiruppur-collector-inaugurates-icds-rally
  {
    id: 18, type: "provider", sector: "Anganwadis & Govt Child Care",
    name: "ICDS District Programme Office, Tiruppur",
    area: "District Collectorate, Palladam Road",
    lat: 11.0770, lng: 77.3190, // CHECK coords
    org_type: "ICDS Office",
    offers: ["Find nearest anganwadi", "Nutrition for under-6s", "Pregnant and new mother support"],
    description: "District office of the Integrated Child Development Services scheme, which runs anganwadis across Tiruppur. Ask here which anganwadi covers your street and how to enrol a child under 6. Office location inside the Collectorate is not confirmed.",
  },
  // source: https://www.mysarkarinaukri.com/find/government-tamil-nadu-jobs/162084
  {
    id: 19, type: "provider", sector: "Anganwadis & Govt Child Care",
    name: "District Child Protection Unit (DCPU), Tiruppur",
    area: "District Collectorate, Palladam Road",
    lat: 11.0755, lng: 77.3200, // CHECK coords
    org_type: "Government Child Protection",
    offers: ["Child protection help", "Child care institution referral", "Childline 1098 link"],
    address: "Room No. 705, 7th Floor, District Collectorate Campus, Palladam Road, Tiruppur 641604",
    description: "Government unit that handles child protection cases and places children in care homes when needed. Mothers can ask here about safe care for a child they cannot keep with them.",
  },
  {
    id: 20, type: "provider", sector: "Anganwadis & Govt Child Care",
    name: "Anganwadi Centre (ICDS), Veerapandi area",
    area: "Veerapandi",
    lat: 11.0610, lng: 77.3360, // CHECK coords
    org_type: "Anganwadi Centre",
    offers: ["Free pre-school for 3 to 6", "Hot meal", "Growth check"],
    verified: "Unverified",
    description: "Placeholder for the anganwadi that serves Veerapandi. Anganwadis run in every ward, but the exact centre and its hours are not confirmed, so check with the ICDS office first.",
  },
  {
    id: 21, type: "provider", sector: "Anganwadis & Govt Child Care",
    name: "Anganwadi Centre (ICDS), Anupparpalayam area",
    area: "Anupparpalayam",
    lat: 11.1290, lng: 77.3295, // CHECK coords
    org_type: "Anganwadi Centre",
    offers: ["Free pre-school for 3 to 6", "Hot meal", "Take-home ration"],
    verified: "Unverified",
    description: "Placeholder for the anganwadi that serves Anupparpalayam. Anganwadis usually close in the early afternoon, so working mothers may still need day care after that.",
  },

  // ───────────── Jobs: Garment & Knitwear ─────────────
  // source: https://apparelresources.com/business-news/sustainability/eastman-exports-eegcpl-empowers-12000-women-grow-succeed/
  // source: https://www.tofler.in/eastman-exports-private-limited/company/U05110TZ1998PTC008644
  {
    id: 22, type: "provider", sector: "Jobs: Garment & Knitwear",
    name: "Eastman Exports Global Clothing",
    area: "Sri Lakshmi Nagar, Pitchampalayam Pudur",
    lat: 11.1385, lng: 77.3310, // CHECK coords
    org_type: "Knitwear Exporter",
    offers: ["Tailor and checker jobs", "Most workers are women", "Company hostel and transport"],
    address: "5/591 Sri Lakshmi Nagar, Pitchampalayam Pudur, Tiruppur 641603",
    description: "Large knitwear exporter with many factories in and around Tiruppur, where women are reported to be 60 to 70 percent of workers. It reports offering hostel and transport for women workers. Ask about hostel rules on going out before joining.",
  },
  // source: https://afternoonnews.in/article/collector-inspects-knitwear-at-netaji-apparel-park/
  {
    id: 23, type: "provider", sector: "Jobs: Garment & Knitwear",
    name: "Netaji Apparel Park",
    area: "Eettiveerampalayam, New Tiruppur",
    lat: 11.1700, lng: 77.3600, // CHECK coords
    org_type: "Apparel Park",
    offers: ["50+ knitwear units", "Tailor and helper jobs", "Women's and men's wear"],
    description: "Apparel park of 166 acres with more than 50 export knitwear units and over 15,000 workers. Women can go unit to unit at the gate to ask about tailor, checker and helper jobs.",
  },
  // source: https://in.thedollarbusiness.com/magazine/our-quality-is-much-superior-to-that-of-bangladesh-b-m-boopathi-ceo-tekic/3194
  {
    id: 24, type: "provider", sector: "Jobs: Garment & Knitwear",
    name: "Tiruppur Export Knitwear Industrial Complex (TEKIC)",
    area: "Mudalipalayam",
    lat: 11.0650, lng: 77.3050, // CHECK coords
    org_type: "Industrial Complex",
    offers: ["About 189 knitwear units", "Checker and tailor jobs", "Shift work"],
    description: "Knitwear industrial complex of about 100 acres set up in 1990, with around 189 units and over 20,000 workers. Many units hire women for tailoring, checking and packing.",
  },
  // source: https://www.careers360.com/colleges/nift-tea-college-of-knitwear-fashion-tirupur
  {
    id: 25, type: "provider", sector: "Jobs: Garment & Knitwear",
    name: "SIDCO Industrial Estate, Mudalipalayam",
    area: "Mudalipalayam SIDCO",
    lat: 11.0600, lng: 77.3130, // CHECK coords
    org_type: "Industrial Estate",
    offers: ["Small garment units", "Helper and packer jobs", "Next to TEKIC"],
    description: "Government small-industry estate next to TEKIC, home to small knitwear and job-work units. Smaller units often hire walk-in helpers and packers.",
  },
  // source: https://howtoexportimport.com/How-to-get-Certificate-of-Origin-non-preferential--1624.aspx
  {
    id: 26, type: "provider", sector: "Jobs: Garment & Knitwear",
    name: "Tiruppur Exporters' Association (TEA)",
    area: "Appachi Nagar",
    lat: 11.1245, lng: 77.3405, // CHECK coords
    org_type: "Industry Association",
    offers: ["Member exporter list", "Worker housing push", "Industry grievance route"],
    address: "62 Appachi Nagar Main Road, Tiruppur 641607",
    description: "Association of knitwear exporters, set up in 1990, that also runs NIFT-TEA college and TEKIC. In 2026 it asked the state for worker hostels and family housing in Tiruppur.",
  },
  {
    id: 27, type: "provider", sector: "Jobs: Garment & Knitwear",
    name: "Pushpa Tirkey",
    area: "Anupparpalayam",
    lat: 11.1250, lng: 77.3235,
    org_type: "Line Supervisor (Hindi-speaking)",
    offers: ["Tailor and checker openings", "Hindi help at interview", "Units on Avinashi Road"],
    contact: "+91 90000 00003",
    verified: "Unverified",
    description: "Line supervisor from Simdega in Jharkhand with 11 years in Avinashi Road knitwear units. Tells new Hindi-speaking women which units are hiring and goes with them to the first interview.",
  },

  // ───────────── Skills & Training ─────────────
  // source: https://atdcindia.co.in/wp-content/uploads/2025/02/AVI-Brochure-NHO-JAN-2025-.pdf
  {
    id: 28, type: "provider", sector: "Skills & Training",
    name: "ATDC-KTM Centre of Excellence, Tiruppur",
    area: "Kaikattipudur, Avinashi",
    lat: 11.1780, lng: 77.2850, // CHECK coords
    org_type: "Apparel Training Centre",
    offers: ["Sewing machine operator course", "Pattern making", "Placement help"],
    address: "D.No. 5/147, Tirupur Main Road, Kaikattipudur Post, Avinashi 641654",
    contact: "88700 08553",
    description: "Apparel Training and Design Centre run with the Apparel Export Promotion Council, training machine operators and supervisors for the knitwear industry. An older listing places ATDC at the AEPC building, Indira Nagar, so confirm the current site by phone.",
  },
  // source: https://www.careers360.com/colleges/nift-tea-college-of-knitwear-fashion-tirupur
  {
    id: 29, type: "provider", sector: "Skills & Training",
    name: "NIFT-TEA College of Knitwear Fashion",
    area: "East of TEKIC, Mudalipalayam",
    lat: 11.0675, lng: 77.3115, // CHECK coords
    org_type: "Fashion College",
    offers: ["Short upskilling courses", "Knitwear diplomas", "Industry links"],
    address: "East of TEKIC, Mudalipalayam, Tiruppur 641606",
    description: "Knitwear fashion college set up by the Tiruppur Exporters' Association. It runs degree courses and short courses for people already in the industry, so it suits women aiming for checker or supervisor roles.",
  },

  // ───────────── Safety & Support ─────────────
  // source: https://www.livelaw.in/job-updates/center-administrator-and-field-worker-vacancy-at-one-stop-centre-tiruppur-district-307339
  {
    id: 30, type: "provider", sector: "Safety & Support",
    name: "Sakhi One Stop Centre, Tiruppur",
    area: "Tiruppur (run through District Social Welfare Office)",
    lat: 11.0785, lng: 77.3170, // CHECK coords
    org_type: "One Stop Centre",
    offers: ["Help for violence and harassment", "Short stay shelter", "Women Helpline 181"],
    contact: "181",
    description: "Government centre for women facing violence, with police, medical, legal and counselling help and a short stay shelter. Its exact building is not confirmed, so call 181 and ask to be routed to the Tiruppur centre.",
  },
  // source: https://tnsocialwelfare.tn.gov.in/sites/default/files/2025-02/Tiruppur-LC.pdf
  {
    id: 31, type: "provider", sector: "Safety & Support",
    name: "All Women Police Station, Tiruppur North",
    area: "Kumaran Road",
    lat: 11.1060, lng: 77.3440, // CHECK coords
    org_type: "All Women Police Station",
    offers: ["Complaints by women", "Workplace harassment", "Domestic violence"],
    address: "AWPS North, Kumaran Road, Tiruppur",
    contact: "63825 35336",
    description: "Police station staffed by women officers for complaints from women and children. Its inspector sits on the district committee for workplace sexual harassment complaints.",
  },
  // source: https://tnsocialwelfare.tn.gov.in/sites/default/files/2025-02/Tiruppur-LC.pdf
  {
    id: 32, type: "provider", sector: "Safety & Support",
    name: "All Women Police Station, Tiruppur South",
    area: "Dharapuram Road",
    lat: 11.0990, lng: 77.3485, // CHECK coords
    org_type: "All Women Police Station",
    offers: ["Complaints by women", "Workplace harassment", "Domestic violence"],
    address: "AWPS South, Dharapuram Road, Tiruppur",
    contact: "94981 74373",
    description: "All women police station for the south side of the city. Women living on Dharapuram, Palladam and Kangeyam roads can file complaints here.",
  },
  // source: https://tiruppur.dcourts.gov.in/
  {
    id: 33, type: "provider", sector: "Safety & Support",
    name: "District Legal Services Authority (DLSA), Tiruppur",
    area: "Combined Court Campus, Palladam Road",
    lat: 11.0740, lng: 77.3160, // CHECK coords
    org_type: "Free Legal Aid",
    offers: ["Free lawyer for women", "Wage and labour disputes", "Lok Adalat"],
    address: "ADR Building, Combined Court Campus, Palladam Road, Tiruppur 641604",
    description: "Court-run body that gives free legal aid, and all women qualify for it under the Legal Services Authorities Act. Women can come here about unpaid wages, withheld documents or family cases.",
  },
  // source: https://tnsocialwelfare.tn.gov.in/sites/default/files/2025-02/Tiruppur-LC.pdf
  {
    id: 34, type: "provider", sector: "Safety & Support",
    name: "District Social Welfare Office, Tiruppur",
    area: "District Collectorate, Palladam Road",
    lat: 11.0765, lng: 77.3210, // CHECK coords
    org_type: "Government Office",
    offers: ["Working women's hostel queries", "Workplace harassment committee", "Women's welfare schemes"],
    address: "Room No. 35 and 36, Ground Floor, District Collectorate, Tiruppur 641604",
    contact: "dswo.tpr@gmail.com",
    description: "District office of the Social Welfare department, which runs the One Stop Centre and the Local Committee for workplace harassment complaints. Ask here about government working women's hostels in the district.",
  },

  // ───────────── Health ─────────────
  // source: https://timesofcollege.com/college/government-medical-college-tiruppur-206532
  {
    id: 35, type: "provider", sector: "Health",
    name: "Government Medical College Hospital, Tiruppur",
    area: "Dharapuram Road",
    lat: 11.0950, lng: 77.3530, // CHECK coords
    org_type: "Government Hospital",
    offers: ["Free treatment", "Maternity and child care", "24-hour casualty"],
    address: "18 Dharapuram Road, Tiruppur 641604",
    description: "Main government hospital for Tiruppur district, attached to the medical college. Treatment and deliveries are free.",
  },
  // source: https://webjosh.com/article/esic-hospital-in-tiruppur-a-huge-relief-for-lakhs-of-industrial-workers-1709313607-98
  {
    id: 36, type: "provider", sector: "Health",
    name: "ESIC Hospital, Tiruppur",
    area: "Pooluvapatti-Thirumuruganpoondi Ring Road",
    lat: 11.1420, lng: 77.2980, // CHECK coords
    org_type: "ESI Hospital",
    offers: ["Free care with ESI card", "Maternity benefit", "100 beds"],
    address: "Pooluvapatti to Thirumuruganpoondi Ring Road, Tiruppur 641603",
    description: "100-bed Employees' State Insurance hospital for registered factory workers and their families. A worker with an ESI card gets free treatment and can claim paid maternity leave through ESI.",
  },
  // source: https://www.publicservicesmap.in/hospitals/centre/govt-nallur-uphc-tiruppur-tn-tiruppur-tamil-nadu-hosp33g184594
  {
    id: 37, type: "provider", sector: "Health",
    name: "Urban Primary Health Centre, Nallur",
    area: "Nallur, Kangeyam Road",
    lat: 11.0930, lng: 77.3850, // CHECK coords
    org_type: "Urban PHC",
    offers: ["Free OPD", "Pregnancy check-ups", "Child vaccination"],
    address: "Kangeyam Road, Nallur, Tiruppur",
    description: "Government urban health centre on Kangeyam Road. Pregnant women and young children get free check-ups and vaccines here.",
  },

  // ───────────── Finance & SHGs ─────────────
  // source: https://tnsocialwelfare.tn.gov.in/sites/default/files/2025-02/Tiruppur-LC.pdf
  {
    id: 38, type: "provider", sector: "Finance & SHGs",
    name: "Mahalir Thittam / TNSRLM, DRDA Tiruppur",
    area: "District Collectorate, Palladam Road",
    lat: 11.0780, lng: 77.3205, // CHECK coords
    org_type: "SHG Programme Office",
    offers: ["Join a women's SHG", "SHG bank loans", "Livelihood training"],
    address: "District Rural Development Agency (DRDA), 3rd Floor, District Collectorate, Tiruppur",
    contact: "drdatup@gmail.com",
    description: "District office of the Tamil Nadu women's self-help group programme under DRDA. Women can ask how to join or form an SHG and get group bank loans.",
  },
  // source: https://ifsclookup.in/ifsc/IOBA0000095
  {
    id: 39, type: "provider", sector: "Finance & SHGs",
    name: "Indian Overseas Bank, Tiruppur Branch",
    area: "Kumaran Road",
    lat: 11.1080, lng: 77.3470, // CHECK coords
    org_type: "Bank",
    offers: ["Zero-balance Jan Dhan account", "SHG bank linkage", "Remittance home"],
    address: "122 Kumaran Road, Tiruppur (IFSC IOBA0000095)",
    description: "Public sector bank branch on Kumaran Road in the town centre. Migrant women can open a basic account to receive wages and send money home.",
  },
  // source: https://www.searchifsc.com/INDIAN_BANK/TAMIL_NADU/COIMBATORE/KAMARAJ_ROAD_(TIRUPUR)
  {
    id: 40, type: "provider", sector: "Finance & SHGs",
    name: "Indian Bank, Kamaraj Road Branch",
    area: "Kamaraj Road",
    lat: 11.1040, lng: 77.3405, // CHECK coords
    org_type: "Bank",
    offers: ["Zero-balance Jan Dhan account", "SHG loans", "Small savings"],
    address: "Kamaraj Road, Tiruppur (IFSC IDIB000T109)",
    description: "Public sector bank branch on Kamaraj Road near the old bus stand. Women in an SHG can ask here about group loans.",
  },
];
