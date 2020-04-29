const express = require('express');
const router = express.Router();
const city = require ("../api/index")

router.get('/city',city.getData)
router.post('/importData',city.importData)



module.exports = router;
