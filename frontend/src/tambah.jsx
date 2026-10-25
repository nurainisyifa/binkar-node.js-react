
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

    fetch('http://localhost:5000/api/siswa')
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
    event.preventDefault();

    if (!jenis || !tanggal) {
      alert('Jenis pelanggaran dan tanggal wajib diisi.');
      return;
    }

    const poinPerJenis = {
      ringan: 5,
      sedang: 10,
      berat: 15
    };

    try {
      const response = await fetch(
        'http://localhost:5000/api/riwayat-pelanggaran',
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
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Gagal menyimpan pelanggaran.'
        );
      }

      alert('Pelanggaran berhasil disimpan.');

      window.location.href =
        `/detail?nis=${encodeURIComponent(siswa.nis)}`;
    } catch (err) {
      alert(err.message || 'Terjadi kesalahan saat menyimpan.');
    }
  }

  if (loading) {
  return <p>Memuat data siswa...</p>;
}

if (error || !siswa) {
  return (
    <main className="dashboard">
      <p>{error || 'Data siswa tidak ditemukan.'}</p>
      <button onClick={() => window.location.href = '/'}>
        Kembali
      </button>
    </main>
  );
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

      <main className="dashboard">
  <h2>Tambah Pelanggaran</h2>
  <form onSubmit={handleSimpan}>
          <div className="detail-info" style={{ padding: '20px' }}>
            <p>
              <strong>NIS SISWA:</strong> {siswa.nis}
            </p>
            <p>
              <strong>NAMA SISWA:</strong> {siswa.nama}
            </p>
            <p>
              <strong>KELAS SISWA:</strong> {siswa.kelas}
            </p>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="jenis">Jenis Pelanggaran</label>
            <select
              id="jenis"
              value={jenis}
              onChange={(event) => setJenis(event.target.value)}
              required
              style={{ display: 'block', width: '100%', padding: '10px' }}
            >
              <option value="">Pilih jenis pelanggaran</option>
              <option value="ringan">Ringan</option>
              <option value="sedang">Sedang</option>
              <option value="berat">Berat</option>
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="tanggal">Tanggal Pelanggaran</label>
            <input
              id="tanggal"
              type="date"
              value={tanggal}
              onChange={(event) => setTanggal(event.target.value)}
              required
              style={{ display: 'block', width: '100%', padding: '10px' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="keterangan">Keterangan (Opsional)</label>
            <textarea
              id="keterangan"
              value={keterangan}
              onChange={(event) => setKeterangan(event.target.value)}
              rows="4"
              placeholder="Masukkan keterangan pelanggaran"
              style={{ display: 'block', width: '100%', padding: '10px' }}
            />
          </div>

          <div className="detail-actions">
            <button
              type="button"
              className="detail"
              onClick={() => window.location.href = `/detail?nis=${encodeURIComponent(siswa.nis)}`}
            >
              ← Kembali
            </button>

            <button type="submit" className="tambah">
              Simpan Pelanggaran
            </button>
          </div>
          </form>
      </main>
    </>
  )
}

export default TambahPelanggaran
