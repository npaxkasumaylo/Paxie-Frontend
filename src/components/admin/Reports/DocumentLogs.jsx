
export default function DocumentLogs (){
   return(
    <>
    <div className="w-full overflow-x-auto rounded-2xl border border-white/15 bg-white/10 backdrop-blur-lg shadow-2xl">
        <table className="w-full min-w-[720px] table-auto border-collapse">
            <thead className="bg-white/10">
                <tr className="[&>th]:px-5 [&>th]:py-4 [&>th]:text-left [&>th]:text-sm [&>th]:font-semibold [&>th]:text-white/90">
                    <th>Document Name</th>
                    <th>Embedding Model</th>
                    <th>LLM Model</th>
                    <th>Text Token Count</th>
                    <th>Image Text Token Count</th>
                </tr>
            </thead>

            <tbody className="divide-y divide-white/10">
                        
            </tbody>
        </table>
    </div>
    </>
    )
}