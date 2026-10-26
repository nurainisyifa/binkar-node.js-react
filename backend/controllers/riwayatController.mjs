import {
    tambahPelanggaran as simpanPelanggaran,
    getRiwayatPelanggaran as ambilRiwayatPelanggaran,
    hapusRiwayat
} from '../models/riwayatModel.mjs';

import {
    getTotalPoinSemuaSiswa
} from '../models/riwayatModel.mjs';


export const hapusRiwayatController = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await hapusRiwayat(id);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Riwayat pelanggaran tidak ditemukan.'
            });
        }

        return res.json({
            message: 'Riwayat pelanggaran berhasil dihapus.'
        });
    } catch (error) {
        console.error('Gagal menghapus riwayat:', error);

        return res.status(500).json({
            message: 'Gagal menghapus riwayat pelanggaran.'
        });
    }
};


const poinPelanggaran = {
    Ringan: 5,
    Sedang: 10,
    Berat: 15
};

// Menambahkan pelanggaran siswa
export const tambahPelanggaran = async (req, res) => {
    try {
        const {
            nis,
            jenisPelanggaran,
            tanggal,
            keterangan
        } = req.body;

        if (!nis || !jenisPelanggaran || !tanggal) {
            return res.status(400).json({
                message: 'NIS, jenis pelanggaran, dan tanggal wajib diisi.'
            });
        }

        if (!Object.hasOwn(poinPelanggaran, jenisPelanggaran)) {
            return res.status(400).json({
                message: 'Jenis pelanggaran tidak valid.'
            });
        }

        const poin = poinPelanggaran[jenisPelanggaran];

        const result = await simpanPelanggaran(
            nis,
            jenisPelanggaran,
            poin,
            tanggal,
            keterangan
        );

        return res.status(201).json({
            message: 'Pelanggaran berhasil ditambahkan.',
            id: result.insertId,
            poin
        });
    } catch (error) {
        console.error('Gagal menambahkan pelanggaran:', error);

        return res.status(500).json({
            message: 'Terjadi kesalahan saat menyimpan pelanggaran.'
        });
    }
};

// Mengambil riwayat pelanggaran berdasarkan NIS
export const getRiwayatPelanggaran = async (req, res) => {
    try {
        const { nis } = req.params;

        console.log('GET RIWAYAT TERPANGGIL:', nis);

        const data = await ambilRiwayatPelanggaran(nis);

        return res.json(data);
    } catch (error) {
        console.error('Gagal mengambil riwayat pelanggaran:', error);

        return res.status(500).json({
            message: 'Gagal mengambil riwayat pelanggaran.'
        });
    }
};


export const getTotalPoin = async (req, res) => {
    try {
        const data = await getTotalPoinSemuaSiswa();
        return res.json(data);
    } catch (error) {
        console.error('Gagal mengambil total poin:', error);
        return res.status(500).json({
            message: 'Gagal mengambil total poin.'
        });
    }
};
