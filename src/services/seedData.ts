import { collection, getDocs, doc, setDoc, writeBatch } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import { Service, Project, Testimonial, FAQ, BlogPost, CompanySettings } from '../types';

export const INITIAL_SERVICES: Omit<Service, 'id'>[] = [
  {
    title: 'Roof Installation',
    slug: 'roof-installation',
    shortDescription: 'Professional installation for new construction or custom home upgrades using premium architectural materials.',
    description: 'Our roof installation service delivers exceptional engineering, premium underlayment, and industry-leading roofing shingles and metal systems. We tailor each installation to local wind ratings and weather extremes, ensuring your brand new home is shielded for decades to come.',
    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
    features: ['Architectural & Designer Shingles', 'High-Grade Ice & Water Barriers', 'Precision Ridge Ventilation', '50-Year Manufacturer Warranty', 'Certified Master Craftsmen'],
    startingPrice: 6500,
    active: true,
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    title: 'Roof Replacement',
    slug: 'roof-replacement',
    shortDescription: 'Remove the old and upgrade to a stronger, long-lasting roof engineered with superior weather resistance.',
    description: 'When aging shingles crack, curl, or lose protective granules, a complete replacement revitalizes your property value and safeguards your interior. We manage total tear-offs, decking replacements, and installation of cutting-edge roofing systems with zero debris left behind.',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    features: ['Full Decking Structural Assessment', 'Synthetic Heavy-Duty Underlayment', 'Advanced Algae-Resistant Shingles', 'Flashing & Valley Reconstruction', 'Lifetime Workmanship Guarantee'],
    startingPrice: 8500,
    active: true,
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    title: 'Roof Repair',
    slug: 'roof-repair',
    shortDescription: 'Quick and reliable repairs to fix leaks, wind blow-offs, damaged flashing, and regular wear & tear.',
    description: 'Don’t let a minor leak escalate into catastrophic water rot and attic mold. Our certified technicians pinpoint hidden leak pathways around skylights, chimneys, and valleys, executing seamless structural repairs that match your existing roof aesthetic.',
    imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
    features: ['Same-Day Leak Detection', 'Chimney & Skylight Flashing', 'Missing & Blown-off Shingle Matching', 'Pipe Boot & Vent Collar Seals', 'Thorough Attic Moisture Scans'],
    startingPrice: 350,
    active: true,
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    title: 'Gutter Services',
    slug: 'gutter-services',
    shortDescription: 'Installation, cleaning, and maintenance for a proper drainage system that protects your foundation.',
    description: 'Proper water diversion is critical for roof and foundation longevity. We fabricate custom seamless 5-inch and 6-inch aluminum gutters on-site, coupled with heavy-duty hidden hangers, leaf filtration guards, and strategically placed downspouts.',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    features: ['Custom On-Site Seamless Aluminum', 'High-Flow Micro-Mesh Leaf Guards', 'Fascia Board Wood Repair', 'Reinforced Heavy-Duty Hangers', 'Downspout Extensions & Drainage'],
    startingPrice: 850,
    active: true,
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    title: 'Roof Inspection',
    slug: 'roof-inspection',
    shortDescription: 'Comprehensive 21-point certified roof inspections with high-resolution drone imaging and detailed reports.',
    description: 'Whether you are buying a home, preparing for storm season, or verifying roof integrity after heavy hail, our certified inspectors examine shingles, gutters, seals, decking, and attic ventilation. You receive a digital photographic report within 24 hours.',
    imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80',
    features: ['4K Drone Aerial Surface Scans', '21-Point Structural Checklist', 'Attic Insulation & Moisture Scan', 'Insurance-Grade Certified Reports', 'Free Replacement Cost Estimator'],
    startingPrice: 199,
    active: true,
    featured: false,
    createdAt: new Date().toISOString(),
  },
  {
    title: 'Emergency Roofing',
    slug: 'emergency-roofing',
    shortDescription: '24/7 rapid emergency tarping and dispatch to halt active water intrusion and safeguard your property.',
    description: 'Storms strike without warning. Fallen branches, severe wind shear, and sudden penetrations demand rapid response. Our 24/7 emergency unit arrives with heavy-duty tarps, industrial fasteners, and immediate leak barriers to mitigate losses before full repair.',
    imageUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80',
    features: ['24/7 On-Call Emergency Crew', 'Heavy-Duty Tarping & Board-Up', 'Tree & Debris Stabilization', 'Direct Insurance Mitigation Documentation', 'Rapid Storm Response'],
    startingPrice: 500,
    active: true,
    featured: false,
    createdAt: new Date().toISOString(),
  },
  {
    title: 'Commercial Roofing',
    slug: 'commercial-roofing',
    shortDescription: 'Engineered commercial roofing solutions including TPO, EPDM, PVC, and metal roof restorations.',
    description: 'We deliver commercial roofing installations and preventive maintenance for office buildings, warehouses, multi-family complexes, and retail centers. Our systems enhance energy efficiency, reduce HVAC load, and come with manufacturer NDL warranties.',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    features: ['TPO & EPDM Single-Ply Membranes', 'Standing Seam Commercial Metal', 'Reflective Elastomeric Coatings', 'Low-Slope Thermal Insulation', 'Multi-Year NDL Warranties'],
    startingPrice: 12000,
    active: true,
    featured: false,
    createdAt: new Date().toISOString(),
  },
  {
    title: 'Storm Damage Repair',
    slug: 'storm-damage-repair',
    shortDescription: 'Expert hail, wind, and severe weather repairs backed by complete insurance claim assistance.',
    description: 'Hail impacts can bruise shingle fiberglass and compromise water tightness without visible ground cues. We provide comprehensive storm diagnostics, meet with your insurance adjusters on the roof, and fight to ensure every square foot of damage is restored properly.',
    imageUrl: 'https://images.unsplash.com/photo-1527030280862-64139fba04ca?auto=format&fit=crop&w=1200&q=80',
    features: ['Hail Impact & Wind Uplift Mapping', 'Insurance Adjuster On-Site Meetings', 'Code-Upgrade Compliance Support', 'Zero Out-of-Pocket Beyond Deductible', 'Full Restoration Guarantee'],
    startingPrice: 1500,
    active: true,
    featured: false,
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_PROJECTS: Omit<Project, 'id'>[] = [
  {
    title: 'The Aspen Ridge Residence',
    slug: 'aspen-ridge-residence',
    location: 'Denver, CO',
    serviceType: 'Roof Replacement',
    description: 'Complete transformation of a 3,400 sq. ft. Craftsman residence. We stripped 20-year-old failing 3-tab shingles, reinforced weak decking, installed premium synthetic underlayment, and laid Timberline HDZ charcoal architectural shingles with copper valley accents.',
    beforeImage: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1000&q=80',
    afterImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80'
    ],
    completedDate: '2025-11-14',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    title: 'Hilltop Modern Estate',
    slug: 'hilltop-modern-estate',
    location: 'Boulder, CO',
    serviceType: 'Roof Installation',
    description: 'Custom contemporary architectural build featuring 24-gauge standing seam matte black metal roofing with integrated solar snow guards and concealed fasteners. Engineered for 130 mph mountain wind gust resistance.',
    beforeImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=80',
    afterImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80'
    ],
    completedDate: '2025-10-02',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    title: 'Pine Valley Ranch Restoration',
    slug: 'pine-valley-ranch-restoration',
    location: 'Evergreen, CO',
    serviceType: 'Storm Damage Repair',
    description: 'Severe quarter-sized hail battered this mountain ranch property. PeakShield handled the claim directly with the insurance carrier, replaced 42 squares of impact-resistant Class 4 shingles, and upgraded all gutters to 6" seamless aluminum.',
    beforeImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80',
    afterImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1000&q=80'
    ],
    completedDate: '2025-09-18',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    title: 'Grandview Commercial Center',
    slug: 'grandview-commercial-center',
    location: 'Aurora, CO',
    serviceType: 'Commercial Roofing',
    description: '18,500 square-foot high-reflectance 60-mil white TPO membrane installation over polyiso rigid insulation board. Upgraded drainage sumps and edge metal trim for complete watertight commercial peace of mind.',
    beforeImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80',
    afterImage: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1000&q=80'
    ],
    completedDate: '2025-08-30',
    featured: false,
    createdAt: new Date().toISOString(),
  },
  {
    title: 'Cherry Creek Historic Manor',
    slug: 'cherry-creek-historic-manor',
    location: 'Denver, CO',
    serviceType: 'Roof Replacement',
    description: 'Preservation and overhaul of a 1928 historic estate. We preserved custom copper chimney pots while outfitting the main structure with lightweight, maintenance-free composite slate tiles designed to endure 100+ years.',
    beforeImage: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1000&q=80',
    afterImage: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=80'
    ],
    completedDate: '2025-07-22',
    featured: false,
    createdAt: new Date().toISOString(),
  },
  {
    title: 'Lakewood Vista Heights',
    slug: 'lakewood-vista-heights',
    location: 'Lakewood, CO',
    serviceType: 'Roof Installation',
    description: 'Custom contemporary two-story home featuring dual slope roofing with hidden internal gutters and high-efficiency reflective asphalt shingle materials.',
    beforeImage: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1000&q=80',
    afterImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80'
    ],
    completedDate: '2025-06-15',
    featured: false,
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_TESTIMONIALS: Omit<Testimonial, 'id'>[] = [
  {
    customerName: 'Marcus Vance',
    customerPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    text: 'PeakShield replaced our 25-year-old shingle roof in just two days. Impeccable cleanup, professional crew, and our home looks brand new. The best contracting experience we have ever had!',
    service: 'Roof Replacement',
    approved: true,
    createdAt: new Date().toISOString(),
  },
  {
    customerName: 'Elena Rostova',
    customerPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    text: 'After a severe hail storm tore through our neighborhood, PeakShield was the only company that handled our insurance claim with zero stress. They documented everything and got us 100% coverage.',
    service: 'Storm Damage Repair',
    approved: true,
    createdAt: new Date().toISOString(),
  },
  {
    customerName: 'David & Sarah Miller',
    customerPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    text: 'The drone inspection report was eye-opening. Transparent pricing, no surprise fees, and the dark green trim shingles look magnificent. We have already referred our neighbors.',
    service: 'Roof Installation',
    approved: true,
    createdAt: new Date().toISOString(),
  },
  {
    customerName: 'Robert Chen',
    customerPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    text: 'We hired PeakShield for our 18,000 sq ft commercial facility. Top-tier craftsmanship, strict adherence to OSHA safety, and completed three days ahead of schedule.',
    service: 'Commercial Roofing',
    approved: true,
    createdAt: new Date().toISOString(),
  },
  {
    customerName: 'Jennifer Hayes',
    customerPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    text: 'From the initial digital quote to the final magnetic nail sweep across our lawn and driveway, every step was seamless. True professionals.',
    service: 'Roof Repair',
    approved: true,
    createdAt: new Date().toISOString(),
  },
  {
    customerName: 'Thomas Bradford',
    customerPhoto: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    text: 'Outstanding customer service and true master craftsmen. The standing seam metal roof has already dropped our summer cooling bills significantly.',
    service: 'Roof Installation',
    approved: true,
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_FAQS: Omit<FAQ, 'id'>[] = [
  {
    question: 'How do I know if my roof needs a full replacement or just a repair?',
    answer: 'If your roof is under 15 years old and damage is isolated (e.g. a few blown-off shingles or a specific pipe boot leak), a targeted repair is often best. However, if your roof exceeds 20 years, shows widespread granule loss, curling shingles, or sagging decking across multiple slopes, a full replacement is safer and far more economical long term.',
    category: 'General',
    active: true,
    order: 1,
  },
  {
    question: 'How long does a typical roof replacement take?',
    answer: 'Most average residential homes (2,000 to 3,500 square feet) are completely torn off, decked, weather-shielded, and shingled within 1 to 2 business days. Larger estates, steep pitches, or custom metal installations may require 3 to 4 days. We ensure your roof is never left exposed to weather overnight.',
    category: 'Process',
    active: true,
    order: 2,
  },
  {
    question: 'Will you work directly with my homeowner insurance company on storm claims?',
    answer: 'Yes! PeakShield specializes in storm restoration. We meet directly with your insurance field adjuster on your roof, provide 4K photographic evidence and itemized Xactimate estimates, and ensure all damaged components and code requirements are covered properly.',
    category: 'Insurance',
    active: true,
    order: 3,
  },
  {
    question: 'What warranty coverage does PeakShield Roofing provide?',
    answer: 'We provide two layers of ironclad protection: a Lifetime Non-Prorated Manufacturer Material Warranty (up to 50 years on architectural shingles) and PeakShield’s exclusive 10-Year Workmanship Warranty covering labor and installation integrity.',
    category: 'Warranties',
    active: true,
    order: 4,
  },
  {
    question: 'Do you offer financing options for roof replacements?',
    answer: 'Yes, we partner with premier home improvement lenders to offer low-interest financing, including 0% APR for 12 months or flexible monthly payment terms up to 120 months. Pre-qualifying takes under 2 minutes and will not affect your credit score.',
    category: 'Pricing & Financing',
    active: true,
    order: 5,
  },
  {
    question: 'How much does a new roof typically cost?',
    answer: 'Roof replacement costs depend on total square footage, pitch steepness, existing layers to tear off, and chosen materials (architectural asphalt, standing seam metal, or synthetic slate). Most residential roofs range from $7,500 to $18,000. Use our Free Quote page for a customized estimate.',
    category: 'Pricing & Financing',
    active: true,
    order: 6,
  },
  {
    question: 'Are your roofers fully licensed, insured, and certified?',
    answer: 'Absolutely. PeakShield holds Class A General Roofing Contractor licensing, carries $2,000,000 in General Liability insurance, and provides full Workers’ Compensation for every technician on your property. We are also certified factory installers for GAF, CertainTeed, and Owens Corning.',
    category: 'Safety & Licensing',
    active: true,
    order: 7,
  },
  {
    question: 'What should I do if my roof starts leaking during a storm?',
    answer: 'First, place a container beneath the drip and clear furniture or electronics. If water is pooling in ceiling drywall, carefully puncture a tiny pinhole to relieve pressure. Then call our 24/7 emergency dispatch immediately at (123) 456-7890. Never climb onto a wet roof during a storm.',
    category: 'Emergency',
    active: true,
    order: 8,
  },
];

export const INITIAL_BLOG_POSTS: Omit<BlogPost, 'id'>[] = [
  {
    title: '7 Signs Your Roof May Need Immediate Replacement Before Winter',
    slug: 'signs-roof-needs-replacement-before-winter',
    excerpt: 'Detecting subtle roofing degradation in the autumn can save thousands of dollars in water and ice dam damage once freeze-thaw cycles begin.',
    content: `When winter temperatures dip below freezing, minor roof issues can quickly turn into major structural emergencies. Ice dams, heavy snow loads, and wind-driven sleet put immense pressure on your home's exterior envelope.

### 1. Curled, Cupped, or Buckling Shingles
Shingles that curve upward or lose rigidity can no longer deflect moisture. High winds easily lift them, allowing freezing rain to penetrate the decking.

### 2. Excessive Granule Accumulation in Gutters
Asphalt shingles rely on mineral granules for UV protection and impact resistance. If your gutters resemble coarse black sand, your roof is reaching end of life.

### 3. Daylight Showing Through the Attic Roof Boards
Step into your unlit attic on a sunny afternoon. If slivers of natural light peek through the roof decking, water and cold drafts can easily follow.

### 4. Spongy or Bouncy Roof Decking
A compromised decking feels soft underfoot. This indicates prolonged moisture trapped under underlayment, leading to rot.

### 5. Flashing Cracks Around Chimneys and Skylights
Metal flashing seals the most vulnerable seams. Old tar caulk or corroded aluminum flashing is the #1 culprit of sudden winter leaks.

### 6. Recurring Winter Ice Dams
Thick ridges of ice at the eaves indicate poor ventilation and escaping attic heat. Over time, trapped water forces its way under shingles.

### 7. The Roof Is Over 20 Years Old
Even well-maintained 3-tab shingle roofs lose elasticity after two decades. Scheduling a certified inspection now ensures you are not caught off guard.`,
    coverImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    category: 'Maintenance',
    authorName: 'PeakShield Technical Team',
    published: true,
    publishedAt: '2025-10-15',
    seoTitle: '7 Signs Your Roof Needs Replacement Before Winter | PeakShield Roofing',
    seoDescription: 'Learn how to spot curling shingles, granule loss, and attic leaks before winter storms strike. Tips from certified roofing experts.',
    createdAt: new Date().toISOString(),
  },
  {
    title: 'Architectural Shingles vs. Standing Seam Metal: Which Is Right for You?',
    slug: 'architectural-shingles-vs-standing-seam-metal',
    excerpt: 'A comprehensive comparison of lifespan, initial investment, energy efficiency, and storm resistance between two leading roofing systems.',
    content: `Choosing a new roof is one of the most significant investments you will make in your home. Two materials dominate the modern residential landscape: dimensional architectural shingles and standing seam metal.

### Architectural Shingles: The Versatile Classic
- **Lifespan**: 30 to 50 years with premium dimensional laminates.
- **Cost**: Lower initial investment, making it accessible for almost any homeowner budget.
- **Aesthetic**: Rich texture with shadowed dimensional depth that complements traditional, craftsman, and colonial homes.
- **Repairs**: In the rare event of damage, individual shingles can be replaced quickly.

### Standing Seam Metal: The Lifetime Performance Standard
- **Lifespan**: 50 to 75+ years, outlasting the lifespan of most homeowners in their properties.
- **Energy Efficiency**: Reflects solar radiant heat, lowering summertime air conditioning costs by up to 25%.
- **Weather Immunity**: Class 4 impact resistance, zero rot, impervious to moss, and rated for 140+ mph winds.
- **Concealed Fasteners**: Standing seams hide all screws beneath interlocking ribs, preventing leak vulnerabilities.

### Summary
If you prioritize initial value and classic residential warmth, architectural shingles are hard to beat. If you seek unmatched longevity, maximum energy savings, and modern architectural lines, standing seam metal is the ultimate choice.`,
    coverImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    category: 'Materials Guide',
    authorName: 'PeakShield Technical Team',
    published: true,
    publishedAt: '2025-09-28',
    seoTitle: 'Architectural Shingles vs Standing Seam Metal Roofs | PeakShield Guide',
    seoDescription: 'Compare pros, cons, costs, and durability between modern architectural shingles and standing seam metal roofing.',
    createdAt: new Date().toISOString(),
  },
  {
    title: 'How to Navigate Roofing Insurance Claims After a Severe Hail Storm',
    slug: 'navigating-roofing-insurance-claims-after-hail',
    excerpt: 'Step-by-step guidance on documenting hail impacts, working with adjusters, and avoiding predatory storm chasers.',
    content: `Hailstorms can cause severe structural damage within minutes. While shingles may not immediately leak, bruised fiberglass mats can fail catastrophically months later. Here is how to ensure your homeowner claim is properly handled.

### Step 1: Schedule an Independent Professional Inspection
Before contacting your insurance company, have a certified local roofer inspect your roof, soft metals, gutters, and AC units. An experienced contractor documents test squares and takes high-resolution photos of hail divots.

### Step 2: File Your Claim Promptly
Most insurance policies require claims to be submitted within 12 months of the storm event. Provide the specific date and documented hail sizes.

### Step 3: Insist Your Contractor Is Present During the Adjuster Visit
Insurance adjusters evaluate dozens of roofs daily. Having PeakShield’s project manager on the roof ensures no collateral damage—such as damaged flashing, vents, or gutter denting—is missed or undercounted.

### Step 4: Beware of Out-of-State "Storm Chasers"
After major storms, uncertified fly-by-night crews knock on doors offering "free roofs." Always choose a local, established business with permanent licensing, physical offices, and manufacturer warranties.`,
    coverImage: 'https://images.unsplash.com/photo-1527030280862-64139fba04ca?auto=format&fit=crop&w=1200&q=80',
    category: 'Insurance',
    authorName: 'PeakShield Technical Team',
    published: true,
    publishedAt: '2025-08-14',
    seoTitle: 'How to Handle Hail Damage Roofing Insurance Claims | PeakShield',
    seoDescription: 'Expert tips on maximizing your roofing insurance claim, meeting with adjusters, and avoiding storm chaser scams.',
    createdAt: new Date().toISOString(),
  },
  {
    title: 'The Complete Homeowner’s Guide to Roof Ventilation & Energy Efficiency',
    slug: 'homeowners-guide-roof-ventilation-energy-efficiency',
    excerpt: 'Discover why balanced ridge and soffit airflow is the secret to extending shingle lifespan and slashing summer AC utility bills.',
    content: `A roof is not just a surface barrier—it is an active dynamic breathing system. Without proper ventilation, attics become superheated ovens in the summer and moisture traps in the winter.

### How Balanced Ventilation Works
Effective attic ventilation relies on the 50/50 balance rule:
- **Intake**: Continuous perforated soffit vents allow cool, dense outdoor air to enter at the eaves.
- **Exhaust**: Ridge vents or high-profile louvers along the roof peak allow rising warm air to exhaust naturally.

### The Dangers of Inadequate Ventilation
1. **Premature Shingle Aging**: Trapped attic temperatures exceeding 140°F literally bake shingles from the underside, causing asphalt to dry out and blister.
2. **Mold and Mildew**: Household humidity from showers and cooking condenses on cold roof rafters, causing toxic mold.
3. **High Energy Bills**: An overheated attic radiates heat into your living spaces, forcing your air conditioner to run constantly.`,
    coverImage: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80',
    category: 'Energy & Efficiency',
    authorName: 'PeakShield Technical Team',
    published: true,
    publishedAt: '2025-07-19',
    seoTitle: 'Roof Ventilation Guide: How Attic Airflow Saves Shingles and Energy',
    seoDescription: 'Learn how balanced intake and exhaust attic ventilation keeps your home cool and prevents roof rot.',
    createdAt: new Date().toISOString(),
  },
  {
    title: 'Why Regular Gutter Maintenance Prevents Expensive Roof Deck Rot',
    slug: 'why-regular-gutter-maintenance-prevents-roof-rot',
    excerpt: 'Clogged gutters do far more than overflow; they wick moisture back up under eaves and destroy your home foundation.',
    content: `When falling autumn leaves, twigs, and debris accumulate in gutters, rain has nowhere to go. During heavy downpours, water backs up behind gutter brackets and wicks into fascia boards and roof eaves.

### The Cascade Effect of Clogged Gutters
1. **Fascia and Soffit Rot**: Trapped standing water saturates the wooden framing supporting your roof edge.
2. **Foundation Settlement**: Overflowing water pools directly against your home perimeter, risking basement cracks and foundation settling.
3. **Pest Infestation**: Stagnant water and rotting leaves create a haven for mosquitoes, termites, and carpenter ants.
4. **Winter Ice Weight**: When debris freezes, the added hundreds of pounds can rip gutters right off the building.

### The Solution: Seamless Gutters & Micro-Mesh Guards
Installing seamless aluminum gutters eliminates joint leaks, while premium stainless steel micro-mesh guards keep pine needles and leaves out permanently.`,
    coverImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    category: 'Gutters & Drainage',
    authorName: 'PeakShield Technical Team',
    published: true,
    publishedAt: '2025-06-25',
    seoTitle: 'Why Gutter Maintenance Protects Your Roof & Foundation | PeakShield',
    seoDescription: 'Find out how clogged gutters lead to rotting roof decking and foundation damage, and how seamless systems solve it.',
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_SETTINGS: CompanySettings = {
  companyName: 'PeakShield Roofing',
  logoUrl: '',
  phone: '(123) 456-7890',
  email: 'info@peakshieldroofing.com',
  address: '123 Roofing Lane, Denver, CO 80202',
  businessHours: 'Mon - Fri: 7:00 AM - 6:00 PM | Sat: 8:00 AM - 3:00 PM | 24/7 Emergency',
  facebook: 'https://facebook.com',
  instagram: 'https://instagram.com',
  linkedin: 'https://linkedin.com',
  youtube: 'https://youtube.com',
  heroTitle: 'Stronger Roofs. Stronger Homes. Built to Last.',
  heroDescription: 'Professional roofing solutions using quality materials, skilled craftsmanship, and dependable service. Your roof. Our responsibility.',
  footerText: 'Building strong roofs and lasting relationships across Colorado and beyond. Licensed, insured, and certified master roofing contractors.',
};

/**
 * Ensures demo data is seeded into Firestore if collections are empty.
 */
export async function ensureDemoDataSeeded(db: Firestore): Promise<void> {
  try {
    const servicesSnap = await getDocs(collection(db, 'services'));
    if (!servicesSnap.empty) {
      // Data already seeded
      return;
    }

    console.log('Seeding initial Firestore business data...');

    const batch = writeBatch(db);

    // Seed services
    for (const service of INITIAL_SERVICES) {
      const ref = doc(collection(db, 'services'));
      batch.set(ref, service);
    }

    // Seed projects
    for (const project of INITIAL_PROJECTS) {
      const ref = doc(collection(db, 'projects'));
      batch.set(ref, project);
    }

    // Seed testimonials
    for (const testimonial of INITIAL_TESTIMONIALS) {
      const ref = doc(collection(db, 'testimonials'));
      batch.set(ref, testimonial);
    }

    // Seed FAQs
    for (const faq of INITIAL_FAQS) {
      const ref = doc(collection(db, 'faqs'));
      batch.set(ref, faq);
    }

    // Seed Blog posts
    for (const blog of INITIAL_BLOG_POSTS) {
      const ref = doc(collection(db, 'blogPosts'));
      batch.set(ref, blog);
    }

    // Seed Settings
    const settingsRef = doc(db, 'settings', 'company');
    batch.set(settingsRef, INITIAL_SETTINGS);

    await batch.commit();
    console.log('Firestore initial business data seeded successfully!');
  } catch (error) {
    console.warn('Error during Firestore demo data seeding:', error);
  }
}
