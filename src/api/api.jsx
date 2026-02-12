import axios from "axios";

// backend url: http://localhost:5255

const BASE_URL = import.meta.env.VITE_API_URL;
// const AI_URL = import.meta.env.AI_API_URL;
const AI_URL = "http://127.0.0.1:8000";


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
  getDocuments: (isProductTag = false, productName = "General") => Api.get("/Documents/GetDocuments", { params: { isProductTag, productName } }),
  deleteDocument: (documentId) => Api.delete(`/Documents/${documentId}`),

  //JOB OPENING API
  getJobs: () => Api.get("/Jobs/GetJobOpenings"),
  addJob: (job) => Api.post("/Jobs/AddJobOpenings", job),
  removeJob: (jobId) => Api.put(`Jobs/UpdateJobOpeningStatus/${jobId}`),

  // AI API
  getAIResponse: (query, id) => axios.post(`${AI_URL}/chatbot-ai`,{ query, id}),
  addAIDocument: (id) => axios.post(`${AI_URL}/newDocument?id=${id}`),
  deleteAIDocument: (id) => axios.delete(`${AI_URL}/deleteDocument?id=${id}`),
  deleteSession: (id) => axios.delete(`${AI_URL}/deleteSession?id=${id}`),
 //Switchmodels
  switchModel: (id) => axios.put(`${AI_URL}/SwitchModel`, {id}),



  //AI Provider
  getAllProviders: () => Api.get("/Provider"),
  getProviderById: (id) => Api.get(`/Provider/${id}`),



  //ModelCredentials
  addModelCredentials: (modelDetails) => Api.post("/ModelCredentials", modelDetails),
  getModelCredentials: () => Api.get("/ModelCredentials"),
  editModelCredentials: (payload) => Api.put("/ModelCredentials",payload),
  getModelCredentialsById: (id) => Api.get(`/ModelCredentials/${id}`),
  editModelCredentialsByUsedModel: (payload) => Api.put(`/ModelCredentials/UseModel`, payload),
  deleteModelCredentials: (payload) => Api.delete(`/ModelCredentials`, {data: payload}),


  //Security
  getSecurityKey: () => Api.get("/Security"),

  //DocumentTags
  getDocumentTags: (isProductTag) => Api.get("/DocumentTags", {params: { IsProductTag: isProductTag },
  }),


  searchFilterProductDocument: (searchParam) => Api.get("/Documents/GetDocuments", { params: { query: searchParam } }),
};


