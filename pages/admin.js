import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Head from 'next/head'

const RESTAURANTE_NOMBRE = 'Restaurante El Fogón'

const ESTADOS = {
  pendiente: { label: 'Pendiente', bg: '#fef3c7', color: '#92400e' },
  confirmada: { label: 'Confirmada', bg: '#d1fae5', color: '#065f46' },
  cancelada: { label: 'Cancelada', bg: '#fee2e2', color: '#991b1b' },
}

export default function Admin() {
  const [reservas, setReservas] = useState([])
  const [filtro, setFiltro] = useState('todas')
  const [cargando, setCargando] = useState(true)
  const [fechaFiltro, setFechaFiltro] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => { cargar() }, [fechaFiltro])

  async function cargar() {
    setCargando(true)
    const { data, error } = await supabase
      .from('reservas')
      .select('*')
      .eq('restaurante', RESTAURANTE_NOMBRE)
      .eq('fecha', fechaFiltro)
      .order('hora', { ascending: true })

    if (!error) setReservas(data || [])
    setCargando(false)
  }

  async function cambiarEstado(id, nuevoEstado) {
    await supabase.from('reservas').update({ estado: nuevoEstado }).eq('id', id)
    setReservas(rs => rs.map(r => r.id === id ? { ...r, estado: nuevoEstado } : r))
  }

  const filtradas = filtro === 'todas' ? reservas : reservas.filter(r => r.estado === filtro)
  const pendientes = reservas.filter(r => r.estado === 'pendiente').length
  const confirmadas = reservas.filter(r => r.estado === 'confirmada').length
  const personas = reservas.filter(r => r.estado !== 'cancelada').reduce((sum, r) => {
    const n = parseInt(r.personas)
    return sum + (isNaN(n) ? 0 : n)
  }, 0)

  const fechaDisplay = new Date(fechaFiltro + 'T12:00').toLocaleDateString('es', {
    weekday: 'long', day: 'numeric', month: 'long'
  })

  return (
    <>
      <Head>
        <title>Panel — {RESTAURANTE_NOMBRE}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={{ minHeight: '100vh', background: 'var(--gray-50)' }}>
        {/* Header */}
        <div style={{ background: '#1a7a5e', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Panel</p>
            <h1 style={{ fontFamily: 'var(--font-display)', color: 'white', fontSize: 20, fontWeight: 400 }}>{RESTAURANTE_NOMBRE}</h1>
          </div>
          <button onClick={cargar} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, padding: '8px 14px', color: 'white', fontSize: 13 }}>
            ↻ Actualizar
          </button>
        </div>

        <div style={{ maxWidth: 600, margin: '0 auto', padding: '1.25rem 1rem' }}>

          {/* Fecha selector */}
          <div style={{ background: 'white', borderRadius: 'var(--radius)', padding: '1rem 1.25rem', marginBottom: 12, boxShadow: 'var(--shadow)' }}>
            <label style={{ fontSize: 12, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 6 }}>
              Mostrando reservas para
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <input type="date" value={fechaFiltro} onChange={e => setFechaFiltro(e.target.value)} style={{ flex: 1 }} />
              <span style={{ fontSize: 14, color: 'var(--gray-600)', whiteSpace: 'nowrap' }}>{fechaDisplay}</span>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 12 }}>
            {[
              { label: 'Pendientes', value: pendientes, bg: '#fef3c7', color: '#92400e' },
              { label: 'Confirmadas', value: confirmadas, bg: '#d1fae5', color: '#065f46' },
              { label: 'Personas', value: personas, bg: '#e0f2fe', color: '#075985' },
            ].map(s => (
              <div key={s.label} style={{ background: s.bg, borderRadius: 10, padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 600, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, color: s.color, opacity: 0.8, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Filtros */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            {['todas','pendiente','confirmada','cancelada'].map(f => (
              <button
                key={f}
                onClick={() => setFiltro(f)}
                style={{
                  padding: '6px 14px', borderRadius: 99, fontSize: 13, border: 'none',
                  background: filtro === f ? '#1a7a5e' : 'white',
                  color: filtro === f ? 'white' : 'var(--gray-600)',
                  fontWeight: filtro === f ? 500 : 400,
                  boxShadow: 'var(--shadow)',
                }}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Lista */}
          {cargando ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-400)' }}>Cargando...</div>
          ) : filtradas.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-400)', background: 'white', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
              No hay reservas para mostrar.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filtradas.map(r => (
                <div key={r.id} style={{ background: 'white', borderRadius: 'var(--radius)', padding: '1rem 1.25rem', boxShadow: 'var(--shadow)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <p style={{ fontWeight: 500, fontSize: 15 }}>{r.nombre}</p>
                      <p style={{ fontSize: 13, color: 'var(--gray-400)', marginTop: 2 }}>
                        {r.hora} · {r.personas} · {r.telefono}
                      </p>
                      {r.ocasion && (
                        <span style={{ fontSize: 11, background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: 99, marginTop: 4, display: 'inline-block' }}>
                          {r.ocasion}
                        </span>
                      )}
                      {r.notas && (
                        <p style={{ fontSize: 12, color: 'var(--gray-600)', marginTop: 6, background: 'var(--gray-50)', padding: '6px 10px', borderRadius: 6 }}>
                          📝 {r.notas}
                        </p>
                      )}
                    </div>
                    <span style={{
                      fontSize: 11, padding: '4px 10px', borderRadius: 99, fontWeight: 500, whiteSpace: 'nowrap',
                      background: ESTADOS[r.estado]?.bg,
                      color: ESTADOS[r.estado]?.color,
                    }}>
                      {ESTADOS[r.estado]?.label}
                    </span>
                  </div>

                  {/* Acciones */}
                  <div style={{ display: 'flex', gap: 8, borderTop: '1px solid var(--gray-100)', paddingTop: 10, marginTop: 4 }}>
                    {r.estado !== 'confirmada' && (
                      <button onClick={() => cambiarEstado(r.id, 'confirmada')}
                        style={{ flex: 1, padding: '7px', background: '#d1fae5', color: '#065f46', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500 }}>
                        ✓ Confirmar
                      </button>
                    )}
                    {r.estado !== 'cancelada' && (
                      <button onClick={() => cambiarEstado(r.id, 'cancelada')}
                        style={{ flex: 1, padding: '7px', background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500 }}>
                        ✕ Cancelar
      </button>
                    )}
                    <a href={`https://wa.me/${r.telefono.replace(/\D/g,'')}`} target="_blank" rel="noreferrer"
                      style={{ flex: 1, padding: '7px', background: '#e8f5f0', color: '#1a7a5e', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, textAlign: 'center', textDecoration: 'none' }}>
                      💬 WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
