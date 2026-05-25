# Match Tech — Encontre sua equipe ideal para hackathons

Uma plataforma de matchmaking comunitária que conecta desenvolvedores, designers e entusiastas solitários a equipes complementares — baseado em habilidades reais, paixões e vetos, não em currículos genéricos.

Nasceu da transformação de um app de gestão de equipe do [Hackathon Tech Floripa 2026](https://techfloripa.com.br), cujo sistema de mapeamento de perfil individual ficou tão bom que decidimos abri-lo para toda a comunidade.

---

## ✨ Funcionalidades

### Mapeamento de Perfil Gamificado
- **Classes:** Selecione sua role principal e secundárias (Frontend, Backend, AI/ML, Design, Hardware, etc.)
- **Skills Radar:** Sliders de 1-10 em 6 categorias, gerando um spider chart em tempo real.
- **Arsenal de Tags:** Marque tecnologias como ❤️ AMO, ✅ OPERO BEM ou 🚫 NEM FUDENDO — mínimo de 10 para calibrar o algoritmo.

### Descoberta de Perfis
- Explore perfis da comunidade com filtros por role, skill dominante e tags.
- Cards compactos com preview de radar chart e status de equipe.

### Análise por IA
- Análise individual de perfil via Google Gemini (tom brutal ou suave).
- Compatibilidade entre perfis (cruza skills + tags + vetos).
- Análise de composição de equipe com sugestões de forças e gaps.

### Sistema de Squads
- Crie equipes, envie convites e visualize radares sobrepostos de todos os membros.

---

## 💻 Stack Tecnológica

| Camada | Tecnologias |
|--------|------------|
| **Frontend** | React 19, TypeScript, Vite |
| **Estilo** | Tailwind CSS v4 (Dark Mode, SaaS Minimalista) |
| **Animações** | `motion/react` |
| **Gráficos** | Recharts (Radar / Spider Charts) |
| **Ícones** | Lucide React |
| **Auth** | Firebase Authentication (Google OAuth) |
| **Banco de Dados** | Firebase Firestore (NoSQL, Offline-First) |
| **IA** | Google Gemini SDK (`@google/genai`) |
| **Server** | Express + Vite Middleware |
| **Deploy** | Vercel |

---

## 🔧 Como Rodar Localmente

### 1. Clone o repositório

```bash
git clone https://github.com/YnotMax/match-tech.git
cd match-tech
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo de exemplo e adicione sua chave da API do Gemini:

```bash
cp .env.example .env
```

Edite o `.env`:

```env
GEMINI_API_KEY="SUA-CHAVE-AQUI"
```

### 4. Configure o Firebase (opcional)

**Opção A — Usar config existente:**
O projeto já inclui `firebase-applet-config.json` com um projeto Firebase hospedado. Nenhuma configuração extra necessária.

**Opção B — Usar seu próprio Firebase:**

1. Crie um projeto em [console.firebase.google.com](https://console.firebase.google.com).
2. Em Firestore Database, **crie um banco de dados**.
3. Em Authentication, habilite o provider **Google**.
4. Crie um app Web nas configurações do projeto.
5. Copie as chaves para `firebase-applet-config.json`:

```json
{
  "apiKey": "SUA_API_KEY",
  "authDomain": "seu-app.firebaseapp.com",
  "projectId": "seu-app",
  "storageBucket": "seu-app.appspot.com",
  "messagingSenderId": "0000000000",
  "appId": "1:000000000:web:01234abcd",
  "firestoreDatabaseId": "(default)"
}
```

6. Aplique as regras de segurança do arquivo `firestore.rules` no console do Firestore.

### 5. Inicie o servidor dev

```bash
npm run dev
```

O app estará rodando em `http://localhost:3000`.

---

## 📁 Documentação do Projeto

| Documento | Propósito |
|-----------|-----------|
| `docs/VISION_MATCH_TECH.md` | Visão do produto, identidade visual, arquitetura, modelo de dados |
| `docs/FRONTEND_BLUEPRINT.md` | Blueprint técnico de implementação (o que manter, modificar, criar) |
| `docs/TODO_MATCH_TECH.md` | Roadmap com checklist de progresso |
| `docs/CODEBASE_MAP.md` | Mapa rápido de toda a codebase (arquivos, dependências, funções-chave) |

---

## 🔒 Segurança

O Firestore utiliza regras de segurança com validação de schema (`isValidMember`), verificação de `request.auth.uid` e controle de campos alteráveis. Veja `firestore.rules` para detalhes.

---

## 📜 Licença

Projeto open-source criado para a comunidade do Hackathon Tech Floripa 2026.

Feito com ☕ por **Tony Max & Squad**.
 