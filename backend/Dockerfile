FROM eclipse-temurin:17-jdk-noble AS build
WORKDIR /app
COPY mvnw pom.xml ./
COPY .mvn .mvn
RUN chmod +x mvnw
COPY src src
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:17-jre-noble
WORKDIR /app
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar target/backend-0.0.1-SNAPSHOT.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "target/backend-0.0.1-SNAPSHOT.jar"]
