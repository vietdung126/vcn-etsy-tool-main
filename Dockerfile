FROM node:20 as builder

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production --ignore-engines


FROM node:20-alpine

WORKDIR /app
RUN yarn global add pm2 
COPY --from=builder /app .
COPY . .

USER node
EXPOSE 3000

CMD ["pm2-runtime", "start", "ecosystem.config.cjs", "--no-auto-exit"]
