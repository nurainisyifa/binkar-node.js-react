import express from 'express';
import {
    tambahPelanggaran,
    getRiwayatPelanggaran,
    getTotalPoin,
    hapusRiwayatController
} from '../controllers/riwayatController.mjs';

const router = express.Router();

router.post('/', tambahPelanggaran);
router.get('/total', getTotalPoin);
router.delete('/:id', hapusRiwayatController);
router.get('/:nis', getRiwayatPelanggaran);
export default router;
