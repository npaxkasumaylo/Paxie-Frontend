import { CircleX, FileText, LoaderCircle, LoaderIcon } from "lucide-react";
import React, {useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { convertFileToBytes, downloadFileFromBase64 } from "../../utils/FileConverter";
import { api } from "../../api/api";
import { Bounce, toast, ToastContainer } from "react-toastify";
import AdminNavBar from "./AdminNavBar";
import PageLoader from "../PageLoader";
import Toast from "../Toast";
import JobOpenings from "./JobOpenings";
import AddNewJob from "./AddNewJob";
import ManageAiModels from "./ManageAIModels";
import ManageProductsandServices from "./ProductsandServices";
import ProductsandServicesList from "./ProductsandServicesList";
import ModelList from "./ModelList";
import Report from "./Reports/QueryLogs";
import QueryLogs from "./Reports/QueryLogs";
import DocumentLogs from "./Reports/DocumentLogs";
import Graphs from "./Reports/Graphs";
import Calculator from "./Reports/Calculator";
import Dashboard from "./Reports/Dashboard";
import ModelCosting from "./ModelCosting";
import CostingList from "./CostingList";

export default function Home() {
	const [uploading, setUploading] = useState(false);
	const [deleting, setDeleting] = useState(false);
  	const [loading, setLoading] = useState(true);
  	const [error, setError] = useState("");
	const [networkError, setNetworkError] = useState("");
  	const [file, setFile] = useState(null);
	const [docInfo, setDocInfo] = useState("");
  	const navigate = useNavigate();
	const [generalDocuments, setGeneralDocuments] = useState([]);
	const [productDocuments, setProductDocuments] = useState([]);
  	const [currentId, setCurrentId] = useState(null);
	const [jobs, setJobs] = useState([]);
	const [mode, setMode] = useState("files");
	const docTypeArr = ['Pdf File', 'Excel File', 'Word FIle'];
	const [details, setDetails] = useState([]);
	const [editingRow, setEditingRow] = useState(null);
 	const [documentTags, setDocumentTags] = useState([]);
	const [productTagMap, setProductTagMap] = useState({});
	const [pageSize] = useState(10);
	const [totalPages, setTotalPages] = useState(1);
	const [pageNumber, setPageNumber] = useState(1);

	const [reportMode, setReportMode] = useState("dashboard");

	const [refreshKey, setRefreshKey] = useState(0);


	//loading initial data
    useEffect(() => {
			setTimeout(() => {
				initializeData();
			}, 500)
    },[]);

	useEffect(() => {
	if (mode === "producstandservices" && productDocuments.length === 0) {
		getAllProductDocuments();
	}
	}, [mode]);

const initializeData = async () => {
	await getAllDocuments(false, "General");
	await getAllJobs();
	await getDetails();
	await getDocumentTags();
	setLoading(false);
};

const notify = (msg, status) => {
	if (status === "success") {
		toast.success(msg);
	} else if (status === "error") {
		toast.error(msg);
	} else if (status === "warning") {
		toast.info(msg);
	}
};

	// get all documents
const getAllDocuments = async (
  isProductTag = false,
  productName = "General",
  page = pageNumber,
  size = pageSize
) => {
  try {
    setNetworkError("");

    const res = await api.getDocuments(isProductTag, productName, page, size);
    const data = res?.data;

    // If backend returns plain array
    if (Array.isArray(data)) {
      setGeneralDocuments(data);
      // Unknown total pages — treat as "Next exists if we got a full page"
      setTotalPages(1);
      return;
    }

    // If backend returns object { items, totalPages/totalCount }
    const items = data?.items || data?.data || [];
    setGeneralDocuments(Array.isArray(items) ? items : []);

    const apiTotalPages = data?.totalPages ?? data?.pages ?? null;
    const totalCount = data?.totalCount ?? data?.totalItems ?? data?.count ?? null;

    if (apiTotalPages != null) {
      setTotalPages(Number(apiTotalPages) || 1);
    } else if (totalCount != null) {
      setTotalPages(Math.max(1, Math.ceil(Number(totalCount) / size)));
    } else {
      setTotalPages(1);
    }
  } catch (e) {
    if (e?.status === 401) navigate("/admin/login");
    console.error(e);
    setNetworkError("Something went wrong. Try again later.");
    setGeneralDocuments([]);
    setTotalPages(1);
  }
};

useEffect(() => {
  if (mode === "files") {
    getAllDocuments(false, "General", pageNumber, pageSize);
  }
}, [pageNumber, pageSize, mode]);
    

const validateFileSize = (data, maxMB) => {
	const maxSize = maxMB * 1024 * 1024; 
	return data.size <= maxSize;
};

const handleUpload = async () => {
		if (!file) {
			notify("Please select a file to upload.", "warning");
			return;
		}

		if (!docInfo) {
			notify("Please select a document type.", "warning");
			return;
		}

		if(!validateFileSize(file, 10)) {
			notify("File must be less than 10MB", "error");
			return;
		};

		let docType;

		if (file.type === "application/pdf") {
			docType = 0; // PDF
		}
		else if (file.type === "text/plain") {
			docType = 1; // Text
		} else {
			notify("Unsupported File Type", "error");
			return;
		}

			const { base64String } = await convertFileToBytes(file);
			
		
		// Check uniqueness of documents
		if (generalDocuments 
				&& generalDocuments.some(d => d.fileName && d.fileName.toLowerCase() === file.name.toLowerCase())
				|| generalDocuments.some(d => d.data === base64String)) {
			notify("A document with this filename or content already exists.", "error");
			return;
		}

		setUploading(true);
		setError("");

		try {
			const document = {
				FileName: file.name,
				DocumentType: docType,
				productName:"General",
				documentTagsId: Number(docInfo),
				Data: base64String,
				Uploaded: new Date().toISOString(),
				DocumentInformation: docInfo
			};

			const res = await api.addDocument(document);
			await api.addAIDocument(res.data.id);

			setUploading(false);
			setFile(null);
			setDocInfo("");
			notify("Successfully uploaded file!", "success")
			getAllDocuments();

		} catch (e) {
			console.error("Error uploading document:", e);
			notify("Upload Failed. Try again later.", "error");
			setUploading(false);
		}
};

const handleDelete = (documentId) => async () => {
	setCurrentId(documentId);
	setDeleting(true);
	if (!window.confirm("Are you sure you want to delete this document?")) {
		setDeleting(false);
		return;
	}

	try {
		
		await api.deleteAIDocument(documentId);
		await api.deleteDocument(documentId);
		console.log("Document deleted successfully!");
		notify("Document deleted successfully!", "success")
		setDeleting(false);
		setCurrentId(null);
		getAllDocuments();
		getAllProductDocuments();
	} catch (e) {
		console.error("Error deleting document:", e);
		setDeleting(false);
		notify("Failed to delete document.", "error");
	}
};

const handleDownload = (document) => {
	try {
		downloadFileFromBase64(document.data, document.fileName);
	} catch (e) {
		console.error("Error downloading document:", e);
		notify("Failed to download document.", "error");
	}
};		

const getAllJobs = async () => {
	try {
		const res = await api.getJobs();
		setJobs(res.data);
	} catch(e){
		if(e.status == 401) { navigate("/admin/login");}
		setNetworkError("Something went wrong. Try again later.");
	}		
}

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
} 

//editAIModel, handleUseModel, deleteModel, details
//gets model credentials
const getDetails = async () => {
  const res = await api.getModelCredentials();
  setDetails(res.data || []);
};

const deleteModel = async (model) => {
  try{
    await api.deleteModelCredentials({
      id:model.id,
      isActive:false
    });
    notify?.("Model successfuly deleted.", "success");
    getDetails();
  }catch (e){
    console.error(e);
    notify?.("Failed to use model.", "error");
    getDetails();
  }
};

const handleUseModel = async (row) => {
  try {

    const response = await api.switchModel(row.id);

    const result = response.data;
    console.log("Switch model response:", result);

    if (result != "Success") {
      notify?.(
        result?.message || "Model switch failed.",
        "error"
      );
      return;
    }


    await api.editModelCredentialsByUsedModel({
      id: row.id,
      isImplemented: true,
    });

    notify?.("Model switched successfully.", "success");


    getDetails();
    console.log(response)
  } catch (e) {
    console.error(e);
    notify?.(
      e?.response?.data?.detail?.[0]?.msg ||
        e?.response?.data?.message ||
        "Failed to switch model.",
      "error"
    );
  }
};

const onEditModel= (row) => setEditingRow(row);

const onEditModelCost= (row) => setEditingRow(row);


//document tags
const getDocumentTags = async () => {
  try {
    const res = await api.getDocumentTags(false);
    setDocumentTags(Array.isArray(res?.data) ? res.data : []);
  } catch (e) {
    console.error(e);
    notify?.("Failed to load document tags.", "error");
    setDocumentTags([]);
  }
};

//get all products
const getAllProductDocuments = async () => {
  try {
    setNetworkError("");

    const resTags = await api.getDocumentTags(true);
    const tags = Array.isArray(resTags?.data) ? resTags.data : [];

    const productNames = [...new Set(tags.map(t => t?.tagName).filter(Boolean))];

    // if somehow no tags exist, at least fetch General so ProductName is not empty
    if (productNames.length === 0) {
      const res = await api.getDocuments(true, "General", 1, 100);
      setProductDocuments(Array.isArray(res?.data) ? res.data : []);
      return;
    }

    const responses = await Promise.all(
      productNames.map((name) => api.getDocuments(true, name, 1, 1000))
    );

    const merged = responses.flatMap((r) => (Array.isArray(r?.data) ? r.data : []));
    setProductDocuments(merged);
  } catch (e) {
    console.error(e);
    setNetworkError("Something went wrong. Try again later.");
    setProductDocuments([]);
    notify?.("Failed to load product documents.", "error");
  }
};
const hasNextPage = generalDocuments.length === pageSize;
//SIDEPANEL 
const SidePanel = () => {
		if (mode === "files") {
			return (
				<div className="md:w-1/8 lg:1/3 w-full p-8 bg-[#00092d] backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl 
							overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:rounded-full
					[&::-webkit-scrollbar-thumb]:bg-white/50"
				>
					<div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-b-white/50">
						<h1 className="text-2xl font-bold text-white pb-3 ">
						Document List
						</h1>
						
					</div>

						{generalDocuments && generalDocuments.length > 0 ? (
							generalDocuments.map(item => (
								<div key={item.documentId} className="relative group mt-2.5">
									<div className="flex p-2 bg-white/10 rounded-lg border border-white/10 hover:bg-white/20 transition-all duration-200">
										<button 
											onClick={() => handleDownload(item)}
											className="flex flex-1 items-center cursor-pointer hover:text-white"
										>
											<FileText className="mr-2 text-white/90 hover:text-white" />
											<p className="text-white/90 hover:text-white truncate">{item.fileName}</p>
										</button>
										<button onClick={handleDelete(item.documentId)} className="ml-auto flex-shrink-0" disabled={deleting}>
											{deleting && currentId === item.documentId ? (
												<LoaderCircle className="text-white/90 animate-spin"/>
											) : (
												<CircleX size={20} className="text-white/90 transition-transform duration-200 hover:scale-125"/>
											)}
										</button>
									</div>

									{/* Specific details */}
									<div className=" absolute right-0 left-0 top-full p-2 mt-1 bg-white/10 rounded-b-lg border border-t-0 border-white/10 shadow-xl overflow-hidden
										max-h-0 opacity-0 pointer-events-none group-hover:static group-hover:max-h-60 group-hover:opacity-100 group-hover:pointer-events-auto
										transition-all duration-300 ease-out"
									>
										<p className="text-white/90 truncate text-sm"><b>File Format:</b> {docTypeArr[item.documentType]}</p>
										<p className="text-white/90 truncate text-sm"><b>File Information:</b> {documentTags.find(t => Number(t.id) === Number(item.documentTagsId))?.tagName ?? "Unknown"}</p>
										<p className="text-white/90 truncate text-sm"><b>Date Uploaded:</b> {formatDate(item.uploaded)}</p>
									</div>
									
								</div>
								
							)) 
						) : (
								<>
						{ networkError ? (
							<p className="text-red-500 text-sm mt-2 font-medium text-center">{networkError}</p>
							) : (
								<p className="text-white/90 mt-4 text-center">No documents uploaded yet.</p>
							)}
								</>
							)}

					<div className="flex items-center justify-between px-5 py-4 border-t border-white/10">
						<button
						className="rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-sm text-white/90 disabled:opacity-40"
						disabled={pageNumber <= 1}
						onClick={() => setPageNumber(p => Math.max(1, p - 1))}
						>
						Prev
						</button>

						<p className="text-sm text-white/70">
						Page {pageNumber}
						</p>

						<button
						className="rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-sm text-white/90 disabled:opacity-40"
						disabled={totalPages > 1 ? pageNumber >= totalPages : !hasNextPage}
						onClick={() => setPageNumber((p) => p + 1)}
						>
						Next
						</button>
					</div>	
				</div>
					
			)
		}	
		if (mode === "addJob") {
			return <JobOpenings jobs={jobs} networkError={networkError} getAllJobs={getAllJobs} notify={notify} />
		}

		if (mode === "producstandservices") {
			return <ProductsandServicesList 
			 documents={productDocuments}
				handleDownload={handleDownload}
				handleDelete={handleDelete}
				deleting={deleting}
				currentId={currentId}
				docTypeArr={docTypeArr}
				documentTags={documentTags}
				formatDate={formatDate}
				networkError={networkError}
				tagMap={productTagMap}
				/>

		}
		
		if (mode === "models") {
			return<ModelList details={details} editAiModel={onEditModel} handleUseModel={handleUseModel} deleteModel={deleteModel} notify={notify} />
		}

		if (mode === "costing") {
			return<CostingList notify={notify} refreshKey={refreshKey} editModelCost={onEditModelCost}/>
		}


		return null;
	};

    return (
		<>
		{ !loading ? (
			<div className="flex flex-col min-h-screen bg-[url('/adminBG.jpg')] bg-cover bg-center select-none">

				<AdminNavBar setMode={setMode} />
				<div className="flex flex-col md:flex-row lg:flex-row justify-between gap-5 m-10 ">

					{/* Upload Files */}
					 <div className="w-full p-8 px-10 pb-16 bg-[#00092d] backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl">
						<div className="flex justify-between pb-3 mb-4">
							<h1 className="text-2xl font-bold text-white">
								{mode === "files" && "Upload General Files"}
								{mode === "addJob" && "Manage Jobs"}
								{mode === "models" && "Manage AI Models"}
								{mode === "costing" && "Model Costing"}
								{mode === "producstandservices" && "Upload Products and Services Files"}
								{mode === "report" }
							</h1>
						</div> 
						
						{mode === "files" && (
							<div className="flex-row justify-between gap-6">
								
								{/* Upload Input */}
								<span className="text-white/90 text-sm">Upload Document</span>
								<div className="flex w-full relative flex-col items-center justify-center border-2 border-dashed border-white/30 rounded-lg h-48 hover:bg-white/10 cursor-pointer">
									<input 
										onChange={(e) => setFile(e.target.files[0])}
										type="file" 
										accept=".pdf,.txt"
										className="border border-white/20 cursor-pointer text-white w-full h-full absolute opacity-0" 
									/>
									
									{file != null ? (
										<div className="w-full justify-center flex p-2 hover:bg-white/20 cursor-pointer">
												<FileText size={30} className="mr-2 text-white/90" />
												<p className="text-white/90 text-2xl">{file.name}</p>
										</div>
									) : (
										<div className="text-white/90 mt-4">Click to upload or drag and drop</div>
									)}
								</div>
									
								<div className="mt-4 w-full">
								<span className="text-white/90 text-sm">Document Type</span>
								<select
									value={docInfo}
									onChange={(e) => setDocInfo(e.target.value === "" ? "" : Number(e.target.value))}
									disabled={!file}
									className="block w-full px-3 py-2.5 rounded-lg bg-white/10 border border-default-medium text-white text-sm shadow-xs"
								>
									<option className="text-gray-800" value="">Select document type</option>
									{documentTags.map((t) => (
									<option key={t.id} value={t.id} className="text-gray-800">
										{t.tagName}
									</option>
									))}
								</select>
								</div>

								{/* Upload Button */}
								<div className="flex w-full"> 
									{error && <p className={`text-red-600 text-sm mt-2 font-medium
									bg-white p-1.5 px-2 rounded-b-lg`}>{error}</p>}

									<button onClick={handleUpload} disabled={uploading} className="w-full mt-6 bg-white/90 hover:bg-white/25 text-[#183398] hover:text-white text-md font-bold py-2 px-4 rounded-full transition">
										<span>{uploading ? (
											<div className="flex items-center justify-center">
												<LoaderCircle className="animate-spin mr-2"/>
												Uploading...
											</div>
										) : "Upload File"}</span>
									</button>
									{/* Cancel Button */}
									{
										file && !uploading && (
											<button onClick={() => {setFile(null); setDocInfo("")}} className="w-full mt-6 ml-4 bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded-full shadow-lg">
												Cancel
											</button>
										)
									}
								</div> 

							</div>
						)}

						{mode === "addJob" && (
						<AddNewJob getAllJobs={getAllJobs} notify={notify} jobs={jobs} />
						)}

						{mode === "models" && (
						<ManageAiModels notify={notify} getDetails={getDetails} editingRow={editingRow} clearEditingRow={() => setEditingRow(null)} />
						)}

						{mode === 'costing' && (
						<ModelCosting notify={notify} onSaved={() => setRefreshKey((prev) => prev + 1)} editingRow={editingRow} />
						)}

						{mode === "producstandservices" && (
						<ManageProductsandServices getAllJobs={getAllJobs} notify={notify} jobs={jobs} onUploaded={getAllProductDocuments} error={error} />
						)}	

						

						{mode === "report" && (
							<div className="w-full space-y-6">
						 		<div className="flex justify-between pb-3 mb-4">
									<h1 className={`text-4xl font-bold text-white ${
										reportMode === "dashboard" ? "text-center w-full" : ""
									}`}>
										{reportMode === "dashboard" && "PAXIE Cost Tracking Dashboard"}
										{reportMode === "querylogs" && "Query Logging"}
										{reportMode === "documentlogs" && "Document Logging"}
										{reportMode === "graphs" && "Graphs"}
										{reportMode === "calculator" && "Cost Calculator"}
									</h1>

							<select
								value={reportMode}
								onChange={(e) => setReportMode(e.target.value)}
								className="text-gray-600 font-semibold p-1.5 border border-gray-300 rounded-lg hover:bg-white "
							>
								<option value="dashboard">Cost Tracking Dashboard</option>
								<option value="querylogs">Query Logging</option>
								<option value="documentlogs">Document Logging</option>
								<option value="graphs">Graphs Report</option>
								<option value="calculator">Cost Calculator</option>
							</select>
							</div>

							{reportMode === "dashboard" && (
								<Dashboard />
							)}

							{reportMode === "querylogs" && (
								<QueryLogs />
							)}	

							{reportMode === "documentlogs" && (
								<DocumentLogs />
							)}

							{reportMode === "graphs" && (
								<Graphs />
							)}

							{reportMode === "calculator" && (
								<Calculator/>
							)}



							</div>
						)}

					</div>

						<SidePanel />

				</div>
				
				<Toast />

				

			</div>
		) : (
			<PageLoader/>
		)
		}
		</>
    );
}