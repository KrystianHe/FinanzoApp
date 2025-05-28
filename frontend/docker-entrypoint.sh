#!/bin/sh

# Podstawiamy URL backendu z zmiennej środowiskowej lub używamy domyślnej wartości
BACKEND_URL=${BACKEND_URL:-https://finanzoapp-backend-production.up.railway.app}

# Upewniamy się, że URL kończy się ukośnikiem
if [ "$(echo $BACKEND_URL | grep -c '/$')" -eq 0 ]; then
  BACKEND_URL="${BACKEND_URL}/"
fi

echo "Konfigurowanie proxy dla backendu: $BACKEND_URL"

# Podmieniamy URL backendu w konfiguracji nginx
sed -i "s|proxy_pass .*|proxy_pass $BACKEND_URL;|g" /etc/nginx/conf.d/default.conf

# Uruchamiamy komendę przekazaną jako argument (domyślnie nginx)
exec "$@" 