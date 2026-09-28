FROM node:20-alpine
WORKDIR /app

RUN apk add --no-cache openssl libc6-compat

COPY package.json package-lock.json* ./
COPY apps/api/package.json apps/api/package.json
COPY apps/api/prisma apps/api/prisma
RUN npm install --workspace=@td-bookverse/api --include-workspace-root

COPY apps/api apps/api
RUN npm run build --workspace=@td-bookverse/api

EXPOSE 4000
CMD ["node", "apps/api/dist/index.js"]
