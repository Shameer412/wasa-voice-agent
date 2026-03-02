export type Priority = "critical" | "high" | "medium" | "low";
export type Status = "new" | "in-progress" | "escalated" | "resolved" | "closed";
export type Category = "no-water" | "dirty-water" | "pipe-burst" | "sewerage" | "billing" | "other";
export type AgentRole = "agent" | "supervisor" | "ert";
export type AppPage = "dashboard" | "submit" | "analytics" | "demo";

export interface TimelineEvent {
  id: string;
  type: "created" | "assigned" | "escalated" | "resolved" | "note" | "call";
  message: string;
  by: string;
  at: Date;
}

export interface Ticket {
  id: string;
  ticketNo: string;
  callerName: string;
  phone: string;
  area: string;
  category: Category;
  icon: string;
  priority: Priority;
  status: Status;
  description: string;
  aiSummary: string;
  createdAt: Date;
  updatedAt: Date;
  callDuration: number;
  householdsAffected: number;
  assignedTo: string | null;
  escalatedTo: string | null;
  escalationReason: string | null;
  aiScore: number;
  slaMinutes: number;
  timeline: TimelineEvent[];
  voiceTranscript: string;
  tags: string[];
  duplicateOf: string | null;
  latitude?: number;
  longitude?: number;
}

export interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  team?: string;
  available: boolean;
  avatar: string;
  assignedCount: number;
}

export interface ComplaintSubmission {
  callerName: string;
  phone: string;
  area: string;
  category: Category;
  description: string;
  householdsAffected: number;
}

export interface DemoCallStep {
  id: string;
  speaker: "agent" | "citizen";
  urdu: string;
  english: string;
  delayMs: number;
  extractedField?: {
    key: string;
    label: string;
    value: string;
  };
}

export interface AreaStat {
  area: string;
  count: number;
  critical: number;
}

export interface CategoryStat {
  category: Category;
  label: string;
  icon: string;
  count: number;
  color: string;
}
