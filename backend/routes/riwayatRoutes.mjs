
import express from 'express';
import {
    tambahPelanggaran,
    getRiwayatPelanggaran,
    getTotalPoin
} from '../controllers/riwayatController.mjs';

const router = express.Router();

router.post('/', tambahPelanggaran);
router.get('/total', getTotalPoin);
router.get('/:nis', getRiwayatPelanggaran);

export default router;
