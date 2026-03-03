import { useEffect, useMemo, useState } from "react";
import { api } from "../../../api/api";

export default function DocumentLogs({ networkError }) {
  const [logs, setLogs] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;

  const [documentTags, setDocumentTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");

  const [totalPages, setTotalPages] = useState("");

  const [docCounts, setDocCounts] = useState({});

  const loadTotalEmbeddingPages = async () => {
  try {
    const res = await api.getTotalEmbeddingPages(pageSize);
    setTotalPages(Number(res?.data ?? 0));
  } catch (e) {
    console.error(e);
    setTotalPages(0);
  }
};

useEffect(() => {
  loadTotalEmbeddingPages(); // once on mount
}, []);

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
   const getEmbeddingLogs = async () => {
  try {
    const productName = String(selectedTag || "").trim();

    const res = await api.getEmbeddingLogs(
      pageNumber,
      pageSize,
      productName || undefined // if empty => all logs
    );

    const data = res?.data;

    if (Array.isArray(data)) {
      setLogs(data);
      return;
    }

    const items = data?.items || data?.data || [];
    setLogs(Array.isArray(items) ? items : []);
  } catch (e) {
    console.error(e);
    setLogs([]);
  }
};

  useEffect(() => {
    getDocumentTags();
  }, []);

   useEffect(() => {
    getEmbeddingLogs();
  }, [pageNumber, selectedTag]);

  // ✅ reset to page 1 when filter changes
  useEffect(() => {
    setPageNumber(1);
  }, [selectedTag]);


  const pagedLogs = logs;

  const hasNextPage = logs.length === pageSize;


  const totals = useMemo(() => {
    return (logs || []).reduce(
      (acc, item) => {
        acc.textTokenCount += Number(item.textTokenCount || 0);
        acc.imageTextTokenInput += Number(item.imageTextTokenInput || 0);
        acc.imageTextTokenOutput += Number(item.imageTextTokenOutput || 0);
        return acc;
      },
      { textTokenCount: 0, imageTextTokenInput: 0, imageTextTokenOutput: 0 }
    );
  }, [logs]);

  function HoverCell({ children }) {
  return (
    <div className="relative group ">
      <div className="truncate cursor-pointer">{children}</div>

      <div className="
        absolute z-[9999] hidden group-hover:block
          bottom-full mb-2 left-0
          bg-[#0b1f3a] border border-white/20
          text-white text-xs
          p-3 rounded-xl shadow-xl
          min-w-[250px] max-w-[500px]
          whitespace-pre-wrap break-words
      ">
        {children}
      </div>
    </div>
  );
}

// for document count
const loadCountsPerTag = async () => {
  if (!documentTags?.length) return;

  const map = {};

  for (const tag of documentTags) {
    const name = String(tag.tagName || "").trim(); // ✅ normalize key
    try {
      const res = await api.getDocumentsCount(true, name);
      map[name] = Number(res?.data?.totalDocuments ?? 0);
    } catch (e) {
      console.error("Failed count for:", name);
      map[name] = 0;
    }
  }

  setDocCounts(map);
};

useEffect(() => {
  loadCountsPerTag();
}, [documentTags]);

useEffect(() => {
  const loadPagesForSelected = async () => {
    try {
      const name = String(selectedTag || "").trim();

      // no filter => global pages
      if (!name) {
        await loadTotalEmbeddingPages();
        return;
      }

      const res = await api.getDocumentsCount(true, name);
      const totalDocs = Number(res?.data?.totalDocuments ?? 0);
      setTotalPages(Math.max(1, Math.ceil(totalDocs / pageSize)));
    } catch (e) {
      console.error(e);
      setTotalPages(1);
    }
  };

  loadPagesForSelected();
}, [selectedTag]);

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-blue-400/10  bg-[#0b1f3a] backdrop-blur-lg shadow-[0_0_40px_rgba(0,0,0,0.6)]">
      <table className="w-full min-w-[720px] table-auto border-collapse">
        <thead className="bg-[#27304d] border-b border-blue-400/10">
          <tr className="[&>th]:px-5 [&>th]:py-4 [&>th]:text-left [&>th]:text-sm [&>th]:font-semibold [&>th]:text-white/90">
            <th>Timestamp</th>
            <th>Document Name</th>
            <th className="px-5 py-4 text-white/90">
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value.trim())}
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
            <th>Total Image Text Token</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-blue-400/5 bg-[#27304d]">
          {pagedLogs.length > 0 ? (
            pagedLogs.map((item) => (
              <tr key={item.id}  className="border-b border-blue-400/5 hover:bg-[#0056e5] transition-colors duration-200">
                <td className="px-5 py-4 text-white/90 max-w-[140px]">
                  <HoverCell>{item.timeStamp}</HoverCell>
                </td>
                <td className="px-5 py-4 text-white/90 max-w-[220px]">
                  <HoverCell>{item.documentName}</HoverCell>
                </td>
                <td className="px-5 py-4 text-white/90 max-w-[140px] text-center">
                  <span className="truncate block">{item.productName || "General"}</span>
                </td>
                <td className="px-5 py-4 text-white/90 max-w-[180px]">
                  <HoverCell>{item.embeddingModel}</HoverCell>
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
                <td className="px-5 py-4 text-white/90">
                  <span>{item.imageTextTokenInput + item.imageTextTokenOutput}</span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9} className="px-5 py-16 text-center align-middle">
                {networkError ? (
                  <p className="text-red-400 font-medium">{networkError}</p>
                ) : (
                  <p className="text-white/80 text-sm">No document logs yet.</p>
                )}
              </td>
            </tr>
          )}
        </tbody>

        {logs.length > 0 && (
          <tfoot className="bg-[#27304d] border-t border-blue-400/10">
            <tr className="[&>th]:px-5 [&>th]:py-4 [&>th]:text-left [&>th]:text-lg [&>th]:font-semibold [&>th]:text-white/90">
              <th className="px-5 py-4 text-white">Total</th>
              <th className="px-5 py-4 text-white">-</th>
              <th className="px-5 py-4 text-white">-</th>
              <th className="px-5 py-4 text-white">-</th>
              <th className="px-5 py-4 text-white">-</th>
              <th className="px-5 py-4 text-white">{totals.textTokenCount}</th>
              <th className="px-5 py-4 text-white">{totals.imageTextTokenInput}</th>
              <th className="px-5 py-4 text-white">{totals.imageTextTokenOutput}</th>
              <th className="px-5 py-4 text-white">{totals.imageTextTokenInput + totals.imageTextTokenOutput}</th>
            </tr>
          </tfoot>
        )}
      </table>

      <div className="flex items-center bg-[#27304d] justify-between px-5 py-4 border-t border-white/10">
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
          disabled={!hasNextPage}
          onClick={() => setPageNumber((p) => p + 1)}
        >
          Next
        </button>
      </div>

      <div className="px-5 py-3 text-white/80 bg-[#00092d] text-xl border-b border-white/10">
      {selectedTag
      ? `${selectedTag}: ${docCounts[String(selectedTag).trim()] ?? 0} Documents`
      : "Select a service to see its total documents."}
    </div>
    </div>
  );
}
