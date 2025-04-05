import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const uploadImageTournamentAndPlayer = async (id, image) => {
    console.log("req body: ",image);
    
    try {
        if (!image) {
            throw new Error('No file uploaded');
        }
        const formData = new FormData();
        formData.append('image', image);

        const result = await axios.post(`${API_URL}/tournament-player/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log("file: ", result.data);
        return result.data.data.secure_url; 

    } catch (error) {
        console.error("Error upload image Club: ", error);
    }
}


export const uploadImageClub = async (id, type, file) => {
    try {
        if (!file) {
            throw new Error('No file uploaded');
        }
        const formData = new FormData();
        formData.append('image', file);
        const result = await axios.post(`${API_URL}/club/${id}/${type}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log("Uploaded file: ", result.data.data.secure_url);
        return result.data.data.secure_url; // Trả về URL
    } catch (error) {
        console.error("Error uploading image for club: ", error);
        throw error;
    }
};