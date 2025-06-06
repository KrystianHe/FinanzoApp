#!/bin/sh
set -e

# Podstawiamy URL backendu z zmiennej środowiskowej lub używamy domyślnej wartości
BACKEND_URL=${BACKEND_URL:-https://finanzoapp-backend-production.up.railway.app/api}

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

# Skopiuj konfigurację do właściwej lokalizacji
cp /etc/nginx/templates/default.conf.template /etc/nginx/conf.d/default.conf

# Podmieniamy URL backendu w konfiguracji nginx
sed -i "s|proxy_pass .*;|proxy_pass $BACKEND_URL;|g" /etc/nginx/conf.d/default.conf
sed -i "s|proxy_set_header Host .*;|proxy_set_header Host $(echo $BACKEND_URL | sed 's|^https\?://||' | sed 's|/.*$||');|g" /etc/nginx/conf.d/default.conf

# Jeśli zmienna PORT jest ustawiona przez Railway, zmień port w konfiguracji NGINX
if [ -n "$PORT" ] && [ "$PORT" != "80" ]; then
  echo "Changing NGINX port to $PORT"
  sed -i "s|listen 80;|listen $PORT;|g" /etc/nginx/conf.d/default.conf
fi

# Wypisz informacje o środowisku
echo "Current environment:"
echo "===================="
echo "PORT: $PORT"
echo "HOST: $HOST"
echo "===================="

# Wypisz zawartość katalogu HTML
echo "Contents of /usr/share/nginx/html:"
ls -la /usr/share/nginx/html/

# Sprawdź plik index.html
if [ -f /usr/share/nginx/html/index.html ]; then
  echo "index.html exists."
else
  echo "WARNING: index.html does not exist!"
fi

# Wypisz konfigurację NGINX
echo "NGINX configuration:"
cat /etc/nginx/conf.d/default.conf

# Uruchom komendę (NGINX)
echo "Starting NGINX..."
exec "$@"
