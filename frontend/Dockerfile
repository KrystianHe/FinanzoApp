FROM node:18-alpine AS build

WORKDIR /app

# Kopiowanie plików konfiguracyjnych
COPY package.json package-lock.json ./

# Instalacja zależności z flagą legacy-peer-deps do rozwiązania konfliktów
RUN npm install --legacy-peer-deps

# Kopiowanie kodu źródłowego
COPY . .

# Build aplikacji z tą samą flagą
RUN npm run build --legacy-peer-deps

# Etap produkcyjny
FROM nginx:stable-alpine

# Kopiowanie pliku konfiguracyjnego nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Kopiowanie skompilowanych plików z etapu build
COPY --from=build /app/dist/frontend /usr/share/nginx/html

# Dodanie pliku zdrowia dla Railway
RUN echo "OK" > /usr/share/nginx/html/health

# Wystawienie portu
EXPOSE 80

# Uruchomienie serwera
CMD ["nginx", "-g", "daemon off;"]
