import {useMemo,useEffect,useState } from "react";
import { api } from "../../api/api";

export default function ManageAiModels({ notify }) {
const [selectedModel, setSelectedModel] = useState("");

const [aiProviders, setAIProviders] = useState("");
const [providers, setProviders] = useState([]);
const [serviceModels, setServiceModels] = useState([]);
const [apiKey, setApiKey] = useState("");
const [temperature, setTemperature] = useState("");
const [saving, setSaving] = useState(false);
const [details, setDetails] =useState([]);



useEffect(() => {
  const loadProviders = async () => {
    try {
      const res = await api.getAllProviders();
      setProviders(res.data || []);
    } catch (e) {
      console.error(e);
      notify?.("Failed to load providers.", "error");
    }
  };
  loadProviders();
}, []);



const getDetails = async () => {
    try{
        const res = await api.getModelCredentials();
        setDetails(res.data || [])
    }catch (e) {
        console.error(e);
        notify?.("Failed to load details.", "error");
    }
};

useEffect(() => {
  getDetails();
}, []);

 const filteredModels = useMemo(() => {
  if (!aiProviders) return [];

  const selectedProvider = providers.find(
    (p) => String(p.id) === String(aiProviders)
  );

  if (!selectedProvider) return [];

  return serviceModels.filter(
    (m) => m.serviceProviderName === selectedProvider.name
  );
}, [aiProviders, serviceModels, providers]);


const handleProviderChange = async (e) => {
  const providerId = e.target.value;
  setAIProviders(providerId);
  setSelectedModel("");

  const provider = providers.find((p) => String(p.id) === String(providerId));
  if (!provider) return;

  try {
    const res = await api.getServiceModels(provider.name); // e.g. "Mistral"
    setServiceModels(res.data || []);
  } catch (err) {
    console.error(err);
    notify?.("Failed to load models.", "error");
  }
};


const addNewAiModel = async (e) => {
    e.preventDefault();

    if (!aiProviders) {
      notify("Please select an AI provider");
      return;
    }

    if (!selectedModel) {
      notify("Please select an AI model");
      return;
    }

    setSaving(true);

    try {
        const providerName =
        providers.find((p) => String(p.id) === String(aiProviders))?.name;

        const modelName =
        filteredModels.find((m) => String(m.id) === String(selectedModel))?.modelName;

      const modelDetails ={
        serviceProvider: providerName,
        model: modelName,
        apiKey: apiKey,
        isActive: true,   
        temperature: temperature
      };
        await api.addModelCredentials(modelDetails);

      cancelAdd();
      notify("Successfully added new AI model!");
      getDetails();
    } catch(e) {
        console.error(e);
      notify("Something went wrong");
    }finally{
        setSaving(false);
    } 
};

const cancelAdd = () => {
    setAIProviders("");
    setSelectedModel("");
    setApiKey("");
    setTemperature("");
}

//for table



    return (
        <div>
            <form onSubmit={addNewAiModel} className="space-y-2">
        <label className="block">

             <span className="text-white/90 text-sm">AI Provider</span>
            <select
                value={aiProviders}
                onChange={handleProviderChange}
                className="mt-2 block w-full rounded-lg bg-white/10 border border-white/20 px-4 py-1.5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/80"
                >
                <option className="text-gray-900" value="">Select AI Provider</option>
                {providers.map((p) => (
              <option key={p.id} value={p.id} className="text-gray-900">
                {p.name}
              </option>
            ))}
            </select>
        </label>  
        <label className="block">
            <span className="text-white/90 text-sm">AI Models</span>
            <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                disabled={!aiProviders}
                className="mt-2 block w-full rounded-lg bg-white/10 border border-white/20 px-4 py-1.5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/80"
                >
                <option className="text-gray-900" value="">
                    {!aiProviders
                    ? "Select provider first"
                    : filteredModels.length === 0
                    ? "No models available"
                    : "Select AI Model"}
                </option>
                    {filteredModels.map((m) => (
                    <option key={m.id} value={m.id} className="text-gray-900">
                        {m.modelName}
                    </option>
                    ))}
                </select>

                
        </label>

        <label className="block">
            <span className="text-white/90 text-sm">API Key</span>
            <span className="text-white/90 text-sm"></span>
            <input
              type="text"
              required
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Model API Key"
              className="mt-2 block w-full rounded-lg bg-white/10 border border-white/20 px-4 py-1.5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/80"
            />
          </label>

        <label className="block">
            <span className="text-white/90 text-sm">Temperature</span>
            <input
              type="number"
              required
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
              placeholder="0-1 (e.g 0.7)"
              className="mt-2 block w-full rounded-lg bg-white/10 border border-white/20 px-4 py-1.5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/80"
            />
          </label>

        <div className="pt-5">
            <button 
                 type="submit" 
                disabled={saving}
                className={`w-full bg-white text-[#183398] hover:bg-white/25  hover:text-white text-md font-bold py-1.5 rounded-full transition`}
            >
              {saving ? "SAVING..." : "SAVE"}
            </button>
        </div>
            </form>
            <button 
            onClick={cancelAdd}
                disabled={saving}
                className={`w-full mt-2 bg-red-600 hover:bg-red-700 text-white text-md font-bold py-1.5 rounded-full transition`}>
                    CANCEL
            </button>

            <hr className="my-6 border-white/10" />

             {/* AI Models Table */}

            <div className="w-full overflow-x-auto rounded-2xl border border-white/15 bg-white/10 backdrop-blur-lg shadow-2xl">
                <table className="w-full min-w-[720px] table-auto border-collapse">
                    <thead className="bg-white/10">
                    <tr className="[&>th]:px-5 [&>th]:py-4 [&>th]:text-left [&>th]:text-sm [&>th]:font-semibold [&>th]:text-white/90">
                        <th>Model Name</th>
                        <th>API Key</th>
                        <th>Temperature</th>
                        <th className="text-right">Actions</th>
                    </tr>
                    </thead>

                    <tbody className="divide-y divide-white/10">
                        {details.length > 0 ? (
                            details.map((d) => (
                            <tr key={d.id ?? `${d.model}-${d.apiKey}`} className="transition hover:bg-white/10">
                                <td className="px-5 py-4 text-white">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">{d.model}</span>
                                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                                    d.isActive ? "bg-emerald-400/15 text-emerald-200" : "bg-gray-400/15 text-gray-200"
                                    }`}>
                                     {d.isActive ? "Active" : "Inactive"}
                                    </span>
                                </div>
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
                                <div className="flex justify-end gap-2">
                                    <button className="rounded-xl bg-white/90 px-4 py-2 text-sm font-bold text-[#183398] shadow hover:bg-white/70 transition">
                                    Edit
                                    </button>
                                    <button className="rounded-xl bg-white/20 px-4 py-2 text-sm font-bold text-white shadow transition">
                                    Use Model
                                    </button>
                                </div>
                                </td>
                            </tr>
                            ))
                        ) : (
                            <tr>
                            <td className="px-5 py-6 text-white/70" colSpan={4}>
                                No models added yet.
                            </td>
                            </tr>
                        )}
                        </tbody>
                </table>
                </div>
        </div>

    )
}