import { FileText } from "lucide-react";
import { useState } from "react";
import Toast from "../Toast";

export default function ManageProductsandServices({notify}) {
      const [fileName, setFileName] = useState(null);
      const [ProductName, setProductName] = useState("");
      const [documentType, setDocumentType] = useState("");


const addProductService = async (e) => {
    e.preventDefault();
    console.log("Product/Service:", ProductName);
    console.log("Document Type:", documentType);
    console.log("File:", fileName);
    notify("Product/Service added successfully!");

}

const cancel = () => {
    setFileName(null);
    setProductName("");
    setDocumentType("");
}
    return (
    <div>
		<form className="space-y-2" onSubmit={addProductService}>
			<label className="block">
                <span className="text-white/90 text-sm">Product/Service</span>
                <select
                value={ProductName}
                onChange={(e) => setProductName(e.target.value)}
                required
                className="block w-full px-3 py-2.5 cursor-pointer bg-white/10 border border-default-medium text-white text-sm rounded-lg shadow-xs">
                    <option className="text-gray-800" disabled value="">Select Product/Service</option>
                    <option className="text-gray-800" value="Product A">MC Frame 7</option>
                    <option className="text-gray-800" value="Product B">MC Frame GA</option>
                    <option className="text-gray-800" value="Service A">Dr. Sum</option>
                    <option className="text-gray-800" value="Service B">Motion Board</option>
                    <option className="text-gray-800" value="Service C">General</option>
                </select>
            </label>

        <label className="block">
            <span className="text-white/90 text-sm">Upload Document (PDF only)</span>
		<div className="flex w-full relative flex-col items-center justify-center border-2 border-dashed border-white/30 rounded-lg h-48 hover:bg-white/10 cursor-pointer">
            <input 
                type="file" 
                accept=".pdf"
                required
                onChange={(e) => setFileName(e.target.files[0].name)}
                disabled={ProductName === ""}
                className="border border-white/20 cursor-pointer text-white w-full h-full absolute opacity-0" 
            />
                                            
            {fileName != null ? (
                <div className="w-full justify-center flex p-2 hover:bg-white/20 cursor-pointer">
                    <FileText size={30} className="mr-2 text-white/90" />
                    <p className="text-white/90 text-2xl">{fileName}</p>
                </div>
                         ) : (
                <div className="text-white/90 mt-4">Click to upload or drag and drop</div>
                )}
        </div>
        </label>

		<label className="block">
            <span className="text-white/90 text-sm">Document Type</span>
            <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                disabled={fileName == null}
                className="block w-full px-3 py-2.5 cursor-pointer bg-white/10 border border-default-medium text-white text-sm rounded-lg shadow-xs">
                <option className="text-gray-800" disabled value="">Select document type</option>
                <option className="text-gray-800" value="Requirement A">Product Overview</option>
                <option className="text-gray-800" value="Requirement B">Technical Specifications</option>
                <option className="text-gray-800" value="Requirement C">User Manual</option>
            </select>
        </label>

			<div className="pt-5">
				<button 
				type="submit" 
				className={`w-full bg-white/20 text-gray-500 bg-white hover:bg-white/25 hover:text-white text-[#183398] text-md font-bold py-1.5 rounded-full transition`}
            >
                SAVE
            </button>
					</div>
			</form>
			<button 
                onClick={cancel}
				className={`w-full mt-2 bg-white/20 text-gray-500 hover:bg-red-600 hover:text-white text-md font-bold py-1.5 rounded-full transition`}>
					CANCEL
			</button>
            <Toast />
		</div>
    )
}