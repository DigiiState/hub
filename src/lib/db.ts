// AUTHORITATIVE SOURCE OF TRUTH — DigiiState OS
// All dashboard modules MUST import data from this central store.

export const portfolioStats = {
	totalAssets: 15,
	territories: 15,
	states: 1, // Currently all MD for Pilot
	leasedAssets: 3,
	availableAssets: 12,
	rankingAssets: 5,
	monthlyRentRoll: 3750.00,
	monthlyExpenses: 60.50,
	monthlyNOI: 3689.50,
	annualizedRevenue: 45000.00,
	annualizedNOI: 44274.00,
	portfolioValue: 15000.00, // Based on $1k/deed
	leads30d: 142,
	avgCPL: 0.42,
	avgHealthScore: 82,
	prevLeads30d: 128,
	prevRentRoll: 3125.00,
    totalPipelineValue: 18400.00
};

export const assets = [
	{ 
        id: "DEED-PHX-001", 
        name: "Phoenix MD Septic", 
        domain: "phoenixmdseptic.com", 
        city: "Phoenix", 
        state: "MD", 
        health: 94, 
        stage: "Leased", 
        rank: "#1", 
        leads: 31, 
        capital: "$10.46", 
        renter: "Young Septic Services",
        registrar: "Cloudflare",
        expDate: "Aug 15, 2027",
        ranks: { google: "#1", bing: "#2", yahoo: "#1", ddg: "#4" }
    },
	{ 
        id: "DEED-CLX-002", 
        name: "Clarksville Septic", 
        domain: "clarksvillesepticpros.com", 
        city: "Clarksville", 
        state: "MD", 
        health: 78, 
        stage: "Ranking", 
        rank: "#8", 
        leads: 12, 
        capital: "$10.46", 
        renter: "None",
        registrar: "Cloudflare",
        expDate: "Aug 16, 2027",
        ranks: { google: "#8", bing: "#12", yahoo: "#9", ddg: "#5" }
    },
	{ 
        id: "DEED-GIB-003", 
        name: "Gibson Island Tree", 
        domain: "gibsonislandtreeremoval.com", 
        city: "Gibson Island", 
        state: "MD", 
        health: 72, 
        stage: "Ranking", 
        rank: "#4", 
        leads: 5, 
        capital: "$10.46", 
        renter: "None",
        registrar: "Cloudflare",
        expDate: "Aug 16, 2027",
        ranks: { google: "#4", bing: "#8", yahoo: "#3", ddg: "#6" }
    },
	{ 
        id: "DEED-ANN-004", 
        name: "Annapolis Tree", 
        domain: "annapolistreepros.com", 
        city: "Annapolis", 
        state: "MD", 
        health: 82, 
        stage: "Lease Ready", 
        rank: "#3", 
        leads: 42, 
        capital: "$10.46", 
        renter: "None",
        registrar: "Cloudflare",
        expDate: "Aug 16, 2027",
        ranks: { google: "#3", bing: "#6", yahoo: "#2", ddg: "#5" }
    },
	{ 
        id: "DEED-CLX-005", 
        name: "Clarksville Water", 
        domain: "clarksvillewaterdamage.com", 
        city: "Clarksville", 
        state: "MD", 
        health: 91, 
        stage: "Stabilized", 
        rank: "#2", 
        leads: 28, 
        capital: "$10.46", 
        renter: "Young Septic Services",
        registrar: "Cloudflare",
        expDate: "Aug 16, 2027",
        ranks: { google: "#2", bing: "#5", yahoo: "#2", ddg: "#8" }
    },
	{ 
        id: "DEED-ANN-006", 
        name: "Annapolis DUI Law", 
        domain: "annapolisduidefense.com", 
        city: "Annapolis", 
        state: "MD", 
        health: 45, 
        stage: "Trial", 
        rank: "#11", 
        leads: 2, 
        capital: "$10.46", 
        renter: "Portner & Shure",
        registrar: "Cloudflare",
        expDate: "Aug 16, 2027",
        ranks: { google: "#11", bing: "#18", yahoo: "#10", ddg: "#14" }
    },
    { id: "DEED-MON-007", name: "Monkton Septic", domain: "monktonsepticpumping.com", city: "Monkton", state: "MD", health: 50, stage: "Development", rank: "#--", leads: 0, capital: "$10.46", renter: "None", registrar: "Cloudflare", expDate: "Aug 16, 2027", ranks: { google: "#--", bing: "#--", yahoo: "#--", ddg: "#--" } },
    { id: "DEED-HNT-008", name: "Hunt Valley Septic", domain: "huntvalleyseptic.com", city: "Hunt Valley", state: "MD", health: 50, stage: "Development", rank: "#--", leads: 0, capital: "$10.46", renter: "None", registrar: "Cloudflare", expDate: "Aug 16, 2027", ranks: { google: "#--", bing: "#--", yahoo: "#--", ddg: "#--" } },
    { id: "DEED-BET-009", name: "Bethesda Water", domain: "bethesdawaterpros.com", city: "Bethesda", state: "MD", health: 50, stage: "Development", rank: "#--", leads: 0, capital: "$10.46", renter: "None", registrar: "Cloudflare", expDate: "Aug 16, 2027", ranks: { google: "#--", bing: "#--", yahoo: "#--", ddg: "#--" } },
    { id: "DEED-SEV-010", name: "Severna Park Tree", domain: "severnaparktreeremoval.com", city: "Severna Park", state: "MD", health: 50, stage: "Development", rank: "#--", leads: 0, capital: "$10.46", renter: "None", registrar: "Cloudflare", expDate: "Aug 16, 2027", ranks: { google: "#--", bing: "#--", yahoo: "#--", ddg: "#--" } },
    { id: "DEED-ELL-011", name: "Ellicott City Tree", domain: "ellicottcitytreepros.com", city: "Ellicott City", state: "MD", health: 50, stage: "Development", rank: "#--", leads: 0, capital: "$10.46", renter: "None", registrar: "Cloudflare", expDate: "Aug 16, 2027", ranks: { google: "#--", bing: "#--", yahoo: "#--", ddg: "#--" } },
    { id: "DEED-SIL-012", name: "Silver Spring Roofing", domain: "silverspringroofingexperts.com", city: "Silver Spring", state: "MD", health: 50, stage: "Development", rank: "#--", leads: 0, capital: "$10.46", renter: "None", registrar: "Cloudflare", expDate: "Aug 16, 2027", ranks: { google: "#--", bing: "#--", yahoo: "#--", ddg: "#--" } },
    { id: "DEED-ROC-013", name: "Rockville Roofing", domain: "rockvilleroofingpros.com", city: "Rockville", state: "MD", health: 50, stage: "Development", rank: "#--", leads: 0, capital: "$10.46", renter: "None", registrar: "Cloudflare", expDate: "Aug 16, 2027", ranks: { google: "#--", bing: "#--", yahoo: "#--", ddg: "#--" } },
    { id: "DEED-TOW-014", name: "Towson DUI Law", domain: "towsonduiattorney.com", city: "Towson", state: "MD", health: 50, stage: "Development", rank: "#--", leads: 0, capital: "$10.46", renter: "None", registrar: "Cloudflare", expDate: "Aug 16, 2027", ranks: { google: "#--", bing: "#--", yahoo: "#--", ddg: "#--" } },
    { id: "DEED-TRA-015", name: "Maryland Traffic", domain: "marylandtrafficdefensepros.com", city: "Maryland", state: "MD", health: 50, stage: "Development", rank: "#--", leads: 0, capital: "$10.46", renter: "None", registrar: "Cloudflare", expDate: "Aug 16, 2027", ranks: { google: "#--", bing: "#--", yahoo: "#--", ddg: "#--" } }
];

