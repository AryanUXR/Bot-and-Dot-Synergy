# Pink Dots Tiruppur: research notes

Researched 2026-11-04 for `dots-providers.ts` and `dots-seekers.ts`.

## Housing and child care for migrant women in Tiruppur

The Tiruppur knitwear cluster employs more than 10 lakh workers directly, and about 65% of them are women ([AEPC via Textile Value Chain, May 2026](https://textilevaluechain.in/aepc-urges-affordable-housing-support-for-migrant-garment-workers-in-tiruppur)). Housing is the main gap. In 2026 both AEPC and the Tiruppur Exporters' Association asked the state for worker hostels and family housing, including four worker accommodation parks of about 25,000 beds each ([Apparel Resources](https://apparelresources.com/business-news/manufacturing/tea-seeks-worker-housing-to-ease-tiruppurs-labour-crunch/)). A 2026 ESCAP, IOM and UN Women study of 153 migrant women garment workers in Tamil Nadu found that factory hostels mostly house unmarried women and few offer rooms for couples. It recommended married-couple housing, child care and Tamil support for workers' children ([UN India summary](https://india.un.org/en/node/318966), [ESCAP repository](https://repository.unescap.org/items/2afa26c3-33d7-4cb1-bf0f-85229b23bb84)). Factories with more than 30 women must provide a creche under the Factories Act, but NHRC and state checks since 2019 point to weak compliance in the garment sector ([DT Next](https://dtnext.in/amp/tamilnadu/2019/04/29/garment-units-under-watch-after-nhrc-rap-over-miserable-working-conditions)). Women who rent rooms rather than live in a company hostel usually rely on private ladies hostels, anganwadis that close in the early afternoon, and informal neighbours for child care.

## What I could not verify

- **Thozhi hostel in Tiruppur.** The Tamil Nadu Working Women's Hostel Corporation's "Thozhi" hostels are in Chennai, Chengalpattu, Salem, Trichy, Tirunelveli, Vellore, Villupuram, Perambalur, Thanjavur and others. No source names one in Tiruppur. A later batch of 12 hostels was announced, but I could not get the district list. The only government women's hostel found is at **Neruperichal** (row 1), and who runs it and who can apply is unclear.
- **Factory creches.** No public source names a Tiruppur factory that runs a creche. No factory creche row was added.
- **Palna / National Creche Scheme.** Tamil Nadu had 100 anganwadi-cum-creches approved (Lok Sabha, Feb 2024), but none is confirmed in Tiruppur.
- **Specific anganwadi centres.** No address list was found. Rows 20 and 21 are placeholders marked `Unverified`.
- **One Stop Centre building.** The centre exists (staff recruited Oct 2025 through the DSWO) but its building is not published. Row 30 is pinned near the Collectorate and tells women to call 181.
- **ICDS District Programme Office.** It exists, but the office address is not published. It is assumed to be at the Collectorate.
- **Private hostels and day-care centres.** All come from online directories (worldorgs, proeves, lentlo). Fees, curfews, vacancy and whether they still operate are not checked. Directory phone numbers were left out of the .ts on purpose. They are on the source pages if the team wants to call and check.
- **ATDC location.** ATDC's own 2025 brochure places it at Kaikattipudur near Avinashi. An older directory says the AEPC building, Indira Nagar. Confirm by phone.
- **TEA address** is from an undated third-party page.
- **Coordinates.** Every real row is approximate (`// CHECK coords`). None was taken from a map pin. The Collectorate rows (18, 19, 30, 34, 38) and the DLSA row (33) sit within about 200 m of each other because they share one campus.

## Sumangali and hostel restriction concerns

- The Sumangali scheme (lump-sum pay at the end of a 3-5 year contract, mostly for young unmarried women in spinning mills) is well documented in the Tiruppur, Coimbatore and Dindigul belt up to about 2017. Workers lived in mill hostels with home visits allowed every 6 months, or once a year for north Indian migrants ([Fair Wear Foundation guidance](https://api.fairwear.org/wp-content/uploads/2020/09/Guidance-on-Sumangali-India.pdf), [Deccan Herald](https://www.deccanherald.com/india/textile-mills-take-girls-ride-2566915)). The industry says the scheme has been renamed to an "apprentice scheme with hostel facility" in about 120 mills.
- Six young women were reported beaten by a warden and guard while trying to leave a factory-run hostel in Udumalpet, Tiruppur district ([The News Minute](https://thenewsminute.com/amp/story/tamil-nadu/six-women-rescued-tn-garment-factory-after-assault-warden-and-guard-62311)). Udumalpet is about 60 km away, outside the map area.
- **No mill or company hostel is listed as a recommended hostel.** The directory also listed "Sivaa Sakthi Mills Labour Hostel", "Victus Hostel" and "Hem Tex Hostel". These look like company labour hostels and were left out.
- Eastman Exports (row 22) says it offers hostel and transport for women. The row tells women to ask about hostel rules on going out before joining. No Sumangali link was found for Eastman.
- Seeker 104 (Sarita Y.) is written around this issue: she wants to leave a company hostel that lets women out once a month.
- **For Sakhi:** never call a hostel "safe" or "verified". Ask whether the woman can leave freely, keeps her own ID and phone, and is paid monthly. Point her to AWPS, DLSA or 181 if not.

## Fictional and unconfirmed rows (6 of 41 provider rows)

| id | Name | Sector | Why |
|---|---|---|---|
| 16 | Meena Devi | Creches & Child Care | Persona 3 in personas.md (home day care, 15 Velampalayam) |
| 17 | Lalita Munda | Creches & Child Care | Home day care, Veerapandi |
| 20 | Anganwadi Centre (ICDS), Veerapandi area | Anganwadis & Govt Child Care | Real service, exact centre unconfirmed |
| 21 | Anganwadi Centre (ICDS), Anupparpalayam area | Anganwadis & Govt Child Care | Real service, exact centre unconfirmed |
| 27 | Pushpa Tirkey | Jobs: Garment & Knitwear | Hindi-speaking line supervisor |
| 41 | Sunita Majhi | Women's Hostels & PGs | Hindi-speaking room finder |

The four personas use dummy phone numbers `+91 90000 0000x`. All 10 seeker dots (ids 101-110) are fictional women placed in real localities.
