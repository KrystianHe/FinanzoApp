FROM nginx:stable-alpine

# Kopiowanie statycznej strony
COPY public/index.html /usr/share/nginx/html/index.html

# Kopiowanie konfiguracji NGINX
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Dodanie pliku zdrowia dla Railway
RUN echo "OK" > /usr/share/nginx/html/health

# Wystawienie portu
EXPOSE 80

# Uruchomienie serwera
CMD ["nginx", "-g", "daemon off;"]
