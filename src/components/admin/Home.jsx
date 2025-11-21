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

export default function Home() {
  const [uploading, setUploading] = useState(false);
	const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
	const [networkError, setNetworkError] = useState("");
  const [file, setFile] = useState(null);
	const [docInfo, setDocInfo] = useState(null);
  const navigate = useNavigate();
	const [documents, setDocuments] = useState([]);
  const [currentId, setCurrentId] = useState(null);
	const [jobs, setJobs] = useState([]);
	const [uploadFile, setUploadFile] = useState(true);


    useEffect(() => {
			setTimeout(() => {
				initializeData();
			}, 500)
    },[]);

		const initializeData = async () => {
			await getAllDocuments();
			await getAllJobs();
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

		// Retrieve all documents from the atabase
    const getAllDocuments = async () => {
			try {
				const res = await api.getDocuments();
				setDocuments(res.data);
			} catch (e) {
				if(e.status == 401) {navigate("/admin/login");}
				setNetworkError("Something went wrong. Try again later.");
			}
    };

	const handleUpload = async () => {
			// Validation for empty file
			if (!file) {
				notify("Please select a file to upload.", "warning");
				return;
			}

			// Validation for no chosen docInfo
			if (docInfo == null) {
				notify("Please select a document type.", "warning");
				return;
			}

			let docType;

			if (file.type === "application/pdf") {
				docType = 0; // PDF
			} else {
				notify("Unsupported File Type", "error");
				return;
			}

				const { byteArray, base64String } = await convertFileToBytes(file);
				
			
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
					Data: base64String,
					Uploaded: new Date().toISOString(),
					DocumentInformation: docInfo
				};

				const res = await api.addDocument(document);
				await api.addAIDocument(res.data.id);

				setUploading(false);
				setFile(null);
				setDocInfo(null);
				notify("Successfully uploaded file!", "success")
				getAllDocuments();

			} catch (e) {
				notify("Upload Failed. Try again later.", "error");
				setUploading(false);
			}
	};

	const handleDelete = (documentId) => async () => {
		setCurrentId(documentId);
		setDeleting(true);
		if (!window.confirm("Are you sure you want to delete this document?")) {
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

    return (
		<>
		{ !loading ? (
			<div className="flex flex-col min-h-screen bg-[url('/adminBG.jpg')] bg-cover bg-center select-none">

				<AdminNavBar />
				<div className="flex flex-col md:flex-row lg:flex-row justify-between gap-5 m-10 ">

					{/* Upload Files */}
					 <div className="w-full p-8 px-10 pb-16 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl">
						<div className="flex justify-between pb-3 mb-4">
							<h1 className="text-2xl font-bold text-white">	{uploadFile ? 'Upload Files' : 'Add Job Opening' }</h1>
							<button 
								className="text-white font-semibold p-1.5 border border-gray-300 rounded-lg hover:bg-white hover:text-gray-600"
								onClick={() => setUploadFile(!uploadFile)}
							>
								{uploadFile ? 'Manage Jobs' : 'Manage Files' }
							</button>
						</div> 
						
						{uploadFile &&
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
										disabled={!file ? true : false }
										onChange={(e) => setDocInfo(Number(e.target.value))} 
										className="block w-full px-3 py-2.5 cursor-pointer bg-white/10 border border-default-medium text-white text-sm rounded-lg shadow-xs"
									>
										<option className="text-gray-800" value={null}>Choose document type</option>
										<option className="text-gray-800" value={0}>Company Profile</option>
										<option className="text-gray-800" value={1}>Company Management</option>
										<option className="text-gray-800" value={2}>Product/Service Profile</option>
										<option className="text-gray-800" value={3}>Policy Profile</option>
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
											<button onClick={() => setFile(null)} className="w-full mt-6 ml-4 bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded-lg shadow-lg">
												Cancel
											</button>
										)
									}
								</div> 

							</div>
						}

						{!uploadFile &&
						<AddNewJob getAllJobs={getAllJobs} notify={notify} jobs={jobs} />
						}
						
					</div>



					{/* Document List */}
					<div className="md:w-1/8 lg:1/3 w-full p-8 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl 
							overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:rounded-full
					[&::-webkit-scrollbar-thumb]:bg-white/50"
					>
							<h1 className="text-2xl font-bold text-white pb-3 border-b-2 border-b-white/50">Document List</h1>
							{documents && documents.length > 0 ? (
								documents.map(item => (
										<div key={item.documentId} className="flex mt-2.5 p-2 bg-white/10 rounded-lg border border-white/10 hover:bg-white/20 transition-all duration-200 group">
											<button 
												onClick={() => handleDownload(item)}
												className="flex flex-1 items-center cursor-pointer group-hover:text-white"
											>
												<FileText className="mr-2 text-white/90 group-hover:text-white" />
												<p className="text-white/90 group-hover:text-white truncate">{item.fileName}</p>
											</button>
											<button onClick={handleDelete(item.documentId)} className="ml-auto flex-shrink-0" disabled={deleting}>
												{deleting && currentId === item.documentId ? (
													<LoaderCircle className="text-white/90 animate-spin"/>
												) : (
													<CircleX size={20} className=" text-white/90 ext-white/90 transition-transform duration-200 hover:scale-125"/>
												)}
											</button>
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
					
					{/* Job Openings */}
					<JobOpenings jobs={jobs} networkError={networkError} getAllJobs={getAllJobs} notify={notify} />

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