import { Agent, DemoCallStep, Ticket, TimelineEvent } from "../types";

const now = new Date();
const subtractHours = (hours: number) => new Date(now.getTime() - hours * 60 * 60 * 1000);
const subtractMinutes = (mins: number) => new Date(now.getTime() - mins * 60 * 1000);

const genId = () => Math.random().toString(36).substr(2, 9);

export const mockAgents: Agent[] = [
  { id: "a1", name: "Usman Tariq", role: "agent", team: "Field Team A", avatar: "UT", available: true, assignedCount: 2 },
  { id: "a2", name: "Sana Malik", role: "agent", team: "Field Team B", avatar: "SM", available: true, assignedCount: 1 },
  { id: "a3", name: "Bilal Ahmed", role: "supervisor", team: "Supervision", avatar: "BA", available: true, assignedCount: 1 },
  { id: "a4", name: "Ayesha Raza", role: "supervisor", team: "Supervision", avatar: "AR", available: false, assignedCount: 0 },
  { id: "s1", name: "ERT Alpha", role: "ert", team: "Emergency Response Alpha", avatar: "EA", available: true, assignedCount: 1 },
  { id: "s2", name: "ERT Beta", role: "ert", team: "Emergency Response Beta", avatar: "EB", available: true, assignedCount: 0 }
];

const createTimeline = (type: TimelineEvent["type"], msg: string, by: string, at: Date): TimelineEvent => ({
  id: genId(), type, message: msg, by, at
});

