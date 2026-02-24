
export default function ModelCosting() {
    return (
        <div>
        <form  className="space-y-2">
        <label className="block">

             <span className="text-white/90 text-sm">AI Model</span>
            <select
                className="mt-2 block w-full rounded-lg bg-white/10 border border-white/20 px-4 py-1.5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/80"
                >
                <option className="text-gray-900" value="">Select an AI model</option>
                <option className="text-gray-900" value="">gpt-mini-5</option>
                <option className="text-gray-900" value="">mistral-medium-2508</option>
                <option className="text-gray-900" value="">claude-haiku-4-5-20251001</option>
                <option className="text-gray-900" value="">gemini-2.0-flash-lite</option>
                <option className="text-gray-900" value="">Mistral-Large-3</option>

            </select>
        </label>  
        <label className="block">
            <span className="text-white/90 text-sm">Input Cost</span>
            <input
                placeholder="Input cost amount per million token"
                className="mt-2 block w-full rounded-lg bg-white/10 border border-white/20 px-4 py-1.5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/80"
                />
        </label>

        <label className="block">
            <span className="text-white/90 text-sm">Output Cost</span>
            <span className="text-white/90 text-sm"></span>
            <input
              type="text"
              required
              placeholder="Output cost amount per million token"
              className="mt-2 block w-full rounded-lg bg-white/10 border border-white/20 px-4 py-1.5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/80"
            />
          </label>



        <div className="pt-5">
            <button 
                type="submit" 
                className={`w-full bg-white text-[#183398] hover:bg-white/25  hover:text-white text-md font-bold py-1.5 rounded-full transition`}
            >
                SAVE
            </button>
        </div>
            </form>
            <button 
                className={`w-full mt-2 bg-red-600 hover:bg-red-700 text-white text-md font-bold py-1.5 rounded-full transition`}>
                    CANCEL
            </button>
        </div>
    )
}