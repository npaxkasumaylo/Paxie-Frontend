import axios from "axios";

// backend url: http://localhost:5255

const BASE_URL = import.meta.env.VITE_API_URL;
const AI_URL = import.meta.env.AI_API_URL;

console.log(AI_URL);

const Api = axios.create({baseURL: `${BASE_URL}/api`,
  withCredentials: true,
});

// Api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("authToken");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });     

export default Api;


export const api = {
  //AUTH API
  login: (credentials) => Api.post("/Auth/Login", credentials),
  logout: () => Api.post("/Auth/Logout"),
  //register: (newAdmin) => Api.post("/Auth/CreateAdmin", newAdmin),

  // DOCUMENTS API
  addDocument: (document) => Api.post("/Documents/AddDocument", document),
  getDocuments: () => Api.get("/Documents/GetDocuments"),
  deleteDocument: (documentId) => Api.delete(`/Documents/${documentId}`),

  //JOB OPENING API
  getJobs: () => Api.get("/Jobs/GetJobOpenings"),
  addJob: (job) => Api.post("/Jobs/AddJobOpenings", job),
  removeJob: (jobId) => Api.put(`Jobs/UpdateJobOpeningStatus/${jobId}`),

  // AI API
  getAIResponse: (query, id) => axios.post(`http://127.0.0.1:8000/chatbot-ai?query=${query}&id=${id}`),
  addAIDocument: (id) => axios.post(`http://127.0.0.1:8000/newDocument?id=${id}`),
  deleteAIDocument: (id) => axios.delete(`http://127.0.0.1:8000/deleteDocument?id=${id}`)

};


