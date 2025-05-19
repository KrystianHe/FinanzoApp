# Etap 1: Budowanie aplikacji
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
COPY start.sh ./start.sh
RUN mvn clean package -DskipTests

# Etap 2: Obraz produkcyjny
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/Wydatki-0.0.1-SNAPSHOT.jar app.jar
COPY --from=builder /app/start.sh ./start.sh
RUN chmod +x ./start.sh
EXPOSE 8080
CMD ["./start.sh"] 