import { CircleX, FileText, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../../api/api";

export default function ProductsandServicesList({
  handleDownload,
  handleDelete,
  deleting,
  currentId,
  docTypeArr = [],
  documentTags = [],
  formatDate,
  notify
}){


const [documents, setDocuments] = useState([]);
  const [networkError, setNetworkError] = useState("");

const getProductDocuments = async (isProductTag = true ) => {
    try {
      const res = await api.getDocuments(isProductTag);
      setDocuments(res.data);
      setNetworkError("");
    } catch (e) {
      console.error(e);
      setNetworkError("Something went wrong. Try again later.");
      notify?.("Failed to load product documents.", "error");
    }
  };

  useEffect(() => {
    getProductDocuments();
  }, []);

  return (
    <>
      	{/* Job Openings */}
			<div className="md:w-1/8 lg:1/3 w-full  p-8 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl 
				overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:rounded-full
				[&::-webkit-scrollbar-thumb]:bg-white/50"
			>
			<h1 className="text-2xl font-bold text-white pb-3 border-b-2 border-b-white/50">Products and Services List</h1>
				{documents && documents.length > 0 ? (documents.map(item => (
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
    </>
  )
}