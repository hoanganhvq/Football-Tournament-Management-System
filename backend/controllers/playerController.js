const Player = require('../models/playerModel');
const mongoose = require('mongoose');
// Get all player
const getPlayers = async (req, res)=>{
    try{
        const players = await Player.find();
        if(players.length === 0){
            return res.status(404).json({message:'No players found'});
        }
        return res.status(200).json(players);
    }catch(error){
        res.status(500).json({message: error.message});
    }
}
//Get player by id
const getPlayerById = async (req,res) =>{
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({message:'Invalid Player ID'});
    }
    try{
        const player = await Player.findById(id);
        if(!player){
            return res.status(404).json({message:'Player not found'});
        }
        res.status(200).json(player);
    }catch(error){
        res.status(404).json({message: error.message});
    }
}
//Create Player
const createPlayer = async(req, res) =>{
    const player = new Player(req.body);
    try{
        await player.save();
        res.status(201).json(player);
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

//Update Player's information
const updatePlayer = async (req, res) =>{
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({message:'Invalid Player ID'});
    }
    try{
        await Player.findByIdAndUpdate(id, req.body);
        res.status(200).json({message:'Player updated successfully'});
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

//Delete Player 
const deletePlayer = async(req,res)=>{
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({message:'Invalid Player ID'});
    }
    try{
        await Player.findByIdAndDelete(id);
        res.status(200).json({message:'Player deleted successfully'});
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

module.exports = {getPlayers, getPlayerById, createPlayer, updatePlayer, deletePlayer};