
import { getAllSiswa } from '../models/siswaModel.mjs';

export const getSiswa = async (req, res) => {
    try {
        const data = await getAllSiswa();
        res.json(data);
    } catch (error) {
        console.error('Gagal mengambil data siswa:', error);

        res.status(500).json({
            message: 'Gagal mengambil data siswa.'
        });
    }
};
