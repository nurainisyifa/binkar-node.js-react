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

  
async function handleHapus(id) {
  const yakin = window.confirm(
    'Yakin ingin menghapus riwayat pelanggaran ini?'
  )

  if (!yakin) return

  try {
    const response = await fetch(
      `http://localhost:5000/api/riwayat-pelanggaran/${id}`,
      {
        method: 'DELETE',
      }
    )

    if (!response.ok) {
      throw new Error('Gagal menghapus riwayat pelanggaran.')
    }

    setRiwayat((dataSebelumnya) =>
      dataSebelumnya.filter((item) => item.id !== id)
    )

    alert('Riwayat pelanggaran berhasil dihapus.')
  } catch (err) {
    alert(err.message)
  }
}


  if (loading) {
    return <p>Memuat detail siswa...</p>
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

      <main className="dashboard detail-page">
        <h2 className="detail-title">{siswa.nama}</h2>

        <section className="detail-info">
          <p>
            <strong>NIS</strong>
            <span>: {siswa.nis}</span>
          </p>
          <p>
            <strong>KELAS</strong>
            <span>: {siswa.kelas}</span>
          </p>
          <p>
            <strong>TOTAL POINT</strong>
            <span>: {totalPoin}</span>
          </p>
        </section>

        <section className="riwayat-section">
          <h3>RIWAYAT PELANGGARAN</h3>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>TANGGAL</th>
                  <th>JENIS PELANGGARAN</th>
                  <th>POINT</th>
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
                      <td>
                        {/* TODO: sambungkan ke fungsi hapus riwayat */}
                        <button className="hapus" onClick={() => handleHapus(item.id)}>
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="detail-actions">
            <button
              className="detail"
              onClick={() => (window.location.href = '/')}
            >
              Back
            </button>

            <button
              className="tambah"
              onClick={() => {
                window.location.href =
                  `/tambah?nis=${encodeURIComponent(siswa.nis)}`
              }}
            >
              Tambah Point
            </button>
          </div>
        </section>
      </main>
    </>
  )
}

export default DetailSiswa
