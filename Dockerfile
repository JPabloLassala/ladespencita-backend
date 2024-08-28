FROM node:22-alpine3.20 AS development

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN yarn

EXPOSE 3000

# Command to run the application
CMD ["yarn", "start"]

FROM NODE:22-alpine3.20 AS build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .

RUN yarn build
RUN yarn ci -f --only=production && yarn cache clean --force

USER node

FROM node:20-alpine AS production
ENV NODE_ENV production
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
CMD [ "node", "dist/main.js" ]
