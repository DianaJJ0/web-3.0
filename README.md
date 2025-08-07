# 🚀 ServiTech Web 2.0

Plataforma web para conectar usuarios con expertos en tecnología: agenda asesorías, paga seguro, chatea, administra usuarios y expertos, y gestiona todo desde un panel moderno y responsivo.

---

## � Estructura del Proyecto

```
servitech-1 2.0/
├── backend/
│   ├── app.js                # Servidor Express principal
│   ├── inicializar.js        # Script para datos iniciales
│   ├── config/
│   │   └── database.js       # Configuración de conexión a MongoDB
│   ├── controllers/          # (vacío, preparado para lógica de control)
│   ├── models/
│   │   ├── asesoria.js
│   │   ├── categorias.js
│   │   ├── mensajeria.js
│   │   ├── models.js
│   │   ├── notificacion.js
│   │   ├── reseña.js
│   │   └── usuario.js
│   ├── routes/
│   │   ├── categorias.js
│   │   ├── expertos.js
│   │   ├── registro-experto.js
│   │   └── usuarios.js
│   ├── scripts/
│   │   └── usuarios-tools.js
│   ├── services/
│   │   ├── email.service.js
│   │   └── test-email.js
│   ├── package.json
│   └── .env (no incluido)
├── views/
│   ├── admin/
│   │   ├── admin-categorias.ejs
│   │   ├── admin-configuracion.ejs
│   │   ├── admin-expertos.ejs
│   │   ├── admin-mensajes.ejs
│   │   ├── admin-publicaciones.ejs
│   │   ├── admin-usuarios.ejs
│   │   └── admin.ejs
│   ├── assets/
│   │   ├── css/ (ver listado abajo)
│   │   ├── img/ (logo, gifs, etc)
│   │   └── js/ (ver listado abajo)
│   ├── componentes/
│   │   ├── footer.ejs
│   │   ├── header.ejs
│   │   └── navbar-admin.ejs
│   ├── calendario.ejs
│   ├── confirmacion-asesoria.ejs
│   ├── contacto.ejs
│   ├── editar-perfil-experto.ejs
│   ├── expertos.ejs
│   ├── index.ejs
│   ├── login.ejs
│   ├── mensajes.ejs
│   ├── mis-asesorias.ejs
│   ├── pasarela-pagos.ejs
│   ├── perfil-experto.ejs
│   ├── perfil.ejs
│   ├── privacidad.ejs
│   ├── recuperar-password.ejs
│   ├── registro-experto.ejs
│   ├── registro.ejs
│   └── terminos.ejs
└── README.md
```

---

## �️ Backend (Node.js + Express + MongoDB)

- **Servidor:** `app.js` (Express)
- **Modelos:** Mongoose (`models/`)
- **Rutas API:**
  - `/api/usuarios` (usuarios.js)
  - `/api/categorias` (categorias.js)
  - `/api/expertos` (expertos.js)
  - `/registro-experto` (registro-experto.js)
- **Servicios:** Email (`services/email.service.js`)
- **Scripts:** Inicialización y utilidades (`inicializar.js`, `usuarios-tools.js`)
- **Sesiones:** express-session, JWT
- **Configuración:** `.env` (MONGODB_URI, JWT_SECRET, SESSION_SECRET, PORT)
- **Dependencias principales:** express, mongoose, ejs, cors, dotenv, bcrypt, jsonwebtoken, nodemailer

### Comandos útiles

```bash
# Instalar dependencias
cd backend
npm install

# Inicializar datos de prueba
node inicializar.js

# Iniciar servidor
node app.js
# O en modo desarrollo (reinicio automático)

```

---

## 🎨 Frontend (EJS + CSS + JS)

- **Vistas principales:**
  - index.ejs, login.ejs, registro.ejs, perfil.ejs, perfil-experto.ejs, editar-perfil-experto.ejs, expertos.ejs, calendario.ejs, mis-asesorias.ejs, mensajes.ejs, pasarela-pagos.ejs, confirmacion-asesoria.ejs, contacto.ejs, terminos.ejs, privacidad.ejs, recuperar-password.ejs
