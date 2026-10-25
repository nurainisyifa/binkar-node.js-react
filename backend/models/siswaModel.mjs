import db from '../config/db.mjs';

export const getAllSiswa = async () => {
    const [rows] = await db.query('SELECT * FROM siswa');
    return rows;
};

export const importSiswa = async (dataSiswa) => {
    const sql = `
        INSERT INTO siswa (nis, nama, kelas)
        VALUES ?
        ON DUPLICATE KEY UPDATE
            nama = VALUES(nama),
            kelas = VALUES(kelas)
    `;

    const values = dataSiswa.map((siswa) => [
        siswa.nis,
        siswa.nama,
        siswa.kelas
    ]);

    const [result] = await db.query(sql, [values]);
    return result;
};