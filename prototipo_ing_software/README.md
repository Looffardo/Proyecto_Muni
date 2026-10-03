## Estructura del proyecto

El proyecto se divide en `frontend` y `backend`.

```text
prototipo_capstone/ #Nota de Looff: Como que capstone?!? 0_o
├── backend/
│   └── src/
│       ├── config/        # Configuración y conexión a BD
│       ├── controllers/   # Procesamiento de solicitudes
│       ├── middleware/    # Autenticación y permisos
│       ├── models/        # Modelos de datos
│       ├── routes/        # Endpoints de la API
│       └── services/      # Lógica del sistema
│
└── frontend/
    └── src/
        ├── api/           # Comunicación con el backend
        ├── assets/        # Imágenes, íconos y logos
        ├── components/    # Componentes reutilizables
        ├── context/       # Estados globales, ej. autenticación
        ├── hooks/         # Lógica reutilizable de React
        ├── layouts/       # Estructuras generales de las páginas
        ├── pages/         # Pantallas de la aplicación
        ├── routes/        # Navegación y rutas protegidas
        ├── styles/        # Estilos generales
        └── utils/         # Funciones auxiliares

```
## Cómo ejecutar el proyecto

### 1. Clonar el repositorio

```bash
git clone URL_DEL_REPOSITORIO
cd prototipo_ing_software
```

### 2. Instalar dependencias del backend

```bash
cd prototipo_ing_software
cd backend
npm install
```

### 3. Crear el archivo `.env`

Dentro de la carpeta `backend/`, crear un archivo llamado `.env` y agregar:

```env
MONGODB_URI=URI_DE_MONGODB_ATLAS
```

La URI de MongoDB Atlas será compartida de forma privada con el equipo.

> Importante: el archivo `.env` no debe subirse a GitHub.

### 4. Ejecutar el backend

Dentro de `backend/`:

```bash
npm run dev
```

Si la conexión funciona correctamente, debería aparecer:

```text
MongoDB conectado correctamente
```

### 5. Instalar dependencias del frontend

Abrir otra terminal y ejecutar:

```bash
cd prototipo_ing_software
cd frontend
npm install
```

### 6. Ejecutar el frontend

```bash
npm run dev
```

Vite mostrará una dirección local similar a:

```text
http://localhost:5173
```

Abrir esa dirección en el navegador.

## Requisitos

- Node.js
- npm
- Git
- Acceso autorizado al cluster de MongoDB Atlas

## Importante

El archivo `.gitignore` debe incluir:

```text
.env
node_modules/
```

Esto evita subir credenciales y dependencias innecesarias al repositorio.

# Session Secret

Ejecuten en el terminal una vez:

node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"

el resultado de ese comando lo añaden al .env del backend asi:

SESSION_SECRET=RESULTADO_DEL_COMANDO
PORT=3000
FRONTEND_ORIGIN=http://localhost:5173