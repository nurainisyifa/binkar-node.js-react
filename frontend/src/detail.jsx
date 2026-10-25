
import { useEffect, useState } from 'react'
import './App.css'

function DetailSiswa() {
  const params = new URLSearchParams(window.location.search)
  const nis = params.get('nis')

  const [siswa, setSiswa] = useState(null)
  const [riwayat, setRiwayat] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function ambilData() {
      if (!nis) {
        setError('NIS siswa tidak ditemukan.')
        setLoading(false)
        return
      }

      try {
        // Mengambil data siswa
        const responseSiswa = await fetch(
          'http://localhost:5000/api/siswa'
        )

        if (!responseSiswa.ok) {
          throw new Error('Gagal mengambil data siswa.')
        }

        const dataSiswa = await responseSiswa.json()

        const siswaDitemukan = dataSiswa.find(
          (item) => String(item.nis) === String(nis)
        )

        if (!siswaDitemukan) {
          throw new Error('Data siswa tidak ditemukan.')
        }

        setSiswa(siswaDitemukan)

        // Mengambil riwayat pelanggaran berdasarkan NIS
        const responseRiwayat = await fetch(
          `http://localhost:5000/api/riwayat-pelanggaran/${encodeURIComponent(nis)}`
        )

        if (!responseRiwayat.ok) {
          throw new Error('Gagal mengambil riwayat pelanggaran.')
        }

        const dataRiwayat = await responseRiwayat.json()
        setRiwayat(dataRiwayat)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    ambilData()
  }, [nis])

  // Menghitung total poin dari seluruh riwayat
  const totalPoin = riwayat.reduce(
    (total, item) => total + Number(item.poin || 0),
    0
  )

  if (loading) {
    return <p>Memuat detail siswa...</p>
  }

  if (error || !siswa) {
    return (
      <main className="dashboard">
        <p>{error || 'Data siswa tidak ditemukan.'}</p>
        <button onClick={() => window.location.href = '/'}>
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

      <main className="dashboard detail-page">
        <h2 className="detail-title text-center">
          {siswa.nama}
        </h2>

        <section
          className="detail-info"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px'
          }}
        >
          <div>
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

          <table
            border="3"
            cellPadding="10"
            style={{
              width: '200px',
              backgroundColor: '#d9b46b',
              textAlign: 'center'
            }}
          >
            <tbody>
              <tr>
                <td>
                  <strong>TOTAL POIN PELANGGARAN</strong>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>{totalPoin}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="riwayat-section">
          <h3>RIWAYAT PELANGGARAN</h3>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>TANGGAL</th>
                  <th>JENIS PELANGGARAN</th>
                  <th>POIN</th>
                  <th>KETERANGAN</th>
                  <th>AKSI</th>
                </tr>
              </thead>

              <tbody>
                {riwayat.length === 0 ? (
                  <tr>
                    <td colSpan="5">
                      Belum ada riwayat pelanggaran.
                    </td>
                  </tr>
                ) : (
                  riwayat.map((item) => (
                    <tr key={item.id}>
                      <td>
                        {item.tanggal
                          ? String(item.tanggal).slice(0, 10)
                          : '-'}
                      </td>
                      <td>{item.jenis_pelanggaran}</td>
                      <td>{item.poin}</td>
                      <td>{item.keterangan || '-'}</td>
                      <td>-</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <div className="detail-actions">
          <button
            className="detail"
            onClick={() => window.location.href = '/'}
          >
            ← BACK
          </button>

          <button
            className="tambah"
            onClick={() => {
              window.location.href =
                `/tambah?nis=${encodeURIComponent(siswa.nis)}`
            }}
          >
            TAMBAH PELANGGARAN
          </button>
        </div>
      </main>
    </>
  )
}

export default DetailSiswa
