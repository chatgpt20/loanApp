const { Router } = require('express');
const viewController = require('../controllers/ViewController');
const { requireAuth } = require("../middleware/authMiddleware");

const router = Router();

router.use(requireAuth);

router.get('/',viewController.dashboard_get);
router.get('/viewusers',viewController.view_users_get);
router.get('/viewevents',viewController.view_events_get);
router.get('/completedloans',viewController.completed_loans_get);

module.exports = router;