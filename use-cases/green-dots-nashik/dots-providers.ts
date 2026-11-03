// Green Dots Nashik: provider dots.
// Real organisations carry a "// source:" line. Expert rows (sector "Experts & Agents")
// are fictional personas. Coordinates are neighbourhood-level approximations.
// Rows marked "// CHECK coords" need a pin check on Google Maps before launch.

export const SECTORS = [
  "Farm Labour",
  "Equipment Repair",
  "Machinery Rental",
  "Cold Storage & Warehousing",
  "Mandi & Market Access",
  "Finance & Insurance",
  "Government & Training",
  "Experts & Agents",
  "Farmer Requests",
] as const;

export interface GreenDot {
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
  verified?: string; // "Unverified" on fictional expert rows
}

export const NASHIK_PROVIDER_DOTS: GreenDot[] = [
  // ───────────── Mandi & Market Access ─────────────
  // source: https://en.wikipedia.org/wiki/Lasalgaon_onion
  {
    id: 1, type: "provider", sector: "Mandi & Market Access",
    name: "Lasalgaon Agricultural Produce Market Committee (APMC)",
    area: "Station Road, Lasalgaon",
    lat: 20.1503, lng: 74.2330, // CHECK coords
    org_type: "APMC Market",
    offers: ["Onion auction", "Daily price discovery", "NAFED/NCCF onion procurement"],
    description: "Onion wholesale market with open auctions on working days. Traders across India use its daily rate as the onion reference price.",
  },
  // source: https://en.wikipedia.org/wiki/Vinchur
  {
    id: 2, type: "provider", sector: "Mandi & Market Access",
    name: "Lasalgaon APMC, Vinchur Sub-Market Yard",
    area: "Vinchur",
    lat: 20.1080, lng: 74.2280, // CHECK coords
    org_type: "APMC Sub-Yard",
    offers: ["Onion auction", "NCCF procurement centre"],
    description: "Onion sub-market run under the Lasalgaon APMC. Farmers south of Lasalgaon can sell here without the queue at the main yard.",
  },
  // source: https://en.wikipedia.org/wiki/Pimpalgaon_Baswant
  {
    id: 3, type: "provider", sector: "Mandi & Market Access",
    name: "Pimpalgaon Baswant Agricultural Produce Market Committee (APMC)",
    area: "Mumbai-Agra Highway, Pimpalgaon Baswant",
    lat: 20.1700, lng: 73.9930, // CHECK coords
    org_type: "APMC Market",
    offers: ["Onion auction", "Tomato auction", "Grape trade"],
    description: "Wholesale market for onion and tomato on the Mumbai-Agra highway. It is one of the NAFED/NCCF onion procurement points in Niphad taluka.",
  },
  // source: https://yappe.in/maharashtra/nashik/shri-ram-fruit-co/595377
  {
    id: 4, type: "provider", sector: "Mandi & Market Access",
    name: "Nashik APMC, Sharad Chandra Pawar Market Yard",
    area: "Peth Road, Makhmalabad",
    lat: 20.0294, lng: 73.7927,
    org_type: "APMC Market",
    offers: ["Vegetable auction", "Fruit wholesale", "Daily market"],
    address: "Sharad Chandra Pawar Market Yard, Peth Road, Nashik",
    description: "Main APMC yard for Nashik city, with a daily fruit and vegetable auction. Farmers from Dindori and Nashik taluka bring tomato, leafy vegetables and grapes here.",
  },
  // source: https://www.indiacustomercare.com/maharashtra-state-agri-marketing-board-msamb-contact-no
  {
    id: 5, type: "provider", sector: "Mandi & Market Access",
    name: "Chandwad Agricultural Produce Market Committee (APMC)",
    area: "Chandwad",
    lat: 20.3250, lng: 74.2430, // CHECK coords
    org_type: "APMC Market",
    offers: ["Onion auction", "Maize auction"],
    address: "APMC, A/P Chandwad, Tal. Chandwad, Dist. Nashik 423101",
    description: "Taluka-level APMC for Chandwad. Onion and maize growers north of Lasalgaon sell here with a shorter haul.",
  },
  // source: https://www.gulfood.com/exhibitors/sahyadri-farms-post-harvest-care-limited
  {
    id: 6, type: "provider", sector: "Mandi & Market Access",
    name: "Sahyadri Farms (Sahyadri Farmers Producer Company)",
    area: "Mohadi, Dindori",
    lat: 20.1520, lng: 73.8850, // CHECK coords
    org_type: "Farmer Producer Company",
    offers: ["Grape export buying", "Tomato processing", "Pack house", "FPC membership"],
    address: "Gat No. 314/1 and 314/2/1, Mohadi-Dindori Road, A/P Mohadi, Tal. Dindori, Nashik 422207",
    description: "Farmer-owned company that buys, packs and exports grapes, tomatoes and other produce. Member farmers get a fixed buyer and access to its pack house and cold chain.",
  },

  // ───────────── Cold Storage & Warehousing ─────────────
  // source: https://dae.gov.in/barcs-innovative-combination-of-radiation-technology-and-onion-specific-cold-storage-for-extension-of-shelf-life-while-maintaining-the-quality-of-onions/
  {
    id: 7, type: "provider", sector: "Cold Storage & Warehousing",
    name: "KRUSHAK Irradiation Centre (BARC), Lasalgaon",
    area: "Lasalgaon",
    lat: 20.1555, lng: 74.2455, // CHECK coords
    org_type: "Government Facility",
    offers: ["Onion irradiation", "Onion cold storage (250 t)"],
    description: "BARC food irradiation plant with a 250-tonne onion cold store added in December 2023. Low-dose irradiation slows sprouting so onions keep longer.",
  },
  // source: https://www.freepressjournal.in/pune/nashik-rotten-onions-worms-and-maggots-found-at-lasalgaon-cwc-godown-questions-raised-over-storage
  {
    id: 8, type: "provider", sector: "Cold Storage & Warehousing",
    name: "Central Warehousing Corporation, Lasalgaon Warehouse",
    area: "Lasalgaon-Manmad Road, Lasalgaon",
    lat: 20.1630, lng: 74.2425, // CHECK coords
    org_type: "Warehouse",
    offers: ["Bulk onion storage", "Buffer stock godown", "Warehouse receipts"],
    description: "CWC godown used for government onion buffer stock. Farmer groups and traders can ask about rented space and warehouse receipts.",
  },
  // source: https://www.apeda.gov.in/apedahindi/announcements/list_of_pack_house_fruits_vegetables.pdf
  {
    id: 9, type: "provider", sector: "Cold Storage & Warehousing",
    name: "Shramik Fruits Pack House",
    area: "Pimpalgaon Baswant",
    lat: 20.1785, lng: 73.9815, // CHECK coords
    org_type: "Pack House",
    offers: ["Grape packing", "Pomegranate packing", "Pre-cooling"],
    address: "Gat No. 681/A, Pimpalgaon (B.), Tal. Niphad, Dist. Nashik",
    description: "APEDA-recognised pack house for export grapes and pomegranate, certificate valid to December 2026. Grape growers near Pimpalgaon can pack and pre-cool for export here.",
  },
  // source: https://www.apeda.gov.in/apedahindi/announcements/list_of_pack_house_fruits_vegetables.pdf
  {
    id: 10, type: "provider", sector: "Cold Storage & Warehousing",
    name: "Seven Star Fruits Pvt. Ltd. Pack House",
    area: "Pimpalgaon-Vani Road, Pimpalgaon Baswant",
    lat: 20.1905, lng: 73.9780, // CHECK coords
    org_type: "Pack House",
    offers: ["Grape packing", "Pomegranate packing", "Cold storage"],
    address: "Gat No. 454, Pimpalgaon-Vani Road, Pimpalgaon Baswant, Tal. Niphad, Dist. Nashik",
    description: "Export pack house for grapes and pomegranate on the Vani road. Listed on an older APEDA recognition list, so check current status before a booking.",
  },
  // source: https://freshdi.com/supplier/KAIVALYA-AGRO-EXPORTS-LLP
  {
    id: 11, type: "provider", sector: "Cold Storage & Warehousing",
    name: "Kaivalya Agro Exports LLP Pack House",
    area: "Pimpalgaon-Vani Road, Pimpalgaon Baswant",
    lat: 20.2010, lng: 73.9720, // CHECK coords
    org_type: "Pack House",
    offers: ["Grape pre-cooling", "Cold storage", "Export buying"],
    address: "Gat No. 672, Pimpalgaon-Vani Road, Pimpalgaon Baswant, Tal. Niphad, Dist. Nashik",
    description: "Grape exporter with its own pack house, pre-cooling and cold store. Growers on the Vani road side can sell export-grade bunches or rent pre-cooling.",
  },

  // ───────────── Equipment Repair ─────────────
  // source: https://dealer.mahindratractor.com/mahindra-tractors/nashik
  {
    id: 12, type: "provider", sector: "Equipment Repair",
    name: "Panchaganga Autowheels (Mahindra Tractors), Niphad",
    area: "Rasulpur, Niphad",
    lat: 20.0870, lng: 74.0950, // CHECK coords
    org_type: "Tractor Dealer & Workshop",
    offers: ["Mahindra tractor service", "Spare parts", "Harvester service"],
    address: "Gate No. 327-1, Nashik-Aurangabad Highway, Rasulpur, Niphad, Nashik 422303",
    contact: "080-37908312",
    description: "Authorised Mahindra tractor dealer and service workshop on the Nashik-Aurangabad highway. Stocks genuine Mahindra parts and services Mahindra combine harvesters.",
  },
  // source: https://dealer.mahindratractor.com/mahindra-tractors/tractor-showroom-in-nashik/tractor-showroom-in-pimpalgaon-baswant/mahindra-implements-jay-shri-krishna-automoblies-in-pimpalgaon-baswant-nashik--7ec689f1-7d56-40c0-8528-29a38d22b4c3/products/straw-reaper-pfnip3lwfyh7a3u
  {
    id: 13, type: "provider", sector: "Equipment Repair",
    name: "Jay Shri Krishna Automobiles (Mahindra Tractors & Implements)",
    area: "Zopul Road, Pimpalgaon Baswant",
    lat: 20.1610, lng: 73.9920, // CHECK coords
    org_type: "Tractor Dealer & Workshop",
    offers: ["Mahindra tractor service", "Implement repair", "Spare parts"],
    address: "Plot No. 4, Zopul Road, Pimpalgaon Baswant, Tal. Niphad, Nashik 422209",
    description: "Mahindra tractor and implements dealer in Pimpalgaon Baswant. Grape and onion farmers in western Niphad can get service without driving to Niphad town.",
  },
  // source: https://www.tractorjunction.com/find-tractor-dealers/swaraj/nashik/
  {
    id: 14, type: "provider", sector: "Equipment Repair",
    name: "Tractor House (Swaraj Tractors), Ozar",
    area: "Tilak Nagar, Ozar",
    lat: 20.0960, lng: 73.9300, // CHECK coords
    org_type: "Tractor Dealer & Workshop",
    offers: ["Swaraj tractor service", "Spare parts"],
    address: "G.N. 2400 M.N. 2849, Tilak Nagar, A/P Ozar, Nashik",
    description: "Swaraj tractor dealer listed in Ozar. Swaraj owners between Nashik city and Pimpalgaon can get service and parts here.",
  },
  // source: https://tractorgyan.com/tractor-dealers/nashik/maharashtra/bhilai-automotive/10135
  {
    id: 15, type: "provider", sector: "Equipment Repair",
    name: "Bhilai Automotive (Solis Tractors), Dindori",
    area: "Dindori-Kalwan Road, Dindori",
    lat: 20.2120, lng: 73.8420, // CHECK coords
    org_type: "Tractor Dealer & Workshop",
    offers: ["Solis tractor service", "Spare parts"],
    address: "Gat No. 1054, Nashik-Kalwan Road, Dindori, Nashik 422202",
    description: "Solis tractor dealer on the Kalwan road out of Dindori. Dindori taluka farmers with Solis or Yanmar tractors can get parts here.",
  },
  // source: https://tractorgyan.com/tractor-dealers/nashik/maharashtra/morya-tractors-farm-engineering/13658
  {
    id: 16, type: "provider", sector: "Equipment Repair",
    name: "Morya Tractors & Farm Engineering (Massey Ferguson)",
    area: "Jaulke Phata, Dindori",
    lat: 20.1700, lng: 73.8500, // CHECK coords
    org_type: "Tractor Dealer & Workshop",
    offers: ["Massey Ferguson service", "Farm implement repair", "Spare parts"],
    address: "Kushal Complex, Jaulke Phata, PO Jaulke, Tal. Dindori, Nashik",
    description: "Massey Ferguson dealer with a farm engineering workshop near Jaulke. Serves grape growers in Dindori who run small orchard tractors.",
  },

  // ───────────── Finance & Insurance ─────────────
  // source: https://business.mapsofindia.com/bank-branches/bank_of_maharashtra/maharashtra/lasalgaon/lasalgaon.html
  {
    id: 17, type: "provider", sector: "Finance & Insurance",
    name: "Bank of Maharashtra, Lasalgaon Branch",
    area: "Near S.T. Stand, Lasalgaon",
    lat: 20.1460, lng: 74.2380, // CHECK coords
    org_type: "Bank",
    offers: ["Kisan Credit Card", "Crop loan", "PMFBY enrolment"],
    address: "Namdev Complex, near S.T. Stand, Lasalgaon, Nashik 422306 (IFSC MAHB0000352)",
    description: "Public sector bank branch next to the Lasalgaon bus stand. Handles Kisan Credit Card crop loans and PMFBY crop insurance enrolment for loanee farmers.",
  },
  // source: https://razorpay.com/ifsc-code/state-bank-of-india/maharashtra/nashik/pimplegaon-baswant-/SBIN0005539
  {
    id: 18, type: "provider", sector: "Finance & Insurance",
    name: "State Bank of India, Pimpalgaon Baswant Branch",
    area: "Pimpalgaon Baswant",
    lat: 20.1650, lng: 73.9880, // CHECK coords
    org_type: "Bank",
    offers: ["Kisan Credit Card", "Agri gold loan", "PMFBY enrolment"],
    address: "Pimpalgaon Baswant, Tal. Niphad, Nashik 422209 (IFSC SBIN0005539)",
    description: "SBI branch serving the Pimpalgaon grape and onion belt. Issues Kisan Credit Cards and agri term loans for drip, tractors and kanda chawl.",
  },
  // source: https://www.codeforbanks.com/banks/branch-code/ICIC00NDCCB/
  {
    id: 19, type: "provider", sector: "Finance & Insurance",
    name: "Nashik District Central Co-operative Bank, Main Branch",
    area: "Dwarka Circle, Agra Road",
    lat: 19.9925, lng: 73.8040,
    org_type: "Co-operative Bank",
    offers: ["Crop loan via PACS", "Kisan Credit Card", "Loan restructuring"],
    address: "Plot No. 284, Service Road, Agra Road, near Dwarka Circle, Nashik 422011",
    description: "District co-operative bank that funds crop loans through village societies (PACS). Farmers with dues or restructuring questions go to this main branch.",
  },

  // ───────────── Government & Training ─────────────
  // source: https://icar.org.in/en/node/15040
  {
    id: 20, type: "provider", sector: "Government & Training",
    name: "Krishi Vigyan Kendra Nashik (YCMOU)",
    area: "Dnyangangotri, Gangapur Dam",
    lat: 20.0230, lng: 73.6950, // CHECK coords
    org_type: "Krishi Vigyan Kendra",
    offers: ["Farmer training", "Soil testing", "Crop advisory"],
    address: "Yashwantrao Chavan Maharashtra Open University, Dnyangangotri, near Gangapur Dam, Nashik 422222",
    contact: "0253-2230698",
    description: "ICAR farm science centre run by YCMOU since 1994. Runs short courses on grape, onion and vegetable practice and does on-farm advisory visits.",
  },
  // source: https://www.slideshare.net/slideshow/list-nhrdfcenters/37059066
  {
    id: 21, type: "provider", sector: "Government & Training",
    name: "National Horticultural Research and Development Foundation (NHRDF), Chitegaon Phata",
    area: "Chitegaon Phata, Niphad",
    lat: 20.0520, lng: 73.9750, // CHECK coords
    org_type: "Research Station",
    offers: ["Onion seed", "Onion storage advice", "Farmer training"],
    address: "Chitegaon Phata, Post Darna Sangvi, Tal. Niphad, Nashik",
    contact: "02550-237551",
    description: "NHRDF head office and onion research farm on the Nashik-Aurangabad highway. Sells certified onion seed and advises on kanda chawl design to cut storage loss.",
  },
  // source: https://mpkv.ac.in/Research/..\..\Uploads\Research\56. ARS Niphad.pdf
  {
    id: 22, type: "provider", sector: "Government & Training",
    name: "Agricultural Research Station Niphad (MPKV)",
    area: "Kundewadi, Niphad",
    lat: 20.0950, lng: 74.1180, // CHECK coords
    org_type: "Research Station",
    offers: ["Wheat seed", "Crop advisory", "Field demonstrations"],
    address: "Agricultural Research Station, Kundewadi, Niphad, Nashik 422303",
    contact: "02550-241023",
    description: "Mahatma Phule Krishi Vidyapeeth station that coordinates wheat research for Maharashtra. Farmers can buy released wheat varieties and attend field days.",
  },
  // source: https://mpkv.ac.in/Research/..\..\Uploads\Research\67. Pimpalgaon Baswant.pdf
  {
    id: 23, type: "provider", sector: "Government & Training",
    name: "Onion and Grape Research Station Pimpalgaon Baswant (MPKV)",
    area: "Wani Chowphuli, Pimpalgaon Baswant",
    lat: 20.1715, lng: 73.9845, // CHECK coords
    org_type: "Research Station",
    offers: ["Grape disease advisory", "Onion variety advice", "Farmer training"],
    address: "Near Wani Chowphuli, Pimpalgaon Baswant, Tal. Niphad, Nashik 422209",
    contact: "02550-250305",
    description: "MPKV station for onion and grape research in Niphad taluka. Growers can bring downy mildew and other vine disease problems to its scientists.",
  },

  // ───────────── Experts & Agents (fictional personas) ─────────────
  {
    id: 24, type: "provider", sector: "Farm Labour",
    name: "Dnyaneshwar Shankar Gaikwad",
    area: "Khedgaon, Dindori",
    lat: 20.2365, lng: 73.9605,
    org_type: "Labour Contractor",
    offers: ["Grape harvest teams", "Bunch cutting", "20-40 workers"],
    contact: "98228 41736",
    verified: "Unverified",
    description: "Grape harvest mukadam with 14 years of experience, running teams of 20 to 40 cutters from February to April. Works for export grape growers in Dindori and Pimpalgaon who need packing-grade cutting.",
  },
  {
    id: 25, type: "provider", sector: "Farm Labour",
    name: "Balasaheb Kacharu Shinde",
    area: "Ugaon, Niphad",
    lat: 20.1235, lng: 74.1397,
    org_type: "Labour Contractor",
    offers: ["Onion harvest labour", "Onion grading", "Daily-wage teams"],
    contact: "94220 57318",
    verified: "Unverified",
    description: "Onion harvest mukadam with 11 years of experience who gathers workers at the Ugaon and Niphad nakas each morning. Supplies teams of 10 to 25 for small onion farmers around Vinchur and Lasalgaon.",
  },
  {
    id: 26, type: "provider", sector: "Farm Labour",
    name: "Kavita Raghunath Ahire",
    area: "Pandhurli, Sinnar",
    lat: 19.8305, lng: 73.8555,
    org_type: "Labour Group Leader",
    offers: ["Onion transplanting", "Weeding", "Women's labour group"],
    contact: "77098 23451",
    verified: "Unverified",
    description: "Leads a group of 15 women farm workers, with 8 years of experience in onion transplanting and weeding. Takes bookings from Sinnar and Nashik taluka farmers who need hands for 2 to 5 days.",
  },
  {
    id: 27, type: "provider", sector: "Experts & Agents",
    name: "Sandip Bhausaheb Kadam",
    area: "Kasabe Sukene, Niphad",
    lat: 20.0780, lng: 74.0140,
    org_type: "Tractor Mechanic",
    offers: ["Hydraulic lift repair", "On-farm visits", "Mahindra and Swaraj"],
    contact: "98500 64129",
    verified: "Unverified",
    description: "Tractor hydraulic mechanic with 16 years of experience who repairs lift and pump faults on the farm. Serves grape growers between Ozar and Niphad whose tractors stop in the spray season.",
  },
  {
    id: 28, type: "provider", sector: "Experts & Agents",
    name: "Nitin Murlidhar Borse",
    area: "Niphad",
    lat: 20.0810, lng: 74.1090,
    org_type: "Spray Pump Mechanic",
    offers: ["HTP pump repair", "Air-blast sprayer repair", "Nozzle replacement"],
    contact: "97639 18275",
    verified: "Unverified",
    description: "Spray pump and blower repair mechanic with 9 years of experience, working from a shop near Niphad market. Grape and onion farmers get same-day repair on HTP pumps and tractor-mounted sprayers.",
  },
  {
    id: 29, type: "provider", sector: "Experts & Agents",
    name: "Santosh Ramdas Jadhav",
    area: "Vani, Dindori",
    lat: 20.3306, lng: 73.8895,
    org_type: "Drip Irrigation Technician",
    offers: ["Drip line repair", "Filter cleaning", "Venturi and fertigation setup"],
    contact: "88059 27346",
    verified: "Unverified",
    description: "Drip irrigation repair technician with 10 years of experience on Jain and Netafim systems. Fixes clogged laterals and filters for grape and tomato farmers in Vani and Dindori.",
  },
  {
    id: 30, type: "provider", sector: "Experts & Agents",
    name: "Prakash Nivrutti Thete",
    area: "Vadner Bhairav, Chandwad",
    lat: 20.2610, lng: 74.0960, // CHECK coords
    org_type: "Kanda Chawl Builder",
    offers: ["Kanda chawl construction", "Ventilated storage design", "Chawl subsidy paperwork"],
    contact: "94235 70814",
    verified: "Unverified",
    description: "Builds ventilated onion storage sheds (kanda chawl) and has 13 years of experience. Helps farmers holding 25 to 500 tonnes file for the state kanda chawl subsidy.",
  },
  {
    id: 31, type: "provider", sector: "Machinery Rental",
    name: "Vikas Sopan Sanap",
    area: "Sinnar",
    lat: 19.8470, lng: 74.0010,
    org_type: "Harvester Operator",
    offers: ["Combine harvester hire", "Wheat harvest", "Soybean harvest"],
    contact: "98903 46521",
    verified: "Unverified",
    description: "Owns and operates a combine harvester, with 12 years of experience, charging per acre. Takes wheat and soybean bookings from Sinnar and Niphad farmers.",
  },
  {
    id: 32, type: "provider", sector: "Machinery Rental",
    name: "Amol Dattatray Kshirsagar",
    area: "Talegaon Dindori",
    lat: 20.1475, lng: 73.8195,
    org_type: "Tractor Hire Operator",
    offers: ["Rotavator hire", "Ploughing", "Onion bed making"],
    contact: "70204 85137",
    verified: "Unverified",
    description: "Hires out a tractor with rotavator and plough at hourly rates, with 7 years of experience. Prepares onion and tomato beds for small farmers in Dindori who do not own a tractor.",
  },
  {
    id: 33, type: "provider", sector: "Experts & Agents",
    name: "Yogesh Bapurao Pagar",
    area: "Chandwad",
    lat: 20.3300, lng: 74.2490,
    org_type: "Crop Insurance Agent",
    offers: ["PMFBY claim filing", "7/12 extract", "Crop loss intimation"],
    contact: "95527 31608",
    verified: "Unverified",
    description: "Runs a Common Service Centre counter and has 6 years of experience filing PMFBY crop insurance claims. Helps non-loanee onion farmers report unseasonal rain loss within the 72-hour window.",
  },
];
