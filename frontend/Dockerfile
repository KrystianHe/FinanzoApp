FROM node:18-alpine as build

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build -- --configuration production --base-href /

# Serve with nginx
FROM nginx:alpine

# Copy nginx configuration as template
COPY nginx.conf /etc/nginx/conf.d/default.conf.template

# Copy entrypoint script
COPY entrypoint.sh /docker-entrypoint.d/40-envsubst-on-nginx-conf.sh
RUN chmod +x /docker-entrypoint.d/40-envsubst-on-nginx-conf.sh

# Copy built application
COPY --from=build /app/dist/frontend /usr/share/nginx/html

EXPOSE 80

# NGINX's docker image already uses CMD ["nginx", "-g", "daemon off;"] 