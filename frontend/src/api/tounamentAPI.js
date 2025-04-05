import axios from 'axios';

const API_URL = 'http://localhost:5000/api/tournament';

export const getTournaments = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching Matches data:', error);
    throw error;
  }
};

export const getTournamentById = async(id)=>{
  try{
    //Su dung ~~ thay vi ''
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data
  }catch(error){
    console.error('Error fetching Match data:', error);
    throw error;
  }
}

export const createTournament = async(tournamentData) =>{
  try{
    const res = await axios.post(API_URL, tournamentData);
    return res.data;
  }catch(err){
    console.error('Error creating tournament:', err);
    throw err;
  }
}

export const deleteTournament = async(id)=>{
  try{
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  }catch(err){
    console.error('Error deleting Match:', err);
    throw err;
  }
}

export const updateTournament = async(id, tournamentData) =>{
  try{
    const res = await axios.put(`${API_URL}/${id}`, tournamentData);
    return res.data;
  }catch(err){
    console.error('Error updating Match:', err);
    throw err;
  }
}


export const getTournamentsByUserId = async (token) => {
  try {
    const res = await axios.get(`${API_URL}/my-tournament`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  } catch (err) {
    console.log('Error fetching tournaments:', err);
    throw err;
  }
};

export const addTeamToTournament = async(teamData)=>{
  try{
    const res = await axios.post(`${API_URL}/add-team`,teamData);
    return res.data;
  }catch(err){
    console.log('Error postingt team to tournaments:', err);
    throw err;
  }
}