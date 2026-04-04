# Quiz Generator Front

Plataforma web de evaluaciones en linea construida con Next.js 16. Permite a postulantes completar evaluaciones asignadas y a administradores gestionar evaluaciones, examenes, postulantes y revisiones.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **React**: 19
- **Styling**: Tailwind CSS 4
- **Linting/Formatting**: Biome 2
- **PDF**: jsPDF
- **Markdown**: react-markdown
- **TypeScript**: 5 (strict mode)

## Requisitos

- Node.js >= 18
- npm >= 9

## Instalacion

```bash
npm install
```

## Scripts

| Comando          | Descripcion                           |
| ---------------- | ------------------------------------- |
| `npm run dev`    | Servidor de desarrollo con Turbopack  |
| `npm run build`  | Build de produccion con Turbopack     |
| `npm start`      | Servidor de produccion                |
| `npm run lint`   | Verificar codigo con Biome            |
| `npm run fmt`    | Formatear codigo con Biome            |

## Variables de entorno

| Variable                    | Descripcion               | Default                  |
| --------------------------- | ------------------------- | ------------------------ |
| `NEXT_PUBLIC_API_BASE_URL`  | URL base del API backend  | `http://localhost:8008`  |

## Estructura del proyecto

```
src/
├── app/                            # Pages (App Router)
│   ├── page.tsx                    # Landing page
│   ├── login/                      # Login postulante
│   ├── evaluacion/                 # Lista de evaluaciones del postulante
│   │   └── [respuestaId]/         # Vista de evaluacion activa
│   └── admin/
│       ├── login/                  # Login administrador
│       └── dashboard/              # Panel de administracion
│           ├── evaluacion/         # Gestion de evaluaciones
│           ├── examen/             # Gestion de examenes
│           ├── postulante/         # Gestion de postulantes
│           └── revision/           # Revision de respuestas
│               └── [revisionId]/[postulanteId]/
├── components/
│   ├── QuestionCard.tsx            # Renderiza una pregunta individual
│   ├── ExamSection.tsx             # Renderiza una seccion de examen
│   └── admin/
│       ├── Revision.tsx            # Componente de revision
│       └── ResultadoDelExamen.tsx  # Selector de resultado
├── hooks/
│   ├── useLogin.ts                 # Autenticacion postulante
│   ├── usePostulante.ts            # Datos del postulante
│   ├── useListaEvaluaciones.ts     # Lista de evaluaciones
│   ├── useRespuestaEvaluacion.ts   # Estado de evaluacion activa
│   └── admin/
│       ├── useAdminLogin.ts        # Autenticacion admin
│       ├── useRevision.ts          # Datos de revision
│       └── usePostulante.ts        # CRUD de postulantes
├── config/
│   └── api.ts                      # BASE_URL y manejo de 401
├── types/
│   └── evaluacion.ts               # Interfaces TypeScript
└── utils/
    └── pdfReportGenerator.ts       # Generacion de reportes PDF
```

## Tema y personalizacion

Todos los colores de la aplicacion se configuran en un solo lugar: `src/app/globals.css` dentro de `:root`.

```css
:root {
  --primary: #1677ff;        /* Botones, links, estados activos */
  --primary-dark: #0958d9;   /* Hover de botones */
  --primary-light: #e6f4ff;  /* Fondos de seleccion */

  --success: #52c41a;        /* Completado, confirmado */
  --warning: #faad14;        /* En progreso, precaucion */
  --danger: #ff4d4f;         /* Errores, acciones destructivas */

  --sidebar-bg: #001529;     /* Fondo del sidebar */
  /* ... mas variables disponibles */
}
```

Para cambiar el tema, modifica los valores hex en `:root`. Todos los componentes referencian estas variables.

## Flujos principales

### Postulante

1. Login en `/login` con DNI y contrasena
2. Ve lista de evaluaciones asignadas en `/evaluacion`
3. Inicia o continua una evaluacion en `/evaluacion/[respuestaId]`
4. Las respuestas se guardan automaticamente al seleccionar
5. Finaliza la evaluacion con el boton "Finalizar Evaluacion"

### Administrador

1. Login en `/admin/login`
2. Dashboard con navegacion lateral:
   - **Evaluacion**: metricas y actividad reciente
   - **Examen**: lista de examenes
   - **Postulante**: CRUD de postulantes
   - **Revision**: revisar respuestas, agregar observaciones, generar PDF

## Autenticacion

- El login del postulante retorna un JWT que se almacena en `localStorage`
- El ID del postulante se extrae del campo `sub` del JWT
- Si el token expira (respuesta 401), se redirige automaticamente a `/login`

## API Endpoints

| Metodo  | Endpoint                                    | Descripcion                    |
| ------- | ------------------------------------------- | ------------------------------ |
| POST    | `/login/postulante`                         | Login de postulante            |
| GET     | `/postulantes?id={id}`                      | Datos del postulante           |
| GET     | `/respuestas?postulante_id={id}`            | Lista de evaluaciones          |
| GET     | `/respuestas/{respuestaId}`                 | Detalle de evaluacion          |
| PATCH   | `/respuestas/{respuestaId}`                 | Actualizar respuesta           |
| PATCH   | `/respuestas/{respuestaId}/estado`          | Cambiar estado de evaluacion   |
| PATCH   | `/respuesta/{respuestaId}/finalizar`        | Finalizar evaluacion           |
| PATCH   | `/revision`                                 | Enviar revision                |
