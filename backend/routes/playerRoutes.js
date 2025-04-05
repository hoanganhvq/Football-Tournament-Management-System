const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');
const playerValidation = require('../validations/playerValidation');


router.delete('/:id', playerController.deletePlayer);

router.get('/', playerController.getPlayers);

router.get('/:id', playerController.getPlayerById);

router.put('/:id', playerController.updatePlayer);

router.post('/', playerValidation, playerController.createPlayer);


module.exports = router;
