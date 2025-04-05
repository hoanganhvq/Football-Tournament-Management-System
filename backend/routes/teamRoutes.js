const express = require('express');
// Import the routes for teams
const router = express.Router();
const teamController = require('../controllers/teamController');
const teamValidation = require('../validations/teamValidation');
const { authenticateToken }  = require('../middlewares/auth');
router.post('/getMany', teamController.getTeamsById);

router.post('/add-player/:id', teamController.addPlayerIntoTeam);

router.get('/statistic/:id', teamController.toReckonTeam);

router.get('/my-team', authenticateToken, teamController.getTeamByUserId);

router.post('/', authenticateToken, teamController.createTeam);

router.get('/', teamController.getTeams);

router.get('/:id', teamController.getTeamById);

router.put('/:id', teamController.updateTeam);

router.delete('/:id', teamController.deleteTeam);


// Export the router
module.exports = router; 
