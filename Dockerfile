# Obraz do budowania i uruchamiania aplikacji
FROM maven:3.9.6-eclipse-temurin-17

# Ustaw katalog roboczy
WORKDIR /app

# Skopiuj plik pom.xml i pobierz zależności (oddzielnie, aby wykorzystać cache)
COPY pom.xml .

# Skopiuj kod źródłowy
COPY src ./src

# Zbuduj aplikację (pakiet JAR)
RUN mvn package -DskipTests

# Znajdź JAR i przenieś go do znanej lokalizacji
RUN mv $(find /app/target -name "*.jar" | head -n 1) /app/app.jar

# Otwórz port 8080
EXPOSE 8080

# Ustaw parametry pamięci dla JVM
ENV JAVA_OPTS="-Xmx256m -Xms128m -XX:MaxMetaspaceSize=128m"

# Uruchom aplikację przy starcie kontenera
CMD java $JAVA_OPTS -jar /app/app.jar 