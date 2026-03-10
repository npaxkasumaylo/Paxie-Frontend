import { FileText } from "lucide-react";
import { useState, useEffect } from "react";
import Toast from "../Toast";
import { api } from "../../api/api";
import { convertFileToBytes } from "../../utils/FileConverter";
import { LoaderCircle } from "lucide-react";

export default function ManageProductsandServices({ notify, onUploaded }) {
  const [file, setFile] = useState(null);
  const [documentType, setDocumentType] = useState("");
  const [documentTags, setDocumentTags] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    getDocumentTags();
  }, []);

  const selectedTag = documentTags.find(
    (t) => Number(t.id) === Number(documentType),
  );

  const addProductService = async (e) => {
    e.preventDefault();

    if (!file){
      notify("Please select a file.", "warning");
      return;
    }

    if (!validateFileSize(file, 10)) {
      notify("File must be less than 10MB", "error");
      return;
    }

    let docType;
    if (file.type === "application/pdf") {
      docType = 0; // PDF
    } 
    else if (file.type === "text/plain") {
      docType = 1; // TXT
    } 
    else if (
      file.type === "application/msword" ||
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      docType = 2; // Word
    } 
    else if (
      file.type === "application/vnd.ms-excel" ||
      file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      docType = 3; // Excel
    } else {
      notify("Unsupported file type.", "error");
      return;
    }

    setUploading(true);

    try {
      const { base64String } = await convertFileToBytes(file);

      const document = {
        FileName: file.name,
        DocumentType: docType,
        productName: selectedTag?.tagName || "",
        documentTagsId: Number(documentType),
        Data: base64String,
        Uploaded: new Date().toISOString(),
      };

      const res = await api.addDocument(document);
      await api.addAIDocument(res.data.id);

      notify("Product document uploaded!", "success");
      cancel();
      await onUploaded?.();
    } catch (e) {
      console.error(e);
      notify("Upload failed.", "error");
    }
    setUploading(false);
  };

  const getDocumentTags = async () => {
    try {
      const res = await api.getDocumentTags(true);
      setDocumentTags(Array.isArray(res?.data) ? res.data : []);
      console.log("documentTags:", res.data);
    } catch (e) {
      console.error(e);
      notify?.("Failed to load document tags.", "error");
      setDocumentTags([]);
    }
  };

  const validateFileSize = (data, maxMB) => {
    const maxSize = maxMB * 1024 * 1024;
    return data.size <= maxSize;
  };

  const cancel = () => {
    setFile(null);
    setDocumentType("");
  };
  return (
    <div>
		<form className="flex-row justify-between gap-6" onSubmit={addProductService}>
      <span className="text-white/90 text-sm">Upload Document</span>
		<div className="flex w-full relative flex-col items-center justify-center border-2 border-dashed border-white/30 rounded-lg h-48 hover:bg-white/10 cursor-pointer">
            <input 
                type="file" 
                accept=".pdf,.txt,.doc,.docx,.xls,.xlsx"
                onChange={(e) => setFile(e.target.files[0])}
                className="border border-white/20 cursor-pointer text-white w-full h-full absolute opacity-0" 
            />
                                            
            {file ? (
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
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            disabled={!file}
            required
            className="block w-full px-3 py-2.5 rounded-lg bg-white/10 border border-default-medium text-white text-sm shadow-xs"
          >
            <option className="text-gray-800" value="">
              Select document type
            </option>

            {documentTags.map((t) => (
              <option key={t.id} value={t.id} className="text-gray-800">
                {t.tagName}
              </option>
            ))}
          </select>
        </div>

			<div className="flex w-full ">
        
				<button 
          disabled={uploading} 
          className={`w-full mt-6 bg-white text-[#183398] hover:bg-white/25  hover:text-white text-md font-bold py-2 px-4 rounded-full transition`}>
          {uploading ? (<><LoaderCircle className="animate-spin mr-2" />  <span className="ml-2">Uploading...</span></>) : "Upload File"}
        </button>

        { file && !uploading &&(
        <button 
          onClick={cancel}
				  className={`w-full mt-6 ml-4 bg-red-600 hover:bg-red-700 text-white text-md font-bold py-1.5 rounded-full transition`}>
					Cancel
			  </button>)}

			</div>
			</form>
		</div>
    )
}
