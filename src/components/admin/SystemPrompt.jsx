import { useState } from "react"

export default function SystemPrompt({notify, promptPreview, setPromptPreview}) {
const [editing, setEditing] = useState(false)
const [systemPrompt, setSystemPrompt] = useState("")

const handleEdit = () => {
    setSystemPrompt(promptPreview);
    setEditing(true);
}

const handleSave = () => {
    const confirmed = window.confirm("Are you sure you want to update the system prompt? This will affect how the AI behaves.");

    if (!confirmed) return;
    
    setPromptPreview(systemPrompt)
    setEditing(false)
    setSystemPrompt("")
    notify("Prompt Successfuly Edited", "success");
}

const cancel = () => {
    setEditing(false)
    setSystemPrompt("")
}

    return (
        <div className="flex-row justify-between gap-6">
            {/* Upload Input */}

             <label className="text-sm text-gray-300 mb-2">
            Edit Prompt
            </label>

            <textarea
             value={editing ? systemPrompt : ""}
			  minLength={10}
			  maxLength={4000}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="w-full h-[350px] bg-[#0B1E4A] text-white font-mono text-sm
                p-4 rounded-lg border border-blue-900 focus:outline-none focus:ring-2
                focus:ring-blue-500 resize-none"
                placeholder="Enter AI system instructions..."
            />
            <div className="text-xs text-gray-400 mt-2 text-right">
                {(editing ? systemPrompt.length : 0)} / 4000 characters
            </div>

            {/* Upload Button */}
            <div className="flex w-full"> 
            {! editing ? (
                <button 
                onClick={handleEdit}
                className={`w-full mt-6 bg-white text-[#183398] hover:bg-white/25  hover:text-white text-md font-bold py-2 px-4 rounded-full transition`}>
                    Edit Prompt
                </button>
                ):(
                    <>
                    
              <button
                onClick={handleSave}
                disabled={systemPrompt.trim().length < 10}
                className="w-full mt-2 bg-white text-[#183398] hover:bg-white/25  hover:text-white text-md font-bold py-1.5 rounded-full transition"
              >
                Save
              </button>

              <button
                onClick={cancel}
                className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white text-md font-bold py-2 px-4 rounded-full transition"
              >
                Cancel
              </button>
                    </>
                )
            }
    
            </div> 
        </div>
    )
}