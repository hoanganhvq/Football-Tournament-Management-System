import axios from 'axios';

const API_URL = 'http://localhost:5000/api/match';

export const getMatches = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching Matches data:', error);
        throw error;
    }
};

export const updateMatch = async(id, matchData) =>{
    try{
        const response = await axios.put(`${API_URL}/update-match-round/${id}`, matchData);
        return response.data;
    } catch(error){
        console.error('Error updating match:', error);
        throw error;
    }
}


export const updateMatchGroup = async(id, matchData)=>{
    try{
        const respone = await axios.put(`${API_URL}/update-match-group/${id}`, matchData);
        return respone.data;
    } catch(error){
        console.error('Error updating match group:', error);
        throw error;
    }
}


export const getMatchesByTournamentId = async(id) => {
    try{
        const res = await axios.get(`${API_URL}/${id}`);
        return res.data;
    } catch(error){
        console.error('Error updating match:', error);
        throw error;
    }
}

export const createMatches =async (matches) =>{
    try{
        const res = await axios.post(`${API_URL}/generate-match-round`, {matches});
        return res.data
    }catch(error){
        console.error('Error creating match:', error);
    }
}

export const caculateData = async(id) =>{
    try{
        const res = await axios.get(`${API_URL}/caculate/${id}`);
        return res.data;
    }catch(error){
        console.error('Error calculating data:', error);
        throw error;
    }
}

export const getWinnerAndRunner = async(id, round) =>{
    try{
        const res = await axios.post(`${API_URL}/${id}/winner`, { round: round });
        return res.data.data;
    } catch(error){
        console.error('Error getting winner and runner:', error);
        throw error.response.data;
    }
}
export const getThirdPlace = async(id, round)=>{    
    try{
        const res = await axios.post(`${API_URL}/${id}/third-place`, { round: round }); //With Single Dât, you just impentmnet like this
        return res.data;   
    }catch(error){
        console.error('Error getting third place:', error);
        throw error.response.data;
    }
}