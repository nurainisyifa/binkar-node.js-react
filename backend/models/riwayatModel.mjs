
import db from '../config/db.mjs';

export const tambahPelanggaran = async (
    
    nis,
    jenisPelanggaran,
    poin,
    tanggal,
    keterangan
) => {
    const sql = `
        INSERT INTO riwayat_pelanggaran
        (nis, jenis_pelanggaran, poin, tanggal, keterangan)
        VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(sql, [
        nis,
        jenisPelanggaran,
        poin,
        tanggal,
        keterangan || null
    ]);

    return result;
};

export const getRiwayatPelanggaran = async (nis) => {
    const sql = `
        SELECT *
        FROM riwayat_pelanggaran
        WHERE nis = ?
        ORDER BY tanggal DESC, id DESC
    `;

    const [rows] = await db.execute(sql, [nis]);

    return rows;
};


export const getTotalPoinSemuaSiswa = async () => {
    const sql = `
        SELECT nis, COALESCE(SUM(poin), 0) AS totalPoin
        FROM riwayat_pelanggaran
        GROUP BY nis
    `;

    const [rows] = await db.execute(sql);
    return rows;
};
