FROM node:alpine AS development

WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

RUN npm install -g pnpm
RUN pnpm install

COPY apps/reservations apps/reservations
COPY libs libs

WORKDIR /app/apps/reservations

RUN pnpm install

WORKDIR /app

RUN pnpm run build reservations

##############################

FROM node:alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install --prod

COPY --from=development /app/dist ./dist
COPY proto proto

CMD ["node", "dist/apps/reservations/main"]

