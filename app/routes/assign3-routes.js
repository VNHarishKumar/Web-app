import express from 'express';
import * as assign1 from '../controllers/assign3-controller.js';
import {notAllowed,notFound} from '../controllers/assign3-controller.js';

const router = express.Router();

router.route('/')
    .post(assign1.post)
    .get(assign1.getAllRecordsByUsername)
    .all(notAllowed);

router.route('/:id')
    .get(assign1.getARecord)
    .delete(assign1.removeARecord)
    .put(assign1.updateARecord)
    .post(notFound)
    .all(notAllowed);

 router.route('*',notFound);   

export default router;