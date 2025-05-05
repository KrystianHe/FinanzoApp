#!/bin/sh

# Recreate config file
echo "window.env = {" > /usr/share/nginx/html/env-config.js
echo "  BACKEND_URL: \"$BACKEND_URL\"," >> /usr/share/nginx/html/env-config.js
echo "}" >> /usr/share/nginx/html/env-config.js 