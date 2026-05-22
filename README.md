# Sistema de Votación — Mascota Facultad de Ingeniería USB Cali

Sistema distribuido de votación implementado con Docker. Permite que los estudiantes voten por la mascota de la facultad usando su código estudiantil, garantizando que cada código vote una sola vez.

---

## Requisitos previos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y corriendo
- Git

---

## Cómo ejecutar

```bash
# 1. Clonar el repositorio
git clone https://github.com/sofimq167/Proyecto-Final-Sistemas-operativos-y-redes
cd "Proyecto final"

# 2. Crear el archivo de variables de entorno
cp .env.example .env

# 3. Levantar los tres servicios
docker-compose up --build
```

Listo. El sistema queda disponible en:

| Página | URL |
|---|---|
| Formulario de votación | http://localhost:8080 |
| Resultados en tiempo real | http://localhost:8080/resultados.html |

Para detener: `Ctrl+C` y luego `docker-compose down`.

> Si se quiere borrar también los votos guardados (el volumen de PostgreSQL):
> `docker-compose down -v`

---

## Arquitectura

```
Navegador
    │
    └── :8080  →  Nginx (frontend)
                      ├── /            → archivos estáticos (HTML, CSS, JS)
                      └── /api/*       → Flask (backend) :5000
                                              └── PostgreSQL (BD) :5432
```

Tres contenedores en la misma red Docker interna. El navegador solo conoce el puerto 8080 — Nginx actúa como reverse proxy hacia el backend.

### Servicios

| Servicio | Imagen | Puerto interno |
|---|---|---|
| frontend | nginx:alpine | 80 |
| backend | Python 3.12 + Flask | 5000 |
| db | postgres:16-alpine | 5432 |

---

## Estructura del proyecto

```
.
├── docker-compose.yml
├── .env.example
├── frontend/
│   ├── index.html          # Formulario de votación
│   ├── resultados.html     # Dashboard de resultados
│   ├── nginx.conf          # Reverse proxy hacia el backend
│   ├── css/estilos.css
│   └── js/
│       ├── votar.js        # POST /api/votar
│       └── resultados.js   # GET /api/resultados (auto-refresca cada 5s)
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── app.py              # Punto de entrada Flask
│   ├── database.py         # Conexión a PostgreSQL
│   └── routes/
│       ├── votar.py        # Endpoint POST /votar
│       └── resultados.py   # Endpoint GET /resultados
└── db/
    └── init.sql            # Crea tablas e inserta los 3 candidatos
```

---

## Endpoints de la API

### `POST /api/votar`
Registra un voto. Si el código ya votó, la base de datos lo rechaza.

**Body:**
```json
{ "codigo": "2210123", "candidato_id": 1 }
```

**Respuesta exitosa:**
```json
{ "exito": true, "mensaje": "¡Voto registrado!" }
```

**Si el código ya votó (409):**
```json
{ "exito": false, "mensaje": "Este código ya emitió su voto" }
```

### `GET /api/resultados`
Devuelve el conteo de votos por candidato.

```json
[
  { "id": 1, "candidato": "Pavo Real", "votos": 5 },
  { "id": 2, "candidato": "Pato",      "votos": 3 },
  { "id": 3, "candidato": "Ganso",     "votos": 2 }
]
```

---

## Conceptos de SO y Redes aplicados

- **Contenedores (namespaces + cgroups):** cada servicio corre en su propio entorno aislado con recursos controlados por el kernel de Linux.
- **Red virtual Docker:** los contenedores se comunican por nombre (`backend`, `db`) sin exponer puertos innecesarios al host.
- **Reverse proxy (Nginx):** un solo punto de entrada en el puerto 8080; el backend queda detrás.
- **Variables de entorno:** los secretos (contraseñas, nombres de BD) no están hardcodeados — los inyecta Docker al levantar los contenedores.
- **Healthcheck:** Docker espera a que PostgreSQL acepte conexiones antes de arrancar Flask, evitando errores de conexión al inicio.
- **Volumen nombrado:** los datos de PostgreSQL persisten aunque el contenedor se reinicie.
