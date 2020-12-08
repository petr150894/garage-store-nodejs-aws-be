FROM node:15-alpine as base

# install dependencies
WORKDIR /app
COPY package*.json ./
RUN npm install

# build application
WORKDIR /app
COPY . .
RUN npm run build


# final application setup
FROM node:15-alpine as app
COPY --from=base /app/package*.json ./
RUN npm install --only=production
# admin monitoring tool
# RUN npm install pm2 -g
COPY --from=base /app/dist ./dist

USER node
ENV PORT=3000
EXPOSE 3000

CMD ["node", "dist/main.js"]
