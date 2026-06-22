# 📱 Registro Celular — Página + Panel de administración

Página web cinematográfica (glassmorphism) para tu servicio de apoyo en el
**Registro Celular Obligatorio**, con un **contador regresivo configurable**,
**botón de ubicación a Google Maps**, **generador de código QR** y un
**panel de administración protegido con contraseña** para editar todo sin tocar
código.

Construido con **Next.js 15 + Supabase + Tailwind CSS**, listo para desplegar
en **Vercel**.

---

## ✨ Lo que puedes configurar desde el panel

- Título principal, subtítulo y mensaje de bienvenida
- Fecha, hora **y zona horaria** del contador regresivo
- Dirección + enlace de Google Maps (botón "Cómo llegar")
- Horarios de atención
- Texto del aviso de aportación voluntaria
- Código QR descargable para imprimir en tus carteles

> El registro siempre se realiza en el **teléfono de la persona**, ante su
> compañía. La página deja esto claro y **no almacena datos de nadie**.

---

## 🧰 Requisitos previos

- **Node.js 18.18 o superior** (recomendado 20+). Descárgalo en https://nodejs.org
- Una cuenta gratuita de **Supabase** → https://supabase.com
- Una cuenta de **Vercel** (gratis) para publicar → https://vercel.com
- **VS Code** (o tu editor favorito)

---

## 🚀 Puesta en marcha (paso a paso)

### 1) Crea el proyecto en Supabase

1. Entra a https://supabase.com → **New project**. Ponle nombre y una
   contraseña de base de datos (guárdala).
2. Cuando termine de crearse, ve a **SQL Editor** (menú izquierdo) →
   **New query**.
3. Abre el archivo **`supabase/schema.sql`** de este proyecto, copia **todo**
   su contenido, pégalo en el editor y dale **Run**. Esto crea la tabla de
   configuración y sus reglas de seguridad.
4. Crea tu **usuario administrador**: ve a **Authentication → Users →
   Add user**. Escribe tu correo y contraseña y **marca la casilla
   "Auto Confirm User"**. Ese será tu acceso al panel.

### 2) Consigue tus llaves de API

En Supabase ve a **Project Settings → API** y copia:

- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **Project API keys → `anon` `public`** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3) Configura el proyecto en tu computadora

1. Descomprime el proyecto y ábrelo en **VS Code**.
2. Crea tu archivo de variables copiando el ejemplo:

   ```bash
   cp .env.local.example .env.local
   ```

3. Abre **`.env.local`** y pega tus valores:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-public-key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. Instala dependencias y arranca:

   ```bash
   npm install
   npm run dev
   ```

5. Abre **http://localhost:3000** → verás la página.
   El panel está en **http://localhost:3000/login**.

### 4) Configura tu página desde el panel

1. Entra a `/login` con el correo y contraseña que creaste en Supabase.
2. Ajusta el título, el contador (fecha + hora + zona horaria), tu dirección,
   horarios y el aviso de aportación.
3. Pega tu **enlace de Google Maps** (ver abajo) y guarda.
4. Descarga tu **código QR** y úsalo en tus carteles impresos.

#### 📍 Cómo obtener tu enlace de Google Maps

1. Abre **Google Maps** y busca tu dirección (o muévete hasta el punto exacto).
2. Toca **Compartir** → **Copiar vínculo**.
3. Pega ese vínculo en el campo *"Enlace de Google Maps"* del panel.

Si lo dejas vacío, el botón buscará automáticamente por el **texto** de la
dirección que escribiste.

---

## ☁️ Publicar en Vercel (producción)

1. Sube el proyecto a un repositorio en **GitHub**.
2. Entra a https://vercel.com → **Add New… → Project** → importa tu repo.
3. En **Environment Variables** agrega las mismas tres variables de tu
   `.env.local` (usa la URL real de tu dominio en `NEXT_PUBLIC_SITE_URL`,
   ej. `https://tu-dominio.vercel.app`).
4. **Deploy**. En 1-2 minutos tu página estará en línea.

> Después de publicar, regenera el QR desde el panel apuntando a tu dominio
> real para que la gente llegue a la página correcta.

---

## 🗂️ Estructura del proyecto

```
registro-celular/
├─ supabase/
│  └─ schema.sql            ← Ejecútalo en Supabase (tabla + seguridad)
├─ src/
│  ├─ app/
│  │  ├─ page.tsx           ← Página pública (hero, contador, secciones)
│  │  ├─ login/page.tsx     ← Inicio de sesión del admin
│  │  ├─ dashboard/         ← Panel protegido + acción de guardado
│  │  ├─ layout.tsx         ← Fuentes y fondo cinematográfico
│  │  └─ globals.css        ← Estilos glassmorphism + animaciones
│  ├─ components/
│  │  ├─ Countdown.tsx      ← Contador regresivo (cliente)
│  │  ├─ DashboardForm.tsx  ← Formulario de configuración
│  │  ├─ LoginForm.tsx      ← Formulario de acceso
│  │  └─ QRCodePanel.tsx    ← Generador/descarga de QR
│  └─ lib/
│     ├─ config.ts          ← Lectura de configuración + enlace de mapa
│     ├─ timezones.ts       ← Lista de zonas horarias
│     └─ supabase/          ← Clientes de Supabase (navegador/servidor)
└─ middleware.ts            ← Protege /dashboard
```

---

## ✏️ Personalizaciones rápidas en código

- **Compañías mostradas:** edita el arreglo `OPERATORS` al inicio de
  `src/app/page.tsx`.
- **Beneficios:** ahora se editan **desde el panel** (uno por línea). Ya no
  necesitas tocar código.
- **Requisitos:** son texto fijo dentro de `src/app/page.tsx`, en la tarjeta
  `InfoCard` de "Requisitos". Cámbialos a tu gusto.
- **Imagen del header:** reemplaza el archivo `public/header-bg.jpg` por la tuya
  (mismo nombre). Recomendado: JPG, máx. 1600 px de ancho y bajo peso para que
  cargue rápido en móviles.
- **Colores:** están en `tailwind.config.ts` y en `src/app/globals.css`
  (busca `--font` y los colores `void`, `panel`, `sky-glow`, `ink`).

---

## 🔄 ¿Ya tenías el proyecto desplegado?

Si ya habías creado la base de datos antes de esta versión, corre **una vez** el
archivo `supabase/migration_beneficios.sql` en *Supabase > SQL Editor* para
agregar la columna de Beneficios. (Si es una instalación nueva con `schema.sql`,
ya viene incluida y no necesitas hacer nada.)

---

## 🔒 Nota sobre las compañías

Se muestran los **nombres** de las compañías como texto (no sus logotipos),
para evitar dar a entender una afiliación o autorización oficial con ellas.
Es la opción legalmente más segura para tu servicio.

---

## ❓ Problemas comunes

- **No puedo entrar al panel:** revisa que creaste el usuario en
  *Authentication → Users* con **"Auto Confirm User"** activado.
- **Los cambios no se ven:** la página pública se actualiza al guardar; si usas
  varias pestañas, recárgala.
- **Error de variables al arrancar:** confirma que `.env.local` existe y que las
  llaves no tienen espacios al inicio o final.

---

Hecho con cariño para ayudar a quien más lo necesita. 💙
