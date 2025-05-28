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

# Tworzymy folder dla zasobów statycznych
RUN mkdir -p /app/dist/frontend/assets

# Kopiujemy logo do folderu assets (jeśli nie jest to zrobione podczas buildu)
COPY src/assets/ /app/dist/frontend/assets/

# Etap produkcyjny
FROM nginx:stable-alpine

# Kopiowanie pliku konfiguracyjnego nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Kopiowanie skompilowanych plików z etapu build
COPY --from=build /app/dist/frontend /usr/share/nginx/html

# Kopiowanie pliku index.html jako fallback
COPY public/index.html /usr/share/nginx/html/fallback.html

# Tworzenie katalogu assets jeśli nie istnieje
RUN mkdir -p /usr/share/nginx/html/assets

# Kopiowanie logotypu i innych zasobów (jeśli są)
COPY --from=build /app/dist/frontend/assets/ /usr/share/nginx/html/assets/

# Dodanie pliku zdrowia dla Railway
RUN echo "OK" > /usr/share/nginx/html/health

# Dodanie skryptu entrypoint do dynamicznej konfiguracji
COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh

# Wystawienie portu
EXPOSE 80

# Użycie entrypoint do konfiguracji
ENTRYPOINT ["/docker-entrypoint.sh"]

# Uruchomienie serwera (będzie wywołane przez entrypoint)
CMD ["nginx", "-g", "daemon off;"]
