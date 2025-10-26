import axios from "axios";

const API_BASE_URL = "http://localhost:30080";

// Registro de usuario
export const registerUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/`, { username, password });
    return response.data;
  } catch (error) {
    console.error(error.response?.data);
    throw error;
  }
};

// Login de usuario
export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login/`, { username, password });
    return response.data;
  } catch (error) {
    console.error(error.response?.data);
    throw error;
  }
};

// Crear una tirada de tarot
export const createReading = async (userId, question, answer) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/${userId}/readings/`, { question, answer });
    return response.data;
  } catch (error) {
    console.error(error.response?.data);
    throw error;
  }
};

// Obtener todas las tiradas de un usuario
export const getUserReadings = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}/readings/`);
    return response.data;
  } catch (error) {
    console.error(error.response?.data);
    throw error;
  }
};

