# Apolo Genética

Versão preparada para GitHub e Vercel a partir do código-fonte original fornecido.

## Executar localmente

Requer Node.js 22 ou superior.

```bash
npm ci
npm run dev
```

Abra `http://localhost:3000`.

## Publicar na Vercel

1. Envie todo o conteúdo desta pasta para o repositório GitHub.
2. Na Vercel, importe o repositório.
3. Framework Preset: **Next.js**.
4. Build Command: `npm run build`.
5. Não é necessário configurar variáveis de ambiente para a versão local.

## Dados

Os dados originais do plantel e genealogia permanecem em `app/plantel-data.ts`,
`app/pedigree-data.ts` e `app/offspring-data.ts`. Alterações feitas pela interface
são mantidas no `localStorage` do navegador nesta versão Vercel.
