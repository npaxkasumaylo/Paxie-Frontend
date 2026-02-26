
export default function CostingList(){
  
    return(
         <div className="md:w-1/8 lg:1/3 w-full p-8 bg-[#00092d] backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl 
							overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:rounded-full
					[&::-webkit-scrollbar-thumb]:bg-white/50"
					>
			<h1 className="text-2xl font-bold text-white pb-3">Model Cost List</h1>	
            <div className="w-full overflow-x-auto rounded-2xl border border-white/15 bg-white/10 backdrop-blur-lg shadow-2xl">
                <table className="w-full min-w-[720px] table-auto border-collapse">
                    <thead className="bg-white/10">
                      <tr className="[&>th]:px-5 [&>th]:py-4 [&>th]:text-sm [&>th]:font-semibold [&>th]:text-white/90">
                        <th>Model Name</th>
                        <th>Input Cost</th>
                        <th>Output Cost</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-white/10">
                            <tr  className="transition text-center hover:bg-white/10">
                                <td className="px-5 py-4 text-white">
                                    <span className="font-semibold">
                                        Gpt-mini-5
                                    </span>
                                </td>

                                <td className="px-5 py-4 text-white/90">
                                  <span className= "font-semibold">
                                    $0.25
                                  </span>
                                </td>


                                <td className="px-5 py-4 text-white/90">
                                <span className="font-semibold">
                                    $2
                                </span>
                                </td>

                                <td>
                                    <button 
                                    className= "rounded-xl px-4 py-2 text-sm font-bold shadow transition bg-white/10 text-white cursor-not-allowed">
                                    Edit
                                    </button>
                                </td>
                            </tr>
                            <tr  className="transition text-center hover:bg-white/10">
                                <td className="px-5 py-4 text-white">
                                    <span className="font-semibold">
                                        ministral-large-3
                                    </span>
                                </td>

                                <td className="px-5 py-4 text-white/90">
                                  <span className= "font-semibold">
                                    $0.50
                                  </span>
                                </td>


                                <td className="px-5 py-4 text-white/90">
                                <span className="font-semibold">
                                    $1.50
                                </span>
                                </td>
                                
                                <td>
                                    <button 
                                    className= "rounded-xl px-4 py-2 text-sm font-bold shadow transition bg-white/10 text-white cursor-not-allowed">
                                    Edit
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                </table>
                </div>
        </div>
    )
}