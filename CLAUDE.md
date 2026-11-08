# CLAUDE.md

## Proyecto

Plataforma de solicitudes barriales para GESCOM (Municipalidad de Peñalolén).

- **Frontend:** React + Vite + Leaflet, en `prototipo_ing_software/frontend`.
- **Backend:** Express 5 + Mongoose, en `prototipo_ing_software/backend`, con sesiones mediante express-session.

## Trabajo de Sebastián

- Conectar el formulario de solicitudes al backend.
- Mostrar solicitudes reales en `MyRequests` y en el mapa.

## No modificar

- Autenticación: `authController`, `authService`, `authRoutes`, `AuthContext`, `AuthForm`.
- Modelo `User`.
- Archivos `.env`.

## Roles

`user.role` es `"GESCOM"` o el nombre de un área (`"Tránsito"`, `"Espacios Públicos"`, etc.).

## Llamadas a la API

- Todo POST desde el frontend debe enviar los headers `Content-Type: application/json` y `X-Requested-With: muni-web` (los exige `app.js`).
- Seguir el estilo de `api/authApi.js`.

## Forma de trabajar

- Textos de la interfaz en español.
- Cambios pequeños y explicados.
- No instalar dependencias sin preguntar.
