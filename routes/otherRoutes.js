const { Router } = require('express');
const otherController = require('../controllers/otherController');
const { requireAuth } = require("../middleware/authMiddleware");

const router = Router();

router.use(requireAuth);

router.get('/addloan',otherController.addloan_get);
router.post('/addloan',otherController.addloan_post);
router.get('/createevent',otherController.create_event_get);
router.post('/createevent',otherController.create_event_post);

module.exports = router;