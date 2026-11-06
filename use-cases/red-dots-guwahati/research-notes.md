# Red Dots Guwahati: research notes

Researched 2026-11-06 for the Sahai Line map prototype (`dots-providers.ts`, `dots-seekers.ts`).

How to read this file:
- **Coords** are neighbourhood-level. Almost all are from memory of the area, not a map pin, and are marked `CHECK coords`. Only one came from a published pin: Kamrup Tyres, Basistha.
- **Phone** is given only where a public page publishes it. "Not published" means I found no number. Numbers from aggregators (Bajaj Finserv Health, Pratidin Time, indiacustomercare and similar) are marked as such and need one test call.
- **Empanelled for cashless road-accident care:** I found **no official public list** of hospitals for Assam's Golden Hour scheme or for PM RAHAT in Assam. No hospital below is marked as confirmed empanelled. See Schemes and Caveats.

---

## 1. Trauma & Emergency Hospitals

### 1.1 Gauhati Medical College & Hospital (GMCH), Emergency Medicine Block
- **Area:** Bhangagarh, Guwahati
- **Coords:** 26.1556, 91.7672 `CHECK coords`
- **Address:** GMCH, Bhangagarh, Guwahati 781032 (address is widely published; I did not open a GMCH contact page)
- **Phone:** Not confirmed
- **Offers:** 24x7 emergency and trauma care; government hospital (free or low cost); referral centre for the region
- **Description:** Assam's main government referral hospital. The state health department lists it as a Level-II trauma centre with a proposed upgrade to Level-I. It handled 19,153 road-accident cases in 2024.
- **Sources:** [GMCH institutional overview](https://gmch.assam.gov.in/node/898), [GMCH Emergency Medicine dept](https://gmch.assam.gov.in/department-highlights-level-three/emergency-medicine/department-0/college), [Assam H&FW trauma list](https://hfw.assam.gov.in/node/93114), [Assam Tribune, 2024 figures](https://assamtribune.com/guwahati/gmch-treats-over-115-l-patients-in-2024-gears-up-for-robotic-surgery-in-2025-1563141)
- **Note:** "GMCH trauma centre" as a separate building could not be confirmed. Use "GMCH Emergency" in the bot.

### 1.2 GNRC Hospital, Dispur
- **Area:** Dispur (near Dispur Super Market / Rukminigaon), GS Road side
- **Coords:** 26.1388, 91.7935 `CHECK coords`
- **Address:** Super Market, GNRC Road, Dispur, Rukmini Gaon, Guwahati 781006 (aggregator)
- **Phone:** GNRC ambulance (toll-free) 1800-345-0011; appointments 1800-345-0022 (both on GNRC's own site)
- **Offers:** Accident & emergency department; own ambulance fleet; multispeciality inpatient care
- **Description:** Large private multispeciality hospital. It runs a dedicated accident and emergency unit and a 24/7 ambulance line.
- **Sources:** [GNRC Dispur A&E page](https://gnrchospitals.com/gnrc-hospitals/dispur/accident-emergency), [GNRC contact](https://gnrchospitals.com/contact-us), [Bajaj Finserv Health (address)](https://bajajfinservhealth.in/hospitals/kamrup-metropolitan/gnrc-hospitals-rukmini-gaon)

### 1.3 Nemcare Hospital
- **Area:** Bhangagarh (GS Road / GMC Hospital Road)
- **Coords:** 26.1560, 91.7700 `CHECK coords`
- **Address:** GMC Hospital Road / GS Road, Bhangagarh, Guwahati 781005 (aggregators differ slightly)
- **Phone:** 0361-2469697 (Bajaj Finserv Health listing: emergency/ambulance; not checked against the hospital's own site)
- **Offers:** 24x7 emergency; ambulance; multispeciality care
- **Description:** Private super-speciality hospital close to GMCH. Bhangagarh–Ulubari is its nearest catchment.
- **Sources:** [Bajaj Finserv Health](https://www.bajajfinservhealth.in/hospitals/kamrup-metropolitan/nemcare-hospital-bhangagarh), [publicservicesmap (registry)](https://www.publicservicesmap.in/hospitals/centre/nemcare-hospitals-pvt-ltd-kamrup-metro-assam-hosp18p66455)

### 1.4 Down Town Hospital
- **Area:** GS Road, Dispur / Bormotoria
- **Coords:** 26.1365, 91.8005 `CHECK coords`
- **Address:** GS Road, Dispur, Bormotoria, Guwahati 781006
- **Phone:** 9864101111 (Bajaj Finserv Health, listed as emergency). Older CGHS lists give other numbers.
- **Offers:** Open 24 hours (CGHS directory); emergency; multispeciality
- **Description:** Long-established private hospital on GS Road. It is CGHS-empanelled, which is a different scheme from the road-accident schemes.
- **Sources:** [CGHS facility page](https://cghshospitals.com/facility/down-town-hospital-ltd-1538), [Bajaj Finserv Health](https://www.bajajfinservhealth.in/hospitals/kamrup-metropolitan/down-town-hospital-rukmini-gaon), [Nagaland CMHIS list (address)](https://cmhis.nagaland.gov.in/storage/pageFiles/1723644972_76.pdf)

### 1.5 Apollo Excelcare Hospital
- **Area:** Paschim Boragaon, NH-27 (old NH-37), about 2–3 km west of Gorchuk
- **Coords:** 26.1205, 91.7105 `CHECK coords`
- **Address:** NH-37 Highway, near Ganesh Mandir, Paschim Boragaon, Guwahati 781033 (Apollo site)
- **Phone:** Apollo emergency 1066; hospital line 0361-7140101 (published by Apollo)
- **Offers:** 24x7 emergency; ambulance; tertiary care
- **Description:** Former Excelcare Hospital, taken over by Apollo in November 2021. It is the closest large private hospital to the Gorchuk pothole persona.
- **Sources:** [Apollo Excelcare page](https://apollohospitals.com/hospitals/apollo-excelcare-guwahati), [Apollo Guwahati emergency](https://admin-drupal.apollohospitals.com/guwahati/departments/emergency)

### 1.6 Health City Hospital
- **Area:** Khanapara (Koinadhara / Uday Nagar), NH-27, on the way to Jorabat
- **Coords:** 26.1205, 91.8270 `CHECK coords`
- **Address:** Opp. Bodoland Guest House, Uday Nagar, Khanapara, Guwahati 781022
- **Phone:** 0361-7105000 (CGHS notification and Bajaj listing)
- **Offers:** Emergency; ambulance; multispeciality
- **Description:** Private hospital on the Khanapara stretch of the Shillong road. It is about 6–7 km before Jorabat and is the nearest large hospital for the Jorabat persona.
- **Sources:** [CGHS facility page](https://cghshospitals.com/facility/health-city-hospital-a-unit-of-north-east-health-city-private-limited-1544), [Bajaj Finserv Health](https://www.bajajfinservhealth.in/hospitals/kamrup-metropolitan/health-city-hospital-uday-nagar)

### 1.7 Pratiksha Hospital
- **Area:** Borbari, VIP Road
- **Coords:** 26.1500, 91.8120 `CHECK coords`
- **Address:** VIP Road, Borbari, Guwahati 781036
- **Phone:** Not confirmed (no reliable number found)
- **Offers:** 24x7 emergency (per directory); multispeciality
- **Description:** Private hospital in east Guwahati, listed with 24x7 emergency by a third-party directory.
- **Sources:** [myupchar](https://myupchar.com/en/hospitals/guwahati/pratiksha-hospital-guwahati-9394), [publicservicesmap](https://www.publicservicesmap.in/hospitals/centre/pratiksha-hospital-kamrup-metro-assam-hosp18p69918)

### 1.8 District Hospital, Sonapur
- **Area:** Sonapur, NH-27, about 20 km east of Guwahati and past the Jorabat junction
- **Coords:** 26.1170, 91.9770 `CHECK coords`
- **Address:** Near NH-37/27, Sonapur, Kamrup (Metro)
- **Phone:** Not published
- **Offers:** Government district hospital; trauma stabilisation equipment (SaveLIFE / Skoda project); referral to GMCH
- **Description:** Government hospital that SaveLIFE Foundation is upgrading into a trauma stabilisation centre under its Zero Fatality Corridor programme. Whether the centre is running now is unconfirmed.
- **Sources:** [Syllad, SaveLIFE–Skoda trauma care](https://www.syllad.com/savelife-foundation-and-skoda-auto-india-strengthen-trauma-care-in-assam-to-reduce-road-crash-fatalities)

### 1.9 Boko CHC / First Referral Unit
- **Area:** Boko, Kamrup (Rural), NH-17 Guwahati–Goalpara
- **Coords:** 25.9800, 91.2350 `CHECK coords`
- **Address:** Boko, Kamrup district
- **Phone:** Not published
- **Offers:** Government CHC; emergency and admission (PMJAY directory); first referral before GMCH
- **Description:** Assam NHM lists both a "Boko FRU" and a "Boko BPHC/CHC". It is the nearest government facility for the Boko truck-tyre persona. The sources do not say whether these are one facility or two.
- **Sources:** [NHM Assam CHC list](https://nhm.assam.gov.in/sites/default/files/swf_utility_folder/departments/nhm_lipl_in_oid_6/menu/document/list_of_community_health_center.pdf), [publicservicesmap Boko CHC](https://www.publicservicesmap.in/hospitals/centre/boko-chc-kamrup-assam-hosp18g106728)

---

## 2. Ambulance & 108

### 2.1 108 Mrityunjoy (EMRI Green Health Services)
- **Area:** Statewide. Pin it at the Guwahati city centre as a symbolic location.
- **Coords:** 26.1445, 91.7362 `CHECK coords` (symbolic)
- **Phone:** 108 (free, 24x7)
- **Offers:** Free emergency ambulance; free pre-hospital care; 102 inter-facility transfer on the same number
- **Description:** Assam's free ambulance service, running since November 2008. It is operated by EMRI Green Health Services (formerly GVK EMRI) with NHM Assam.
- **Sources:** [Sentinel, 17 years of 108](https://www.sentinelassam.com/cities/guwahati-city/mrityunjoy-108-marks-17-years-91-lakh-served-224-lakh-lives-saved), [Sivasagar district page](https://sivasagar.assam.gov.in/scheme-page/mrityunjoy108-ambulance-service)

### 2.2 GNRC Ambulance Service
- **Area:** Dispur (fleet across GNRC units, including Six Mile and North Guwahati)
- **Coords:** 26.1388, 91.7935 `CHECK coords`
- **Phone:** 1800-345-0011 (toll-free, GNRC site)
- **Offers:** 24/7 ambulance; ACLS ambulances; transfer to GNRC hospitals
- **Description:** Private hospital-run ambulance line that advertises round-the-clock service.
- **Source:** [GNRC ambulance page](https://gnrchospitals.com/gnrc-ambulance-service)

### 2.3 Apollo Emergency / Ambulance (1066)
- **Area:** Boragaon (Apollo Excelcare)
- **Coords:** 26.1205, 91.7105 `CHECK coords`
- **Phone:** 1066 (Apollo emergency)
- **Offers:** 24/7 ambulance; transfer to Apollo Excelcare
- **Description:** Apollo's Guwahati ambulance service, dispatched from the Boragaon hospital.
- **Source:** [Apollo ambulance services, Guwahati](https://www.apollohospitals.com/ambulance-services/guwahati)

### 2.4 Health City Hospital ambulance
- **Area:** Khanapara
- **Coords:** 26.1205, 91.8270 `CHECK coords`
- **Phone:** 0361-7105000 (listed as emergency/ambulance by Bajaj Finserv Health)
- **Offers:** Ambulance; closest private dispatch toward Jorabat
- **Description:** Hospital ambulance on the Shillong road side of the city.
- **Source:** [Bajaj Finserv Health](https://www.bajajfinservhealth.in/hospitals/kamrup-metropolitan/health-city-hospital-uday-nagar)

### 2.5 Private ICU ambulance operators (unverified)
- Medifyhome and Panchmukhi Northeast advertise ICU road ambulances in Guwahati. Both sources are promotional or old blog pages, so **I do not recommend them as map rows.** If needed, use a fictional "private ambulance" persona instead.
- **Sources:** [Medifyhome](https://medifyhome.com/?p=58990), [Panchmukhi blog 2022](https://panchmukhinortheastambulance.blogspot.com/2022/03/panchmukhi-northeast-road-ambulance.html)

---

## 3. Police & Traffic

Police station phone numbers come from a Pratidin Time list dated 17 May 2025 (officer-in-charge mobiles). Officers rotate, so treat these as "station contact, check before use".

### 3.1 Guwahati Traffic Control Room
- **Area:** City-wide. Pin it at Pan Bazar (Commissionerate) as a symbolic location.
- **Coords:** 26.1850, 91.7460 `CHECK coords`
- **Phone:** +91 361 2730989, +91 6026176755, +91 6901269006 (Pratidin Time, undated). Emergency: 100 / 112.
- **Offers:** Traffic queries; road blockages; diversion info
- **Description:** Guwahati Traffic Police control room numbers as published in a Pratidin Time advisory.
- **Source:** [Pratidin Time, traffic advisory](https://www.pratidintime.com/guwahati-news-breaking-latest/guwahati-traffic-police-advises-public-to-avoid-key-roads-amid-heavy-rainfall)

### 3.2 Gorchuk Police Station
- **Area:** Gorchuk, NH-27
- **Coords:** 26.1140, 91.7030 `CHECK coords`
- **Phone:** 9864125719 (OC, May 2025)
- **Offers:** Accident FIR / GD entry; NH-27 patrol (Gorchuk traffic handled the Betkuchi NH-27 crash)
- **Description:** Station for the Gorchuk–Betkuchi stretch of NH-27, which covers the pothole-fall persona.
- **Sources:** [Pratidin Time PS list](https://www.pratidintime.com/technology/complete-list-of-guwahati-police-stations-with-contact-details-9079117), [Sentinel, Betkuchi NH-27 crash](https://www.sentinelassam.com/cities/guwahati-city/two-killed-as-truck-hits-vehicle-parked-on-nh-27-near-betkuchi-in-guwahati)

### 3.3 Jorabat Police Outpost (under Basistha PS)
- **Area:** Jorabat junction, NH-27 / NH-6 to Shillong
- **Coords:** 26.1030, 91.8700 `CHECK coords`
- **Phone:** 8638041849 (SI in charge, undated Pratidin Time list). Basistha PS: 9435089137.
- **Offers:** Accident reporting on the Jorabat junction; highway patrol
- **Description:** Outpost of East Guwahati Police District under Basistha PS. Jorabat straddles the Assam–Meghalaya border, and crashes beyond the junction on NH-6 fall under Ri-Bhoi police (Meghalaya).
- **Sources:** [Pratidin Time police list](https://www.pratidintime.com/latest-assam-news-breaking-news-assam/list-of-police-stations-in-guwahati), [Sentinel, Jorabat OP under Basistha PS](https://sentinelassam.com/guwahati-city/east-guwahati-police-district-held-minor-with-stolen-items-664838), [Wikipedia: Jorabat](https://en.wikipedia.org/wiki/Jorabat)

### 3.4 Boko Police Station
- **Area:** Boko, Kamrup (Rural), NH-17
- **Coords:** 25.9810, 91.2330 `CHECK coords`
- **Phone:** Not published (Kamrup Rural district police; current OC unconfirmed)
- **Offers:** Accident cases on NH-17 Boko–Mirza–Singra stretch
- **Description:** Station that handles NH-17 crashes around Boko, including truck collisions at Beerpara and Agchiya.
- **Sources:** [EastMojo, Boko NH-17 truck collision 2023](https://eastmojo.com/assam/2023/01/24/assam-two-vehicles-collide-in-kamrups-boko-both-drivers-dead/), [India Today NE, NH-17 widening hazard near Boko (May 2026)](https://www.indiatodayne.in/assam/story/assam-nh-17-expansion-work-raises-safety-concerns-after-vehicle-falls-into-open-construction-ditch-near-boko-1400477-2026-05-31)

### 3.5 Maligaon Police Outpost
- **Area:** Maligaon, AT Road
- **Coords:** 26.1600, 91.6960 `CHECK coords`
- **Phone:** 7086604537 (SI in charge, May 2025)
- **Offers:** Night help on AT Road; incident reporting
- **Description:** Police outpost for Maligaon. It is near the Nilachal flyover, which has had repeated crashes.
- **Source:** [Pratidin Time PS list](https://www.pratidintime.com/technology/complete-list-of-guwahati-police-stations-with-contact-details-9079117)

### 3.6 Jalukbari Police Station
- **Area:** Jalukbari, NH-27 / NH-17 junction
- **Coords:** 26.1555, 91.6680 `CHECK coords`
- **Phone:** 9435152338 (OC, May 2025)
- **Offers:** Accident FIR; Jalukbari–Khanapara highway stretch
- **Description:** Station at the western entry of the city, where NH-17 from Goalpara meets the city highway.
- **Source:** [Pratidin Time PS list](https://www.pratidintime.com/technology/complete-list-of-guwahati-police-stations-with-contact-details-9079117)

### 3.7 Bhangagarh Police Station (for Ulubari flyover area)
- **Area:** Bhangagarh, near Ulubari
- **Coords:** 26.1565, 91.7690 `CHECK coords`
- **Phone:** 7002310658 (OC, May 2025)
- **Offers:** Incident reports around the Bhangagarh–Ulubari flyovers
- **Description:** Station near the Ulubari and Bhangagarh flyovers. I could not confirm which station covers the Ulubari flyover itself; Paltan Bazar PS (7002530174) is the other candidate.
- **Source:** [Pratidin Time PS list](https://www.pratidintime.com/technology/complete-list-of-guwahati-police-stations-with-contact-details-9079117)

---

## 4. Two-wheeler Mechanics

None of these confirm late-night hours. **No real late-open bike garage on AT Road could be verified.** The Maligaon 11 pm persona needs a fictional garage, or should be framed as "call ahead". Hi Speed's listing says it closes at 8:30 pm.

### 4.1 PREMIA / Hi Speed Bikes (Hero MotoCorp)
- **Area:** AT Road, Maligaon (near LCB College)
- **Coords:** 26.1605, 91.6890 `CHECK coords`
- **Address:** No 1, Ground Floor, Mangaldeep Building, AT Road, Maligaon, Guwahati 781011
- **Phone:** 09821741030 (Hero dealer locator; a second Hero page shows 9289922756)
- **Offers:** Hero authorised service; spares; closes about 8:30 pm per listing
- **Description:** Authorised Hero dealer and service centre on AT Road, Maligaon.
- **Sources:** [Hero locator, Maligaon](https://dealers.heromotocorp.com/locator/guwahati/maligaon/premia-guwahati-ms-hi-speed-bikes-hero-motocorp-in-maligaon-guwahati--6AdMcE/reviews), [Hero locator, Durgasarovar](https://dealers.heromotocorp.com/locator/guwahati/durgasarovar/hi-speed-bikes-hero-motocorp-in-durgasarovar-guwahati--3VjQmc/home)

### 4.2 Chirag Enfield (Royal Enfield)
- **Area:** Maligaon, opposite Railway Gate No. 1
- **Coords:** 26.1620, 91.7000 `CHECK coords`
- **Phone:** Not published on BikeWale
- **Offers:** Royal Enfield authorised service; chain and drivetrain parts
- **Description:** Authorised Royal Enfield service centre in Maligaon.
- **Source:** [BikeWale RE service centres](https://bikewale.com/service-centers/royalenfield/guwahati)

### 4.3 Bimal Honda (Honda two-wheelers)
- **Area:** Adabari, Jalukbari (opposite Adabari bus stand)
- **Coords:** 26.1650, 91.6790 `CHECK coords`
- **Address:** Opp. Adabari Bus Stop, Jalukbari, Guwahati 781014
- **Phone:** Not confirmed
- **Offers:** Honda two-wheeler sales and service
- **Description:** Honda two-wheeler dealer about 2 km from Maligaon, toward Jalukbari.
- **Source:** [BikeDekho Honda service centres](https://bikedekho.com/service-centers/honda/guwahati)

### 4.4 Vinayak Honda
- **Area:** AT Road, near Railway Gate No. 5 (Mullick Compound)
- **Coords:** 26.1790, 91.7420 `CHECK coords`
- **Address:** Mullick Compound, near Railway Gate No 5, AT Road, Guwahati 781001
- **Phone:** Not confirmed
- **Offers:** Honda two-wheeler service
- **Description:** Honda two-wheeler dealer on the city end of AT Road.
- **Source:** [BikeDekho Honda service centres](https://bikedekho.com/service-centers/honda/guwahati)

### 4.5 4Aces Enfield (Royal Enfield)
- **Area:** Zoo Road, Bhaskar Nagar
- **Coords:** 26.1720, 91.7800 `CHECK coords`
- **Address:** Plot 2, Bylane 3, Zoo Road, near V Mart, Bhaskar Nagar
- **Phone:** 7099028555 (BikeWale)
- **Offers:** Royal Enfield authorised service
- **Description:** Royal Enfield service centre in central-east Guwahati.
- **Source:** [BikeWale RE service centres](https://bikewale.com/service-centers/royalenfield/guwahati)

---

## 5. Car Workshops

### 5.1 Mittal Maruti (Mittal Autozone)
- **Area:** Lokhra, near Central Jail
- **Coords:** 26.1145, 91.7430 `CHECK coords`
- **Address:** Mittal Autozone, near Central Jail, Lokhra, Guwahati 781029
- **Phone:** Shown on CarDekho (not copied; check before use)
- **Offers:** Maruti Suzuki authorised service; body and accident repair
- **Description:** Maruti authorised workshop on the Lokhra side of NH-27.
- **Sources:** [CarDekho Maruti service](https://www.cardekho.com/Maruti/Guwahati/car-service-center.htm), [CarHP](https://carhp.in/service-centres/maruti-suzuki/guwahati)

### 5.2 Lohia Hyundai
- **Area:** Lokhra, opposite Sarusajai Stadium, NH-27
- **Coords:** 26.1245, 91.7470 `CHECK coords`
- **Address:** Subham Square, opp. Sarusajai Stadium, NH-27, Lokhra, Guwahati 781040. Another listing gives a service address at NH-27, Boragaon/Katahbari.
- **Phone:** Not confirmed
- **Offers:** Hyundai sales and service
- **Description:** Hyundai dealer on NH-27 near Sarusajai. Its workshop may be at the Boragaon/Katahbari address.
- **Source:** [CarHP Hyundai service](https://carhp.in/service-centres/hyundai/guwahati)

### 5.3 Mukesh Hyundai
- **Area:** GS Road, Ganeshguri
- **Coords:** 26.1490, 91.7860 `CHECK coords`
- **Address:** Kushan Plaza, GS Road, Ganeshguri, Guwahati 781007
- **Phone:** Not confirmed
- **Offers:** Hyundai sales and service
- **Description:** Hyundai dealer on GS Road.
- **Source:** [CarDekho Hyundai dealers](https://www.cardekho.com/Hyundai/Guwahati/cardealers)

### 5.4 Oja Hyundai
- **Area:** Basistha Chariali / Beltola Chariali, NH-27
- **Coords:** 26.1100, 91.7960 `CHECK coords`
- **Address:** NH-37, Basistha Chariali, Beltola Chariali, Guwahati 781029
- **Phone:** Not confirmed
- **Offers:** Hyundai service; on the Khanapara–Jorabat side
- **Description:** Hyundai outlet at Basistha Chariali, one of the stated accident-prone junctions.
- **Source:** [CarHP Hyundai service](https://carhp.in/service-centres/hyundai/guwahati)

### 5.5 Paramount Honda (cars)
- **Area:** Maligaon, AT Road, Railway Gate No. 1
- **Coords:** 26.1620, 91.6995 `CHECK coords`
- **Address:** AT Road, Railway Gate No-1, Maligaon, Guwahati 781014
- **Phone:** Not confirmed
- **Offers:** Honda car sales and service
- **Description:** Honda car dealer on AT Road, Maligaon.
- **Source:** [CarDekho Honda service](https://www.cardekho.com/Honda/Guwahati/car-service-center.htm)

No authorised workshop at **Betkuchi** or on **GS Road for Maruti** turned up. Betkuchi has the DTO (see Schemes).

---

## 6. Heavy Vehicle & Tyre Repair

**No truck tyre shop in Boko, Mirza or Azara could be confirmed.** The nearest confirmed options for the Boko persona are at Jalukbari and Adabari, about 50 km away. Consider a fictional roadside "tyre puncture / dhaba mechanic" persona at Boko.

### 6.1 Gargo Motors (Tata Motors commercial vehicles)
- **Area:** NH-27 (old NH-37), Gorchuk / Lokhra
- **Coords:** 26.1150, 91.7150 `CHECK coords`
- **Address:** NH-37, Gorchuk, Lokhra, Guwahati (directory)
- **Phone:** Not confirmed
- **Offers:** Authorised Tata truck and bus sales, service and spare parts
- **Description:** Authorised Tata commercial vehicle dealer and workshop on the city highway.
- **Source:** [TrucksBuses, Gargo Motors](https://www.trucksbuses.com/dealers/tata/assam/guwahati/gargo-motors-guwahati)

### 6.2 Skylight Automotive (Ashok Leyland)
- **Area:** North Jalukbari, NH-27, behind Gauhati University
- **Coords:** 26.1560, 91.6600 `CHECK coords`
- **Phone:** Not published
- **Offers:** Ashok Leyland truck service
- **Description:** Ashok Leyland workshop at the Jalukbari end, the first major truck workshop for traffic coming in on NH-17.
- **Source:** [91trucks Ashok Leyland Guwahati](https://www.91trucks.com/hi/truck-servicecenters/ashok-leyland/guwahati)

### 6.3 Assam Tyre Service
- **Area:** NH-17, Gopinath Bordoloi Nagar, Jalukbari
- **Coords:** 26.1500, 91.6620 `CHECK coords`
- **Phone:** Masked on directory
- **Offers:** Tyre sales and service on NH-17 (heavy-vehicle capability unconfirmed)
- **Description:** Tyre shop on NH-17 at the Jalukbari end of the Guwahati–Goalpara highway.
- **Source:** [TractorGyan Guwahati tyre dealers](https://tractorgyan.com/tyre-dealers/guwahati/assam)

### 6.4 MRF T&S Swastik Tyres
- **Area:** Adabari, North Jalukbari (AT Road), near Kiran Transport
- **Coords:** 26.1655, 91.6770 `CHECK coords`
- **Phone:** On the MRF dealer page
- **Offers:** MRF tyres; tyre service; Mon 9 am–8 pm per listing
- **Description:** MRF tyre and service outlet beside the Adabari transport hub.
- **Source:** [MRF dealer page](https://dealers.mrftyres.com/mrf-t-s-swastik-tyres-tyre-shop-adabari-guwahati-470178/Home)

### 6.5 Kamrup Tyres (JK Tyre Steel Wheels)
- **Area:** Basistha Chariali, NH-27
- **Coords:** 26.1123, 91.7978 (from the JK Tyre store page, map pin)
- **Phone:** On the JK store page
- **Offers:** JK Tyre sales; wheel service
- **Description:** JK Tyre brand shop at Basistha Chariali, on the way to Jorabat.
- **Source:** [JK Tyre brand shop](https://brandshops.jktyre.com/jk-tyre-steel-wheels-kamrup-tyres-tyre-shop-basistha-charali-guwahati-102334/Home)

### 6.6 Apollo Tyres, SAR Tyres (Beharbari)
- **Area:** Beharbari, NH-27, near Mercedes Axom Motors
- **Coords:** 26.1135, 91.7780 `CHECK coords`
- **Phone:** On the Apollo store page
- **Offers:** Apollo tyres; tyre service
- **Description:** Apollo Tyres dealer on NH-27 at Beharbari.
- **Source:** [Apollo Tyres store](https://store.apollotyres.com/apollo-tyres-sartyres-tyre-shop-beharbari-kamrup-81932/Home)

---

## 7. Towing & Crane Services

**This is the thinnest category.** No named, verified 24-hour towing operator with a public number was found for Guwahati.

### 7.1 NHAI 1033 Highway Helpline (incident management)
- **Area:** National highways (NH-27, NH-17). Pin it at the NHAI Regional Office, Dispur.
- **Coords:** 26.1400, 91.7900 `CHECK coords`
- **Phone:** 1033 (24x7, toll-free)
- **Offers:** Highway emergencies; potholes; routes calls to the incident-management team / concessionaire
- **Description:** National 24x7 highway helpline. Complaints are forwarded to the local PIU or concessionaire, who handle clearance on the highway. It is the best real option for a stuck truck on a national highway.
- **Sources:** [India TV, NHAI grievance system](https://www.indiatvnews.com/business/news/nhai-rolls-out-multi-platform-grievance-redressal-system-to-boost-highway-user-safety-transparency-2025-07-16-999117), [DeshGujarat](https://deshgujarat.com/2025/07/15/toll-free-helpline-mobile-apps-portal-among-nhais-grievance-redressal-platforms)

### 7.2 Santosh Crane Service (IndiaMART listing)
- **Area:** Guwahati (exact locality not shown)
- **Coords:** none; do not pin without a locality
- **Phone:** IndiaMART proxy number only (not copied)
- **Offers:** Crane hire
- **Description:** Directory-listed crane operator in Guwahati. It is unverified, and the rating on the page may belong to another listing.
- **Source:** [IndiaMART towing listings](https://m.indiamart.com/impcat/car-towing-service.html)

### 7.3 Transrentals (crane / hydra rental)
- **Area:** Guwahati (online rental aggregator)
- **Offers:** Mobile and hydra crane hire, advertised "from ₹4,999"
- **Description:** Crane rental platform. It is for heavy lifting, and roadside recovery is not confirmed.
- **Source:** [Transrentals Guwahati](https://transrentals.in/crane-on-rent/guwahati)

### 7.4 CarChhe breakdown directory (North Guwahati)
- **Area:** North Guwahati / Amingaon
- **Offers:** 24/7 towing, flat tyre, battery jump-start (directory claim)
- **Description:** Directory page of breakdown providers, not a single operator.
- **Source:** [CarChhe](https://www.carchhe.com/car-breakdown-services/northguwahati)

**Suggestion:** use 1 real row (NHAI 1033) and 2–3 fictional tow-truck personas at Jalukbari, Lokhra and Boko. Car makers also run roadside assistance for their own owners, but I did not verify any brand's RSA number.

---

## 8. Schemes & Help Desks

### 8.1 PM RAHAT (Road Accident Victims' Hospitalisation and Assured Treatment)
- **Coverage:** Cashless treatment up to ₹1.5 lakh per victim for 7 days from the accident, on any road. Covers insured and uninsured victims. Uses AB-PM-JAY hospitals plus hospitals meeting NHA PM-RAHAT guidelines. Linked to **112**: a caller can get the nearest designated hospital and an ambulance. Police authentication goes through MoRTH's eDAR system, and claims run on NHA TMS 2.0. Hospitals are paid from the Motor Vehicle Accident Fund.
- **Launched:** 13–14 Feb 2026 (PIB/MoRTH). One source says it was live in 34 States/UTs by 31 July 2026.
- **Assam status:** **Not confirmed.** I found no Assam-specific notice.
- **Pin:** Do not pin it at one place. Show it as an info card, or pin it at GMCH as the "ask here" desk.
- **Sources:** [Vikaspedia PM RAHAT](https://en.vikaspedia.in/viewcontent/schemesall/central-government-schemes/pm-rahat), [Autocar Pro](https://www.autocarpro.in/news/government-launches-pm-rahat-scheme-for-cashless-treatment-of-road-accident-victims-131200), [Vision IAS, Mar 2026](https://dce.visionias.in/monthly-magazine/2026-03-31/polity-and-governance/pm-rahat-road-accident-victim-hospitalization-and-assured-treatment)

### 8.2 Assam "Golden Hour" cashless trauma care scheme
- **Coverage:** Cashless treatment up to ₹1.5 lakh for 7 days at **46 empanelled hospitals** with trauma units. Launched 30 May 2024. It had treated 2,657 victims by July 2025.
- **Relation to central scheme:** Assam was a pilot state for the central "Cashless Treatment of Road Accident Victims Scheme" from 14 March 2024, along with Chandigarh. Whether "Golden Hour" is the same programme, or has since been folded into PM RAHAT, is **not confirmed**.
- **Hospital list:** Not published in any source I found.
- **Sources:** [Assam Tribune](https://assamtribune.com/assam/assams-golden-hour-scheme-saves-2650-lives-offers-model-for-road-accident-care-1583232), [India Today NE, July 2025](https://www.indiatodayne.in/assam/story/assam-govt-provides-cashless-treatment-to-over-2600-road-accident-victims-since-may-2024-1237839-2025-07-01), [Vikaspedia, cashless pilot](https://en.vikaspedia.in/viewcontent/schemesall/central-government-schemes/cashless-treatment-of-road-accident-victims-scheme), [News on AIR](https://www.newsonair.gov.in/govt-introduces-cashless-treatment-for-road-accident-victims-in-chandigarh-assam-providing-up-to-rs-1-5-lakh-in-benefits)

### 8.3 Atal Amrit Abhiyan (Assam state health insurance)
- **Coverage:** Up to ₹2 lakh per family per year for listed serious illnesses. Trauma, mainly accidents, was reported as being added. Hospital counts differ across sources.
- **Use in bot:** Secondary fallback after the cashless 7-day window.
- **Sources:** [Assam govt scheme page](https://assam.gov.in/scheme-page/448), [Sentinel](https://sentinelassam.com/topheadlines/atal-amrit-abhiyan-a-succour-for-cancer-patients-himanta-biswa-sarma)

### 8.4 District Legal Services Authority, Kamrup (Metro)
- **Area:** District & Sessions Court complex, Cotton University Road, near Dighalipukhuri
- **Coords:** 26.1860, 91.7520 `CHECK coords`
- **Phone:** 6901281635 (state DLSA contact list). Email dlsakamrupm@gmail.com (third-party).
- **Offers:** Free legal aid; help filing accident compensation claims (MACT); Lok Adalat
- **Description:** Free legal aid body for Guwahati, the first stop for a family seeking accident compensation.
- **Source:** [Kamrup Metro district court](https://kamrupmetro.dcourts.gov.in/?p=721)

### 8.5 Motor Accident Claims Tribunals, Kamrup (Metro)
- **Area:** MACT 2 & 3 at Bharalumukh (behind Sonaram School field). STAT & MACT 1 at Ulubari (near old DTO complex).
- **Coords:** Bharalumukh 26.1720, 91.7330; Ulubari 26.1720, 91.7600 `CHECK coords`
- **Phone:** MACT 2: 7002954360; MACT 3: 9101894686; STAT & MACT 1: 8638111102. These come from indiacustomercare only; the court site lists addresses without numbers.
- **Offers:** Compensation claims for death or injury in road accidents
- **Description:** Tribunals that decide motor-accident compensation in Guwahati.
- **Sources:** [Kamrup Metro court site](https://kamrupmetro.dcourts.gov.in/?p=721), [indiacustomercare](https://www.indiacustomercare.com/kamrup-metro-district-court-contact-no)

### 8.6 District Transport Office (RTO), Kamrup Metro / AS-01, Betkuchi
- **Area:** Betkuchi, NH-27
- **Coords:** 26.1190, 91.7280 `CHECK coords`
- **Address:** Betkuchi, NH-37, Guwahati 781034/781035 (PIN differs by source)
- **Phone:** 0361-2431376 (state transport site, Kamrup R&L listing). Other sources give 0361-2540149 or 0361-2544160.
- **Offers:** Accident vehicle inspection and fitness; licence and RC matters; complaints against bus operators
- **Description:** Guwahati's transport office (AS-01). The Kamrup RTA and enforcement offices share the Betkuchi campus.
- **Source:** [Assam Commissionerate of Transport](https://comtransport.assam.gov.in/node/92396)

### 8.7 Kamrup (Metro) district control room: damaged roads and open pits
- **Phone:** 1077 (district control room); 9365429314 (phone/WhatsApp). Issued 11 June 2023.
- **Offers:** Report potholes and open pits within Guwahati
- **Description:** District administration line for road damage. Use it for the Ulubari pothole persona. No separate PWD pothole helpline was found.
- **Coords:** Pin at the DC office, Panbazar, 26.1860, 91.7440 `CHECK coords`
- **Source:** [India Today NE](https://indiatodayne.in/assam/story/assam-kamrup-m-administration-issues-helpline-numbers-to-report-damaged-roads-and-open-pits-574418-2023-06-11)

### 8.8 NHAI Regional Office, Guwahati
- **Area:** NEDFI House, 4th floor, GS Road, Dispur
- **Coords:** 26.1400, 91.7900 `CHECK coords`
- **Phone:** 0361-2224004 (old NHAI PDF, likely outdated). Use **1033**.
- **Offers:** Owner of NH-27 and NH-17 complaints, including the Gorchuk pothole and the Boko widening works
- **Source:** [NHAI PIU/RO list (old)](https://nhai.gov.in/nhai/Doc/24march14/piu-ro-cmulist.pdf)

### 8.9 112 Emergency Response Support System
- 112 is national. PM RAHAT relies on it. I could not confirm Assam's 112 go-live date, because older reports say Assam lagged. The bot should say "108 for ambulance; 112 or 100 for police".
- **Sources:** [MHA ERSS](https://www.mha.gov.in/emergency-response-support-system-erss), [112.gov.in](https://112.gov.in/about)

---

## 9. Locality anchors for hazard reports

| # | Spot | Lat, Lng | Why | Source |
|---|---|---|---|---|
| H1 | Gorchuk, NH-27 | 26.1137, 91.7022 `CHECK coords` | Daily gridlock junction since Basistha flyover; Gorchuk traffic handles the Betkuchi NH-27 crashes | [Sentinel, NH-27 risk zone](https://www.sentinelassam.com/amp/story/cities/guwahati-city/guwahati-nh-27-turns-risk-zone-amid-urban-chaos-poor-planning), [Sentinel, Betkuchi crash](https://www.sentinelassam.com/cities/guwahati-city/two-killed-as-truck-hits-vehicle-parked-on-nh-27-near-betkuchi-in-guwahati) |
| H2 | Jalukbari | 26.1530, 91.6700 `CHECK coords` | Western end of the "deadly" Jalukbari–Khanapara stretch; residents report rising accidents | [Dainik Asom / Assam Tribune](https://dainikasam.assamtribune.com/article/deadly-jalukbarikhanapara-highway-stretch-spurs-road-safety-alarms-1578109), [Sentinel](https://sentinelassam.com/guwahati-city/jalukbari-residents-concerned-over-rising-road-accidents-510006) |
| H3 | Khanapara junction | 26.1230, 91.8180 `CHECK coords` | SaveLIFE Foundation discussed fixes for this junction; a truck overturned onto a car here | [Pratidin Time](https://pratidintime.com/amp/story/guwahati-news-breaking-latest/guwahati-truck-overturns-onto-car-in-khanapara-traffic-snarled-on-nh37) |
| H4 | Ulubari flyover | 26.1700, 91.7620 `CHECK coords` | Potholes on roads near the flyover. The Chief Secretary ordered repair (Oct 2024), and later reports say the order was ignored. | [GuwahatiPlus](https://m.guwahatiplus.com/article/pothole-ridden-roads-near-ulubari-flyover-pose-challenge-to-guwahati-residents/34799), [Assam Tribune](https://assamtribune.com/guwahati/chief-secretarys-orders-ignored-as-guwahati-roads-crumble-near-flyover-sites-1587211) |
| H5 | Basistha Chariali | 26.1110, 91.7960 `CHECK coords` | Accidents rose at the underpass after the Basistha flyover opened | [Sentinel, NH-27 risk zone](https://www.sentinelassam.com/amp/story/cities/guwahati-city/guwahati-nh-27-turns-risk-zone-amid-urban-chaos-poor-planning) |
| H6 | Beltola (Beltola Chariali) | 26.1140, 91.7900 `CHECK coords` | On the same NH-27 corridor, but no accident-specific source was found | none specific; weak anchor |
| H7 | Six Mile | 26.1330, 91.8130 `CHECK coords` | GS Road / VIP Road junction; no accident-specific source found | none; weak anchor |
| H8 | Jorabat junction | 26.1030, 91.8700 `CHECK coords` | NH-27 / NH-6 junction. Gas tanker overturned (Apr 2024), and biker deaths at Bar Mile. Umiam–Jorabat road: 25 deaths in 100 days. | [India Today NE](https://www.indiatodayne.in/assam/video/guwahati-shillong-road-closed-after-14-wheeler-gas-tanker-overturns-in-jorabat-994946-2024-04-30), [Sentinel](https://www.sentinelassam.com/cities/guwahati-city/assam-motorcyclist-dies-on-spot-in-jorabat), [GuwahatiPlus](https://m.guwahatiplus.com/article/25-killed-in-100-days-on-route-connecting-guwahati-to-shillong-speeding-and-drunk-driving-cited/38888) |
| H9 | Lokhra / Betkuchi, NH-27 | 26.1170, 91.7300 `CHECK coords` | Truck rear-ended a parked vehicle near Betkuchi, killing 2 | [Sentinel](https://www.sentinelassam.com/cities/guwahati-city/two-killed-as-truck-hits-vehicle-parked-on-nh-27-near-betkuchi-in-guwahati) |
| H10 | Maligaon / Nilachal flyover | 26.1590, 91.6985 `CHECK coords` | Truck hit 4 bikes on the Nilachal flyover (1 dead); a water tanker crashed on the Maligaon flyover | [Northeast Live](https://northeastlivetv.com/around-ne/assam/1-dead-several-injured-after-truck-hits-4-bikes-on-nilachal-flyover-in-guwahati/), [Pratidin Time](https://www.pratidintime.com/guwahati-news-breaking-latest/guwahati-water-tanker-crashes-in-tragic-road-accident-at-maligaon-flyover) |
| H11 | Boko–Mirza, NH-17 | 25.9800, 91.2350 `CHECK coords` | Repeated truck collisions (Beerpara 2023, near Mirza); open widening ditch (May 2026) | [EastMojo](https://eastmojo.com/assam/2023/01/24/assam-two-vehicles-collide-in-kamrups-boko-both-drivers-dead/), [India Today NE](https://www.indiatodayne.in/assam/story/assam-nh-17-expansion-work-raises-safety-concerns-after-vehicle-falls-into-open-construction-ditch-near-boko-1400477-2026-05-31) |

Official lists: Kamrup (Metro) named **33 black spots**, and NHAI/MoRTH has its own Assam lists. The individual names of the 33 were not in the articles I could read, and the GuwahatiPlus article returns 404. No spot above is confirmed as an official black spot. ([Sentinel, 33 black spots](https://www.sentinelassam.com/guwahati-city/kamrup-m-admin-identifies-33-locations-as-accident-prone-areas-across-the-district-657683))

---

## Caveats

- **Coordinates:** all are approximate and from memory except Kamrup Tyres (JK store pin). Gorchuk, Basistha, Lokhra and Beltola sit within about 1–3 km of each other on NH-27, so check the pins against a map before shipping.
- **Cashless empanelment:** no official list of Golden Hour (46 hospitals) or PM RAHAT hospitals in Assam was found. **Do not label any hospital "cashless" on the map.** Have Sahai tell callers to ask the hospital or call 112 / 108.
- **PM RAHAT vs Golden Hour:** both offer ₹1.5 lakh for 7 days. Whether Assam's scheme is now run as PM RAHAT is unconfirmed.
- **Phone numbers:** police numbers are officer mobiles from a May 2025 news list and will drift. Hospital numbers mostly come from aggregators. Traffic control room numbers come from an undated news item. Numbers shown only on directories (CarDekho, MRF, JK, Apollo Tyres) were left out on purpose.
- **Late-night bike repair at Maligaon:** no real garage was confirmed open at 11 pm. The persona should use a fictional mechanic, or Sahai should say "most authorised centres close by 8–8:30 pm".
- **Boko truck tyre:** no tyre or truck shop in Boko or Mirza was confirmed. Nearest real ones are at Jalukbari and Adabari, about 50 km east.
- **Towing:** no verified operator. Use NHAI 1033 plus fictional personas.
- **GMCH "trauma centre":** a separate trauma building is not confirmed. GMCH is listed Level-II with Level-I proposed.
- **Jorabat jurisdiction:** the junction straddles Assam and Meghalaya. Crashes on NH-6 past the junction fall under Ri-Bhoi police.
- **Ulubari flyover station:** Bhangagarh vs Paltan Bazar PS coverage is unconfirmed.
