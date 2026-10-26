import { useEffect, useState } from 'react'
import './App.css'

function TambahPelanggaran() {
  const params = new URLSearchParams(window.location.search)
  const nis = params.get('nis') || ''

  const [siswa, setSiswa] = useState(null)
  const [jenis, setJenis] = useState('')
  const [tanggal, setTanggal] = useState('')
  const [keterangan, setKeterangan] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!nis) {
      setError('NIS siswa belum tersedia.')
      setLoading(false)
      return
    }

    fetch('/api/siswa')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Gagal mengambil data siswa.')
        }
        return response.json()
      })
      .then((data) => {
        const dataSiswa = data.find(
          (item) => String(item.nis) === String(nis)
        )

        if (!dataSiswa) {
          throw new Error('Data siswa tidak ditemukan.')
        }

        setSiswa(dataSiswa)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [nis])

  async function handleSimpan(event) {
    event.preventDefault()

    if (!jenis || !tanggal) {
      alert('Jenis pelanggaran dan tanggal wajib diisi.')
      return
    }

    const poinPerJenis = {
      ringan: 5,
      sedang: 10,
      berat: 15
    }

    try {
      const response = await fetch(
        '/api/riwayat-pelanggaran',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            nis: siswa.nis,
            jenisPelanggaran: jenis.charAt(0).toUpperCase() + jenis.slice(1),
            poin: poinPerJenis[jenis],
            tanggal,
            keterangan
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Gagal menyimpan pelanggaran.'
        )
      }

      alert('Pelanggaran berhasil disimpan.')

      window.location.href =
        `/detail?nis=${encodeURIComponent(siswa.nis)}`
    } catch (err) {
      alert(err.message || 'Terjadi kesalahan saat menyimpan.')
    }
  }

  if (loading) {
    return <p>Memuat data siswa...</p>
  }

  if (error || !siswa) {
    return (
      <main className="dashboard">
        <p>{error || 'Data siswa tidak ditemukan.'}</p>
        <button
          className="detail"
          onClick={() => (window.location.href = '/')}
        >
          Kembali
        </button>
      </main>
    )
  }

  return (
    <>
      <nav className="navbar">
        <h1>B-KAR</h1>
        <div>
          <a href="/">Data Siswa</a>
          <a href="/">Logout</a>
        </div>
      </nav>

      <main className="dashboard form-page">
        <h2 className="form-title">Form Tambah Point</h2>

        <form className="form-card" onSubmit={handleSimpan}>
          <div className="form-group">
            <label htmlFor="nis">NIS SISWA</label>
            <input
              id="nis"
              className="form-input"
              type="text"
              value={siswa.nis}
              readOnly
            />
          </div>

          <div className="form-group">
            <label htmlFor="nama">NAMA SISWA</label>
            <input
              id="nama"
              className="form-input"
              type="text"
              value={siswa.nama}
              readOnly
            />
          </div>

          <div className="form-group">
            <label htmlFor="kelas">KELAS SISWA</label>
            <input
              id="kelas"
              className="form-input"
              type="text"
              value={siswa.kelas}
              readOnly
            />
          </div>

          <div className="form-group">
            <span className="form-label">JENIS PELANGGARAN</span>

            <div className="radio-group">
              {['ringan', 'sedang', 'berat'].map((item) => (
                <label key={item} className="radio-item">
                  <input
                    type="radio"
                    name="jenis"
                    value={item}
                    checked={jenis === item}
                    onChange={(event) => setJenis(event.target.value)}
                    required
                  />
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="tanggal">Tanggal</label>
            <input
              id="tanggal"
              className="form-input"
              type="date"
              value={tanggal}
              onChange={(event) => setTanggal(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="keterangan">Keterangan</label>
            <textarea
              id="keterangan"
              className="form-input"
              value={keterangan}
              onChange={(event) => setKeterangan(event.target.value)}
              rows="2"
            />
          </div>

          <div className="detail-actions">
            <button
              type="button"
              className="detail"
              onClick={() => {
                window.location.href =
                  `/detail?nis=${encodeURIComponent(siswa.nis)}`
              }}
            >
              Back
            </button>

            <button type="submit" className="tambah">
              Tambah Point
            </button>
          </div>
        </form>
      </main>
    </>
  )
}

export default TambahPelanggaran
