import { CircleX, FileText, LoaderCircle } from "lucide-react";
import { useState } from "react";

export default function JobOpenings({jobs, networkError, getAllDocuments, notify}){
  const [deleting, setDeleting] = useState(false);
  const [currentId, setCurrentId] = useState(null);

 	const handleJobDelete = async (id) => {
			setCurrentId(documentId);
      setDeleting(true);
      if (!window.confirm("Are you sure you want to delete this document?")) {
        return;
      }

      try {
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
		}


  return (
    <>
      	{/* Job Openings */}
					<div className="md:w-1/8 lg:1/3 w-full  p-8 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl 
							overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:rounded-full
					[&::-webkit-scrollbar-thumb]:bg-white/50"
					>
							<h1 className="text-2xl font-bold text-white pb-3 border-b-2 border-b-white/50">Job Openings</h1>
							{jobs && jobs.length > 0 ? (
								jobs.map(item => (
										<div key={item.id} className="flex mt-2.5 p-2 bg-white/10 rounded-lg border border-white/10 hover:bg-white/20 cursor-pointer">
											<FileText className="mr-2 text-white/90" />
											<p className="text-white/90">{item.jobTitle}</p>
											<button onClick={handleJobDelete(item.id)} className="ml-auto" disabled={deleting}>
												{deleting && currentId === item.id ? (
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
    </>
  )
}