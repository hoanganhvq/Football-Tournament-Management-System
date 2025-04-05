const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const  tournamentController = require('../controllers/tournamentController');
const tournamentValidation = require('../validations/tournamentValidation');
//It like get with so it can be used before get with id
router.post('/add-team', tournamentController.addTeamToTournament);

router.get('/my-tournament', auth.authenticateToken, tournamentController.getTournamentByUser);

router.post('/', tournamentController.createTournament);

router.put('/:id', tournamentController.updateTournament);

router.get('/', tournamentController.getTournaments);

router.get('/:id', tournamentController.getTournamentById);

router.delete('/:id', tournamentController.deleteTournament);

module.exports = router;