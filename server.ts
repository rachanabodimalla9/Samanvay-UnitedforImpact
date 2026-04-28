import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function analyzeContent(content: string) {
  try {
    const prompt = `Analyze the following post/request for an NGO. 
    1. Provide a sentiment_score on a scale of 1-10 (where 1 is very negative and 10 is very positive).
    2. Provide an urgency_score as one of: "High", "Medium", "Low".
    3. Return the result strictly as a valid JSON object with keys "sentiment_score" and "urgency_score".

    Content: "${content}"`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonStr = text.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("AI Analysis failed:", error);
    // Fallback logic
    const urgency = /urgent|help|emergency|critical|immediate|needed/i.test(content) ? "High" : "Low";
    return { sentiment_score: 5, urgency_score: urgency };
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes ---

  // Real NGOs Sourced from NGO Darpan Ecosystem
  const ngos = [
    {
      id: "1",
      name: "Goonj",
      category: "Humanitarian Aid & Disaster Relief",
      description: "Goonj translates 'the discarded' into a resource for rural development. Known for its 'Cloth for Work' initiative, it addresses basic needs while preserving the dignity of recipients.",
      socials: { instagram: "https://instagram.com/goonj", twitter: "https://twitter.com/goonj", youtube: "https://youtube.com/@goonj" },
      location: "New Delhi",
      tags: ["Relief", "Rural Development", "Circular Economy"],
      verification: { financial: true, fieldImpact: true, community: true },
      projectGoal: 1000000,
      currentFunding: 750000,
      projectName: "Assam Flood Relief 2024",
      socialFeed: [
        { platform: "Instagram", content: "Our relief teams reached the remotest parts of Darrang district today.", timestamp: "2h ago", url: "https://instagram.com/p/123", sentiment_score: 8, urgency_score: "High", location: "Darrang, Assam" },
        { platform: "Samanvay Community", content: "Urgent need for clean water containers in the flood affected zones.", timestamp: "5h ago", url: "#", sentiment_score: 3, urgency_score: "High", location: "Darrang, Assam" }
      ],
      sentimentHistory: [5, 6, 4, 7, 6, 8, 7],
      reviews: [
        { id: "r1", user: "Vikram S.", rating: 5, comment: "I volunteered here; they are very organized and the funds truly reach the village.", date: "2024-03-12" }
      ],
      achievements: [
        "Distributed 3,000+ tons of materials annually.",
        "Winner of the World Bank's Global Development Marketplace Award.",
        "Transformed thousands of lives through 'Cloth for Work' initiative."
      ]
    },
    {
      id: "2",
      name: "Akshaya Patra Foundation",
      category: "Education & Hunger",
      description: "Operates the world's largest NGO-run school meal programme, serving over 2 million children across India daily to end classroom hunger and promote education.",
      socials: { instagram: "https://instagram.com/akshayapatrafoundation", twitter: "https://twitter.com/akshayapatra", youtube: "https://youtube.com/@akshayapatra" },
      location: "Bengaluru",
      tags: ["Midday Meal", "Education", "Nutrition"],
      verification: { financial: true, fieldImpact: true, community: true },
      projectGoal: 5000000,
      currentFunding: 4200000,
      projectName: "Mega Kitchen Upgradation",
      socialFeed: [
        { platform: "Instagram", content: "Successfully served 50,000 meals in the drought-hit regions of Bundelkhand.", timestamp: "1d ago", url: "#", sentiment_score: 9, urgency_score: "Low" },
        { platform: "Twitter", content: "Donations are pouring in for the kitchen expansion. Thank you India!", timestamp: "2d ago", url: "#", sentiment_score: 10, urgency_score: "Low" }
      ],
      sentimentHistory: [8, 9, 8, 9, 10, 9, 10],
      reviews: [],
      achievements: [
        "Served over 3 billion meals since inception.",
        "Limca Book of Records entry for largest mid-day meal kitchen.",
        "Gold Shield for Excellence in Financial Reporting."
      ]
    },
    {
      id: "3",
      name: "CRY (Child Rights and You)",
      category: "Child Rights",
      description: "Dedicated to restoring children's rights in India. Works with parents, communities, and the government to ensure every child has a happy, healthy, and creative childhood.",
      socials: { instagram: "https://instagram.com/cry_india", twitter: "https://twitter.com/cryindia", youtube: "https://youtube.com/@cryindia" },
      location: "Mumbai",
      tags: ["Children", "Rights", "Education"],
      verification: { financial: true, fieldImpact: true, community: true },
      projectGoal: 2000000,
      currentFunding: 1850000,
      projectName: "Right to Education Campaign",
      socialFeed: [
        { platform: "Samanvay Community", content: "Seeking volunteers for child health check-up camp in Dharavi slums.", timestamp: "4h ago", url: "#", sentiment_score: 4, urgency_score: "Medium", location: "Dharavi, Mumbai" },
        { platform: "Instagram", content: "Every child deserves a book. Impacting 10,000 more children this month.", timestamp: "3d ago", url: "#", sentiment_score: 8, urgency_score: "Low" }
      ],
      sentimentHistory: [7, 6, 7, 5, 6, 8, 7],
      reviews: [],
      achievements: [
        "Impacted 3 million+ children across 2,000 villages.",
        "Successful advocacy for the Right to Education Act.",
        "Over 40 years of grassroots child rights work."
      ]
    },
    {
      id: "4",
      name: "Smile Foundation",
      category: "Education & Healthcare",
      description: "An Indian development agency directly benefiting over 1.5 million children and their families annually through more than 400 welfare projects on education, healthcare, and livelihood.",
      socials: { instagram: "https://instagram.com/smilefoundation", twitter: "https://twitter.com/smilefoundation", youtube: "https://youtube.com/@smilefoundation" },
      location: "New Delhi",
      tags: ["Healthcare", "Empowerment", "Livelihood"],
      verification: { financial: true, fieldImpact: true, community: true },
      projectGoal: 1500000,
      currentFunding: 920000,
      projectName: "Smile on Wheels (Mobile Hospitals)",
      socialFeed: [],
      reviews: [],
      achievements: [
        "Reaches 1.5 million people annually.",
        "Awarded 'Best NGO' for Healthcare Excellence.",
        "Operates 80+ mobile medical units across 25 states."
      ]
    },
    {
      id: "5",
      name: "HelpAge India",
      category: "Elderly Care",
      description: "Works for the cause and care of disadvantaged older persons. Runs various programs including mobile medical units, cataract surgeries, and elder self-help groups.",
      socials: { instagram: "https://instagram.com/helpageindia", twitter: "https://twitter.com/helpageindia", youtube: "https://youtube.com/@helpageindia" },
      location: "New Delhi",
      tags: ["Elderly", "Healthcare", "Advocacy"],
      verification: { financial: true, fieldImpact: true, community: true },
      projectGoal: 3000000,
      currentFunding: 2100000,
      projectName: "Mobile Medical Unit Fleet Expansion",
      socialFeed: [],
      reviews: [],
      achievements: [
        "Impacted 1.25 million elders annually through various programs.",
        "UN Population Award winner for institutional category.",
        "Successfully lobbied for Maintenance and Welfare of Parents and Senior Citizens Act."
      ]
    },
    {
      id: "6",
      name: "Pratham Education Foundation",
      category: "Education",
      description: "One of the largest innovative learning organizations in India, created to improve the quality of education. Focused on high-quality, low-cost, and replicable interventions.",
      socials: { instagram: "https://instagram.com/prathamindia", twitter: "https://twitter.com/prathamindia", youtube: "https://youtube.com/@prathamindia" },
      location: "Mumbai",
      tags: ["Literacy", "Digital Learning", "Vocational"],
      verification: { financial: true, fieldImpact: true, community: true },
      projectGoal: 2500000,
      currentFunding: 1800000,
      projectName: "Read India Campaign",
      socialFeed: [],
      reviews: [],
      achievements: [
        "Pioneered the Annual Status of Education Report (ASER).",
        "Lui Che Woo Prize for Positive Energy.",
        "Covered 21 states through Read India campaign."
      ]
    },
    {
      id: "7",
      name: "Give (GiveIndia)",
      category: "Philanthropy Marketplace",
      description: "India's largest and most trusted giving platform. It enables individuals and organizations to raise and donate funds conveniently to any cause they care about.",
      socials: { instagram: "https://instagram.com/give_india", twitter: "https://twitter.com/giveindia", youtube: "https://youtube.com/@giveindia" },
      location: "Bengaluru",
      tags: ["Fundraising", "Verified", "Crowdfunding"],
      verification: { financial: true, fieldImpact: true, community: true },
      projectGoal: 10000000,
      currentFunding: 8500000,
      projectName: "Mission 10 Million Lives",
      socialFeed: [],
      reviews: [],
      achievements: [
        "Raised over ₹700 crore for various causes.",
        "Works with 2,500+ verified NGOs.",
        "Pioneering transparency with 'GivePromise' verification."
      ]
    },
    {
      id: "8",
      name: "Nanhi Kali",
      category: "Girl Child Education",
      description: "Specifically focuses on providing primary education to underprivileged girl children in India. Supports academic, material, and social growth for the girl child.",
      socials: { instagram: "https://instagram.com/nanhikali", twitter: "https://twitter.com/nanhikali", youtube: "https://youtube.com/@nanhikali" },
      location: "Mumbai",
      tags: ["Girl Child", "Education", "Gender Equality"],
      verification: { financial: true, fieldImpact: true, community: true },
      projectGoal: 1200000,
      currentFunding: 1100000,
      projectName: "Rural Learning Centers",
      socialFeed: [],
      reviews: [],
      achievements: [
        "Supported over 450,000 girls in completing schooling.",
        "Presence in 10 states across India.",
        "Won multiple awards for gender parity in education."
      ]
    },
    {
      id: "9",
      name: "SEWA",
      category: "Women Empowerment",
      description: "The Self-Employed Women's Association is a trade union of poor, self-employed women workers who earn a living through their own labor or small businesses.",
      socials: { instagram: "https://instagram.com/sewa", twitter: "https://twitter.com/sewa", youtube: "https://youtube.com/@sewa" },
      location: "Ahmedabad",
      tags: ["Women", "Labor", "Microfinance"],
      verification: { financial: true, fieldImpact: true, community: true },
      projectGoal: 4000000,
      currentFunding: 3200000,
      projectName: "Artisans Market Linkage",
      socialFeed: [],
      reviews: [],
      achievements: [
        "World's largest trade union of informal workers with 2 million+ members.",
        "Pioneered micro-banking for poor women with SEWA Bank.",
        "Recipient of the Right Livelihood Award."
      ]
    },
    {
      id: "10",
      name: "Sulabh International",
      category: "Sanitation & Hygiene",
      description: "A social service organization that works to promote human rights, environmental sanitation, non-conventional sources of energy, and waste management through education.",
      socials: { instagram: "https://instagram.com/sulabh", twitter: "https://twitter.com/sulabh", youtube: "https://youtube.com/@sulabh" },
      location: "New Delhi",
      tags: ["Sanitation", "Hygiene", "Human Rights"],
      verification: { financial: true, fieldImpact: true, community: true },
      projectGoal: 1800000,
      currentFunding: 1500000,
      projectName: "Public Toilet Bio-Gas Conversion",
      socialFeed: [],
      reviews: [],
      achievements: [
        "Developed two-pit pour-flush recycling toilets used globally.",
        "Constructed 1.5 million+ household toilets in India.",
        "Winner of the Stockholm Water Prize."
      ]
    },
    {
      id: "11",
      name: "Blue Cross of India",
      category: "Animal Welfare",
      description: "One of India's largest animal welfare organizations. Rescuing, treating, and sheltering street animals, while promoting compassion through education and advocacy.",
      socials: { instagram: "https://instagram.com/bluecross", twitter: "https://twitter.com/bluecross", youtube: "https://youtube.com/@bluecross" },
      location: "Chennai, Tamil Nadu",
      tags: ["Animals", "Rescue", "Vet Care"],
      verification: { financial: true, fieldImpact: true, community: true },
      projectGoal: 900000,
      currentFunding: 650000,
      projectName: "ABC Program Expansion",
      socialFeed: [],
      reviews: [],
      achievements: [
        "Performed 500,000+ animal rescues since 1964.",
        "Pioneered the Animal Birth Control (ABC) program in India.",
        "Winner of the Best Animal Welfare Organization award multiple times."
      ]
    },
    {
      id: "12",
      name: "Sankalp Foundation",
      category: "Education & Literacy",
      description: "Empowering children in rural India through standardized education systems and digital literacy programs. Bridging the urban-rural education divide.",
      socials: { instagram: "https://instagram.com/sankalp", twitter: "https://twitter.com/sankalp", youtube: "https://youtube.com/@sankalp" },
      location: "Hyderabad, Telangana",
      tags: ["Education", "Digital Literacy", "Rural"],
      verification: { financial: true, fieldImpact: true, community: true },
      projectGoal: 1200000,
      currentFunding: 800000,
      projectName: "Smart Schools Initiative",
      socialFeed: [],
      reviews: [],
      achievements: [
        "Established 50+ smart learning centers in rural Telangana.",
        "Digital literacy program reaching 10,000 students monthly.",
        "Partnered with leading tech firms for vocational training."
      ]
    },
    {
      id: "13",
      name: "Friendicoes SECA",
      category: "Animal Welfare",
      description: "A major animal shelter and rescue group based in Delhi. Providing 24/7 ambulance services, clinic facilities, and a permanent sanctuary for abandoned animals.",
      socials: { instagram: "https://instagram.com/friendicoes", twitter: "https://twitter.com/friendicoes", youtube: "https://youtube.com/@friendicoes" },
      location: "New Delhi",
      tags: ["Animals", "Shelter", "Rescue"],
      verification: { financial: true, fieldImpact: true, community: true },
      projectGoal: 1500000,
      currentFunding: 1100000,
      projectName: "Mobile Vet Clinic",
      socialFeed: [],
      reviews: [],
      achievements: [
        "Rescues over 10,000 sick and injured animals every year.",
        "Operates a 24-hour outpatient clinic and horse sanctuary.",
        "A cornerstone of animal welfare in the Delhi NCR region for decades."
      ]
    }
  ];

  const vouchers = [
    { id: "v1", corporate: "Zara", value: 500, type: "Fashion Discount", ngoId: "2", description: "Flat 20% OFF on all fashion apparel and accessories.", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Zara_Logo.svg/1200px-Zara_Logo.svg.png" },
    { id: "v2", corporate: "H&M", value: 300, type: "Style Voucher", ngoId: "1", description: "Exclusive 10% OFF on the conscious collection.", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/H%26M-Logo.svg/1200px-H%26M-Logo.svg.png" },
    { id: "v3", corporate: "Levi's", value: 1000, type: "Denim Deal", ngoId: "3", description: "Buy 2 Get 1 Free on all classic denim jeans.", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Levi%27s_logo.svg/1200px-Levi%27s_logo.svg.png" },
    { id: "v4", corporate: "Adidas", value: 800, type: "Sportswear", ngoId: "6", description: "Flat 20% OFF on latest performance footwear.", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/1200px-Adidas_Logo.svg.png" },
    { id: "v5", corporate: "Dominos", value: 400, type: "Pizza Party", ngoId: "4", description: "Buy 2 Get 1 Free on all medium hand-tossed pizzas.", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Domino%27s_pizza_logo.svg/1200px-Domino%27s_pizza_logo.svg.png" },
    { id: "v6", corporate: "KFC", value: 250, type: "Fried Chicken", ngoId: "7", description: "Flat 10% OFF on all bucket meals and zinger burgers.", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/b/bf/KFC_logo.svg/1200px-KFC_logo.svg.png" },
    { id: "v7", corporate: "Uniqlo", value: 600, type: "Casual Wear", ngoId: "10", description: "Flat 20% OFF on LifeWear essentials.", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/UNIQLO_logo.svg/1200px-UNIQLO_logo.svg.png" },
    { id: "v8", corporate: "Dominos", value: 200, type: "Foodie Special", ngoId: "2", description: "Flat 10% OFF on your next order above ₹500.", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Domino%27s_pizza_logo.svg/1200px-Domino%27s_pizza_logo.svg.png" }
  ];

  const jobs = [
    { 
      id: "j1", 
      ngoId: "1", 
      ngoName: "Goonj",
      title: "Field Coordinator", 
      location: "Bihar", 
      type: "Full-time", 
      description: "As a Field Coordinator at Goonj, you will be at the front lines of humanitarian aid. You'll lead ground operations, manage logistics for relief material distribution, and work closely with local communities to implement the 'Cloth for Work' initiative.",
      requirements: [
        "Willingness to travel to remote rural areas",
        "Experience in community engagement or disaster relief",
        "Strong organizational and crisis management skills",
        "Proficiency in local languages"
      ]
    },
    { 
      id: "j2", 
      ngoId: "2", 
      ngoName: "Akshaya Patra Foundation",
      title: "Nutrition Specialist", 
      location: "Remote", 
      type: "Part-time", 
      description: "Akshaya Patra is looking for a Nutrition Specialist to ensure our school meals provide optimal healthy growth for millions of children. You will review menu plans, conduct nutritional audits, and suggest improvements based on seasonal availability of produce.",
      requirements: [
        "Degree in Nutrition, Dietetics, or related field",
        "Experience in large-scale meal planning is a plus",
        "Knowledge of child nutritional needs",
        "Capability to work independently and virtually"
      ]
    },
    { 
      id: "j3", 
      ngoId: "3", 
      ngoName: "CRY India",
      title: "Social Media Manager", 
      location: "Mumbai", 
      type: "Full-time", 
      description: "Join CRY India to amplify the voices of children. You will be responsible for creating compelling content, managing our social media presence, and engaging with our community to drive awareness and support for child rights campaigns.",
      requirements: [
        "3+ years in social media management or digital marketing",
        "Exceptional storytelling and copywriting skills",
        "Experience with video editing and graphic design tools",
        "Passionate about child rights advocacy"
      ]
    }
  ];

  app.get("/api/ngos", (req, res) => {
    res.json(ngos);
  });

  app.get("/api/vouchers", (req, res) => {
    res.json(vouchers);
  });

  app.get("/api/jobs", (req, res) => {
    res.json(jobs);
  });

  app.post("/api/posts", async (req, res) => {
    const { content, ngoId } = req.body;
    const ngo = ngos.find(n => n.id === ngoId);
    if (!ngo) return res.status(404).json({ error: "NGO not found" });

    // 1. Ingestion: Save to database (memory in this case)
    const analysis = await analyzeContent(content);

    const newPost = {
      platform: "Samanvay Community",
      content,
      timestamp: "Just now",
      url: "#",
      // 2. Analysis & Scoring / 3. Tagging
      sentiment_score: analysis.sentiment_score,
      urgency_score: analysis.urgency_score,
      location: "Community submitted",
      broadcasts: [
        { platform: "Twitter", status: "Posted via Samanvay API", timestamp: "Instant" },
        { platform: "WhatsApp", status: "Broadcast sent to 500+ leaders", timestamp: "Instant" },
        { platform: "Telegram", status: "Channel notification pushed", timestamp: "Instant" }
      ]
    };

    if (!ngo.socialFeed) ngo.socialFeed = [];
    ngo.socialFeed.unshift(newPost);

    // Automatically trigger flash funding if high urgency
    if (analysis.urgency_score === "High") {
       const fund = MOCK_FLASH_FUNDS.find(f => f.ngoId === ngoId);
       if (fund && fund.status === "Pending") {
          fund.status = "Unlocked";
          fund.reason = `Auto-triggered by AI detection: ${content.substring(0, 30)}...`;
          fund.timestamp = new Date().toLocaleTimeString();
       }
    }

    res.json({ success: true, post: newPost });
  });

  const CORPORATES = [
    { name: "Reliance Industries", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/9/99/Reliance_Industries_Logo.svg/512px-Reliance_Industries_Logo.svg.png" },
    { name: "Tata Group", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Tata_logo.svg/512px-Tata_logo.svg.png" },
    { name: "Infosys", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Infosys_logo.svg/512px-Infosys_logo.svg.png" },
    { name: "HDFC Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/HDFC_Bank_logo.svg/512px-HDFC_Bank_logo.svg.png" },
    { name: "Wipro", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Wipro_Logo.svg/512px-Wipro_Logo.svg.png" },
    { name: "Mahindra & Mahindra", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Mahindra_Group_logo.svg/512px-Mahindra_Group_logo.svg.png" },
    { name: "ICICI Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/ICICI_Bank_Logo.svg/512px-ICICI_Bank_Logo.svg.png" },
    { name: "Larsen & Toubro", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4e/L%26T_logo.png" },
    { name: "Adani Group", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Adani_Group_logo.svg/512px-Adani_Group_logo.svg.png" },
    { name: "ITC Limited", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f6/ITC_Limited_logo.svg/512px-ITC_Limited_logo.svg.png" },
    { name: "Zomato", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Zomato_Logo.svg/512px-Zomato_Logo.svg.png" },
    { name: "Unacademy", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Unacademy_logo.svg/512px-Unacademy_logo.svg.png" },
    { name: "Lenskart", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d4/Lenskart_logo.svg/512px-Lenskart_logo.svg.png" },
    { name: "Apollo Hospitals", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f6/Apollo_Hospitals_logo.svg/512px-Apollo_Hospitals_logo.svg.png" }
  ];

  const CATEGORIES = ["Education", "Health", "Water", "Livelihood", "Environment", "Sanitation"];
  const TYPES = ["Money", "Offer", "Service", "Asset"];
  const STATUSES = ["Active", "Active", "Active", "Claimed", "Burned"];

  const MOCK_VOUCHERS = Array.from({ length: 65 }).map((_, i) => {
    const corp = CORPORATES[i % CORPORATES.length];
    const category = CATEGORIES[i % CATEGORIES.length];
    const type = TYPES[i % TYPES.length];
    const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
    
    return {
      id: `v-${i + 1}`,
      code: `${category.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      type: category,
      kind: type,
      status: status,
      recipient: ["Amit S.", "Priya M.", "Rajesh K.", "Sunita R.", "Local Community", "School District 4", "Clinic Hub Alpha"][Math.floor(Math.random() * 7)],
      val: type === "Money" ? `₹${(Math.floor(Math.random() * 20) + 1) * 500}` : 
           type === "Asset" ? "Solar Kit / Books" :
           type === "Service" ? "Free Consultation" : `${Math.floor(Math.random() * 50) + 20}% Off`,
      source: i % 2 === 0 ? `${corp.name} CSR` : `${corp.name} Foundation`,
      logo: corp.logo,
      price: Math.floor(Math.random() * 100)
    };
  });


  const MOCK_FLASH_FUNDS = [
    { id: "f-1", ngoId: "ngo1", ngoName: "Akshaya Patra", amount: "₹25,000", status: "Unlocked", reason: "Automatic unlock for Mega Kitchen Upgradation", timestamp: "Recent" },
    { id: "f-2", ngoId: "ngo2", ngoName: "Goonj", amount: "₹50,000", status: "Pending", reason: "Monitoring community pulse...", timestamp: "-" }
  ];

  const MOCK_AUDIT_LOGS = [
    { id: "l-1", type: "Voucher Burn", user: "Field Worker John", detail: "Burned v-3 for Village Darrang", timestamp: "2h ago" },
    { id: "l-2", type: "Flash Fund", user: "AI System", detail: "Unlocked f-1 for Akshaya Patra", timestamp: "Today" }
  ];

  app.get("/api/csr/vouchers", (req, res) => {
    res.json(MOCK_VOUCHERS);
  });

  app.post("/api/csr/burn-voucher", (req, res) => {
    const { code } = req.body;
    const voucher = MOCK_VOUCHERS.find(v => v.code === code);
    if (voucher) {
      if (voucher.status === "Burned") {
        return res.status(400).json({ error: "Voucher already burned." });
      }
      voucher.status = "Burned";
      MOCK_AUDIT_LOGS.unshift({
        id: `l-${Date.now()}`,
        type: "Voucher Burn",
        user: "Verified Field Staff",
        detail: `Burned ${code} for ${voucher.recipient}`,
        timestamp: "Just now"
      });
      res.json({ success: true, voucher });
    } else {
      res.status(404).json({ error: "Voucher not found." });
    }
  });

  app.get("/api/csr/reports", (req, res) => {
    res.json(MOCK_AUDIT_LOGS);
  });

  app.get("/api/csr/flash-funds", (req, res) => {
    res.json(MOCK_FLASH_FUNDS);
  });

  app.post("/api/ai/draft-reply", async (req, res) => {
    const { content, context, refinePrompt } = req.body;
    try {
      let prompt = `Draft a short, professional, and empathetic reply to the following NGO community post.
      Post Content: "${content}"
      Context: ${context}
      Return only the drafted text.`;

      if (refinePrompt) {
        prompt += `\n\nRefinement Instruction: ${refinePrompt}`;
      }

      const result = await model.generateContent(prompt);
      const reply = result.response.text().trim();
      res.json({ reply });
    } catch (error) {
      res.json({ reply: "Thank you for reaching out. We have noted your request and our team will get back to you shortly." });
    }
  });

  app.post("/api/donate", (req, res) => {
    const { amount, ngoId } = req.body;
    console.log(`Donation received: ${amount} for NGO ${ngoId}`);
    res.json({ success: true, message: "Thank you for your generous contribution!" });
  });

  // --- Vite / Static Handling ---

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Samanvay server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
