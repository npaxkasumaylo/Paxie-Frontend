import { useEffect, useState, useMemo } from "react";
import { api } from "../../../api/api";

export default function QueryLogs ({ networkError}){
const [logs, setLogs] = useState([]);
const [pageNumber, setPageNumber] = useState(1);
const [pageSize] = useState(10);
const [providers, setProviders] = useState([]);
const [selectedProvider, setSelectedProvider] = useState("");
const [aiModels, setAIModels] = useState([]);
const [selectedAIModel, setSelectedAIModel] = useState("");

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

const getProviders = async () => {
    try{
        const res = await api.getAllProviders();
        setProviders(Array.isArray(res?.data) ? res.data : []);
    } catch(e){
        console.error(e);
        setProviders([]);
    }
}

const getModels = async () => {
    try{
        const res = await api.getModelCredentials();
        setAIModels(Array.isArray(res?.data) ? res.data : []);
    } catch(e){
        console.error(e);
        setAIModels([]);
    }
}

useEffect(() => {
  getQueryLogs();
  getProviders();
  getModels();
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

  const providerMap = useMemo(() => {
  const map = {};
  providers.forEach((p) => {
    map[String(p.id)] = p.name; // or p.providerName depending on your API
  });
  return map;
}, [providers]);

const formatNumber = (value, decimals = 2) => {
  if (value === null || value === undefined) return "0";

  const num = Number(value);

  return num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
};


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
                    <th>
                        <select
                            value={selectedProvider}
                            onChange={(e) => setSelectedProvider(e.target.value)}
                            className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white/90 outline-none">
                            <option value="">AI Providers</option>
                            {providers.map((p) => (
                                <option key={p.id} value={p.id} className="text-gray-800">
                                {p.name}
                                </option>
                            ))}
                        </select>
                    </th>
                    <th>
                        <select
                            value={selectedAIModel}
                            onChange={(e) => setSelectedAIModel(e.target.value)}
                            className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white/90 outline-none">
                            <option value="">AI Models</option>
                                {aiModels.map((model) => (
                                    <option key={model.id} value={model.id} className="text-gray-800">
                                        {model.modelName}
                                    </option>
                                ))}
                        </select>
                    </th>
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
                                    <span>{formatNumber(item.totalProcessingTime)}</span>
                                </td>
                                <td className="px-5 py-4 text-white/90">
                                    <span>{formatNumber(item.totalToolCalls)}</span>
                                </td>
                                <td className="px-5 py-4 text-white/90">
                                    <span>{formatNumber(item.totalOutputToken)}</span>
                                </td>
                                <td className="px-5 py-4 text-white/90">
                                    <span>{providerMap[String(item.serviceProviderId)]}</span>
                                </td>
                                <td className="px-5 py-4 text-white/90">
                                    <span>{item.aiModel}</span>
                                </td>
                                <td className="px-5 py-4 text-white/90">
                                    <span>{formatNumber(item.totalInputToken)}</span>
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
                <tr className="[&>th]:px-5 [&>th]:py-4 [&>th]:text-left [&>th]:text-lg [&>th]:font-semibold [&>th]:text-white/90">
                    <th className="px-5 py-4 text-white">Total</th>
                    <th className="px-5 py-4 text-white"></th>
                    <th className="px-5 py-4 text-white"></th>
                    <th className="px-5 py-4 text-white"></th>
                    <th className="px-5 py-4 text-white"></th>
                </tr>
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