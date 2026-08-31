# Next 16 requires Node >= 20.9 and swagger-client requires >= 22, so node:18
# could not run `next build` at all.
FROM node:22-alpine AS builder

# Prisma's query engine links against OpenSSL; alpine ships without it.
RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build


FROM node:22-alpine AS runner

RUN apk add --no-cache openssl

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

USER node

EXPOSE 3000
ENV PORT=3000

# DATABASE_URL and DIRECT_URL are supplied at run time (-e, --env-file, or the
# platform's secret store) and are never baked into the image.
CMD ["npm", "run", "start"]
