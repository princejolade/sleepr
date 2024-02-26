FROM node:lts-alpine AS development

WORKDIR /app

COPY package.json .
COPY pnpm-lock.yaml .
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

RUN npm install -g pnpm
RUN pnpm install

COPY apps/notifications apps/notifications
COPY libs libs

WORKDIR /app/apps/notifications

RUN pnpm install

WORKDIR /app

RUN pnpm run build notifications

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

CMD ["node", "dist/apps/notifications/main.js"]

