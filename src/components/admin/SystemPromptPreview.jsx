export default function SystemPromptPreview({savedPrompt}) {


    return (
        <div className="md:w-1/8 lg:1/3 w-full p-8 bg-[#00092d] backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl 
							overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:rounded-full
					[&::-webkit-scrollbar-thumb]:bg-white/50"
					>
            <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-b-white/50">
                <h2 className="text-xl font-bold text-white mb-4">
                    Prompt Preview
                </h2>

                <select
                    className="text-gray-600 font-semibold p-1.5 border border-gray-300 rounded-lg hover:bg-white "
                >
                    <option value="answering">Answering Model</option>
                    <option value="identifier">Identifier Model</option>
                    <option value="reflection">Reflection Model</option>
                </select>	

            </div>

            <div className="bg-[#0B1E4A] rounded-lg p-4 h-[350px] overflow-auto">
                <p className="text-gray-200 text-sm font-mono whitespace-pre-wrap leading-relaxed">
                    {savedPrompt}
                </p>
            </div>
            <div className="py-2 mt-auto text-right">
                <p className="text-sm text-gray-300 mb-4">
                    This prompt defines how the AI behaves. Be careful when modifying it.
                </p>
            </div>
        </div>
    )
}