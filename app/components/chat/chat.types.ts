export type ChatStep = "welcomeForm" | "quickQuestions" | "chatView";

export type Message = {
  role: "user" | "bot";
  text: string;
  timestamp?: number;
};

export type InlineFormType = "demoRequest" | null;

export type DemoFormData = {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  companySize: string;
  note: string;
  agreed: boolean;
};