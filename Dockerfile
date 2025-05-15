FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Kopiowanie skompilowanego pliku JAR (zakładamy, że został wcześniej zbudowany)
COPY target/Wydatki-0.0.1-SNAPSHOT.jar app.jar

# Ustawienie punktu startowego
EXPOSE 8080
CMD ["java", "-jar", "app.jar"] 