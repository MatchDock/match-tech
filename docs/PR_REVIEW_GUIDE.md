# 🧭 Guia de Revisão de Pull Requests — Match Tech

> Para o Tony: dev júnior, criador do projeto, principal mantenedor do `MatchDock/match-tech`.

---

## O que é um Pull Request (PR)?

É quando alguém do time faz alterações no código e pede para você **revisar antes de aceitar**. Seu papel como mantenedor é funcionar como um porteiro: decidir se aquela mudança entra ou não no projeto.

> [!NOTE]
> **Você não precisa entender cada linha de código.** O objetivo da revisão é entender *o que* mudou, *por quê*, e se isso pode quebrar algo.

---

## 🔁 Seu Fluxo de Revisão (Passo a Passo)

### 1. Leia a descrição do PR primeiro

Antes de ver qualquer código, leia o texto que a pessoa escreveu no PR. Pergunte-se:

- ✅ O PR descreve o que mudou?
- ✅ Ele referencia uma issue? (ex: `Closes #42`)
- ✅ A branch está correta? (deve ir para `develop`, não para `main`)
- ❌ Se a pessoa só colocou "atualiza código" sem explicar nada → peça uma descrição melhor

**Link rápido para ver os PRs:** [github.com/MatchDock/match-tech/pulls](https://github.com/MatchDock/match-tech/pulls)

---

### 2. Entenda o escopo — quantas coisas ele mexeu?

Na aba **"Files changed"** do PR, veja:

| Sinal | O que significa |
|-------|-----------------|
| Verde (linhas `+`) | Código **adicionado** |
| Vermelho (linhas `-`) | Código **removido** |
| Poucos arquivos alterados | PR pequeno ✅ mais fácil de revisar |
| Muitos arquivos e linhas | PR gigante ⚠️ pode ser difícil de aprovar de uma vez |

> [!TIP]
> O `CONTRIBUTING.md` do projeto pede PRs pequenos e focados. Se alguém mandou um PR com 50 arquivos alterados que não tem relação entre si, você pode pedir para dividir.

---

### 3. Verifique se o PR segue as regras do projeto

Baseado no [CONTRIBUTING.md](../CONTRIBUTING.md):

- [ ] A branch do PR tem nome correto? (`feat/`, `bug/`, `docs/`, `task/`, `refactor/`)
- [ ] O PR está indo para `develop` (não para `main`)?
- [ ] Os commits seguem Conventional Commits? (`feat:`, `fix:`, `docs:`, `refactor:`)
- [ ] O PR faz **uma coisa só** (não mistura feature nova + bugfix + refactor)?

---

### 4. Perguntas práticas para revisar o código

Você não precisa ser expert. Faça estas perguntas ao olhar o diff:

#### 🟢 Perguntas básicas (todo PR)
- O que essa mudança adiciona ou resolve?
- Isso pode quebrar algo que já funcionava?
- O nome dos arquivos e funções faz sentido?

#### 🟡 Para PRs de feature (nova funcionalidade)
- Isso resolve a issue que está referenciada?
- A feature se encaixa no estilo visual do projeto?
- Mexe no Firebase/Firestore de forma que pode perder dados?

#### 🔴 Para PRs de refatoração (reorganização do código)
- O comportamento da UI continua igual para o usuário?
- Passou no build? (`npm run build` ou CI do GitHub Actions)
- Passou no typecheck do TypeScript? (`tsc --noEmit`)

#### 🔵 Para PRs de infra/docs
- A documentação faz sentido e está em português?
- Não quebra nenhuma configuração existente?

---

### 5. Como pedir mudanças sem ser rude

Quando algo está errado ou precisa de ajuste, você pode comentar assim:

```text
Oi! Ficou bem legal, mas tenho uma dúvida/sugestão:

❓ Esse arquivo [X] foi modificado, mas não estava relacionado à issue #42.
Você pode remover essa alteração desse PR?

💡 Sugestão: [explica o que preferia ver]

Fora isso, está bem feito! 🚀
```

> [!IMPORTANT]
> No GitHub, você pode comentar linha por linha. Clique no `+` que aparece ao lado das linhas no "Files changed" para deixar um comentário específico.

---

### 6. O CI do projeto já faz parte do trabalho por você!

O repositório tem um **GitHub Actions CI**. Isso significa que automaticamente, em todo PR, o sistema verifica:

- ✅ O TypeScript compila sem erros (`tsc --noEmit`)
- ✅ O build do Vite funciona (`npm run build`)
- ✅ Todos os testes passam (`npm test`)

Se o CI falhar (mostrar ❌ vermelho no PR), **você não precisa aprovar**. Peça para o contribuidor corrigir primeiro.

---

## 🎯 Checklist Rápido — Cole nos comentários do PR

```text
## Checklist de Review ✅

- [ ] Descrição clara do que mudou
- [ ] Referencia a issue correta (ex: `Closes #XX`)
- [ ] Branch correta → develop (não main)
- [ ] Nome da branch no padrão (feat/, bug/, docs/...)
- [ ] Commits em Conventional Commits
- [ ] PR focado em uma única coisa
- [ ] CI passou (TypeScript + Build + Testes) ✅
- [ ] Não quebra funcionalidades existentes
```

---

## 🚦 Quando aprovar (Merge), pedir mudanças ou fechar

| Situação | Ação |
|----------|------|
| Tudo certo, CI passou | ✅ **Aprovar e fazer Merge** |
| Tem erros corrigíveis | 🔄 **Request changes** — pedir ajustes |
| PR gigante sem foco | 📝 Pedir para dividir em PRs menores |
| CI falhou (❌ vermelho) | 🚫 Não aprovar até corrigir |
| PR foi para `main` diretamente | 🚫 Fechar e pedir para reabrir para `develop` |
| Não tem relação com nenhuma issue | ❓ Perguntar o contexto antes de decidir |

---

## 📚 Tipos de PR mais comuns no match-tech

Com base no histórico do projeto, esses são os tipos que você vai ver:

### PR de Feature (`feat/`)
Ex: adicionar filtro de perfis, nova página, novo componente UI
- Foco: **funciona? se encaixa no design?**

### PR de Refatoração (`refactor/`)
Ex: PR #56 foi uma refatoração arquitetural gigante (Clean Architecture, Router v7...)
- Foco: **o comportamento mudou? CI passou? tem testes?**

### PR de Documentação (`docs/`)
Ex: PR #36 atualizou o CONTRIBUTING.md
- Foco: **está em português? é claro? está correto?**

### PR de Infra (`infra/`)
Ex: PR #57 adicionou GitHub Actions CI
- Foco: **vai rodar na conta da org? tem segredos expostos?**

---

## 💬 Como pedir análise para mim (Antigravity)

Se receber um PR complicado, pode me mandar assim no chat:

```text
Me ajuda a revisar o PR #XX: [link]
```

Eu leio o diff, o histórico de commits, e te entrego um resumo em português explicando:
- O que mudou
- Se está correto
- O que pedir para o contribuidor ajustar
- Se você pode aprovar ou não

---

> 🚀 **Você está indo bem!** Gerir um repositório open source com contribuidores externos durante um hackathon é bastante coisa. O importante é manter o ritmo, ser justo nas revisões, e não deixar PRs parados por muito tempo.
