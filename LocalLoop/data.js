// all our businesses — update addresses/hours to real ones if needed
// tried to cover a good mix of categories for the demo

const DEFAULT_BUSINESSES = [
  {
    id: "b1",
    name: "Maple Street Café",
    category: "Food",
    address: "123 Maple St",
    phone: "(555) 123-4567",
    hours: "Mon–Sat 8am–6pm",
    description: "Coffee, sandwiches, and fresh baked goods.",
    keywords: ["coffee", "cafe", "breakfast", "lunch"],
    deal: { title: "10% off any drink", code: "MAPLE10", expires: "2026-06-30" }
  },
  {
    id: "b2",
    name: "Sunrise Bookshop",
    category: "Retail",
    address: "18 Queen St",
    phone: "(555) 909-0909",
    hours: "Daily 11am–6pm",
    description: "Indie bookstore with used and new titles.",
    keywords: ["books", "gifts", "reading"],
    deal: { title: "Buy 2 get 1 used book", code: "READMORE", expires: "2026-05-20" }
  },
  {
    id: "b3",
    name: "City Tech Repair",
    category: "Services",
    address: "890 King Rd",
    phone: "(555) 777-1212",
    hours: "Mon–Fri 9am–5pm",
    description: "Phone and laptop repairs with quick turnaround.",
    keywords: ["repair", "phones", "laptops", "tech"],
    deal: { title: "Free screen protector with repair", code: "FREEGUARD", expires: "2026-04-30" }
  },
  {
    id: "b4",
    name: "Northside Barbers",
    category: "Services",
    address: "55 North Ave",
    phone: "(555) 222-1000",
    hours: "Tue–Sun 10am–7pm",
    description: "Haircuts, fades, and beard trims.",
    keywords: ["haircut", "barber", "fade"],
    deal: { title: "$5 off student cut", code: "STUDENT5", expires: "2026-05-15" }
  },
  {
    id: "b5",
    name: "Pulse Fitness Studio",
    category: "Health/Fitness",
    address: "300 Wellness Blvd",
    phone: "(555) 303-0303",
    hours: "Mon–Sun 6am–9pm",
    description: "Group classes, strength training, and personal coaching.",
    keywords: ["gym", "fitness", "classes", "training"],
    deal: { title: "Free first class", code: "TRY1FREE", expires: "2026-06-01" }
  },
  {
    id: "b6",
    name: "Green Bowl Smoothies",
    category: "Food",
    address: "77 Garden Lane",
    phone: "(555) 808-8080",
    hours: "Mon–Sat 9am–7pm",
    description: "Smoothies, protein bowls, and healthy snacks.",
    keywords: ["smoothies", "healthy", "protein"],
    deal: { title: "BOGO 50% off smoothie", code: "BOWL50", expires: "2026-03-25" }
  },
  {
    id: "b7",
    name: "The Rustic Spoon",
    category: "Food",
    address: "204 Elmwood Ave",
    phone: "(555) 341-7890",
    hours: "Tue–Sun 11am–9pm",
    description: "Farm-to-table comfort food with rotating seasonal menus and homemade desserts.",
    keywords: ["restaurant", "dinner", "lunch", "farm", "comfort food"],
    deal: { title: "Free dessert with entrée", code: "SPOON25", expires: "2026-07-31" }
  },
  {
    id: "b8",
    name: "Bright Minds Tutoring",
    category: "Services",
    address: "512 College Blvd",
    phone: "(555) 654-3210",
    hours: "Mon–Fri 3pm–8pm, Sat 10am–4pm",
    description: "One-on-one tutoring for K–12 students in math, science, and English.",
    keywords: ["tutoring", "education", "school", "math", "science", "kids"],
    deal: { title: "First session free", code: "BRIGHT1", expires: "2026-06-15" }
  },
  {
    id: "b9",
    name: "Petal & Bloom Florist",
    category: "Retail",
    address: "33 Rose Court",
    phone: "(555) 210-4400",
    hours: "Mon–Sat 9am–6pm",
    description: "Custom bouquets, event florals, and houseplants for every occasion.",
    keywords: ["flowers", "florist", "bouquet", "plants", "gifts"],
    deal: { title: "15% off first order", code: "BLOOM15", expires: "2026-08-01" }
  },
  {
    id: "b10",
    name: "Iron & Oak Gym",
    category: "Health/Fitness",
    address: "88 Industrial Park Rd",
    phone: "(555) 900-1122",
    hours: "Mon–Sun 5am–11pm",
    description: "24/7 access gym with free weights, cardio machines, and monthly challenges.",
    keywords: ["gym", "weights", "cardio", "fitness", "workout"],
    deal: { title: "No enrollment fee", code: "IRONOAK", expires: "2026-05-31" }
  },
  {
    id: "b11",
    name: "Crust & Co. Pizzeria",
    category: "Food",
    address: "9 Harbour Street",
    phone: "(555) 477-2323",
    hours: "Mon–Sun 12pm–10pm",
    description: "Wood-fired Neapolitan pizza with local ingredients and craft sodas.",
    keywords: ["pizza", "italian", "dinner", "takeout", "wood fired"],
    deal: { title: "$3 off any large pizza", code: "CRUST3", expires: "2026-09-30" }
  },
  {
    id: "b12",
    name: "Serenity Spa & Wellness",
    category: "Health/Fitness",
    address: "71 Tranquil Way",
    phone: "(555) 188-0099",
    hours: "Tue–Sun 10am–7pm",
    description: "Massage therapy, facials, and aromatherapy treatments in a calming environment.",
    keywords: ["spa", "massage", "facial", "wellness", "relaxation"],
    deal: { title: "20% off first treatment", code: "ZEN20", expires: "2026-07-01" }
  },
  {
    id: "b13",
    name: "The Dog Den",
    category: "Services",
    address: "150 Paw Place",
    phone: "(555) 333-7676",
    hours: "Mon–Sat 8am–6pm",
    description: "Dog grooming, daycare, and boarding by certified pet care professionals.",
    keywords: ["dog", "grooming", "pet", "boarding", "daycare", "animals"],
    deal: { title: "Free nail trim with groom", code: "DOGDEN", expires: "2026-06-30" }
  },
  {
    id: "b14",
    name: "Vinyl & Vibes Record Shop",
    category: "Retail",
    address: "27 Groove Street",
    phone: "(555) 560-4141",
    hours: "Wed–Sun 12pm–7pm",
    description: "New and used vinyl records, turntables, and local artist merch.",
    keywords: ["vinyl", "records", "music", "turntable", "vintage"],
    deal: { title: "10% off used records", code: "VIBES10", expires: "2026-08-15" }
  },
  {
    id: "b15",
    name: "Golden Hour Photography",
    category: "Services",
    address: "62 Shutter Lane",
    phone: "(555) 721-8800",
    hours: "By appointment",
    description: "Portrait, event, and family photography with same-week digital delivery.",
    keywords: ["photography", "portraits", "events", "photos", "family"],
    deal: { title: "$50 off any booking", code: "GOLDEN50", expires: "2026-10-01" }
  },
  {
    id: "b16",
    name: "Brew & Beans Coffee Roasters",
    category: "Food",
    address: "415 Roast Ave",
    phone: "(555) 232-6600",
    hours: "Mon–Fri 7am–5pm, Sat 8am–4pm",
    description: "Specialty single-origin coffee roasted in-house. Beans available to take home.",
    keywords: ["coffee", "espresso", "roaster", "cafe", "beans"],
    deal: { title: "Free bag of beans with 5 visits", code: "BREW5", expires: "2026-11-30" }
  }
];