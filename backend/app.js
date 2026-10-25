import express from 'express';
import cors from 'cors';
import siswaRoutes from './routes/siswaRoutes.mjs';
import riwayatRoutes from './routes/riwayatRoutes.mjs';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Backend Binkar berjalan!');
});

app.use('/api/siswa', siswaRoutes);
app.use('/api/riwayat-pelanggaran', riwayatRoutes);

app.listen(5000, () => {
    console.log('Server berjalan di http://localhost:5000');
});

