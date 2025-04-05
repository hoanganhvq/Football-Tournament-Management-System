import axios from'axios';

const API_URL = 'http://localhost:5000/api/user';

export const register = async (userData) => {
    try {
        const res = await axios.post(`${API_URL}/register`, userData);
        return res.data;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
};

export const login = async (userData) => {
    try {
        const res = await axios.post(`${API_URL}/login`, userData, 
            {withCredentials:true},
        );
        return res.data;
    } catch (error) {
        console.error('Error logging in user:', error);
        throw error;
    }
};

export const getMe = async () => {
    try {
      const res = await axios.get(`${API_URL}/me`, {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      console.error("Error fetching user data:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to fetch user data");
    }
  };

  export const updateProfile = async(userData)=>{
    try {
        const res = await axios.put(`${API_URL}/me`, userData, {
            withCredentials: true,
        });
        return res.data;
    } catch (error) {
        console.error("Error updating user profile:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to update user profile");
    }
  }