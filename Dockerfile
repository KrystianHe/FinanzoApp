FROM maven:3.9.6-eclipse-temurin-17 AS builder

# Cache Maven dependencies
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline

# Build application
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-focal

WORKDIR /app
COPY --from=builder /app/target/Wydatki-0.0.1-SNAPSHOT.jar ./app.jar
COPY start.sh ./start.sh
RUN chmod +x ./start.sh

EXPOSE 8080
CMD ["./start.sh"]
