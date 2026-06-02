# Match Tech — Encontre sua equipe ideal para hackathons

Uma plataforma de matchmaking comunitária que conecta desenvolvedores, designers e entusiastas a equipes complementares — baseado em habilidades reais, paixões e vetos, não em currículos genéricos.

Nasceu da transformação de um app de gestão de equipe do [Hackathon Tech Floripa 2026](https://techfloripa.com.br), cujo sistema de mapeamento de perfil individual ficou tão bom que decidimos abri-lo para toda a comunidade.

> **Acesse em produção:** [matchtech-sooty.vercel.app](https://matchtech-sooty.vercel.app)

---

## Funcionalidades

### Mapeamento de Perfil Gamificado

- Selecione sua role principal e secundárias (Frontend, Backend, AI/ML, Design, Hardware...)
- Skills Radar — sliders de 1 a 10 em 6 categorias com spider chart em tempo real
- Arsenal de Tags — marque tecnologias como ❤️ AMO, ✅ OPERO BEM ou 🚫 NEM FUDENDO (mínimo 10 para calibrar o algoritmo)

### Descoberta de Perfis

- Explore perfis da comunidade com filtros por role, status e tags
- Lista virtualizada (suporta centenas de perfis sem travar)
- Cards com preview do radar de habilidades

### Análise por IA (Oráculo)

- Análise individual via Google Gemini (tom brutal ou suave)
- Compatibilidade cruzada de habilidades + tags + vetos
- Análise de composição de equipe com forças e gaps

### Squads

- Crie equipes, envie convites por deep link (`/join/:squadId`)
- Visualize radares sobrepostos de todos os membros

### Perfil Público Compartilhável

- URL pública `/p/:uid` sem necessidade de login
- Exportação do perfil como imagem PNG (canvas 1200×630)

---

## Stack Tecnológica

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Framework UI | React | 19 |
| Linguagem | TypeScript | ~5.8 |
| Build | Vite | ^6.2 |
| Estilo | Tailwind CSS v4 | ^4.1 |
| Animações | motion/react | ^12 |
| Gráficos | Recharts | ^3.8 |
| Roteamento | React Router | v7 (framework mode) |
| Server state | TanStack Query | v5 |
| Virtualização | TanStack Virtual | v3 |
| Auth | Firebase Authentication | ^12 |
| Banco de dados | Firebase Firestore | ^12 |
| IA | Google Gemini (`@google/genai`) | ^1.29 |
| API Server | Express | ^4.21 |
| Validação | Zod | v4 |
| Deploy | Vercel | — |

---

## Como Rodar Localmente

### Pré-requisitos

- Node.js >= 22
- npm >= 10
- Conta no [Google AI Studio](https://aistudio.google.com) para a chave Gemini

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

```bash
cp .env.example .env
```

Edite o `.env` com sua chave:

```env
GEMINI_API_KEY="sua-chave-aqui"
APP_URL="http://localhost:3000"
```

### 4. Configure o Firebase

#### Opção A — Usar o projeto hospedado (recomendado para contribuidores)

O arquivo `firebase-applet-config.json` já está incluso com um projeto Firebase de desenvolvimento. Nenhuma configuração extra necessária.

#### Opção B — Usar seu próprio Firebase

1. Crie um projeto em [console.firebase.google.com](https://console.firebase.google.com)
2. Habilite **Firestore Database** e **Authentication > Google**
3. Crie um app Web e copie as credenciais para `firebase-applet-config.json`
4. Aplique as regras do arquivo `firestore.rules` no console

### 5. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Acesse em `http://localhost:3000`.

---

## Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento (Vite) |
| `npm run build` | Gera o build de produção em `dist/` |
| `npm run preview` | Serve o build local para pré-visualização |
| `npm run typecheck` | Verifica tipos TypeScript sem emitir arquivos |
| `npm run lint` | ESLint com zero avisos permitidos |
| `npm run lint:fix` | ESLint com correção automática |
| `npm run format` | Prettier em todos os arquivos `src/` |
| `npm test` | Roda os testes unitários com Vitest |

---

## Arquitetura

O projeto segue os princípios de **Clean Architecture** com separação em camadas bem definidas:

```text
src/
├── domain/          ← Regras de negócio puras (sem dependências externas)
├── infrastructure/  ← Implementações concretas (Firebase, Zod)
├── features/        ← Funcionalidades por domínio de produto
├── shared/          ← Código reutilizável entre features
├── routes/          ← Configuração de rotas (React Router v7)
├── layouts/         ← Shells de layout (nav, autenticação)
├── contexts/        ← Contextos React globais (Auth)
└── server/          ← API Express (Gemini, roast, oráculo)
```

Para a documentação técnica completa consulte [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

## Estrutura de Pastas (visão rápida)

```text
match-tech/
├── src/
│   ├── domain/
│   │   ├── entities/        # Member, Squad, tipos compartilhados
│   │   ├── ports/           # Interfaces (IProfileRepository, ISquadRepository...)
│   │   └── usecases/        # Algoritmo de compatibilidade, filtros, ranking
│   ├── infrastructure/
│   │   └── firebase/        # Repositórios Firebase + schemas Zod
│   ├── features/
│   │   ├── discover/        # Descoberta de perfis
│   │   ├── guilda/          # Gestão de squad/guilda
│   │   ├── onboarding/      # Cadastro e setup de perfil
│   │   ├── profile/         # Perfil público + compartilhamento
│   │   ├── squad/           # Convite e entrada em squads
│   │   └── landing/         # Página inicial
│   ├── shared/
│   │   ├── components/ui/   # Componentes puros e reutilizáveis
│   │   ├── hooks/           # useFirestoreSubscription<T>, etc.
│   │   ├── context/         # RepositoryProvider (injeção de dependência)
│   │   ├── lib/             # Firebase client, logger, utilitários
│   │   └── services/        # roast.service (cliente da API)
│   ├── routes/              # Router config, ProtectedLayout, ErrorPage
│   ├── layouts/             # RootLayout (nav + Outlet)
│   ├── contexts/            # AuthContext (Firebase Auth)
│   └── server/              # Express API (roast, oráculo/match)
├── docs/
│   └── ARCHITECTURE.md      # Documentação técnica detalhada
├── .github/workflows/       # CI: typecheck + lint + build
├── firestore.rules          # Regras de segurança do Firestore
├── vercel.json              # Configuração de deploy
└── vite.config.ts           # Vite + Vitest config
```

---

## Testes

```bash
npm test                               # roda todos os testes
npx vitest run --reporter=verbose      # com output detalhado
```

Testes unitários cobrem toda a camada de domínio:

- `calculateCompatibility` — algoritmo de compatibilidade entre membros
- `scoreSkillsForRole` — pontuação de habilidades por role
- `filterMembers` — filtragem por role e status
- `sortByCompatibility` / `getTopCompatibleMembers` — ranking

---

## CI/CD

O GitHub Actions executa em todo PR e push para `main`:

1. **typecheck** — `tsc --noEmit`
2. **lint** — ESLint com zero avisos
3. **build** — `vite build`

O deploy é automático via **Vercel** ao fazer merge em `main`.

---

## Segurança

- Firestore usa regras com validação de schema (`isValidMember`), verificação de `request.auth.uid` e controle de campos alteráveis — veja `firestore.rules`
- API Gemini protegida por rate limiting: 5 req/min (roast), 10 req/min (match)
- Nenhuma chave de API é exposta no bundle do cliente

---

## Contribuindo

Contribuições são bem-vindas! Leia [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) para entender os padrões adotados antes de abrir um PR.

1. Faça um fork e clone o repositório
2. Crie uma branch: `git checkout -b feat/minha-feature`
3. Faça suas alterações seguindo os padrões de código
4. Rode `npm run typecheck && npm run lint && npm test`
5. Abra um Pull Request descrevendo as mudanças

---

## Licença

Projeto open-source criado para a comunidade do Hackathon Tech Floripa 2026.
Feito com ☕ por **Tony Max & Squad**.
