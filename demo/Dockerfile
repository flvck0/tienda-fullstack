# 1. Usar una imagen base con Maven y Java 17 para construir la app
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
# Dar permisos de ejecución al instalador de Maven
RUN chmod +x mvnw
# Crear el archivo ejecutable (saltando los tests para ir rápido)
RUN ./mvnw clean package -DskipTests

# 2. Usar una imagen ligera solo con Java para ejecutar la app
FROM eclipse-temurin:17-jre
WORKDIR /app
# Copiar el archivo .jar creado en el paso anterior
COPY --from=build /app/target/*.jar app.jar
# Informar el puerto
EXPOSE 8080
# Comando para iniciar
ENTRYPOINT ["java", "-jar", "app.jar"]