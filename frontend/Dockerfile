FROM node:18-alpine AS build

WORKDIR /app

# Kopiowanie plików konfiguracyjnych
COPY package.json package-lock.json ./

# Instalacja zależności
RUN npm install

# Kopiowanie kodu źródłowego
COPY . .

# Build aplikacji
RUN npm run build

# Etap produkcyjny
FROM nginx:stable-alpine

# Kopiowanie pliku konfiguracyjnego nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Kopiowanie skompilowanych plików z etapu build
COPY --from=build /app/dist/wydatki /usr/share/nginx/html

# Dla prostych deploymentów, można też użyć katalogu public
COPY public/ /usr/share/nginx/html/

# Dodanie skryptu entrypoint do dynamicznej konfiguracji
COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh

# Wystawienie portu
EXPOSE 80

# Użycie entrypoint do konfiguracji
ENTRYPOINT ["/docker-entrypoint.sh"]

# Uruchomienie serwera (będzie wywołane przez entrypoint)
CMD ["nginx", "-g", "daemon off;"]
