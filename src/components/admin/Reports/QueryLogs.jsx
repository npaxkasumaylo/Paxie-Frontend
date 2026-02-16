import { useEffect, useState, useMemo } from "react";
import { api } from "../../../api/api";

export default function QueryLogs ({ networkError}){
const [logs, setLogs] = useState([]);
const [pageNumber, setPageNumber] = useState(1);
const [pageSize] = useState(10);

const getQueryLogs = async () => {
    try{
        const res = await api.getQueryLogs(pageNumber, pageSize);
        const data = res?.data;

        if(Array.isArray(res.data)){
            setLogs(res.data);
            return
        }
        setLogs(data?.items || data?.data || []);
    }catch (e){
        console.error(e);
        setLogs([]);
    }
};

useEffect(() => {
  getQueryLogs();
}, []);

 const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil((logs?.length || 0) / pageSize));
  }, [logs, pageSize]);

  // ✅ slice like Products & Services
  const pagedLogs = useMemo(() => {
    const safePage = Math.min(Math.max(1, pageNumber), totalPages);
    const start = (safePage - 1) * pageSize;
    return (Array.isArray(logs) ? logs : []).slice(start, start + pageSize);
  }, [logs, pageNumber, pageSize, totalPages]);

  // ✅ clamp when logs shrink
  useEffect(() => {
    if (pageNumber > totalPages) setPageNumber(totalPages);
  }, [totalPages, pageNumber]);

   return(
    <>
        <div className="w-full overflow-x-auto rounded-2xl border border-white/15 bg-white/10 backdrop-blur-lg shadow-2xl">
            <table className="w-full min-w-[720px] table-auto border-collapse">
                <thead className="bg-white/10">
                    <tr className="[&>th]:px-5 [&>th]:py-4 [&>th]:text-left [&>th]:text-sm [&>th]:font-semibold [&>th]:text-white/90">
                    <th>User Query</th>
                    <th>AI Response</th>
                    <th>Relfection Model</th>
                    <th>Total Processing Time</th>
                    <th>Total tool calls</th>
                    <th>Total Output token</th>
                    <th>AI Provider</th>
                    <th>Input token throughput</th>
                    <th>Output token throughput</th>
                    <th>Overall throughput</th>
                    <th>Total Input token</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-white/10">
                    {pagedLogs && pagedLogs.length > 0 ? (
                                    pagedLogs.map((item) => (
                                        <tr key={item.id} className="transition hover:bg-white/10">
                                            <td className="px-5 py-4 text-white/90 max-w-[100px]">
                                                <span className="truncate block">{item.userQuery}</span>
                                            </td>
                                            <td className="px-5 py-4 text-white/90 max-w-[100px]">
                                                <span className="truncate block">{item.aiResponse}</span>
                                            </td>
                                            <td className="px-5 py-4 text-white/90 max-w-[100px]">
                                                <span>{item.reflectionModel}</span>
                                            </td>
                                            <td className="px-5 py-4 text-white/90">
                                                <span>{item.totalProcessingTime}</span>
                                            </td>
                                            <td className="px-5 py-4 text-white/90">
                                                <span>{item.totalToolCalls}</span>
                                            </td>
                                            <td className="px-5 py-4 text-white/90">
                                                <span>{item.totalOutputToken}</span>
                                            </td>
                                            <td className="px-5 py-4 text-white/90">
                                                <span>{item.aiProvider}</span>
                                            </td>
                                            <td className="px-5 py-4 text-white/90">
                                                <span>{item.inputTokenThroughput}</span>
                                            </td>
                                            <td className="px-5 py-4 text-white/90">
                                                <span>{item.outputTokenThroughput}</span>
                                            </td>
                                            <td className="px-5 py-4 text-white/90">
                                                <span>{item.overallThroughput}</span>
                                            </td>
                                            <td className="px-5 py-4 text-white/90">
                                                <span>{item.totalInputToken}</span>
                                            </td>
                                        </tr>
                                        
                                    )) 
                                ) : (
                                     <tr>
                                <td
                                    colSpan={11}
                                    className="px-5 py-16 text-center align-middle"
                                >
                                    {networkError ? (
                                    <p className="text-red-400 font-medium">{networkError}</p>
                                    ) : (
                                    <p className="text-white/80 text-sm">No query logs yet.</p>
                                    )}
                                </td>
                                </tr>
                        )}
                </tbody>
            </table>
            <div className="flex items-center justify-between px-5 py-4 border-t border-white/10">
                <button
                className="rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-sm text-white/90 disabled:opacity-40"
                disabled={pageNumber <= 1}
                onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                >
                Prev
                </button>

                <p className="text-sm text-white/70">
                Page {pageNumber} of {totalPages}
                </p>

                <button
                className="rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-sm text-white/90 disabled:opacity-40"
                disabled={pageNumber >= totalPages}
                onClick={() => setPageNumber((p) => Math.min(totalPages, p + 1))}
                >
                Next
                </button>
            </div>
        </div>
    </>
    )
}