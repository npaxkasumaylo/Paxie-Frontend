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
  getDocuments: (IsProductTag = false, ProductName = "General", PageNumber = 1, PageSize = 10 ) => Api.get("/Documents/GetDocuments", { params: { IsProductTag, ProductName, PageNumber, PageSize } }),
  deleteDocument: (documentId) => Api.delete(`/Documents/${documentId}`),

  //JOB OPENING API
  getJobs: () => Api.get("/Jobs/GetJobOpenings"),
  addJob: (job) => Api.post("/Jobs/AddJobOpenings", job),
  removeJob: (jobId) => Api.put(`Jobs/UpdateJobOpeningStatus/${jobId}`),

  // AI API
  getAIResponse: (query, id, context) => axios.post(`${AI_URL}/chatbot-ai`,{ query, id, context}),
  addAIDocument: (id) => axios.post(`${AI_URL}/newDocument?id=${id}`),
  deleteAIDocument: (id) => axios.delete(`${AI_URL}/deleteDocument?id=${id}`),
  deleteSession: (id) => axios.delete(`${AI_URL}/deleteSession?id=${id}`),
 //Switchmodels
  switchModel: (id) => axios.put(`${AI_URL}/SwitchModel`, {id}),



  //AI Provider
  getAllProviders: () => Api.get("/Provider"),
  getProviderById: (id) => Api.get(`/Provider/${id}`),
  getProviderModels: (providerName) => Api.get("/Provider/ProviderModels", {params: { Provider: providerName },}),



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

  //filetring
  searchFilterProductDocument: (searchParam) => Api.get("/Documents/GetDocuments", { params: { query: searchParam } }),

  //search
  searchDocument: (isProductTag, searchParam) => Api.get("/Documents/SearchDocument", {params: {isProductTag,SearchParam: searchParam}}),

  //logging
  getQueryLogs: (pageNumber, pageSize) => Api.get("/Logging/GetQueryLogs", { params: { pageNumber, pageSize } }),
  getEmbeddingLogs: (pageNumber, pageSize, productName) => Api.get("/Logging/GetEmbeddingLogs", {params: { pageNumber, pageSize, productName },}),

  //costing
  addModelCost: (modelcost) => Api.post("/PricingMaster", modelcost),
  getPricingMaster: () => Api.get("/PricingMaster"),
  editModelCost: (payload) => Api.put("/PricingMaster",payload),
  getModelCostId: (id) => Api.get(`/PricingMaster/${id}`),
  softDeleteModelCostId: (id) => Api.put("/PricingMaster/SoftDelete",id),

  //dashboard data
  getDashboardData:() => Api.get("/Costing/Dashboard"),
  
  //dashboard query data
  getDashboardQueryData:() => Api.get("/Costing/query"),

  //logging pagingation
  getTotalqueryPages:(pageSize =10) => Api.get(`/Logging/GetTotalQueryPages?pageSize=${pageSize}`),
  getTotalEmbeddingPages:(pageSize =10) => Api.get(`/Logging/GetTotalEmbeddingPages?pageSize=${pageSize}`),

  //documentCount
  getDocumentsCount: (isProductTag, productName) => Api.get("/Documents/Count", { params: { isProductTag, productName } }),

};


