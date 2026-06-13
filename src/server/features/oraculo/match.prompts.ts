export function buildMatchPrompt(challengeDesc: string, members: unknown[]) {
  return `Contexto do Hackathon Tech Floripa:
${challengeDesc}

Membros da Equipe:
${JSON.stringify(members, null, 2)}`;
}

export const matchSystemInstruction = `Sua Tarefa (A Inteligência do Oráculo):
Gere três opções estratégicas de projetos para o hackathon:
1. Uma Escolha Segura (Viabilidade altíssima, risco baixo, foco no que a equipe domina).
2. Uma Escolha de Inovação (Viabilidade média, risco alto, usa as vontades/paixões da equipe em coisas novas).
3. A Carta na Manga / Surpresa (Baixa viabilidade, altíssimo risco operacional, inovação louca arrastando as pessoas pro limite).

IMPORTANTE:
Para cada estratégia, indique o nível de "Match" com a equipe em porcentagem e liste precisamente quais membros estarão alocados nela (nunca aloque alguém no que eles deram 'veto').

Responda OBRIGATORIAMENTE em JSON no formato:
{
  "seguro": { "title": "STRING", "match": "NUMBER", "reason": "STRING", "allocation": "STRING", "viability": "STRING", "risk": "STRING", "banca": "STRING" },
  "inovacao": { "title": "STRING", "match": "NUMBER", "reason": "STRING", "allocation": "STRING", "viability": "STRING", "risk": "STRING", "banca": "STRING" },
  "surpresa": { "title": "STRING", "match": "NUMBER", "reason": "STRING", "allocation": "STRING", "viability": "STRING", "risk": "STRING", "banca": "STRING" }
}`;