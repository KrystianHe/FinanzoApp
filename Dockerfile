FROM eclipse-temurin:17-jdk-jammy as build

WORKDIR /app

# copy pom.xml and download dependencies first (for better caching)
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline -B

# build phase
COPY . .
# Używam -B dla trybu 'batch' i --no-transfer-progress aby zmniejszyć ilość logów
RUN ./mvnw clean package -B --no-transfer-progress -DskipTests

# runtime phase
FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

COPY --from=build /app/target/Wydatki-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"] 