export const mockTickets: Ticket[] = [
  {
    id: "t1", ticketNo: "WAS-001", callerName: "Muhammad Aslam", phone: "0300-1234567", area: "Model Town",
    category: "pipe-burst", icon: "💥", priority: "critical", status: "new",
    description: "Major pipe burst on main road. Live electrical wire hanging near water flow. Immediate safety risk.",
    aiSummary: "CRITICAL: Burst pipe with live wire — life safety risk, ERT required immediately",
    createdAt: subtractMinutes(45), updatedAt: subtractMinutes(45), callDuration: 312, householdsAffected: 0,
    assignedTo: null, escalatedTo: null, escalationReason: null, aiScore: 97, slaMinutes: 30,
    voiceTranscript: "Caller reported pipe burst near Model Town chowk. Mentioned electrical wire hanging low near flooding water. Multiple cars stuck, residents evacuating area.",
    tags: ["live-wire", "road-hazard", "ert-required"], duplicateOf: null,
    timeline: [
      createTimeline("call", "Voice call received — Urdu", "VAPI Agent", subtractMinutes(46)),
      createTimeline("created", "Ticket created from voice call", "System", subtractMinutes(45))
    ]
  },
  {
    id: "t2", ticketNo: "WAS-002", callerName: "Fatima Noor", phone: "0321-7654321", area: "Johar Town",
    category: "dirty-water", icon: "🤢", priority: "critical", status: "in-progress",
    description: "Brown murky water from taps. Three children fell ill after drinking. Possible sewerage cross-contamination.",
    aiSummary: "CRITICAL: Contaminated water supply causing illness — health emergency, lab test needed",
    createdAt: subtractHours(2), updatedAt: subtractMinutes(30), callDuration: 245, householdsAffected: 8,
    assignedTo: "a1", escalatedTo: null, escalationReason: null, aiScore: 94, slaMinutes: 30,
    voiceTranscript: "Caller said water has been brown and smelly since yesterday. Her three children drank it and developed stomach issues. Several neighbors reporting same problem on the street.",
    tags: ["contamination", "health-risk", "children-affected"], duplicateOf: null,
    timeline: [
      createTimeline("call", "Voice call received — Urdu", "VAPI Agent", subtractHours(2)),
      createTimeline("created", "Ticket created from voice call", "System", subtractHours(2)),
      createTimeline("assigned", "Assigned to Usman Tariq", "System", subtractMinutes(30))
    ]
  },
  {
    id: "t3", ticketNo: "WAS-003", callerName: "Tariq Mehmood", phone: "0333-9988776", area: "Gulberg III",
    category: "no-water", icon: "🚱", priority: "high", status: "new",
    description: "Complete water supply outage for over 72 hours. Entire block affected. Elderly residents struggling.",
    aiSummary: "HIGH: 72hr outage across full block — 22 households, elderly residents at risk",
    createdAt: subtractHours(4), updatedAt: subtractHours(4), callDuration: 187, householdsAffected: 22,
    assignedTo: null, escalatedTo: null, escalationReason: null, aiScore: 81, slaMinutes: 120,
    voiceTranscript: "Caller has had no water for three days. Says entire street is dry and elderly parents cannot manage basic needs. Neighbors collectively buying water tankers at high cost.",
    tags: ["elderly", "long-outage", "multi-household"], duplicateOf: null,
    timeline: [
      createTimeline("call", "Voice call received — Urdu", "VAPI Agent", subtractHours(4)),
      createTimeline("created", "Ticket created from voice call", "System", subtractHours(4))
    ]
  },
  {
    id: "t4", ticketNo: "WAS-004", callerName: "Principal Govt Girls School", phone: "042-35800000", area: "Iqbal Town",
    category: "sewerage", icon: "🚧", priority: "high", status: "escalated",
    description: "Sewerage overflowing on street adjacent to Government Girls School. Children walking through waste water daily.",
    aiSummary: "HIGH: Sewage next to school — public health risk, child safety, media threat",
    createdAt: subtractHours(1.5), updatedAt: subtractMinutes(15), callDuration: 203, householdsAffected: 15,
    assignedTo: "s1", escalatedTo: "s1", escalationReason: "School/Hospital affected", aiScore: 79, slaMinutes: 120,
    voiceTranscript: "Caller is the school principal. Sewage overflowing since morning near main gate. Students stepping in it entering school. Parents are furious and threatening to contact news channels.",
    tags: ["school", "child-safety", "media-risk"], duplicateOf: null,
    timeline: [
      createTimeline("call", "Voice call received — Urdu", "VAPI Agent", subtractHours(1.5)),
      createTimeline("created", "Ticket created from voice call", "System", subtractHours(1.5)),
      createTimeline("escalated", "Escalated to ERT Alpha", "System", subtractMinutes(15))
    ]
  },
  {
    id: "t5", ticketNo: "WAS-005", callerName: "Amna Bibi", phone: "0345-1122334", area: "Samanabad",
    category: "no-water", icon: "🚱", priority: "medium", status: "in-progress",
    description: "Intermittent supply for 4 days. Water only comes 30 minutes at 5am. Family of 7 cannot manage.",
    aiSummary: "MEDIUM: Severely restricted supply window — repeat complaint, family of 7",
    createdAt: subtractHours(5), updatedAt: subtractHours(1), callDuration: 156, householdsAffected: 7,
    assignedTo: "a2", escalatedTo: null, escalationReason: null, aiScore: 54, slaMinutes: 480,
    voiceTranscript: "Caller says water only arrives at 5am for about 30 minutes. Large family cannot fill enough containers in time. Has submitted complaint twice before with no follow-up response.",
    tags: ["repeat-complaint", "intermittent"], duplicateOf: null,
    timeline: [
      createTimeline("call", "Voice call received — Urdu", "VAPI Agent", subtractHours(5)),
      createTimeline("created", "Ticket created from voice call", "System", subtractHours(5)),
      createTimeline("assigned", "Assigned to Sana Malik", "System", subtractHours(1))
    ]
  },
  {
    id: "t6", ticketNo: "WAS-006", callerName: "Khurram Shahzad", phone: "0301-4455667", area: "DHA Phase 5",
    category: "billing", icon: "📄", priority: "low", status: "escalated",
    description: "Received bill of Rs.45,000 against normal Rs.8,000. No change in usage. Demands immediate correction.",
    aiSummary: "LOW: Billing error 5x overcharge — accounting issue, no infrastructure problem",
    createdAt: subtractHours(24), updatedAt: subtractHours(2), callDuration: 423, householdsAffected: 1,
    assignedTo: "a3", escalatedTo: "a3", escalationReason: "Billing 5x overcharge dispute", aiScore: 28, slaMinutes: 1440,
    voiceTranscript: "Caller received extremely high bill this month. Meter reading appears incorrect. Wants supervisor to personally review account and issue corrected bill before due date.",
    tags: ["billing-error", "overcharge"], duplicateOf: null,
    timeline: [
      createTimeline("call", "Voice call received — Urdu", "VAPI Agent", subtractHours(24)),
      createTimeline("created", "Ticket created from voice call", "System", subtractHours(24)),
      createTimeline("escalated", "Escalated to Bilal Ahmed", "System", subtractHours(2))
    ]
  },
  {
    id: "t7", ticketNo: "WAS-007", callerName: "Imran Butt", phone: "0311-9998887", area: "Bahria Town",
    category: "dirty-water", icon: "🤢", priority: "high", status: "new",
    description: "Yellow tinted water for 2 days. Strong metallic rust smell. Around 20 homes affected in block.",
    aiSummary: "HIGH: Rust/sediment contamination — 20 households, aging pipe corrosion likely",
    createdAt: subtractMinutes(90), updatedAt: subtractMinutes(90), callDuration: 178, householdsAffected: 20,
    assignedTo: null, escalatedTo: null, escalationReason: null, aiScore: 76, slaMinutes: 120,
    voiceTranscript: "Caller says water has been yellowish since Tuesday with metallic smell. Too scared to use for cooking or drinking. Bought mineral water bottles but cannot afford this long term.",
    tags: ["rust", "contamination", "large-area"], duplicateOf: null,
    timeline: [
      createTimeline("call", "Voice call received — Urdu", "VAPI Agent", subtractMinutes(90)),
      createTimeline("created", "Ticket created from voice call", "System", subtractMinutes(90))
    ]
  },
  {
    id: "t8", ticketNo: "WAS-008", callerName: "Zara Hussain", phone: "0322-3334445", area: "Township",
    category: "pipe-burst", icon: "💥", priority: "high", status: "in-progress",
    description: "Underground pipe burst causing road cave-in and flooding. Traffic completely blocked on main boulevard.",
    aiSummary: "HIGH: Road subsidence from burst pipe — traffic blockage, structural collapse risk",
    createdAt: subtractMinutes(110), updatedAt: subtractMinutes(40), callDuration: 267, householdsAffected: 0,
    assignedTo: "a1", escalatedTo: null, escalationReason: null, aiScore: 83, slaMinutes: 120,
    voiceTranscript: "Caller says road caved in near township chowk. Water shooting up from ground level. Heavy traffic jam has formed. Two motorcycles already fell into the sinkhole.",
    tags: ["road-damage", "sinkhole", "traffic"], duplicateOf: null,
    timeline: [
      createTimeline("call", "Voice call received — Urdu", "VAPI Agent", subtractMinutes(110)),
      createTimeline("created", "Ticket created from voice call", "System", subtractMinutes(110)),
      createTimeline("assigned", "Assigned to Usman Tariq", "System", subtractMinutes(40))
    ]
  },
  {
    id: "t9", ticketNo: "WAS-009", callerName: "Rabia Anwar", phone: "0300-8889990", area: "Garden Town",
    category: "no-water", icon: "🚱", priority: "medium", status: "resolved",
    description: "Water supply restored after 2 day outage. Caller confirmed clean water with normal pressure.",
    aiSummary: "RESOLVED: Supply restored — maintenance on main line completed successfully",
    createdAt: subtractHours(48), updatedAt: subtractMinutes(10), callDuration: 98, householdsAffected: 5,
    assignedTo: "a2", escalatedTo: null, escalationReason: null, aiScore: 42, slaMinutes: 480,
    voiceTranscript: "Caller called back to confirm water has returned. Thanked the response team for quick action. Said pressure is good and water appears clean with no discoloration.",
    tags: ["resolved", "callback"], duplicateOf: null,
    timeline: [
      createTimeline("call", "Voice call received — Urdu", "VAPI Agent", subtractHours(48)),
      createTimeline("created", "Ticket created from voice call", "System", subtractHours(48)),
      createTimeline("assigned", "Assigned to Sana Malik", "System", subtractHours(40)),
      createTimeline("resolved", "Marked as resolved", "Sana Malik", subtractMinutes(10))
    ]
  },
  {
    id: "t10", ticketNo: "WAS-010", callerName: "Usman Ghani", phone: "0334-5556667", area: "Shadman",
    category: "sewerage", icon: "🚧", priority: "low", status: "new",
    description: "Strong sewerage smell from drain near house. No visible overflow but smell is unbearable indoors.",
    aiSummary: "LOW: Sewer gas — likely blocked vent pipe, routine inspection required",
    createdAt: subtractHours(8), updatedAt: subtractHours(8), callDuration: 134, householdsAffected: 3,
    assignedTo: null, escalatedTo: null, escalationReason: null, aiScore: 31, slaMinutes: 1440,
    voiceTranscript: "Caller says sewage smell enters home through windows from street drain. Has been ongoing for a week. Previously filed complaint but no one arrived for inspection.",
    tags: ["smell", "repeat-complaint"], duplicateOf: null,
    timeline: [
      createTimeline("call", "Voice call received — Urdu", "VAPI Agent", subtractHours(8)),
      createTimeline("created", "Ticket created from voice call", "System", subtractHours(8))
    ]
  },
  {
    id: "t11", ticketNo: "WAS-011", callerName: "Hamid Ullah", phone: "0315-7778889", area: "Allama Iqbal Town",
    category: "no-water", icon: "🚱", priority: "critical", status: "new",
    description: "Hospital water supply cut for 6 hours. ICU and OT relying on stored water. Critically urgent.",
    aiSummary: "CRITICAL: Hospital water outage 6hrs — ICU at risk, immediate restoration required",
    createdAt: subtractMinutes(30), updatedAt: subtractMinutes(30), callDuration: 380, householdsAffected: 0,
    assignedTo: null, escalatedTo: null, escalationReason: null, aiScore: 99, slaMinutes: 15,
    voiceTranscript: "Caller is facility manager of General Hospital. Water supply cut since 6am. ICU and operation theater using emergency reserves. Tank will run dry in 2 hours.",
    tags: ["hospital", "life-critical", "ert-required"], duplicateOf: null,
    timeline: [
      createTimeline("call", "Voice call received — Urdu", "VAPI Agent", subtractMinutes(31)),
      createTimeline("created", "Ticket created from voice call", "System", subtractMinutes(30))
    ]
  },
  {
    id: "t12", ticketNo: "WAS-012", callerName: "Nadia Perveen", phone: "0343-1112223", area: "Wapda Town",
    category: "dirty-water", icon: "🤢", priority: "medium", status: "in-progress",
    description: "Grey cloudy water since yesterday. Strong chlorine smell. Lab test requested by caller.",
    aiSummary: "MEDIUM: Possible over-chlorination — 12 households, chemical test recommended",
    createdAt: subtractHours(3), updatedAt: subtractHours(1), callDuration: 142, householdsAffected: 12,
    assignedTo: "a2", escalatedTo: null, escalationReason: null, aiScore: 55, slaMinutes: 480,
    voiceTranscript: "Caller says water turned grey and has a strong chemical smell. Refused to use it. Neighbors also complaining. Wants WASA to send a team to test the water.",
    tags: ["chemical", "lab-needed", "multi-household"], duplicateOf: null,
    timeline: [
      createTimeline("call", "Voice call received — Urdu", "VAPI Agent", subtractHours(3)),
      createTimeline("created", "Ticket created from voice call", "System", subtractHours(3)),
      createTimeline("assigned", "Assigned to Sana Malik", "System", subtractHours(1))
    ]
  },
  {
    id: "t13", ticketNo: "WAS-013", callerName: "Khalid Rehman", phone: "0312-4445556", area: "Faisal Town",
    category: "pipe-burst", icon: "💥", priority: "high", status: "resolved",
    description: "Underground burst causing flooding in basement apartment. Repaired by field team.",
    aiSummary: "RESOLVED: Basement flooding from burst — repair completed, drainage cleared",
    createdAt: subtractHours(12), updatedAt: subtractHours(2), callDuration: 198, householdsAffected: 4,
    assignedTo: "a1", escalatedTo: null, escalationReason: null, aiScore: 71, slaMinutes: 120,
    voiceTranscript: "Initial call about basement flooding from pipe burst. Team dispatched within 2 hours. Repair completed and area pumped dry. Caller confirmed resolution.",
    tags: ["resolved", "repair-done"], duplicateOf: null,
    timeline: [
      createTimeline("call", "Voice call received — Urdu", "VAPI Agent", subtractHours(12)),
      createTimeline("created", "Ticket created from voice call", "System", subtractHours(12)),
      createTimeline("assigned", "Assigned to Usman Tariq", "System", subtractHours(10)),
      createTimeline("resolved", "Repair complete, ticket resolved", "Usman Tariq", subtractHours(2))
    ]
  }
];

