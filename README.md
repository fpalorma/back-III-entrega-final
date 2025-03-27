# Backend III - Proyecto final

## Entrega final

### Clonar e iniciar proyecto:

    Clonar el repositorio
    Instalar dependencias 
    npm i
    Ejecutar la app
    npm run dev
    El servidor se levantará en el puerto 8080

> Recordar agregar el archivo .env compartido en los comentarios de la entrega

### Trabajo realizado:

#### Documentar el módulo Users
Se utilizó Swagger para documentar el módulo requerido. Para visualizar la documentación visitar el endpoint http://localhost:8080/apidocs/

#### Realizar test funcional para rutas de adoption.router.js
Utilicé Mocha y Chai para realizar el test funcional para esta ruta.
Se puede ejectuar el test con el comando:

    npm run test

#### Dockerizar la app y subir la imagen a Dock Hub

Realicé la dockerización de la app, creando su imagen para luego subirla a la nube. Se puede descargar usando el siguiente link:
[Link a la imagen](https://hub.docker.com/repository/docker/fedepalorma/entrega-final/general)
