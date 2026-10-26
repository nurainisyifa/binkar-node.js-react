
import { useState, useEffect } from 'react'
import './App.css'
import DetailSiswa from './detail'
import TambahPelanggaran from './tambah'

function App() {
  const params = new URLSearchParams(window.location.search)
  const nisDetail = params.get('nis')

  const [search, setSearch] = useState('')
  const [kelas, setKelas] = useState('')
  const [siswa, setSiswa] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/siswa')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Gagal mengambil data siswa')
        }

        return response.json()
      })
      .then(async (data) => {
        const responsePoin = await fetch(
          'http://localhost:5000/api/riwayat-pelanggaran/total'
        )

        if (!responsePoin.ok) {
          throw new Error('Gagal mengambil total poin')
        }

        const dataPoin = await responsePoin.json()

        const daftarPoin = Object.fromEntries(
          dataPoin.map((item) => [
            String(item.nis),
            Number(item.totalPoin)
          ])
        )

        const dataDenganPoin = data.map((s) => ({
          ...s,
          totalPoin: daftarPoin[String(s.nis)] ?? 0
        }))

        setSiswa(dataDenganPoin)
      })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const hasil = siswa.filter((s) => {
    const namaSiswa = (s.nama ?? '').toLowerCase()
    const kelasSiswa = s.kelas ?? ''

    return (
      namaSiswa.includes(search.toLowerCase()) &&
      (kelas === '' || kelasSiswa === kelas)
    )
  })

  if (window.location.pathname === '/detail' && nisDetail) {
    return <DetailSiswa nis={nisDetail} />
  }

  if (window.location.pathname === '/tambah' && nisDetail) {
    return <TambahPelanggaran />
  }

  return (
    <>
      <nav className="navbar">
        <h1>B-KAR</h1>

        <div>
          <a href="/">Data Siswa</a>
          <a href="/import">Import Data</a>
        </div>
      </nav>

      <main className="dashboard">
        <h2>DATA SISWA</h2>

        <div className="filter">
          <input
            type="text"
            placeholder="Cari Siswa...."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={kelas}
            onChange={(e) => setKelas(e.target.value)}
          >
            <option value="">-- Pilih Kelas --</option>

            {[...new Set(siswa.map((s) => s.kelas).filter(Boolean))]
              .map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
          </select>
        </div>

        {loading && <p>Memuat data siswa...</p>}

        {error && <p>Terjadi kesalahan: {error}</p>}

        {!loading && !error && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>NIS</th>
                  <th>Nama Siswa</th>
                  <th>Kelas</th>
                  <th>Total Point</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {hasil.map((s) => (
                  <tr key={s.nis}>
                    <td>{s.nis}</td>
                    <td>{s.nama}</td>
                    <td>{s.kelas}</td>
                    <td>{s.totalPoin}</td>

                    <td className="aksi">
                      <button
                        className="detail"
                        onClick={() => {
                          window.location.href =
                            `/detail?nis=${encodeURIComponent(s.nis)}`
                        }}
                      >
                        Detail
                      </button>

                      <button
                        className="tambah"
                        onClick={() => {
                          window.location.href =
                            `/tambah?nis=${encodeURIComponent(s.nis)}`
                        }}
                      >
                        Tambah Pelanggaran
                      </button>
                    </td>
                  </tr>
                ))}

                {hasil.length === 0 && (
                  <tr>
                    <td colSpan="5">
                      Data siswa tidak ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  )
}

export default App
