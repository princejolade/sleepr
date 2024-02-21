FROM node:lts-alpine AS development

WORKDIR /app

COPY package.json .
COPY pnpm-lock.yaml .
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

RUN npm install -g pnpm

COPY apps/auth apps/auth
COPY libs libs

RUN pnpm install -r

RUN pnpm run build auth

##############################

FROM node:lts-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package.json .
COPY pnpm-lock.yaml .

RUN npm install -g pnpm
RUN pnpm install --prod

COPY --from=development /app/dist ./dist

CMD ["node", "dist/apps/auth/main.js"]