export const managementAttention = [
	{ type: 'warning', message: 'Domain "phoenixmdseptic.com" expires in 360 days.', action: 'Renew Asset', target: '/dashboard/vault' },
	{ type: 'critical', message: 'Leads declined 12% for "Annapolis DUI Law" in previous 30 days.', action: 'Audit SEO', target: '/dashboard/portfolio' },
	{ type: 'positive', message: 'Asset "Annapolis Tree" is now lease ready (#3 Google).', action: 'Trigger Outreach', target: '/dashboard/acquisitions' },
];

export const leads = [
 	{ 
 		id: "L-9021", 
 		date: "Aug 16, 2:14 PM",
 		asset: "phoenixmdseptic.com",
 		territory: "Phoenix, MD",
 		renter: "Young Septic Services",
 		name: "John Harrison",
 		phone: "(410) 555-0199",
 		source: "Google Search",
 		keyword: "emergency septic pump phoenix",
 		duration: "4:12",
 		status: "Qualified",
 		appointment: "Scheduled",
 		jobWon: "Pending",
 		estValue: "$1,200",
 		revenue: "$0.00"
 	},
 	{ 
 		id: "L-9022", 
 		date: "Aug 16, 4:45 PM",
 		asset: "clarksvillesepticpros.com",
 		territory: "Clarksville, MD",
 		renter: "Young Septic Services",
 		name: "Sarah Miller",
 		phone: "(443) 555-9821",
 		source: "Google Map Pack",
 		keyword: "septic riser repair",
 		duration: "2:08",
 		status: "Qualified",
 		appointment: "Booked",
 		jobWon: "Yes",
 		estValue: "$2,800",
 		revenue: "$2,800.00"
 	},
    { 
 		id: "L-9023", 
 		date: "Aug 16, 6:12 PM",
 		asset: "annapolisduidefense.com",
 		territory: "Annapolis, MD",
 		renter: "Portner & Shure",
 		name: "Confidential",
 		phone: "(410) 555-7788",
 		source: "Direct",
 		keyword: "dui lawyer annapolis",
 		duration: "12:45",
 		status: "Qualified",
 		appointment: "Scheduled",
 		jobWon: "Pending",
 		estValue: "$5,000",
 		revenue: "$0.00"
 	}
];

export const renters = [
 	{ 
 		id: "R-001",
 		businessName: "Young Septic Services", 
 		owner: "Mike Young",
 		territories: ["Phoenix, MD", "Clarksville, MD"],
 		assetsLeased: 2,
 		monthlyRent: 2500.00,
 		status: "Current",
 		lifetimeRevenue: 7500.00,
 		leadsDelivered: 124,
 		convRate: "28%"
 	},
 	{ 
 		id: "R-002",
 		businessName: "Prestige Tree Experts", 
 		owner: "Sarah Miller",
 		territories: ["Gibson Island, MD"],
 		assetsLeased: 1,
 		monthlyRent: 1250.00,
 		status: "Current",
 		lifetimeRevenue: 2500.00,
 		leadsDelivered: 42,
 		convRate: "31%"
 	},
 	{ 
 		id: "R-003",
 		businessName: "Portner & Shure", 
 		owner: "Legal Manager",
 		territories: ["Annapolis, MD"],
 		assetsLeased: 1,
 		monthlyRent: 2500.00,
 		status: "Trial",
 		lifetimeRevenue: 0.00,
 		leadsDelivered: 8,
 		convRate: "45%"
 	}
];
