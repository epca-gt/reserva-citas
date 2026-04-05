import { useState } from 'react'
import { supabase } from '../lib/supabase'
import Head from 'next/head'

// ============================================
// PERSONALIZA AQUI PARA CADA RESTAURANTE
// ============================================
const RESTAURANTE = {
  nombre: 'Restaurante El Fogón',
  descripcion: 'Cocina tradicional guatemalteca',
  color: '#1a7a5e',
  horarios: ['12:00','12:30','13:00','13:30','14:00','19:00','19:30','20:00','20:30','21:00'],
  telefono: '+502 0000 0000',
}
// ============================================

export default function Reservar() {
  const [form, setForm] = useState({
    nombre: '', telefono: '', fecha: '', hora: '', personas: '', ocasion: '', notas: ''
  })
  const [estado, setEstado] = useState('form') // form | loading | success | error
  const [error, setError] = useState('')

  const hoy = new Date().toISOString().split('T')[0]

  function setField(k, v) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function enviar() {
    const { nombre, telefono, fecha, hora, personas } = form
    if (!nombre || !telefono || !fecha || !hora || !personas) {
      setError('Por favor completa todos los campos obligatorios.')
      return
    }
    setError('')
    setEstado('loading')

    const { error: dbError } = await supabase.from('reservas').insert([{
      restaurante: RESTAURANTE.nombre,
      nombre,
      telefono,
      fecha,
      hora,
      personas,
      ocasion: form.ocasion || null,
      notas: form.notas || null,
      estado: 'pendiente',
      created_at: new Date().toISOString(),
    }])

    if (dbError) {
      console.error(dbError)
      setEstado('error')
    } else {
      setEstado('success')
    }
  }

  const fechaFormateada = form.fecha
    ? new Date(form.fecha + 'T12:00').toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' })
    : ''

  return (
    <>
      <Head>
        <title>Reservar mesa — {RESTAURANTE.nombre}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={{ minHeight: '100vh', background: 'var(--gray-50)' }}>

        {/* Header */}
        <div style={{ background: RESTAURANTE.color, padding: '2rem 1.5rem 3.5rem', textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, marginBottom: 6, letterSpacing: 2, textTransform: 'uppercase' }}>
            {RESTAURANTE.descripcion}
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', color: 'white', fontSize: 28, fontWeight: 400 }}>
            {RESTAURANTE.nombre}
          </h1>
        </div>

        {/* Card */}
        <div style={{ maxWidth: 480, margin: '-2rem auto 2rem', padding: '0 1rem' }}>
          <div style={{ background: 'white', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>

            {estado === 'form' || estado === 'loading' ? (
              <div style={{ padding: '1.75rem 1.5rem' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, marginBottom: 4 }}>
                  Reserva tu mesa
                </h2>
                <p style={{ color: 'var(--gray-400)', fontSize: 13, marginBottom: 1.5 + 'rem' }}>
                  Te confirmaremos por WhatsApp.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <Field label="Nombre completo *">
                    <input value={form.nombre} onChange={e => setField('nombre', e.target.value)} placeholder="Ej: María García" />
                  </Field>

                  <Field label="WhatsApp *">
                    <input value={form.telefono} onChange={e => setField('telefono', e.target.value)} placeholder={RESTAURANTE.telefono} type="tel" />
                  </Field>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <Field label="Fecha *">
                      <input type="date" min={hoy} value={form.fecha} onChange={e => setField('fecha', e.target.value)} />
                    </Field>
                    <Field label="Hora *">
                      <select value={form.hora} onChange={e => setField('hora', e.target.value)}>
                        <option value="">Elegir</option>
                        {RESTAURANTE.horarios.map(h => <option key={h}>{h}</option>)}
                      </select>
                    </Field>
                  </div>

                  <Field label="Número de personas *">
                    <select value={form.personas} onChange={e => setField('personas', e.target.value)}>
                      <option value="">Elegir</option>
                      {['1','2','3','4','5','6','7','8','9','10+'].map(n => (
                        <option key={n}>{n} {n === '1' ? 'persona' : 'personas'}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Ocasión especial">
                    <select value={form.ocasion} onChange={e => setField('ocasion', e.target.value)}>
                      <option value="">Ninguna</option>
                      <option>Cumpleaños</option>
                      <option>Aniversario</option>
                      <option>Reunión de negocios</option>
                      <option>Graduación</option>
                      <option>Otra</option>
                    </select>
                  </Field>

                  <Field label="Notas adicionales">
                    <textarea
                      value={form.notas}
                      onChange={e => setField('notas', e.target.value)}
                      placeholder="Alergias, preferencias de mesa, etc."
                      rows={3}
                      style={{ resize: 'vertical' }}
                    />
                  </Field>

                  {error && (
                    <p style={{ color: 'var(--red)', fontSize: 13, background: '#fff5f5', padding: '10px 14px', borderRadius: 8 }}>
                      {error}
                    </p>
                  )}

                  <button
                    onClick={enviar}
                    disabled={estado === 'loading'}
                    style={{
                      background: estado === 'loading' ? 'var(--gray-200)' : RESTAURANTE.color,
                      color: estado === 'loading' ? 'var(--gray-400)' : 'white',
                      border: 'none',
                      borderRadius: 8,
                      padding: '13px',
                      fontSize: 15,
                      fontWeight: 500,
                      transition: 'background 0.15s',
                      marginTop: 4,
                    }}
                  >
                    {estado === 'loading' ? 'Enviando...' : 'Confirmar reserva →'}
                  </button>
                </div>
              </div>
            ) : estado === 'success' ? (
              <div style={{ padding: '2.5rem 1.5rem', textAlign: 'center' }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: 'var(--green-light)', color: RESTAURANTE.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 28, margin: '0 auto 1.25rem'
                }}>✓</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 8 }}>
                  ¡Reserva recibida!
                </h2>
                <p style={{ color: 'var(--gray-600)', fontSize: 14, marginBottom: '1.5rem' }}>
                  Te confirmaremos por WhatsApp al {form.telefono} en los próximos minutos.
                </p>

                <div style={{ background: 'var(--gray-50)', borderRadius: 10, padding: '1rem', textAlign: 'left', marginBottom: '1.5rem' }}>
                  {[
                    ['Nombre', form.nombre],
                    ['Fecha', fechaFormateada],
                    ['Hora', form.hora],
                    ['Personas', form.personas],
                    form.ocasion && ['Ocasión', form.ocasion],
                  ].filter(Boolean).map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--gray-100)', fontSize: 14 }}>
                      <span style={{ color: 'var(--gray-400)' }}>{k}</span>
                      <span style={{ fontWeight: 500 }}>{v}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => { setEstado('form'); setForm({ nombre:'',telefono:'',fecha:'',hora:'',personas:'',ocasion:'',notas:'' }) }}
                  style={{ background: 'none', border: '1.5px solid var(--gray-200)', borderRadius: 8, padding: '10px 20px', fontSize: 14, color: 'var(--gray-600)' }}
                >
                  Hacer otra reserva
                </button>
              </div>
            ) : (
              <div style={{ padding: '2.5rem 1.5rem', textAlign: 'center' }}>
                <p style={{ fontSize: 40, marginBottom: 12 }}>⚠️</p>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, marginBottom: 8 }}>
                  Algo salió mal
                </h2>
                <p style={{ color: 'var(--gray-600)', fontSize: 14, marginBottom: '1.5rem' }}>
                  No se pudo guardar tu reserva. Por favor intenta de nuevo.
                </p>
                <button
                  onClick={() => setEstado('form')}
                  style={{ background: RESTAURANTE.color, color: 'white', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 14 }}
                >
                  Intentar de nuevo
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, color: 'var(--gray-600)', fontWeight: 500, marginBottom: 6 }}>
        {label}
      </label>
      {children}
    </div>
  )
}
