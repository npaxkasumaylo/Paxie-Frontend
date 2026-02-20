import { useEffect, useMemo, useState } from "react";
import { api } from "../../../api/api";

export default function DocumentLogs({ networkError }) {
  const [allLogs, setAllLogs] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;

  const [documentTags, setDocumentTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");

  const getDocumentTags = async () => {
    try {
      const res = await api.getDocumentTags(true);
      setDocumentTags(Array.isArray(res?.data) ? res.data : []);
    } catch (e) {
      console.error(e);
      setDocumentTags([]);
    }
  };

  // ✅ Fetch ALL pages once
  const getAllEmbeddingLogs = async () => {
    try {
      const collected = [];
      let p = 1;

      while (true) {
        const res = await api.getEmbeddingLogs(p, pageSize);
        const data = res?.data;

        const items = Array.isArray(data) ? data : (data?.items || data?.data || []);
        if (!Array.isArray(items) || items.length === 0) break;

        collected.push(...items);

        // stop if last page
        if (items.length < pageSize) break;

        p += 1;
      }

      setAllLogs(collected);
    } catch (e) {
      console.error(e);
      setAllLogs([]);
    }
  };

  useEffect(() => {
    getDocumentTags();
    getAllEmbeddingLogs();
  }, []);

  // ✅ reset to page 1 when filter changes
  useEffect(() => {
    setPageNumber(1);
  }, [selectedTag]);

  // ✅ filter across ALL logs
  const filteredLogs = useMemo(() => {
    return (Array.isArray(allLogs) ? allLogs : []).filter((item) => {
      if (!selectedTag) return true;
      return String(item.productName || "") === String(selectedTag);
    });
  }, [allLogs, selectedTag]);

  // ✅ local pagination now works correctly
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredLogs.length / pageSize));
  }, [filteredLogs.length]);

  const pagedLogs = useMemo(() => {
    const safePage = Math.min(Math.max(1, pageNumber), totalPages);
    const start = (safePage - 1) * pageSize;
    return filteredLogs.slice(start, start + pageSize);
  }, [filteredLogs, pageNumber, totalPages]);

  const totals = useMemo(() => {
    return filteredLogs.reduce(
      (acc, item) => {
        acc.textTokenCount += Number(item.textTokenCount || 0);
        acc.imageTextTokenInput += Number(item.imageTextTokenInput || 0);
        acc.imageTextTokenOutput += Number(item.imageTextTokenOutput || 0);
        return acc;
      },
      { textTokenCount: 0, imageTextTokenInput: 0, imageTextTokenOutput: 0 }
    );
  }, [filteredLogs]);

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-blue-400/10  bg-[#0b1f3a] backdrop-blur-lg shadow-[0_0_40px_rgba(0,0,0,0.6)]">
      <table className="w-full min-w-[720px] table-auto border-collapse">
        <thead className="bg-[#132a4a] border-b border-blue-400/10">
          <tr className="[&>th]:px-5 [&>th]:py-4 [&>th]:text-left [&>th]:text-sm [&>th]:font-semibold [&>th]:text-white/90">
            <th>Timestamp</th>
            <th>Document Name</th>
            <th className="px-5 py-4 text-white/90">
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white/90 outline-none"
              >
                <option value="" className="text-gray-800">Products/Services</option>
                {documentTags.map((t) => (
                  <option key={t.id} value={t.tagName} className="text-gray-800">
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

        <tbody className="divide-y divide-blue-400/5 bg-[#0e2545]">
          {pagedLogs.length > 0 ? (
            pagedLogs.map((item) => (
              <tr key={item.id}  className="border-b border-blue-400/5 hover:bg-[#17365f]/70 transition-colors duration-200">
                <td className="px-5 py-4 text-white/90 max-w-[140px]">
                  <span className="truncate block">{item.timeStamp}</span>
                </td>
                <td className="px-5 py-4 text-white/90 max-w-[220px]">
                  <span className="truncate block">{item.documentName}</span>
                </td>
                <td className="px-5 py-4 text-white/90 max-w-[140px] text-center">
                  <span className="truncate block">{item.productName || "General"}</span>
                </td>
                <td className="px-5 py-4 text-white/90 max-w-[180px]">
                  <span className="truncate block">{item.embeddingModel}</span>
                </td>
                <td className="px-5 py-4 text-white/90 max-w-[180px]">
                  <span className="truncate block">{item.llmModel}</span>
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
              <td colSpan={8} className="px-5 py-16 text-center align-middle">
                {networkError ? (
                  <p className="text-red-400 font-medium">{networkError}</p>
                ) : (
                  <p className="text-white/80 text-sm">No document logs yet.</p>
                )}
              </td>
            </tr>
          )}
        </tbody>

        {filteredLogs.length > 0 && (
          <tfoot className="bg-[#132a4a] border-t border-blue-400/10">
            <tr className="[&>th]:px-5 [&>th]:py-4 [&>th]:text-left [&>th]:text-lg [&>th]:font-semibold [&>th]:text-white/90">
              <th className="px-5 py-4 text-white">Total</th>
              <th className="px-5 py-4 text-white">-</th>
              <th className="px-5 py-4 text-white">-</th>
              <th className="px-5 py-4 text-white">-</th>
              <th className="px-5 py-4 text-white">-</th>
              <th className="px-5 py-4 text-white">{totals.textTokenCount}</th>
              <th className="px-5 py-4 text-white">{totals.imageTextTokenInput}</th>
              <th className="px-5 py-4 text-white">{totals.imageTextTokenOutput}</th>
            </tr>
          </tfoot>
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
  );
}