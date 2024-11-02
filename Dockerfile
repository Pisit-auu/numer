
FROM node:18-alpine AS base


WORKDIR /app


COPY package*.json ./


RUN npm install


COPY . .


RUN npm run build


FROM node:18-alpine

WORKDIR /app


COPY --from=base /app/package*.json ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public


EXPOSE 3000

ENV PORT 3000
ENV DATABASE_URL "postgres://default:ZDQ7EjAIXY0U@ep-flat-morning-a1efwc0r.ap-southeast-1.aws.neon.tech:5432/verceldb?sslmode=require"

CMD ["npm", "run", "start"]
