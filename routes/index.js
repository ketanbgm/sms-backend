const express = require('express');
const router = express.Router();
const city = require ("../api/index")

router.post('/city',city.getData)
router.post('/importData',city.importData)

router.post('/addCity',city.addCity)
router.get('/getOneCity',city.getOneCity)
router.delete('/deleteOneCity',city.deleteOneCity)
router.put('/updateOneCity',city.updateOneCity)
router.get('/test', city.test)



module.exports = router;
