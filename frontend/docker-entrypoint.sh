#!/bin/sh

# Podstawiamy URL backendu z zmiennej środowiskowej lub używamy domyślnej wartości
BACKEND_URL=${BACKEND_URL:-https://finanzoapp-backend-production.up.railway.app}

# Upewniamy się, że URL zawiera protokół
case "$BACKEND_URL" in
  http://*|https://*)
    # URL już zawiera protokół, nic nie robimy
    ;;
  *)
    # Dodajemy protokół https://
    BACKEND_URL="https://${BACKEND_URL}"
    ;;
esac

# Upewniamy się, że URL kończy się ukośnikiem
if [ "$(echo $BACKEND_URL | grep -c '/$')" -eq 0 ]; then
  BACKEND_URL="${BACKEND_URL}/"
fi

echo "=============================================="
echo "Konfigurowanie proxy dla backendu: $BACKEND_URL"
echo "=============================================="

# Podmieniamy URL backendu w konfiguracji nginx
sed -i "s|proxy_pass .*|proxy_pass $BACKEND_URL;|g" /etc/nginx/conf.d/default.conf
sed -i "s|proxy_set_header Host .*|proxy_set_header Host $(echo $BACKEND_URL | sed 's|^https\?://||' | sed 's|/.*$||');|g" /etc/nginx/conf.d/default.conf

# Sprawdź, czy plik index.html istnieje
if [ -f /usr/share/nginx/html/index.html ]; then
  echo "Plik index.html istnieje."
else
  echo "UWAGA: Brak pliku index.html, kopiuję fallback.html."
  # Jeśli nie ma pliku index.html, skopiuj fallback.html
  if [ -f /usr/share/nginx/html/fallback.html ]; then
    cp /usr/share/nginx/html/fallback.html /usr/share/nginx/html/index.html
  fi
fi

# Sprawdź, czy katalog assets istnieje
if [ -d /usr/share/nginx/html/assets ]; then
  echo "Katalog assets istnieje. Zawartość:"
  ls -la /usr/share/nginx/html/assets/
else
  echo "UWAGA: Brak katalogu assets."
  mkdir -p /usr/share/nginx/html/assets
fi

# Wypisz zawartość katalogu
echo "Zawartość głównego katalogu HTML:"
ls -la /usr/share/nginx/html/

# Uruchamiamy komendę przekazaną jako argument (domyślnie nginx)
echo "Uruchamianie NGINX..."
exec "$@" 