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

# Kopiowanie skompilowanych plików z etapu build - poprawiona ścieżka
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Kopiowanie konfiguracji nginx (bez zmiennych)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Dodanie pliku zdrowia dla Railway
RUN echo "OK" > /usr/share/nginx/html/health

# Wystawienie portu dla Railway (domyślnie 100)
EXPOSE 100

# Uruchomienie serwera na porcie 100
CMD ["nginx", "-g", "daemon off;"]
