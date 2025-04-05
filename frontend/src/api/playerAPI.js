import axios from 'axios';

const API_URL = 'http://localhost:5000/api/player';

export const getPlayer = async () =>{
    try{
        const res = await axios.get(API_URL);
        return res.data
    } catch(error){
        console.error("Error fetching Player data: ", error);
        throw error;
    }
}

export const createPlayer = async(playerData) =>{
    try{
        const res = await axios.post(API_URL, playerData);
        return res.data;
    }catch(error){
        console.error("Error creating Player: ", error);
        throw error;
        
    }
}

export const deletePlayer = async(id) =>{
    try{
        const res = await axios.delete(`${API_URL}/${id}`);
        return res.data;
    }catch(error){
        console.error('Error deleting Player: ', error);
        throw error;
    }
}

export const updatePlayer = async(id, playerData) =>{
    try{
        const res = await axios.put(`${API_URL}/${id}`, playerData);
        return res.data;
    }catch(error){
        console.error('Error updating Player: ', error);
        throw error;
    }
}