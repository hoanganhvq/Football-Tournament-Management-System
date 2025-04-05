import axios from "axios";

const API_URL = "http://localhost:5000/api/team";


export const getTeams = async () => {
    try {
        const res = await axios.get(API_URL, {
            headers: { 'Cache-Control': 'no-cache' } //To toell the server not to cache
        });
        return res.data;
    } catch (error) {
        console.error("Error fetching Teams data: ", error);
        throw error;
    }
};

export const getTeamById = async(id) =>{
    try{
        const res = await axios.get(`${API_URL}/${id}`);
        return res.data
    }catch(error){
        console.error("Error fetching Team data: ", error);
        throw error;
    }
}


export const createTeam = async(teamData, token) =>{
    console.log(teamData);
    
    try{
        const res = await axios.post(API_URL, teamData, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        return res.data
    }catch(error){
        console.error("Error creating Team: ", error);
        throw error;
    }
}

export const deleteTeam = async(id) =>{
    try{    
        const res = await axios.delete(`${API_URL}/${id}`);
        return res.data
    } catch(error){
        console.error("Error deleting Team: ", error);
        throw error;
    }
}

export const updateTeam = async(id, teamData) =>{
    try{
        const res = await axios.put(`${API_URL}/${id}`, teamData);
        return res.data
    }catch(error){
        console.error("Error updating Team: ", error);
        throw error;
    }
}

export const getTeamsById = async(ids) =>{
    try{
        //Remember array should to recover by  { }
        const res = await axios.post(`${API_URL}/getMany`, {ids});
        return res.data;
    }catch(error){
        console.error("Error fetching teams ", error);
        throw error;
    }
}

export const addPlayerIntoTeam = async(id, playerData) =>{
    try{
        const res  = await axios.post(`${API_URL}/add-player/${id}`, {playerData: playerData});
        return res.data
    }catch(error){
        console.error("Error adding player to team ", error);
        throw error;
    }
}


export const toReckonTeam = async(id)=>{
    try{
        const res = await axios.get(`${API_URL}/statistic/${id}`);
        return res.data;
    }catch(error){
        console.log("Error to reckon team: ", error);
        throw error;
    }

}

export const getTeamByUserId = async(token) =>{
    try{
        const res = await axios.get(`${API_URL}/my-team`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return res.data;
    }catch(error){
        console.error("Error fetching team by user: ", error);
        throw error;
    }
}