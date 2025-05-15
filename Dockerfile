FROM maven:3.8.4-openjdk-17 AS build

WORKDIR /app

COPY pom.xml .
COPY src ./src

# Update application properties to use direct values instead of environment variables
RUN mkdir -p ./src/main/resources
RUN echo "spring.application.name=Wydatki\n\
server.port=8080\n\
spring.jackson.serialization.indent-output=true\n\
\n\
# Konfiguracja SendGrid\n\
sendgrid.api-key=SG.direct-placeholder-value\n\
sendgrid.from.email=test@example.com\n\
sendgrid.from.name=Wydatki App\n\
\n\
# Konfiguracja JWT\n\
security.jwt.secret=your-secret-key-here-must-be-at-least-32-characters-long\n\
security.jwt.expiration=86400000\n\
\n\
# Konfiguracja bazy danych\n\
spring.datasource.url=jdbc:postgresql://localhost:5432/wydatki\n\
spring.datasource.username=postgres\n\
spring.datasource.password=postgres\n\
spring.datasource.driver-class-name=org.postgresql.Driver\n\
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect\n\
spring.jpa.hibernate.ddl-auto=update\n\
\n\
# Konfiguracja logowania SQL\n\
spring.jpa.show-sql=true\n\
" > ./src/main/resources/application-docker.properties

RUN mvn clean package -DskipTests

FROM openjdk:17-slim

WORKDIR /app

COPY --from=build /app/target/Wydatki-0.0.1-SNAPSHOT.jar app.jar

# Tell Spring to use our docker profile with direct values
ENV SPRING_PROFILES_ACTIVE=docker

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]