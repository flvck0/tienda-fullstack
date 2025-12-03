# 1. Usar una imagen base con Maven y Java 21 para construir la app
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
# Dar permisos de ejecución al instalador de Maven
RUN chmod +x mvnw
# Crear el archivo ejecutable
RUN ./mvnw clean package -DskipTests

# 2. Usar una imagen ligera con Java 21 para ejecutar la app
FROM eclipse-temurin:21-jre
WORKDIR /app
# Copiar el archivo .jar creado en el paso anterior
COPY --from=build /app/target/*.jar app.jar
# Informar el puerto
EXPOSE 8080
# Comando para iniciar
ENTRYPOINT ["java", "-jar", "app.jar"]