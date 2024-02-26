FROM node:lts-alpine AS development

WORKDIR /app

COPY package.json .
COPY pnpm-lock.yaml .
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

RUN npm install -g pnpm
RUN pnpm install

COPY apps/auth apps/auth
COPY libs libs

WORKDIR /app/apps/auth

RUN pnpm install

WORKDIR /app

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
COPY proto proto

CMD ["node", "dist/apps/auth/main.js"]

