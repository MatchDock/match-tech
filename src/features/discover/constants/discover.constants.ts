export const ROLE_OPTIONS = [
  "ALL",
  "Frontend Infiltrator",
  "Backend Architect",
  "Data Scientist",
  "Hardware Operator",
  "Vibe Coder / AI Master",
  "UI/UX Designer",
  "DevOps Engineer",
  "Cyber Security",
  "Fullstack Generalist",
] as const;

export const STATUS_OPTIONS = [
  { value: "ALL", label: "TODAS AS DISPONIBILIDADES" },
  { value: "looking", label: "BUSCANDO EQUIPE" },
  { value: "open", label: "ABERTO A PROPOSTAS" },
  { value: "complete", label: "EQUIPE FORMADA" },
] as const;

export const TOAST_DURATION_MS = 5000;