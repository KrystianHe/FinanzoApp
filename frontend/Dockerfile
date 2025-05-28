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
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Kopiowanie skompilowanych plików z etapu build - poprawiona ścieżka
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Dodanie pliku zdrowia dla Railway
RUN echo "OK" > /usr/share/nginx/html/health

# Kopiowanie skryptu startowego
COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh

# Ustawienie zmiennych środowiskowych
ENV PORT=80
ENV HOST=0.0.0.0

# Wystawienie portu
EXPOSE 80

# Użycie skryptu startowego
ENTRYPOINT ["/docker-entrypoint.sh"]

# Uruchomienie serwera
CMD ["nginx", "-g", "daemon off;"]