- **Panel de administración:**
  - admin.ejs y vistas admin-\* (usuarios, expertos, mensajes, publicaciones, categorías, configuración)
- **Componentes reutilizables:**
  - header.ejs, footer.ejs, navbar-admin.ejs
- **Assets:**
  - **CSS:**
    - admin-categoria.css, admin-components.css, admin-configuracion.css, Admin-expertos.css, admin-mensajes.css, admin-publicaciones.css, admin-responsive.css, admin-usuarios.css, admin.css, administrador.css, auth.css, base.css, calendario.css, componentes.css, confirmacion-asesoria.css, contacto.css, expertos.css, feed.css, landing-page.css, legal.css, mensajes.css, mis-asesorias.css, pasarela-pagos.css, perfil.css, recuperar-password.css, registro.css, terminos.css
  - **JS:**
    - admin/\* (scripts admin), auth.js, calendario.js, common.js, confirmacion-asesoria.js, contacto.js, expertos.js, feed.js, index.js, legal.js, login.js, mensajes.js, mis asesorias.js, mis-asesorias.js, mobile-menu.js, pasarela-pagos.js, perfil.js, recuperar-password.js, registro-experto.js, registro.js, test-auth.js
  - **IMG:**
    - logo.png, circulo.gif, cuadro-animado.gif, lineas-animadas.gif

---

## 🚩 Cambios y Mejoras Recientes

- Rediseño moderno y responsivo de la vista de perfil de experto (`perfil-experto.ejs`)
- Nuevo flujo de edición de perfil de experto (`editar-perfil-experto.ejs`), formulario prellenado
- Navegación fluida entre perfil y edición
- Panel de administración completo y modular
- Refactorización de rutas, middlewares y assets
- Documentación y estructura de carpetas actualizada
- Proyecto subido y sincronizado en GitHub: [web-3.0](https://github.com/DianaJJ0/web-3.0)

---

## 🌐 Acceso y Navegación

Abre tu navegador y visita:

- http://localhost:3001/ (Landing page)
- http://localhost:3001/perfil-experto (Perfil de experto)
- http://localhost:3001/editar-perfil-experto (Editar perfil de experto)
- http://localhost:3001/admin/admin.html (Panel de administración)

---

## � Endpoints y Rutas Principales

- `POST /api/usuarios/login` — Inicio de sesión
- `POST /api/usuarios` — Registro de usuario
- `GET /api/categorias` — Listado de categorías
- `GET /api/expertos` — Listado de expertos
- `POST /api/pse/crear-transaccion` — Iniciar pago
- `GET /api/mensajeria/conversaciones` — Conversaciones usuario
- `GET /perfil-experto` — Vista de perfil de experto (EJS)
- `GET /editar-perfil-experto` — Formulario de edición de perfil (EJS)

---

## ❓ Preguntas Frecuentes

**¿Por qué me sale error con `npm install`?**
Asegúrate de estar en la carpeta `backend` y que exista el archivo `package.json`.

**¿Cómo cambio el puerto?**
Edita la variable `PORT` en el archivo `.env`.

**¿Cómo inicializo datos de prueba?**
Ejecuta `node inicializar.js` en la carpeta `backend`.

**¿Cómo accedo al sistema?**
Abre tu navegador y visita `http://localhost:3001/`.

**¿Cómo uso nodemon para desarrollo?**
Instala nodemon con `npm install -g nodemon` y ejecuta `nodemon backend/app.js` para reinicio automático del servidor al hacer cambios.

---

## 🧑‍💻 Autor

**Diana Carolina Jiménez**
GitHub: [@DianaJJ0](https://github.com/DianaJJ0)

---

## 🏆 Estado Actual

- Backend y frontend operativos
- Mensajería y pagos integrados
- Panel de administración funcional
- Estructura lista para escalar y agregar nuevas funcionalidades

---

# Repositorio actualizado: https://github.com/DianaJJ0/web-3.0

- `GET /api/categorias` — Listado de categorías
