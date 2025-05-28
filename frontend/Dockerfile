# Najprostszy możliwy Dockerfile - jeden etap
FROM nginx:latest

# Kopiowanie pliku konfiguracyjnego
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Kopiowanie plików statycznych
COPY public/ /usr/share/nginx/html/

# Dodanie pliku health check
RUN echo "OK" > /usr/share/nginx/html/health

# Wystawienie portu
EXPOSE 80

# Uruchomienie serwera
CMD ["nginx", "-g", "daemon off;"]
