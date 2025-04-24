# PROYECTO NESTJS

## Descripción

Eres parte de un equipo que gestiona una plataforma de logística inteligente. Cada contenedor  
(físico) en el mundo envía periódicamente su estado ("operativo", "dañado", "desconocido", etc.) a  
tu sistema.

## Tecnologías Utilizadas

- **NestJS**: Framework para Node.js que permite construir aplicaciones eficientes y escalables del lado del servidor.
- **Docker**: Para contenerización y despliegue de servicios.
- **RabbitMQ**: Broker de mensajería para la gestión de eventos y procesos asincrónicos.
- **Mongoose**: ODM para MongoDB, permite interactuar fácilmente con la base de datos.
- **Principios SOLID**: Arquitectura limpia, desacoplada y mantenible.

---

## API REST

### 1. Registrar un nuevo evento del contenedor

**POST** `/events`

Registra un nuevo evento reportado por un contenedor.

#### CURL

```bash
curl --location 'http://localhost:3000/events' \
--header 'Content-Type: application/json' \
--data '{
    "containerId": "ABC123",
    "state": "operational",
    "timestamp": "2025-04-10T13:00:00Z",
    "source": "sensor_main"
}'
```

#### Request Body

| Campo        | Tipo      | Descripción                                 |
|--------------|-----------|---------------------------------------------|
| containerId  | `string`  | Identificador del contenedor                |
| state        | `string`  | Estado del contenedor (`operational`, etc.) |
| timestamp    | `string`  | Fecha y hora del evento en formato ISO      |
| source       | `string`  | Fuente del evento (sensor, sistema, etc.)   |

---

### 2. Obtener estado confiable del contenedor

**GET** `/container/{id}/status`

Devuelve el estado más confiable del contenedor con base a los eventos registrados.

#### CURL

```bash
curl --location --request GET 'http://localhost:3000/container/6807f9a02f668551f6b20cbe/status' \
--header 'Content-Type: application/json'
```

---

### 3. Listar contenedores con paginación

**GET** `/container?page=1&limit=9`

Devuelve una lista de contenedores paginada con metainformación como total, página actual, siguiente página, etc.

#### CURL

```bash
curl --location --request GET 'http://localhost:3000/container?page=1&limit=9' \
--header 'Content-Type: application/json'
```

---

## Estructura del Proyecto

El proyecto sigue una arquitectura basada en los principios **SOLID**, con una estructura separada por módulos (eventos, contenedores, rabbitt), servicios con interfaces inyectadas y controladores ligeros. Esto permite mantener un código escalable, desacoplado y fácil de testear.

---

## Cómo ejecutar el servidor

instalar dependencias del package.json

```bash
npm install
```

Para levantar los servicios de MongoDB y RabbitMQ:

```bash
docker-compose up -d
```

Levantar el servidor

```bash
npm run start:dev
```

## Cómo ejecutar las pruebas

ejecutar:

```bash
npm run test -- --coverage
```