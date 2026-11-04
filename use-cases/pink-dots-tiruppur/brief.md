# Pink Dots Tiruppur — Use Case Brief

Source: Pink Dots AI infographic. Women and the jobs, services and opportunities near them often cannot find each other. Women's labour force participation in India is under 35%. Before: "The job seems good, I just don't feel comfortable travelling so far." After: "There's a similar role just 800m away. That's a relief."

Manager's steer (2026-11-04): put emphasis on **living accommodation** and **child care** needs.

```
USE CASE BRIEF
==============

## 1. Programme name
Pink Dots Tiruppur

## 2. Dots colour
Pink (from the infographic: magenta dots on plum)
- Primary:      #C2185B
- Primary dark: #6A1B4D
- Accent:       #E85AA3

## 3. Geography
- Region: Tiruppur city and its knitwear belt (Avinashi Road, Anupparpalayam,
  15 Velampalayam, Veerapandi, Palladam Road, Mudalipalayam SIPCOT)
- Country: India (Tamil Nadu)
- Map centre: around 11.108, 77.341 (verify during dot build)
- Zoom: 12 (city)

## 4. Seeker type
A woman garment or knitwear worker, often a migrant from Jharkhand, Odisha,
Bihar or UP, who needs a job close to where she can live safely, a women's
hostel she can afford, or child care that covers a full shift.

## 5. Provider type
Working women's hostels and ladies' PGs, creches and day-care (factory,
NGO, home-based), anganwadis and ICDS offices, knitwear units hiring women,
skills centres, safety and support services (One Stop Centre, all-women
police station, legal aid), health, banks and SHG federations, local agents.

## 6. Bot name
Sakhi

## 7. Language(s)
[x] Hindi
Note: Tamil is the local language. Hindi is the common language of the
migrant women this prototype is about.

## 8. Personas (3)
See personas.md.
1. Rinki Kumari — new arrival from Jharkhand, has a job offer 12 km away and
   no safe place to live near it (accommodation, early-stage)
2. Sasmita Nayak — overlock operator from Odisha with a 3-year-old, losing
   half days because nobody can mind her daughter (child care, mid-stage)
3. Meena Devi — runs a home day-care for migrant workers' children and wants
   mothers to find her (provider)

## 9. Sector list
1. Women's Hostels & PGs
2. Creches & Child Care
3. Anganwadis & Govt Child Care
4. Jobs: Garment & Knitwear
5. Skills & Training
6. Safety & Support
7. Health
8. Finance & SHGs
9. Women Requests   ← seeker dots: hardcoded intent

## 10. Supabase project
Only what the bot base already uses. No shared dot table.

## 11. Async sync
[x] No — seeker and provider dots are hardcoded from research.
Dots carry `type: "provider" | "seeker"` (same schema as Green Dots Nashik).

## 12. Anything else
- Safety matters more than in other builds: Sakhi must never send a woman
  to an unverified hostel as if it were checked, and must flag hostels linked
  to the Sumangali scheme or to restrictions on movement.
- Calls are 2-3 minutes.
```
