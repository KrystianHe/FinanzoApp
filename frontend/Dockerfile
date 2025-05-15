FROM node:18-alpine as build

WORKDIR /app

# Kopiowanie i instalacja zależności
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Kopiowanie i budowanie aplikacji
COPY . .
RUN npm run build

# Druga faza - serwowanie za pomocą NGINX
FROM nginx:stable-alpine

# Kopiowanie plików konfiguracyjnych
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Kopiowanie i ustawianie skryptu entrypoint
COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh

# Kopiowanie skompilowanej aplikacji
COPY --from=build /app/dist /usr/share/nginx/html

# Eksponowanie portu
EXPOSE 80

# Ustawienie skryptu entrypoint
ENTRYPOINT ["/docker-entrypoint.sh"] 