FROM node:22-alpine3.20 AS development

WORKDIR /app

COPY --chown=node:node . .

RUN yarn

EXPOSE 3000

# Command to run the application
CMD ["yarn", "start"]

FROM node:22-alpine3.20 AS build

WORKDIR /app

COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=development /app/node_modules ./node_modules
COPY --chown=node:node . .

RUN yarn build

USER node

FROM node:20-alpine AS production

ENV NODE_ENV production

WORKDIR /app

COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/dist ./dist

CMD [ "node", "dist/main.js" ]
