import React from "react";

export default function ModelList({
  details = [],
  editAiModel,
  handleUseModel,
  deleteModel,
}) {
  return (
    <div
      className="md:w-1/8 lg:1/3 w-full p-8 bg-[#00092d] backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl 
      overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full 
      [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/50"
    >
      <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-b-white/50">
        <h1 className="text-2xl font-bold text-white pb-3">Model List</h1>
      </div>

      <div className="space-y-10">
        {/* Answering Models */}
        <section>
          <h2 className="text-2xl font-bold text-white pb-3">Answering Models</h2>
          <div className="w-full overflow-x-auto rounded-2xl border border-white/15 bg-white/10 backdrop-blur-lg shadow-2xl">
            <table className="w-full min-w-[720px] table-auto border-collapse">
              <thead className="bg-white/10">
                <tr className="[&>th]:px-5 [&>th]:py-4 [&>th]:text-sm [&>th]:font-semibold [&>th]:text-white/90">
                  <th>Model Type</th>
                  <th>Model Name</th>
                  <th>Status</th>
                  <th>API Key</th>
                  <th>Temperature</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {details.length > 0 ? (
                  details.map((d) => (
                    <tr
                      key={`answering-${d.id ?? `${d.model}-${d.apiKey}`}`}
                      className="transition hover:bg-white/10"
                    >
                      <td className="px-5 py-4 text-white">
                        <span className="font-semibold">Answering</span>
                      </td>

                      <td className="px-5 py-4 text-white">
                        <span className="font-semibold">{d.modelName}</span>
                      </td>

                      <td className="px-5 py-4 text-white/90">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                            d.isActive && d.isImplemented
                              ? "bg-emerald-400/15 text-emerald-200"
                              : "bg-gray-400/15 text-gray-200"
                          }`}
                        >
                          {d.isActive && d.isImplemented ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-white/90">
                        <span className="inline-flex items-center rounded-lg bg-white/10 px-2 py-1 text-sm font-semibold">
                          —
                        </span>
                      </td>

                      <td className="px-5 py-4 text-white/90">
                        <span className="inline-flex items-center rounded-lg bg-white/10 px-2 py-1 text-sm font-semibold">
                          {d.temperature}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => editAiModel(d)}
                            disabled={d.isImplemented}
                            className={`rounded-xl px-4 py-2 text-sm font-bold shadow transition ${
                              d.isImplemented
                                ? "bg-white/10 text-white cursor-not-allowed"
                                : "bg-white/90 text-[#183398] hover:bg-white/70"
                            }`}
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleUseModel(d)}
                            disabled={d.isImplemented}
                            className={`rounded-xl px-4 py-2 text-sm font-semibold shadow transition ${
                              d.isImplemented
                                ? "bg-emerald-500/20 text-emerald-300 cursor-not-allowed"
                                : "bg-white/20 text-white hover:bg-white/30"
                            }`}
                          >
                            {d.isImplemented ? "In Use" : "Use Model"}
                          </button>

                          <button
                            onClick={() => deleteModel(d)}
                            disabled={d.isImplemented}
                            className={`rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-md transition ${
                              d.isImplemented
                                ? "bg-white/20 text-white hover:bg-white/30 cursor-not-allowed"
                                : "bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
                            }`}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-5 py-6 text-white/70" colSpan={6}>
                      No models added yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Reflection Models */}
        <section>
          <h2 className="text-2xl font-bold text-white pb-3">Reflection Models</h2>
          <div className="w-full overflow-x-auto rounded-2xl border border-white/15 bg-white/10 backdrop-blur-lg shadow-2xl">
            <table className="w-full min-w-[720px] table-auto border-collapse">
              <thead className="bg-white/10">
                <tr className="[&>th]:px-5 [&>th]:py-4 [&>th]:text-sm [&>th]:font-semibold [&>th]:text-white/90">
                  <th>Model Type</th>
                  <th>Model Name</th>
                  <th>Status</th>
                  <th>API Key</th>
                  <th>Temperature</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {details.length > 0 ? (
                  details.map((d) => (
                    <tr
                      key={`reflection-${d.id ?? `${d.model}-${d.apiKey}`}`}
                      className="transition hover:bg-white/10"
                    >
                      <td className="px-5 py-4 text-white">
                        <span className="font-semibold">Reflection</span>
                      </td>

                      <td className="px-5 py-4 text-white">
                        <span className="font-semibold">{d.modelName}</span>
                      </td>

                      <td className="px-5 py-4 text-white/90">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                            d.isActive && d.isImplemented
                              ? "bg-emerald-400/15 text-emerald-200"
                              : "bg-gray-400/15 text-gray-200"
                          }`}
                        >
                          {d.isActive && d.isImplemented ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-white/90">
                        <span className="inline-flex items-center rounded-lg bg-white/10 px-2 py-1 text-sm font-semibold">
                          —
                        </span>
                      </td>

                      <td className="px-5 py-4 text-white/90">
                        <span className="inline-flex items-center rounded-lg bg-white/10 px-2 py-1 text-sm font-semibold">
                          {d.temperature}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => editAiModel(d)}
                            disabled={d.isImplemented}
                            className={`rounded-xl px-4 py-2 text-sm font-bold shadow transition ${
                              d.isImplemented
                                ? "bg-white/10 text-white cursor-not-allowed"
                                : "bg-white/90 text-[#183398] hover:bg-white/70"
                            }`}
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleUseModel(d)}
                            disabled={d.isImplemented}
                            className={`rounded-xl px-4 py-2 text-sm font-semibold shadow transition ${
                              d.isImplemented
                                ? "bg-emerald-500/20 text-emerald-300 cursor-not-allowed"
                                : "bg-white/20 text-white hover:bg-white/30"
                            }`}
                          >
                            {d.isImplemented ? "In Use" : "Use Model"}
                          </button>

                          <button
                            onClick={() => deleteModel(d)}
                            disabled={d.isImplemented}
                            className={`rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-md transition ${
                              d.isImplemented
                                ? "bg-white/20 text-white hover:bg-white/30 cursor-not-allowed"
                                : "bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
                            }`}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-5 py-6 text-white/70" colSpan={6}>
                      No models added yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}