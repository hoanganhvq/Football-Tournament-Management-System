const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadImage');
const imageController = require('../controllers/imageController');

router.post('/tournament-player/:id', upload, imageController.uploadImageTournamentAndPlayer);

router.post('/club/:id/:type', upload, imageController.uploadImageClub);

module.exports = router;