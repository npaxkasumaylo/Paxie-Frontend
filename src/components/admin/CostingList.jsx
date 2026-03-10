import { useEffect, useState } from "react";
import { api } from "../../api/api";

export default function CostingList({ notify, refreshKey, editModelCost }) {
  const [modelCost, setModelCost] = useState([]);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const res = await api.getPricingMaster();
        setModelCost(res.data || []);
      } catch (e) {
        console.error(e);
        notify?.("Failed to load models.", "error");
      }
    };
    loadModels();
  }, [refreshKey]);

  return (
    <div
      className="md:w-1/8 lg:1/3 w-full p-8 bg-[#00092d] backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl 
							overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:rounded-full
					[&::-webkit-scrollbar-thumb]:bg-white/50"
    >
      <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-b-white/50">
        <h1 className="text-2xl font-bold text-white pb-3">Model Cost List</h1>
      </div>
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
            {modelCost.length > 0 ? (
              modelCost.map((c) => (
                <tr
                  key={c.id}
                  className="transition hover:bg-white/10 text-center"
                >
                  <td className="px-5 py-4 text-white">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{c.modelName}</span>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-white/90">
                    <span className="font-semibold">
                      ${c.inputPricePerMillionToken}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-white/90">
                    <span className="font-semibold">
                      ${c.outputPricePerMillionToken}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => editModelCost(c)}
                        className="rounded-xl px-4 py-2 text-sm font-bold shadow transition bg-white/20 text-white hover:bg-white/30"
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-5 py-6 text-white/70" colSpan={5}>
                  No models added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <h3 className="text-white/70 text-sm p-2">
        Note: these prices are in USD per million tokens.
      </h3>
    </div>
  );
}
