# ControlPOS - Backend API

API RESTful para el sistema de Punto de Venta **ControlPOS**. Construida sobre **Node.js** y **Express**, interactuando con **PostgreSQL**.

El backend sigue una arquitectura en capas (N-Tier) para asegurar la escalabilidad, testabilidad y separación de responsabilidades.

## Arquitectura del Proyecto

El flujo de datos sigue estrictamente el patrón: `Ruta` -> `Controlador` -> `Servicio` -> `Repositorio`.

src/
├── app.js           # Configuración de Express y Middlewares globales
├── config/          # Conexión a Base de Datos (PostgreSQL Pool)
├── controllers/     # Capa de Transporte (Manejo de HTTP req/res)
├── services/        # Lógica de Negocio (Validaciones, Cálculos, Reglas)
├── repositories/    # Acceso a Datos (Consultas SQL puras)
├── routes/          # Definición de Endpoints
├── middlewares/     # Seguridad (Auth, ErrorHandler)
└── utils/           # Herramientas (JWT, Nodemailer)

## Tecnologías
- Runtime: Node.js
- Framework: Express.js
- Base de Datos: PostgreSQL
- Driver DB: pg (node-postgres)
- Seguridad: bcryptjs (Hashing), jsonwebtoken (Auth), cors.
- Emails: nodemailer.