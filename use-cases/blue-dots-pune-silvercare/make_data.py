"""Single source for the Pune elder-care data: writes careDots.ts (map) and raya/directory.md (bot).
All rows are fictional sample data. Localities are real Pune areas; no addresses or phone numbers."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
AREAS = {  # lat, lng, and road km from Kothrud, Baner, Aundh (rough, for the prototype)
 "Kothrud": (18.5074, 73.8077, 1, 9, 8), "Karve Nagar": (18.4893, 73.8203, 3, 12, 11), "Erandwane": (18.5100, 73.8340, 3, 9, 7),
 "Deccan": (18.5167, 73.8417, 5, 9, 6), "Shivajinagar": (18.5308, 73.8475, 7, 8, 5), "Baner": (18.5590, 73.7868, 9, 1, 4),
 "Balewadi": (18.5761, 73.7766, 11, 3, 6), "Aundh": (18.5580, 73.8075, 8, 4, 1), "Pashan": (18.5410, 73.7930, 6, 4, 4),
 "Bavdhan": (18.5120, 73.7700, 4, 8, 9), "Wakad": (18.5990, 73.7620, 14, 6, 8), "Koregaon Park": (18.5362, 73.8930, 12, 13, 10),
 "Viman Nagar": (18.5679, 73.9143, 16, 15, 12),
}
SECTORS = {"Home Care & Attendants": "#2563EB", "Elder Day Care": "#2563EB", "Assisted Living": "#2563EB",
           "Nursing & Physio at Home": "#2563EB", "Clinics & Pharmacies": "#2563EB"}  # one blue; icons tell sectors apart
P = [  # id, sector, name, area, org_type, offers, description
 (1, "Home Care & Attendants", "CareNest Home Attendants", "Kothrud", "Care Agency", ["Day attendants", "Few hours or full day", "Background-checked staff"], "Attendants who help elders at home with meals, walks and daily routines."),
 (2, "Home Care & Attendants", "Saksham Elder Care Services", "Baner", "Care Agency", ["Live-in attendants", "Short-term cover", "Background-checked staff"], "Live-in and short-term attendants for elders."),
 (3, "Home Care & Attendants", "Aundh Home Helpers for Seniors", "Aundh", "Care Agency", ["Few hours a day", "Help with meals and walks"], "Part-time helpers who visit elders at home."),
 (4, "Home Care & Attendants", "Karve Nagar Care Agency", "Karve Nagar", "Care Agency", ["Night attendants", "Weekly plans", "Background-checked staff"], "Night and weekly attendant plans."),
 (5, "Home Care & Attendants", "Kavita S. · Caregiver", "Baner", "Independent Caregiver", ["Home visits", "Help with bathing and meals", "Trained general duty assistant"], "Trained caregiver with five years of elder care, working around Baner."),
 (6, "Elder Day Care", "Sukhad Senior Day Centre", "Aundh", "Day Centre", ["Day care", "Lunch", "Games and yoga", "Pickup on request"], "A day centre with lunch, yoga and games for seniors."),
 (7, "Elder Day Care", "Kothrud Seniors Club Day Care", "Kothrud", "Day Centre", ["Weekday day care", "Reading room", "Group outings"], "A weekday club and day centre for seniors."),
 (8, "Elder Day Care", "Pashan Golden Years Centre", "Pashan", "Day Centre", ["Day care", "Memory activities", "Nurse on site"], "Day care with a nurse on site and memory activities."),
 (9, "Elder Day Care", "Baner Evening Companions", "Baner", "Companion Service", ["Evening company", "Walks", "Phone check-ins"], "Volunteers and staff who keep elders company in the evenings."),
 (10, "Assisted Living", "Shanti Kunj Assisted Living", "Bavdhan", "Assisted Living", ["Assisted living", "Respite stays", "Weekly doctor visits"], "Assisted living with short respite stays."),
 (11, "Assisted Living", "Deccan Senior Residency", "Deccan", "Senior Residency", ["Long stays", "Short respite stays", "Meals"], "Senior residency for long or short stays."),
 (12, "Assisted Living", "Balewadi Care Home", "Balewadi", "Care Home", ["Care home", "Memory care", "Family visiting hours"], "A care home with memory care and open visiting hours."),
 (13, "Nursing & Physio at Home", "Kothrud Home Nursing", "Kothrud", "Home Nursing", ["Nurse visits", "Wound dressing", "Injections at home"], "Nurses who visit elders at home."),
 (14, "Nursing & Physio at Home", "Aundh Physio at Home", "Aundh", "Physiotherapy", ["Physiotherapy at home", "Recovery after a fall"], "Physiotherapists who come home."),
 (15, "Nursing & Physio at Home", "Erandwane Home Health", "Erandwane", "Home Health", ["Nurse visits", "Lab tests at home", "Equipment on rent"], "Home nursing, lab tests and equipment on rent."),
 (16, "Nursing & Physio at Home", "Wakad Rehab Physio", "Wakad", "Physiotherapy", ["Physiotherapy", "Walking aids advice"], "Physiotherapy and advice on walking aids."),
 (17, "Clinics & Pharmacies", "Shivajinagar Elder Clinic", "Shivajinagar", "Clinic", ["Elder check-ups", "Memory clinic", "Weekday OPD"], "A clinic for elders with a weekday OPD."),
 (18, "Clinics & Pharmacies", "Kothrud Medicines Home Delivery", "Kothrud", "Pharmacy", ["Medicine delivery", "Monthly refills"], "Pharmacy that delivers medicines and monthly refills."),
 (19, "Clinics & Pharmacies", "Baner Family Clinic", "Baner", "Clinic", ["Check-ups", "Blood pressure and sugar checks", "Sunday morning OPD"], "Family clinic with a Sunday morning OPD."),
 (20, "Clinics & Pharmacies", "Deccan 24x7 Hospital", "Deccan", "Hospital", ["24x7 emergency", "Ambulance"], "Hospital with a round-the-clock emergency ward."),
]
S = [  # requests: id, sector, name, area, need, offers, description
 (101, "Home Care & Attendants", "Leela K. · Lives alone", "Aundh", "Needs: Daytime attendant", ["Weekdays", "Few hours"], "Lives alone and wants help for a few hours each weekday."),
 (102, "Nursing & Physio at Home", "Prakash D. · Retired", "Kothrud", "Needs: Physiotherapy at home", ["Three times a week"], "Recovering after a fall and wants physiotherapy at home."),
 (103, "Home Care & Attendants", "Nalini R. · Family in another city", "Baner", "Needs: Weekly check-in visits", ["Weekly visits", "Help with errands"], "Her family lives in another city and wants someone to visit weekly."),
 (104, "Elder Day Care", "Suresh B. · Retired", "Pashan", "Needs: Day care with a nurse", ["Weekdays"], "Wants a day centre with a nurse on site."),
 (105, "Home Care & Attendants", "Usha M. · Back from hospital", "Erandwane", "Needs: Night attendant", ["Two weeks"], "Back home after a hospital stay and needs a night attendant for two weeks."),
 (106, "Elder Day Care", "Ramesh J. · Retired", "Balewadi", "Needs: Company and walks", ["Evenings"], "Wants company and an evening walk."),
 (107, "Home Care & Attendants", "Meena V. · Family in another city", "Kothrud", "Needs: Help with meals", ["Lunch and dinner"], "Wants help cooking and serving meals at home."),
 (108, "Clinics & Pharmacies", "Ashok P. · Retired", "Wakad", "Needs: Medicine delivery", ["Monthly"], "Wants monthly medicines delivered home."),
]
def row(r, typ):
    i, sec, name, area, org, offers, desc = r; lat, lng = AREAS[area][:2]
    # spread dots in the same area a little so pins don't sit on top of each other
    j = (i * 37) % 11 - 5
    return {"id": i, "type": typ, "sector": sec, "name": name, "area": area, "lat": round(lat + j * 0.0012, 4),
            "lng": round(lng - j * 0.0010, 4), "org_type": org, "offers": offers, "description": desc}
dots = [row(r, "provider") for r in P] + [row(r, "seeker") for r in S]
ts = ["// All rows are fictional sample data for this prototype. Names, services and requests are made up;",
      "// the localities are real Pune areas. No addresses or phone numbers.", "",
      "export const SECTORS = [" + ", ".join(json.dumps(s) for s in SECTORS) + "] as const;", "",
      "export const SECTOR_COLOURS: Record<string, string> = " + json.dumps(SECTORS, indent=2) + ";", "",
      "export interface CareDot {\n  id: number;\n  type: \"provider\" | \"seeker\";\n  name: string;\n  area: string;\n  lat: number;\n  lng: number;\n  sector: string;\n  org_type?: string;\n  offers?: string[];\n  description: string;\n}", "",
      "// The map's \"You\" marker: Kothrud", "export const HOME = { label: \"You\", area: \"Kothrud\", lat: 18.5074, lng: 73.8077 };", "",
      "export const PUNE_CARE_DOTS: CareDot[] = " + json.dumps(dots, indent=2, ensure_ascii=False) + ";", ""]
open(os.path.join(HERE, "careDots.ts"), "w").write("\n".join(ts))
def km(area):
    k, b, a = AREAS[area][2:]
    return f"Kothrud {k} km · Baner {b} km · Aundh {a} km"
out = ["## Directory", "Format: name | area | what they offer | distance from Kothrud, Baner and Aundh.", "",
       "Use the distance for the caller's own area. All entries are sample listings for this prototype.", ""]
for sec in SECTORS:
    out.append(f"### {sec}")
    out += [f"{n} | {ar} | {', '.join(o)} | {km(ar)}" for (i, s, n, ar, org, o, d) in P if s == sec]
    out.append("")
out.append("### Requests from families (never offer these as helpers; they are people who need care. Offer them to a caregiver or provider looking for work)")
out += [f"{n} | {ar} | {need} | {km(ar)}" for (i, s, n, ar, need, o, d) in S]
open(os.path.join(HERE, "raya", "directory.md"), "w").write("\n".join(out) + "\n")
print(len(P), "providers,", len(S), "requests")
