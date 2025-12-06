# 1. For build React app
FROM node:20-alpine AS build
# Set working directory
WORKDIR /app
#
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
# Same as npm install
RUN yarn --production && yarn add @vitejs/plugin-vue
COPY . /app
ENV NODE_ENV=production
RUN yarn build

# FROM node:16-alpine
# WORKDIR /app
# COPY --from=build /app/build .
# RUN yarn global add serve
# EXPOSE 80

# CMD ["serve", "-s", ".", "-l", "80"]

# 2. For Nginx setup
FROM nginx:alpine
# Copy config nginx
COPY --from=build /app/.nginx/nginx.conf /etc/nginx/conf.d/default.conf
WORKDIR /usr/share/nginx/html
# Remove default nginx static assets
RUN rm -rf ./*
# Copy static assets from builder stage
COPY --from=build /app/dist .
EXPOSE 80
# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]
