# Sistema de Reservaciones para Restaurantes

## ¿Qué incluye?
- `/` — Página de reservas para los clientes
- `/admin` — Panel del dueño del restaurante

---

## PASO 1: Configurar Supabase (base de datos)

1. Ve a https://supabase.com y crea una cuenta gratis
2. Crea un proyecto nuevo (elige cualquier nombre y región)
3. Espera ~2 minutos a que termine de crear
4. Ve a **SQL Editor** (menú izquierdo)
5. Pega el contenido del archivo `supabase-setup.sql` y haz clic en **Run**
6. Ve a **Settings > API** y copia:
   - `Project URL` (algo como `https://xxxxx.supabase.co`)
   - `anon public` key (el key largo)

---

## PASO 2: Configurar las variables de entorno

1. Copia el archivo `.env.example` y renómbralo `.env.local`
2. Pega los valores que copiaste de Supabase:

```
NEXT_PUBLIC_SUPABASE_URL=https://TUPROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyTUKEYLARGO...
```

---

## PASO 3: Subir a GitHub

1. Ve a https://github.com y crea un repositorio nuevo (nombre: `reservas-restaurante`)
2. Sube todos estos archivos ahí
   - Asegúrate de NO subir `.env.local` (ya está en `.gitignore`)

---

## PASO 4: Publicar en Vercel (gratis)

1. Ve a https://vercel.com y crea cuenta con tu GitHub
2. Clic en **Add New Project**
3. Selecciona el repositorio `reservas-restaurante`
4. Antes de hacer deploy, ve a **Environment Variables** y agrega:
   - `NEXT_PUBLIC_SUPABASE_URL` = tu URL de Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = tu key de Supabase
5. Clic en **Deploy**
6. En ~1 minuto tendrás tu URL: algo como `reservas-restaurante.vercel.app`

---

## PASO 5: Personalizar para cada restaurante

Abre `pages/index.js` y edita el objeto `RESTAURANTE` al inicio:

```js
const RESTAURANTE = {
  nombre: 'Nombre del Restaurante',
  descripcion: 'Cocina italiana / guatemalteca / etc.',
  color: '#1a7a5e',       // Color principal (hex)
  horarios: ['12:00', '13:00', '20:00', '21:00'],
  telefono: '+502 0000 0000',
}
```

También cambia `RESTAURANTE_NOMBRE` en `pages/admin.js`.

---

## URLs para el cliente

| Página | URL |
|--------|-----|
| Reservas (clientes) | `tu-dominio.vercel.app/` |
| Panel (dueño) | `tu-dominio.vercel.app/admin` |

---

## Para cada cliente nuevo

1. Duplica el proyecto en GitHub
2. Cambia los datos del restaurante en `index.js` y `admin.js`
3. Crea un proyecto nuevo en Vercel con ese repo
4. Agrega las variables de entorno
5. Listo — tienes una URL nueva para ese restaurante

**Tiempo por cliente nuevo: ~30 minutos**

---

## Costos mensuales (tuyos)

| Servicio | Plan | Costo |
|----------|------|-------|
| Supabase | Gratis hasta 50,000 filas | $0 |
| Vercel | Gratis hasta 100 proyectos | $0 |
| **Total** | | **$0/mes** |

Cobras $60-80/mes por cliente. Todo es ganancia.
