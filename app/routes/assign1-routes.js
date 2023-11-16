import express from 'express';
import * as assign1 from '../controllers/assign1-controller.js';

const router = express.Router();

router.route('/')
    .get(assign1.checkConnectionController)
    .put(assign1.checkOtherMethod1)
    .post(assign1.checkOtherMethod1)
    .patch(assign1.checkOtherMethod1)
    .delete(assign1.checkOtherMethod1);
    

router.route('/*')
    .get(assign1.checkOtherMethod)
    .put(assign1.checkOtherMethod)
    .post(assign1.checkOtherMethod)
    .patch(assign1.checkOtherMethod)
    .delete(assign1.checkOtherMethod);
  
    
export default router;
