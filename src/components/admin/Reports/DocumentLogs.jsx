import { useEffect, useState, useMemo } from "react";
import { api } from "../../../api/api";


export default function DocumentLogs ({networkError}){
const [logs, setLogs] = useState([]);
const [pageNumber, setPageNumber] = useState(1);
const [pageSize] = useState(10);
const [documentTags, setDocumentTags] = useState([]);
const [selectedTag, setSelectedTag] = useState("");

const getEmbeddingLogs = async () => {
    try{
        const res = await api.getEmbeddingLogs(pageNumber, pageSize);
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
  getEmbeddingLogs();
  getDocumentTags();
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

  const totals = useMemo(() => {
  if (!Array.isArray(logs) || logs.length === 0) {
    return {
      textTokenCount: 0,
      imageTextTokenInput: 0,
      imageTextTokenOutput: 0,
    };
  }

  return logs.reduce(
    (acc, item) => {
      acc.textTokenCount += Number(item.textTokenCount || 0);
      acc.imageTextTokenInput += Number(item.imageTextTokenInput || 0);
      acc.imageTextTokenOutput += Number(item.imageTextTokenOutput || 0);
      return acc;
    },
    {
      textTokenCount: 0,
      imageTextTokenInput: 0,
      imageTextTokenOutput: 0,
    }
  );
}, [logs]);

const getDocumentTags = async () => {
  try {
    const res = await api.getDocumentTags(true);
    setDocumentTags(Array.isArray(res?.data) ? res.data : []);
    console.log("documentTags:", res.data);
  } catch (e) {
    console.error(e);
    setDocumentTags([]);
  }
};


   return(
    <>
    <div className="w-full overflow-x-auto rounded-2xl border border-white/15 bg-white/10 backdrop-blur-lg shadow-2xl">
        <table className="w-full min-w-[720px] table-auto border-collapse">
            <thead className="bg-white/10">
                <tr className="[&>th]:px-5 [&>th]:py-4 [&>th]:text-left [&>th]:text-sm [&>th]:font-semibold [&>th]:text-white/90">
                    <th>Document Name</th>
                    <th className="px-5 py-4 text-white/90 text-center">
                        <select
                            value={selectedTag}
                            onChange={(e) => setSelectedTag(e.target.value)}
                            className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white/90 outline-none">
                            <option value="">Products/Services</option>
                            {documentTags.map((t) => (
                                <option key={t.id} value={t.id} className="text-gray-800">
                                {t.tagName}
                                </option>
                            ))}
                        </select>
                    </th>
                    <th>Embedding Model</th>
                    <th>LLM Model</th>
                    <th>Text Token Count</th>
                    <th>Image Text Token Input</th>
                    <th>Image Text Token Output</th>
                </tr>
            </thead>

            <tbody className="divide-y divide-white/10">
                {pagedLogs && pagedLogs.length > 0 ? (
                    pagedLogs.map((item) => (
                        <tr key={item.id} className="transition hover:bg-white/10">
                            <td className="px-5 py-4 text-white/90 max-w-[100px]">
                                <span className="truncate block">{item.documentName}</span>
                            </td>
                            <td className="px-5 py-4 text-white/90 max-w-[100px]">
                                <span className="truncate block">{item.productServiceName}</span>
                            </td>
                            <td className="px-5 py-4 text-white/90 max-w-[100px]">
                                <span className="truncate block">{item.embeddingModel}</span>
                            </td>
                            <td className="px-5 py-4 text-white/90 max-w-[100px]">
                                <span>{item.llmModel}</span>
                            </td>
                            <td className="px-5 py-4 text-white/90">
                                <span>{item.textTokenCount}</span>
                            </td>
                            <td className="px-5 py-4 text-white/90">
                                <span>{item.imageTextTokenInput}</span>
                            </td>
                            <td className="px-5 py-4 text-white/90">
                                <span>{item.imageTextTokenOutput}</span>
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
            {pagedLogs && pagedLogs.length > 0 && (
            <tr className="[&>th]:px-5 [&>th]:py-4 [&>th]:text-left [&>th]:text-lg [&>th]:font-semibold [&>th]:text-white/90">
                <th className="px-5 py-4 text-white">Total</th>
                <th className="px-5 py-4 text-white">-</th>
                <th className="px-5 py-4 text-white">-</th>
                <th className="px-5 py-4 text-white">-</th>
                <th className="px-5 py-4 text-white">{totals.textTokenCount}</th>
                <th className="px-5 py-4 text-white">{totals.imageTextTokenInput}</th>
                <th className="px-5 py-4 text-white">{totals.imageTextTokenOutput}</th>
            </tr>
            )}
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