# Contribuindo com o Match Tech

Primeiramente, obrigado por querer contribuir com o Match Tech! 🚀

O Match Tech é uma plataforma open source criada para conectar pessoas e formar equipes para hackathons. Nosso objetivo é criar um ambiente acolhedor para desenvolvedores iniciantes e experientes colaborarem, aprenderem e construírem juntos.

Não importa seu nível de experiência. Se você tem vontade de aprender e colaborar de forma respeitosa, você é bem-vindo(a).

---

# Antes de começar

Recomendamos que você leia:

- README.md
- Documentação disponível na pasta `docs`
- Este guia de contribuição

Isso ajudará você a entender melhor o projeto e evitar trabalho duplicado.

---

# Como contribuir

## 1. Escolha uma Issue

Acesse a aba **Issues** do projeto e procure uma atividade que gostaria de realizar.

Antes de começar:

- Verifique se a issue ainda não possui responsável.
- Comente na issue informando que deseja assumir a tarefa.

Exemplo:

```text
Gostaria de assumir esta issue.
```

---

## 2. Aguarde a atribuição

Um moderador ou mantenedor irá analisar a solicitação e atribuir a issue ao seu usuário.

Somente após a atribuição você deve iniciar o desenvolvimento.

Isso evita que duas pessoas trabalhem na mesma tarefa sem necessidade.

---

## 3. Faça um Fork do projeto

Clique em **Fork** no canto superior direito do repositório.

Isso criará uma cópia do projeto na sua conta GitHub.

---

## 4. Clone seu Fork

```bash
git clone https://github.com/SEU_USUARIO/match-tech.git
```

Entre na pasta do projeto:

```bash
cd match-tech
```

---

## 5. Adicione o repositório original como upstream

Isso permitirá manter seu fork atualizado.

```bash
git remote add upstream https://github.com/MatchDock/match-tech.git
```

Verifique:

```bash
git remote -v
```

Você deverá ver algo semelhante a:

```text
origin    https://github.com/SEU_USUARIO/match-tech.git
upstream  https://github.com/MatchDock/match-tech.git
```

---

# Mantendo seu Fork atualizado

Antes de iniciar qualquer nova contribuição:

```bash
git checkout develop
git fetch upstream
git merge upstream/develop
git push origin develop
```

Isso garante que você esteja trabalhando na versão mais recente do projeto.

---

# Crie uma Branch para sua contribuição

Nunca desenvolva diretamente na branch `develop`.

Crie uma branch específica para sua issue.

Exemplos:

```bash
git checkout -b feature/profile-filters
```

```bash
git checkout -b task/extract-avatar-component
```

```bash
git checkout -b bug/login-redirect-fix
```

---

# Desenvolva sua solução

Realize apenas as alterações relacionadas à issue atribuída.

Evite incluir mudanças não relacionadas no mesmo Pull Request.

PRs menores são mais fáceis de revisar e aprovar.

---

# Commits

Utilizamos o padrão Conventional Commits.

Exemplos:

```bash
git commit -m "feat: add profile filtering"
```

```bash
git commit -m "fix: resolve login redirect issue"
```

```bash
git commit -m "docs: update onboarding documentation"
```

```bash
git commit -m "refactor: extract radar chart component"
```

---

# Envie sua Branch

```bash
git push origin sua-branch
```

Exemplo:

```bash
git push origin feature/profile-filters
```

---

# Abra um Pull Request

Crie um Pull Request para a branch:

```text
develop
```

Não abra Pull Requests diretamente para `main`.

Ao abrir o PR:

- Relacione a issue correspondente.
- Explique brevemente o que foi realizado.
- Adicione capturas de tela quando aplicável.

Exemplo:

```text
Closes #42
```

---

# Revisão

Todo Pull Request passará por revisão.

Os mantenedores poderão solicitar:

- Ajustes de código
- Melhorias de organização
- Correções de bugs
- Alterações de documentação

Isso faz parte do processo normal de desenvolvimento.

---

# Boas práticas

## Faça

✅ Trabalhe apenas em issues atribuídas a você

✅ Mantenha seu fork atualizado

✅ Faça PRs pequenos e objetivos

✅ Escreva código legível

✅ Atualize documentação quando necessário

✅ Seja respeitoso com todos os membros

---

## Evite

❌ Trabalhar diretamente na branch develop

❌ Abrir PRs gigantes

❌ Misturar múltiplas funcionalidades no mesmo PR

❌ Alterar código sem relação com a issue

❌ Forçar pushes em branches compartilhadas

---

# Fluxo de Branches

O projeto utiliza a seguinte estrutura:

```text
main
 └── develop
      ├── feature/*
      ├── task/*
      ├── bug/*
      └── docs/*
```

- `main`: versão estável do projeto.
- `develop`: branch de integração das contribuições.
- Branches temporárias: utilizadas para desenvolvimento de cada issue.

---

# Dúvidas

Caso tenha dúvidas:

- Abra uma Discussion
- Pergunte na issue relacionada
- Procure um moderador do projeto

Toda contribuição é uma oportunidade de aprendizado.

Obrigado por ajudar a construir o Match Tech! 🚀
