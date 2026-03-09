import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { useEffect, useState } from "react";
import { api } from "../../../api/api";



export default function Dashboard (){
    const [queryLogs, setQueryLogs] = useState([]);
    const [cardData, setCardData] = useState(null);
    const [loadingCard, setLoadingCard] = useState(false);
    const [loadingLogs, setLoadingLogs] = useState(false);



 useEffect(() => {
  const loadDashboard = async () => {
    setLoadingCard(true);
    try {
      const res = await api.getDashboardData();
      setCardData(res?.data ?? null);
    } catch (e) {
      console.error(e);
      setCardData(null);
    } finally {
      setLoadingCard(false);
    }
  };

  loadDashboard();
}, []);



  const totalIngestionCost  = Number(cardData?.totalIngestionCost ?? 0);
  const totalQueryCost = Number(cardData?.totalQueryCost ?? 0);
  const averageQueryCost = Number(cardData?. averageQueryCost ?? 0);
  const averageIngestionCost = Number (cardData?. averageIngestionCost ?? 0);
  const grandTotalCost = Number (cardData?. grandTotalCost ?? 0);
  const totalTokenUsage = Number(cardData?.totalTokenUsage ?? 0);
  const totalQueryCount = Number(cardData?.totalQueryCount ?? 0);
  const totalEmbeddingCount = Number(cardData?.totalEmbeddingCount ?? 0);

const getAllQueryLogs = async () => {
  setLoadingLogs(true);
  try {
    const res = await api.getDashboardQueryData(); // ✅ /Costing/query
    const data = res?.data;

    const items = Array.isArray(data) ? data : (data?.items || data?.data || []);
    setQueryLogs(Array.isArray(items) ? items : []);
  } catch (e) {
    console.error(e);
    setQueryLogs([]);
  } finally {
    setLoadingLogs(false);
  }
};

useEffect(() => {
  getAllQueryLogs();
 const t = setInterval(getAllQueryLogs, 5000);
  return () => clearInterval(t);
}, []);



   return(
    <>  
        <div className="w-full rounded-2xl p-6 ">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
                {/* Card 1 Check*/ }
                <div className="bg-[#27304d] border border-blue-400/10 rounded-xl p-6 
                                hover:bg-[#0056e5] hover:scale-[1.02] transition-all duration-300 
                                shadow-md hover:shadow-lg">
                <p className="text-sm text-blue-200/70 font-medium">
                    Total Ingestion Cost
                </p>
                <p className="mt-3 text-3xl font-semibold text-white">
                    {loadingCard ? "Loading..." : `$${totalIngestionCost.toFixed(4)}`}
                </p>
                </div>

                {/* Card 2 check*/}
                <div className="bg-[#27304d] border border-blue-400/10 rounded-xl p-6 
                                hover:bg-[#0056e5] hover:scale-[1.02] transition-all duration-300 
                                shadow-md hover:shadow-lg">
                <p className="text-sm text-blue-200/70 font-medium">
                    Total Query Cost
                </p>
                <p className="mt-3 text-3xl font-semibold text-white">
                    {loadingCard ? "Loading..." : `$${totalQueryCost.toFixed(4)}`}
                </p>
                </div>

                {/* Card 3 to change*/}
                <div className="bg-[#27304d] border border-blue-400/10 rounded-xl p-6 
                                hover:bg-[#0056e5] hover:scale-[1.02] transition-all duration-300 
                                shadow-md hover:shadow-lg">
                <p className="text-sm text-blue-200/70 font-medium">
                    Total Overall Cost 
                </p>
                <p className="mt-3 text-3xl font-semibold text-white">
                    {loadingCard ? "Loading..." : `$${grandTotalCost.toFixed(4)}`}
                </p>
                </div>

                {/* Card 4 */}
                <div className="bg-[#27304d] border border-blue-400/10 rounded-xl p-6 
                                hover:bg-[#0056e5] hover:scale-[1.02] transition-all duration-300 
                                shadow-md hover:shadow-lg">
                <p className="text-sm text-blue-200/70 font-medium">
                    Average Ingestion Cost
                </p>
                <p className="mt-3 text-3xl font-semibold text-white">
                    {loadingCard ? "Loading..." : `$${averageIngestionCost.toFixed(4)}`}
                </p>
                </div>

                {/* Card 5 */}
                <div className="bg-[#27304d] border border-blue-400/10 rounded-xl p-6 
                                hover:bg-[#0056e5] hover:scale-[1.02] transition-all duration-300 
                                shadow-md hover:shadow-lg">
                <p className="text-sm text-blue-200/70 font-medium">
                    Average Query Cost
                </p>
                <p className="mt-3 text-3xl font-semibold text-white">
                    {loadingCard ? "Loading..." : `$${averageQueryCost.toFixed(4)}`}
                </p>
                </div>

                {/* Card 6 check*/}
                <div className="bg-[#27304d] border border-blue-400/10 rounded-xl p-6 
                                hover:bg-[#0056e5] hover:scale-[1.02] transition-all duration-300 
                                shadow-md hover:shadow-lg">
                <p className="text-sm text-blue-200/70 font-medium">
                    Overall Token Usage
                </p>
                <p className="mt-3 text-3xl font-semibold text-white">
                    {loadingCard ? "Loading..." : `${totalTokenUsage.toLocaleString()}`}
                </p>
                </div>

            </div>

            <div className="grid grid-cols-2 sm:grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Card 5 */}
                <div className="bg-[#27304d] border border-blue-400/10 rounded-xl p-6 
                                hover:bg-[#0056e5] hover:scale-[1.02] transition-all duration-300 
                                shadow-md hover:shadow-lg">
                <p className="text-sm text-blue-200/70 font-medium">
                    Total Query
                </p>
                <p className="mt-3 text-3xl font-semibold text-white">
                    {loadingCard ? "Loading..." : `${totalQueryCount.toFixed()}`} Queries
                </p>
                </div>

                {/* Card 6 check*/}
                <div className="bg-[#27304d] border border-blue-400/10 rounded-xl p-6 
                                hover:bg-[#0056e5] hover:scale-[1.02] transition-all duration-300 
                                shadow-md hover:shadow-lg">
                <p className="text-sm text-blue-200/70 font-medium">
                    Total Document Embeddings
                </p>
                <p className="mt-3 text-3xl font-semibold text-white">
                    {loadingCard ? "Loading..." : `${totalEmbeddingCount.toFixed()}`} Documents
                </p>
                </div>

            </div>

        </div>

        <hr className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-lg shadow-2xl"/>
        <h1  className='text-3xl font-bold text-white'>Graphs</h1>
        <div className="w-full flex gap-6 p-6">
            <iframe
                className="rounded-2xl w-full"
                src="https://ai.n-pax.com:3000/public-dashboards/30a591b2889a4c6a9a7bd991ad058e4d"
                height="600"
            />
        </div>
        
        <hr className="border border-white/15 bg-white/10 backdrop-blur-lg shadow-2xl"/>
        <h1  className='text-3xl font-bold text-white'>Running Cost: per user query (live feed)</h1>
        <div className="w-full overflow-x-auto rounded-2xl overflow-hidden bg-[#27304d] ">
            <table className="w-full min-w-[720px] table-auto ">
                <thead className="bg-[#27304d] border-b  border-blue-400/10">
                    <tr className="[&>th]:px-10 [&>th]:py-4 [&>th]:text-center [&>th]:text-xl [&>th]:font-semibold [&>th]:text-white/90">
                        <th>Timestamp</th>
                        <th>User Query</th>
                        <th>Reflection Model Token</th>
                        <th>Answering Model Token</th>
                        <th>Total Token</th>
                        <th>Query Cost</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-blue-400/5 bg-[#27304d] ">
                {queryLogs && queryLogs.length > 0 ? (
                queryLogs.map((item) => (
                    <tr 
                     key={item.queryLogId ?? item.timeStamp}
                    className="border-b border-blue-400/5 hover:bg-[#0056e5] transition-colors duration-200">
                        <td className="px-10 py-4 text-white/90 text-center">
                            <span>{new Date(item.timeStamp).toLocaleString()}</span>
                        </td>
                        <td className="px-5 py-4 text-white/90 max-w-[100px]">
                            <span className="block truncate">{item.userQuery}</span>
                        </td>
                        <td className="px-10 py-4 text-white/90 text-center">
                        <span>{item.reflectionModelTotalTokenUsage}</span>
                        </td>
                        <td className="px-10 py-4 text-white/90 text-center">
                            <span>
                            {Number(item.answeringModelTotalTokens ?? 0).toLocaleString()}
                            </span>
                        </td>
                        <td className="px-10 py-4 text-white/90 text-center">
                            <span>
                              {Number(item.totalTokensUsed ?? 0).toLocaleString()}
                            </span>
                        </td>
                        <td className="px-10 py-4 text-white/90 text-center">
                            <span>
                            ${Number(item.totalQueryCost ?? 0).toFixed(6)}
                            </span>
                        </td>
                    </tr>
                                ))
                        ) : (
                        <tr>
                            <td colSpan={13} className="px-5 py-16 text-center align-middle">
                                <p className="text-white/80 text-sm">
                                {loadingLogs ? "Loading query logs..." : "No query logs yet."}
                                </p>
                            </td>
                        </tr>
                        )}
                </tbody>
            </table>
        </div>
    </>
    )
}