"""Single source for the Pune pet-care data: writes petDots.ts (map) and raya/directory.md (bot).
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
SECTORS = {"Vets & Pet Hospitals": "#2563EB", "Pet Sitters & Boarding": "#0D9488", "Pet Shops": "#D97706",
           "Grooming": "#DB2777", "Training & Adoption": "#7C3AED"}
P = [  # id, sector, name, area, org_type, offers, description
 (1, "Vets & Pet Hospitals", "Paws & Care 24x7 Pet Hospital", "Kothrud", "Pet Hospital", ["24x7 emergency", "X-ray", "Open Sundays"], "Pet hospital open round the clock, with X-ray and surgery."),
 (2, "Vets & Pet Hospitals", "Baner Vet Clinic", "Baner", "Vet Clinic", ["Vaccination", "Check-ups", "Sunday morning OPD"], "Neighbourhood vet clinic, open on Sunday mornings."),
 (3, "Vets & Pet Hospitals", "Aundh Animal Clinic", "Aundh", "Vet Clinic", ["Check-ups", "Lab tests", "Home visits"], "Clinic for dogs and cats; the vet visits homes on weekday evenings."),
 (4, "Vets & Pet Hospitals", "Deccan Pet Hospital", "Deccan", "Pet Hospital", ["24x7 emergency", "ICU", "Dental care"], "Large pet hospital with an ICU, open all night."),
 (5, "Vets & Pet Hospitals", "Bavdhan Mobile Vet", "Bavdhan", "Mobile Vet", ["Home visits", "Vaccination at home", "Weekends"], "A vet who comes home, including weekends."),
 (6, "Pet Sitters & Boarding", "Happy Tails Home Boarding", "Baner", "Home Boarding", ["Dog and cat boarding", "Daily photo updates", "Pickup on request"], "Small home boarding with daily photo updates for owners."),
 (7, "Pet Sitters & Boarding", "Pashan Pet Sitters Circle", "Pashan", "Pet Sitters", ["Home visits for cats", "Feeding", "Litter cleaning"], "Group of sitters who visit homes to feed and care for cats."),
 (8, "Pet Sitters & Boarding", "Kothrud Dog Walkers", "Kothrud", "Dog Walkers", ["Morning walks", "Evening walks", "Small and large dogs"], "Daily dog walks in Kothrud, mornings and evenings."),
 (9, "Pet Sitters & Boarding", "Whiskers Cat Hostel", "Aundh", "Cat Boarding", ["Cats only", "Separate rooms", "Vet on call"], "A quiet cats-only stay with separate rooms."),
 (10, "Pet Sitters & Boarding", "Balewadi Pet Daycare", "Balewadi", "Day Care", ["Day care", "Play area", "Weekday hours"], "Weekday day care with a play area."),
 (11, "Pet Sitters & Boarding", "Anjali D. · Pet caretaker", "Aundh", "Independent Caretaker", ["Dog walks", "Home visits", "Weekend sitting", "Pet first aid"], "Walks dogs and sits pets around Aundh; pet first-aid trained."),
 (12, "Pet Shops", "Furry Basket Pet Store", "Kothrud", "Pet Shop", ["Dog and cat food", "Toys", "Home delivery"], "Pet food and supplies with same-day delivery nearby."),
 (13, "Pet Shops", "Aundh Pet Mart", "Aundh", "Pet Shop", ["Food", "Medicines on prescription", "Accessories"], "Pet shop that also stocks medicines on a vet's prescription."),
 (14, "Pet Shops", "Baner Pet Supplies", "Baner", "Pet Shop", ["Food", "Cat litter", "Carriers"], "Food, litter and travel carriers for cats and dogs."),
 (15, "Pet Shops", "Shivajinagar Aquarium & Pets", "Shivajinagar", "Pet Shop", ["Fish", "Bird food", "Aquarium supplies"], "Fish, birds and aquarium supplies."),
 (16, "Grooming", "Snip & Wag Grooming", "Baner", "Grooming Salon", ["Bath and haircut", "Nail trim", "Tick treatment"], "Grooming salon for dogs and cats."),
 (17, "Grooming", "Karve Nagar Pet Spa", "Karve Nagar", "Grooming Salon", ["Grooming", "Bath", "Pickup and drop"], "Grooming with pickup and drop."),
 (18, "Grooming", "Groom-on-Wheels Pune", "Wakad", "Mobile Grooming", ["Grooming van at home", "Weekends"], "A grooming van that comes to your building."),
 (19, "Training & Adoption", "Good Dog Training School", "Pashan", "Trainer", ["Puppy classes", "Obedience", "Leash training"], "Group and one-on-one dog training."),
 (20, "Training & Adoption", "Erandwane Behaviour Clinic", "Erandwane", "Behaviour Trainer", ["Barking and biting help", "One-on-one sessions"], "Help for dogs that bark, bite or get anxious."),
 (21, "Training & Adoption", "Pune Animal Rescue & Adoption", "Koregaon Park", "Rescue Group", ["Adopt dogs and cats", "Foster care", "Volunteer days"], "Rescue group that rehomes dogs and cats and needs foster homes."),
 (22, "Training & Adoption", "Viman Nagar Adoption Camp", "Viman Nagar", "Adoption Camp", ["Monthly adoption camp", "Vaccinated pets"], "Monthly camp where vaccinated rescues meet new families."),
]
S = [  # requests: id, sector, name, area, need, offers, description
 (101, "Pet Sitters & Boarding", "Kavya R. · Dog owner", "Aundh", "Needs: Evening dog walker", ["Labrador", "Weekdays"], "Works late and wants someone to walk her Labrador in the evenings."),
 (102, "Pet Sitters & Boarding", "Nikhil P. · Cat owner", "Baner", "Needs: Weekend cat sitter", ["Two cats", "Home visits"], "Away most weekends and wants someone to feed his cats at home."),
 (103, "Pet Sitters & Boarding", "Priyanka D. · Two dogs", "Balewadi", "Needs: Weekday day care", ["Two indie dogs"], "Wants day care for two dogs on office days."),
 (104, "Vets & Pet Hospitals", "Sana M. · New puppy", "Pashan", "Needs: Puppy vaccination", ["Eight-week puppy"], "Brought home a puppy and needs its first vaccines."),
 (105, "Vets & Pet Hospitals", "Arjun T. · Senior dog", "Kothrud", "Needs: Home vet visit", ["Fourteen-year-old dog"], "His old dog can't travel easily and needs a vet at home."),
 (106, "Training & Adoption", "Rahul S. · Rescue kitten", "Shivajinagar", "Needs: Foster home", ["Kitten", "Two weeks"], "Found a kitten and needs a foster home for two weeks."),
 (107, "Pet Sitters & Boarding", "Lata J. · Older pet owner", "Erandwane", "Needs: Help with walks", ["Beagle", "Mornings"], "Finds long walks hard and wants help walking her beagle."),
 (108, "Training & Adoption", "Kunal V. · Puppy owner", "Wakad", "Needs: Puppy training", ["Five-month puppy"], "Wants leash and toilet training for a young puppy."),
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
      "export interface PetDot {\n  id: number;\n  type: \"provider\" | \"seeker\";\n  name: string;\n  area: string;\n  lat: number;\n  lng: number;\n  sector: string;\n  org_type?: string;\n  offers?: string[];\n  description: string;\n}", "",
      "// The map's \"You\" marker: Kothrud", "export const HOME = { label: \"You\", area: \"Kothrud\", lat: 18.5074, lng: 73.8077 };", "",
      "export const PUNE_PET_DOTS: PetDot[] = " + json.dumps(dots, indent=2, ensure_ascii=False) + ";", ""]
open(os.path.join(HERE, "petDots.ts"), "w").write("\n".join(ts))
def km(area):
    k, b, a = AREAS[area][2:]
    return f"Kothrud {k} km · Baner {b} km · Aundh {a} km"
out = ["## Directory", "Format: name | area | what they offer | distance from Kothrud, Baner and Aundh.", "",
       "Use the distance for the caller's own area. All entries are sample listings for this prototype.", ""]
for sec in SECTORS:
    out.append(f"### {sec}")
    out += [f"{n} | {ar} | {', '.join(o)} | {km(ar)}" for (i, s, n, ar, org, o, d) in P if s == sec]
    out.append("")
out.append("### Requests from pet owners (never offer these as helpers; they are people who need help. Offer them to a caretaker or provider looking for clients)")
out += [f"{n} | {ar} | {need} | {km(ar)}" for (i, s, n, ar, need, o, d) in S]
open(os.path.join(HERE, "raya", "directory.md"), "w").write("\n".join(out) + "\n")
print(len(P), "providers,", len(S), "requests")
