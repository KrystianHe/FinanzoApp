#!/bin/bash

# Uruchomienie backendu
echo "Uruchamianie backendu Spring Boot..."
mvn spring-boot:run &
BACKEND_PID=$!

# Poczekaj chwilę na uruchomienie backendu
sleep 5

# Przejdź do katalogu frontendu i uruchom go
echo "Uruchamianie frontendu Angular na porcie 4200..."
cd frontend

# Dodanie zależności jeśli są potrzebne
if [ ! -d "node_modules" ]; then
  echo "Instalowanie zależności frontendowych..."
  npm install --legacy-peer-deps
fi

npx ng serve --port 4200 &
FRONTEND_PID=$!

# Funkcja do zatrzymania obu procesów po Ctrl+C
trap_with_arg() {
    func="$1"
    shift
    for sig; do
        trap "$func $sig" "$sig"
    done
}

stop_processes() {
    echo "Zatrzymywanie aplikacji..."
    kill $FRONTEND_PID 2>/dev/null || true
    kill $BACKEND_PID 2>/dev/null || true
    exit
}

trap_with_arg stop_processes INT TERM EXIT

echo "Aplikacja uruchomiona!"
echo "Backend działa na http://localhost:8080"
echo "Frontend działa na http://localhost:4200"

# Utrzymuj skrypt działający
wait