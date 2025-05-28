# Obraz do budowania i uruchamiania aplikacji
FROM maven:3.9.6-eclipse-temurin-17

# Ustaw katalog roboczy
WORKDIR /app

# Skopiuj plik pom.xml i pobierz zależności (oddzielnie, aby wykorzystać cache)
COPY pom.xml .

# Skopiuj kod źródłowy i skrypt startowy
COPY src ./src
COPY start.sh ./start.sh

# Zbuduj aplikację (pakiet JAR)
RUN mvn package -DskipTests

# Nadaj uprawnienia wykonywania dla skryptu
RUN chmod +x ./start.sh

# Otwórz port 8080
EXPOSE 8080

# Uruchom aplikację przy starcie kontenera
CMD ["./start.sh"] 