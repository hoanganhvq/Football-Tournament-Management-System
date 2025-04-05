import axios from 'axios';

const API_URL = 'http://localhost:5000/api/group';

export const getGroups = async (id) => {
    try{
        const res = await axios.get(`${API_URL}/${id}`);
        return res.data;
    }catch(error){
        console.log("Error fetching groups: ", error);
        throw error;
    }
}

export const updateGroup = async (id, groupData) =>{
    try{
        const res = await axios.put(`${API_URL}/${id}`, groupData);
        return res.data;
    }catch(error){
        console.log("Error updating group: ", error);
        throw error;
    }
}


export const createGroup = async (id, groupData) => {
    try{
        console.log("Data gửi đi:", groupData);
        const res = await axios.post(`${API_URL}/${id}`, groupData);
        return res.data;
    }catch(error){
        console.log("Error creating group: ", error);
        throw error;
    }
}

export const createGroupMatches = async(groupData) =>{
    try{
        const res = await axios.post(`${API_URL}/generate-matches`, {groups: groupData});
        return res.data;
    }catch(error){
        console.log("Error creating group matches: ", error);
    }
}

