import { CircleX, FileText, LoaderCircle, LoaderIcon } from "lucide-react";
import React, { use, useEffect, useState } from "react";
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

export default function Home() {
  const [uploading, setUploading] = useState(false);
	const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
	const [networkError, setNetworkError] = useState("");
  const [file, setFile] = useState(null);
	const [docInfo, setDocInfo] = useState("");
  const navigate = useNavigate();
	const [documents, setDocuments] = useState([]);
  const [currentId, setCurrentId] = useState(null);
	const [jobs, setJobs] = useState([]);
	const [mode, setMode] = useState("files");
	const docTypeArr = ['Pdf File', 'Excel File', 'Word FIle'];
	const docInfoArr = ['Company Profile', 'Company Management', 'Product/Service Profile', 'Policy Profile'];
const [details, setDetails] = useState([]);
const [editingRow, setEditingRow] = useState(null);

 const [documentTags, setDocumentTags] = useState([]);


    useEffect(() => {
			setTimeout(() => {
				initializeData();
			}, 500)
    },[]);

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

    const getAllDocuments = async (isProductTag = false, productName = "General") => {
			try {
				const res = await api.getDocuments(isProductTag, productName);
				setDocuments(res.data);
			} catch (e) {
				if(e.status == 401) {navigate("/admin/login");}
				setNetworkError("Something went wrong. Try again later.");
			}
    };

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
			} else {
				notify("Unsupported File Type", "error");
				return;
			}

				const { base64String } = await convertFileToBytes(file);
				
			
			// Check uniqueness of documents
			if (documents 
					&& documents.some(d => d.fileName && d.fileName.toLowerCase() === file.name.toLowerCase())
					|| documents.some(d => d.data === base64String)) {
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

	const SidePanel = () => {
		if (mode === "files") {
			return (
				<div className="md:w-1/8 lg:1/3 w-full p-8 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl 
							overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:rounded-full
					[&::-webkit-scrollbar-thumb]:bg-white/50"
					>
							<h1 className="text-2xl font-bold text-white pb-3 border-b-2 border-b-white/50">General Document List</h1>
							{documents && documents.length > 0 ? (
								documents.map(item => (
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
							
					</div>
			)
		}	
		if (mode === "addJob") {
			return <JobOpenings jobs={jobs} networkError={networkError} getAllJobs={getAllJobs} notify={notify} />
		}

		if (mode === "producstandservices") {
			return <ProductsandServicesList jobs={jobs} networkError={networkError} getAllJobs={getAllJobs} notify={notify} />
		}
		
		if (mode === "models") {
			return<ModelList details={details} editAiModel={onEditModel} handleUseModel={handleUseModel} deleteModel={deleteModel} notify={notify} />
		}

		return null;
	};

    return (
		<>
		{ !loading ? (
			<div className="flex flex-col min-h-screen bg-[url('/adminBG.jpg')] bg-cover bg-center select-none">

				<AdminNavBar />
				<div className="flex flex-col md:flex-row lg:flex-row justify-between gap-5 m-10 ">

					{/* Upload Files */}
					 <div className="w-full p-8 px-10 pb-16 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl">
						<div className="flex justify-between pb-3 mb-4">
							<h1 className="text-2xl font-bold text-white">
								{mode === "files" && "Upload General Files"}
								{mode === "addJob" && "Manage Jobs"}
								{mode === "models" && "Manage AI Models"}
								{mode === "producstandservices" && "Products and Services"}
							</h1>
							<select
								value={mode}
								onChange={(e) => setMode(e.target.value)}
								className="text-gray-600 font-semibold p-1.5 border border-gray-300 rounded-lg hover:bg-white "
							>
								<option value="files">Manage Files</option>
								<option value="addJob">Manage Jobs</option>
								<option value="producstandservices">Products and Services</option>
								<option value="models">AI Models</option>
							</select>
						</div> 
						
						{mode === "files" && (
							<div className="flex-row justify-between gap-6">
								
								{/* Upload Input */}
								<div className="flex w-full relative flex-col items-center justify-center border-2 border-dashed border-white/30 rounded-lg h-48 hover:bg-white/10 cursor-pointer">
									<input 
										onChange={(e) => setFile(e.target.files[0])}
										type="file" 
										accept=".pdf"
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
								<select
									value={docInfo}
									onChange={(e) => setDocInfo(e.target.value === "" ? "" : Number(e.target.value))}
									disabled={!file}
									className="block w-full px-3 py-2.5 cursor-pointer bg-white/10 border border-default-medium text-white text-sm rounded-lg shadow-xs"
								>
									<option className="text-gray-800" value="">Choose document type</option>

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

									<button onClick={handleUpload} disabled={uploading} className="w-full mt-6 bg-white/90 hover:bg-white/50 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-lg">
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
											<button onClick={() => {setFile(null); setDocInfo(4)}} className="w-full mt-6 ml-4 bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded-lg shadow-lg">
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

						{mode === "producstandservices" && (
						<ManageProductsandServices getAllJobs={getAllJobs} notify={notify} jobs={jobs} />
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