export const lahoreAreas = [
  "Model Town", "Johar Town", "Gulberg III", "Gulberg I", "Gulberg II",
  "Iqbal Town", "Samanabad", "DHA Phase 1", "DHA Phase 5", "DHA Phase 6",
  "Bahria Town", "Township", "Garden Town", "Shadman", "Allama Iqbal Town",
  "Wapda Town", "Faisal Town", "Cantt", "Anarkali", "Mall Road",
  "Raiwind Road", "Ferozepur Road", "Thokar Niaz Baig", "Bedian Road"
];

export const demoCallScript: DemoCallStep[] = [
  {
    id: "s1",
    speaker: "agent",
    urdu: "آپ کا WASA شکایت سیل میں خیر مقدم ہے۔ میں آپ کی کیسے مدد کر سکتا ہوں؟",
    english: "Welcome to WASA Complaint Cell. How can I help you today?",
    delayMs: 500,
  },
  {
    id: "s2",
    speaker: "citizen",
    urdu: "جی، ہمارے علاقے میں کل سے پانی نہیں آ رہا اور پائپ پھٹا ہوا ہے، سڑک پر پانی بھر گیا ہے۔",
    english: "There's been no water since yesterday and a pipe has burst — the road is completely flooded.",
    delayMs: 1800,
    extractedField: { key: "category", label: "Category Detected", value: "Pipe Burst + No Water" }
  },
  {
    id: "s3",
    speaker: "agent",
    urdu: "ٹھیک ہے، آپ کا نام کیا ہے؟",
    english: "I understand, that sounds serious. May I have your name please?",
    delayMs: 1200,
  },
  {
    id: "s4",
    speaker: "citizen",
    urdu: "میرا نام محمد ریحان ہے۔",
    english: "My name is Muhammad Rehan.",
    delayMs: 1000,
    extractedField: { key: "name", label: "Caller Name", value: "Muhammad Rehan" }
  },
  {
    id: "s5",
    speaker: "agent",
    urdu: "ریحان صاحب، آپ کون سے علاقے میں ہیں؟",
    english: "Mr. Rehan, which area are you calling from?",
    delayMs: 1000,
  },
  {
    id: "s6",
    speaker: "citizen",
    urdu: "گلبرگ تھری، بلاک ای میں۔ یہاں پانی سڑک پر بہہ رہا ہے اور بجلی کا تار بھی گرا ہوا ہے۔",
    english: "Gulberg III, Block E. Water is flooding the street and there's a downed electrical wire too.",
    delayMs: 2000,
    extractedField: { key: "area", label: "Area Identified", value: "Gulberg III" }
  },
  {
    id: "s7",
    speaker: "agent",
    urdu: "بجلی کا تار؟ یہ بہت خطرناک ہے۔ آپ کا فون نمبر کیا ہے تاکہ ہم فوری رابطہ کر سکیں؟",
    english: "An electrical wire? That's very dangerous. What's your phone number for follow-up?",
    delayMs: 1500,
    extractedField: { key: "priority", label: "AI Priority Score", value: "96 / 100 — CRITICAL" }
  },
  {
    id: "s8",
    speaker: "citizen",
    urdu: "جی، 0311 نو نو آٹھ سات سات چھ پانچ۔",
    english: "Yes, it's 0311-9987765.",
    delayMs: 1000,
    extractedField: { key: "phone", label: "Phone Number", value: "0311-9987765" }
  },
  {
    id: "s9",
    speaker: "agent",
    urdu: "شکریہ ریحان صاحب۔ میں نے آپ کی شکایت درج کر لی ہے۔ ٹکٹ نمبر WAS-014 ہے۔ ERT ٹیم 30 منٹ میں پہنچے گی۔",
    english: "Thank you Mr. Rehan. Your complaint has been registered as Ticket #WAS-014. Our ERT team will arrive within 30 minutes.",
    delayMs: 2000,
    extractedField: { key: "ticket", label: "Ticket Created", value: "WAS-014 — CRITICAL" }
  }
];
