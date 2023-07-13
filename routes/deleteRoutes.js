const { Router } = require('express');
const deleteController = require('../controllers/DeleteController');
const { requireAuth } = require("../middleware/authMiddleware");

const router = Router();

router.use(requireAuth);

router.post('/deleteevent1',deleteController.delete_event);
router.post('/deleteloan',deleteController.delete_loan);

module.exports = router;
