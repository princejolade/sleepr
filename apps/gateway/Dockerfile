FROM node:lts-alpine AS development

WORKDIR /app

COPY package.json .
COPY pnpm-lock.yaml .
COPY tsconfig.json .
COPY nest-cli.json .

RUN npm install -g pnpm
RUN pnpm install 


COPY apps/gateway apps/gateway
COPY libs libs

RUN pnpm run build gateway

########################

FROM node:lts-alpine AS production

ARG NODE_ENV=production

ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package.json .
COPY pnpm-lock.yaml .

RUN npm install -g pnpm
RUN pnpm install --prod

COPY --from=development /app/dist ./dist

CMD [ "node", "dist/apps/gateway/main" ]