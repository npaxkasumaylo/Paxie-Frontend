import axios from "axios";

// backend url: http://localhost:5255

const BASE_URL = import.meta.env.VITE_API_URL;
const AI_URL = import.meta.env.AI_API_URL;

const Api = axios.create({baseURL: `${BASE_URL}/api`});

Api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});     

export default Api;


export const api = {
  //AUTH API
  login: (credentials) => Api.post("/Auth/Login", credentials),
  //register: (newAdmin) => Api.post("/Auth/CreateAdmin", newAdmin),
  addDocument: (document) => Api.post("/Documents/AddDocument", document),
  getDocuments: () => Api.get("/Documents/GetDocuments"),
  deleteDocument: (documentId) => Api.delete(`/Documents/${documentId}`),

  // AI API
  getAIResponse: (query) => axios.post(`http://127.0.0.1:8000/chatbot-ai?query=${ query }`),

};


