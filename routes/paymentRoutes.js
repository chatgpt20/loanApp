const { Router } = require('express');
const paymentController = require('../controllers/paymentController');
const { requireAuth } = require("../middleware/authMiddleware");

const router = Router();

router.use(requireAuth);

router.get('/payloan',paymentController.payloan_get);
router.get('/payment',paymentController.payment_get);
router.post('/payment',paymentController.payment_post);
router.get('/paymentSuccess',paymentController.paymentSuccess_get);

module.exports = router;