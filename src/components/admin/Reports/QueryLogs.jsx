import { useEffect, useMemo, useState } from "react";
import { api } from "../../../api/api";

export default function QueryLogs({ networkError }) {
  const [logs, setLogs] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;

  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState("");

  const [answeringModel, setAnsweringModel] = useState([]);
  const [selectedAnsweringModel, setSelectedAnsweringModel] = useState("");
  
  const [totalPages, setTotalPages] = useState("");


  const loadTotalQueryPages = async () => {
  try {
    const res = await api.getTotalqueryPages();
    setTotalPages(Number(res?.data ?? 0));
  } catch (e) {
    console.error(e);
    setTotalPages(0);
  }
};

useEffect(() => {
  loadTotalQueryPages(); // once on mount
}, []);

  const getQueryLogs = async () => {
    try {
      const res = await api.getQueryLogs(pageNumber, pageSize);
      const data = res?.data;

      // ✅ handle array-only API
      if (Array.isArray(data)) {
        setLogs(data);
        return;
      }

      // ✅ handle object API too (just in case)
      const items = data?.items || data?.data || [];
      setLogs(Array.isArray(items) ? items : []);
    } catch (e) {
      console.error(e);
      setLogs([]);
    }
  };

  const getProviders = async () => {
    try {
      const res = await api.getAllProviders();
      setProviders(Array.isArray(res?.data) ? res.data : []);
    } catch (e) {
      console.error(e);
      setProviders([]);
    }
  };

  const getModels = async () => {
    try {
      const res = await api.getModelCredentials();
      setAnsweringModel(Array.isArray(res?.data) ? res.data : []);
    } catch (e) {
      console.error(e);
      setAnsweringModel([]);
    }
  };

  // ✅ build providerId -> providerName map
  const providerMap = useMemo(() => {
    const map = {};
    providers.forEach((p) => {
      map[String(p.id)] = p.name;
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

  // ✅ fetch provider/model once
  useEffect(() => {
    getProviders();
    getModels();
  }, []);

  // ✅ fetch logs when page changes
  useEffect(() => {
    getQueryLogs();
  }, [pageNumber]);

  // ✅ reset to page 1 when filter changes
  useEffect(() => {
    setPageNumber(1);
  }, [selectedProvider, selectedAnsweringModel]);

  // ✅ filter within current page
  const filteredLogs = useMemo(() => {
    return (Array.isArray(logs) ? logs : []).filter((item) => {
      const matchProvider =
        !selectedProvider || String(item.serviceProviderId) === String(selectedProvider);

      // NOTE: item.answeringModel is a string in your sample logs
      const matchAnsweringModel =
        !selectedAnsweringModel || String(item.answeringModel) === String(selectedAnsweringModel);

      return matchProvider && matchAnsweringModel;
    });
  }, [logs, selectedProvider, selectedAnsweringModel]);

  // ✅ server-paginated: do NOT slice again
  const pagedLogs = filteredLogs;

  // ✅ enable Next if we got a full page from server
  const hasNextPage = logs.length === pageSize;

  const totals = useMemo(() => {
    return filteredLogs.reduce(
      (acc, item) => {
        acc.answeringTotalInputToken += Number(item.answeringTotalInputToken || 0);
        acc.answeringTotalOutputToken += Number(item.answeringTotalOutputToken || 0);
        acc.reflectionTotalInputToken += Number(item.reflectionTotalInputToken || 0);
        acc.reflectionTotalOutputToken += Number(item.reflectionTotalOutputToken || 0);
        acc.totalProcessingTime += Number(item.totalProcessingTime || 0);
        return acc;
      },
      { answeringTotalInputToken: 0, 
        answeringTotalOutputToken: 0, 
        reflectionTotalInputToken: 0,
        reflectionTotalOutputToken: 0,
        totalProcessingTime: 0
    }
    );
  }, [filteredLogs]);

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



  return (
    <>
     <div className="w-full overflow-x-auto rounded-2xl border border-blue-400/10 bg-[#0b1f3a] backdrop-blur-lg shadow-[0_0_40px_rgba(0,0,0,0.6)]">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[720px] table-auto border-collapse">
          <thead className="bg-[#27304d] border-b border-blue-400/10">
            <tr className="[&>th]:px-5 [&>th]:py-4 [&>th]:text-left [&>th]:text-sm [&>th]:font-semibold [&>th]:text-white/90">
              <th>Timestamp</th>
              <th>User Query</th>
              <th>AI Response</th>

              <th>
                <select
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value)}
                  className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white/90 outline-none"
                >
                  <option value="" className="text-gray-800">
                    AI Providers
                  </option>
                  {providers.map((p) => (
                    <option key={p.id} value={p.id} className="text-gray-800">
                      {p.name}
                    </option>
                  ))}
                </select>
              </th>

              <th>
                <select
                  value={selectedAnsweringModel}
                  onChange={(e) => setSelectedAnsweringModel(e.target.value)}
                  className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white/90 outline-none"
                >
                  <option value="" className="text-gray-800">
                    Answering Model
                  </option>
                  {answeringModel.map((m) => (
                    <option key={m.id} value={m.modelName} className="text-gray-800">
                      {m.modelName}
                    </option>
                  ))}
                </select>
              </th>

              <th>Relfection Model</th>
              <th>Node Stage</th>
              <th>Answering Total Input Token</th>
              <th>Answering Total Output Token</th>
              <th>Reflection Total Input Token</th>
              <th>Reflection Total Output Token</th>
              <th>Total Processing Time (ms)</th>
              <th>Answering Total Tool Calls</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-blue-400/5 bg-[#27304d]">
            {pagedLogs && pagedLogs.length > 0 ? (
              pagedLogs.map((item) => (
                <tr key={item.id} className="border-b border-blue-400/5 hover:bg-[#0056e5] transition-colors duration-200">
                  <td className="px-5 py-4 text-white/90 max-w-[100px]">
                    <HoverCell>{item.timeStamp}</HoverCell>
                  </td>
                  <td className="px-5 py-4 text-white/90 max-w-[160px]">
                    <HoverCell>{item.userQuery}</HoverCell>
                  </td>
                  <td className="px-5 py-4 text-white/90 max-w-[200px]">
                    <HoverCell>{item.aiResponse}</HoverCell>
                  </td>
                  <td className="px-5 py-4 text-white/90 text-center">
                    <span>{providerMap[String(item.serviceProviderId)] || item.serviceProviderId}</span>
                  </td>
                  <td className="px-5 py-4 text-white/90">
                    <span>{item.answeringModel}</span>
                  </td>
                  <td className="px-5 py-4 text-white/90">
                    <span>{item.reflectionModel}</span>
                  </td>
                  <td className="px-5 py-4 text-white/90">
                    <span>{item.nodeStage}</span>
                  </td>
                  <td className="px-5 py-4 text-white/90">
                    <span>{item.answeringTotalInputToken}</span>
                  </td>
                  <td className="px-5 py-4 text-white/90">
                    <span>{item.answeringTotalOutputToken}</span>
                  </td>
                  <td className="px-5 py-4 text-white/90">
                    <span>{item.reflectionTotalInputToken}</span>
                  </td>
                  <td className="px-5 py-4 text-white/90">
                    <span>{item.reflectionTotalOutputToken}</span>
                  </td>
                  <td className="px-5 py-4 text-white/90">
                    <span>{formatNumber(item.totalProcessingTime)}</span>
                  </td>
                  <td className="px-5 py-4 text-white/90">
                    <span>{item.answeringTotalToolCalls}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={13} className="px-5 py-16 text-center align-middle">
                  {networkError ? (
                    <p className="text-red-400 font-medium">{networkError}</p>
                  ) : (
                    <p className="text-white/80 text-sm">No query logs yet.</p>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        
        {filteredLogs.length > 0 && (
          <tfoot className="bg-[#27304d] border-t border-blue-400/10">
            <tr className="[&>th]:px-5 [&>th]:py-4 [&>th]:text-left [&>th]:text-lg [&>th]:font-semibold [&>th]:text-white/90">
              <th className="px-5 py-4 text-white">Total</th>
              <th className="px-5 py-4 text-white">-</th>
              <th className="px-5 py-4 text-white">-</th>
              <th className="px-5 py-4 text-white">-</th>
              <th className="px-5 py-4 text-white">-</th>
              <th className="px-5 py-4 text-white">-</th>
              <th className="px-5 py-4 text-white">-</th>
              <th className="px-5 py-4 text-white">{totals.answeringTotalInputToken}</th>
              <th className="px-5 py-4 text-white">{totals.answeringTotalOutputToken}</th>
              <th className="px-5 py-4 text-white">{totals.reflectionTotalInputToken}</th>
              <th className="px-5 py-4 text-white">{totals.reflectionTotalOutputToken}</th>
              <th className="px-5 py-4 text-white">{formatNumber(totals.totalProcessingTime)}</th>
              <th className="px-5 py-4 text-white">-</th>
            </tr>
          </tfoot>
        )}
        </table>
        </div>

        <div className="flex items-center bg-[#27304d] justify-between px-5 py-4 border-t border-white/10">
          <button
            className="rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-sm text-white/90 disabled:opacity-40"
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>

          <p className="text-sm text-white/70">Page {pageNumber} of {totalPages}</p>

          <button
            className="rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-sm text-white/90 disabled:opacity-40"
            disabled={!hasNextPage}
            onClick={() => setPageNumber((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}

