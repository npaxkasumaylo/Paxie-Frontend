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

const encryptApiKey = async (publicKeyBase64, apiKey) => {
  const binaryDer = Uint8Array.from(atob(publicKeyBase64), c => c.charCodeAt(0));

  const publicKey = await window.crypto.subtle.importKey(
    "spki",
    binaryDer.buffer,
    {
      name: "RSA-OAEP",
      hash: "SHA-256"
    },
    false,
    ["encrypt"]
  );

  const encrypted = await window.crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    publicKey,
    new TextEncoder().encode(apiKey)
  );

  return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
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

    if (!apiKey?.trim()) {
    notify("Please enter an API key");
    return;
  }

    setSaving(true);

    try {
      const securityRes = await api.getSecurityKey();
      const encryptedApiKey = await encryptApiKey(securityRes.data, apiKey);

      const providerName =
      providers.find((p) => String(p.id) === String(aiProviders))?.name;

        const modelName =
        filteredModels.find((m) => String(m.id) === String(selectedModel))?.modelName;
      


      const modelDetails ={
        serviceProvider: providerName,
        modelName: modelName,
        apiKey: encryptedApiKey,
        isActive: true,   
        temperature: temperature
      };
        await api.addModelCredentials(modelDetails);

      notify("Successfully added new AI model!");
      getDetails();
      cancelAdd();
    } catch(e) {
        console.error(e);
      notify("Something went wrong");
    }finally{
        setSaving(false);
    } 
};

const deleteModel = async (model) => {
  try{
    await api.deleteModelCredentials({
      id:model.id,
      isActive:false
    });
    notify?.("Model successfuly deleted.", "success");
    getDetails();
  }catch (e){
    console.error(e);
    notify?.("Failed to use model.", "error");
    getDetails();
  }
};

const modelProvider = async (model) => {
  try{
    await api.editModelCredentialsByUsedModel({
      id:model.id,
      isImplemented:true
    });
    notify?.("Model is now in use.", "success");
    getDetails(); 
  }catch (e){
    console.error(e);
    notify?.("Failed to use model.", "error");
    getDetails();
  }
}

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
                        <th>Status</th>
                        <th>API Key</th>
                        <th>Temperature</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-white/10">
                        {details.length > 0 ? (
                            details.map((d) => (
                            <tr key={d.id ?? `${d.model}-${d.apiKey}`} className="transition hover:bg-white/10">
                                <td className="px-5 py-4 text-white">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">{d.modelName}</span>
                                    
                                </div>
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
                                <div className="flex justify-end gap-2">
                                    <button className="rounded-xl bg-white/90 px-4 py-2 text-sm font-bold text-[#183398] shadow hover:bg-white/70 transition">
                                    Edit
                                    </button>
                                    <button 
                                    onClick={() => modelProvider(d)}
                                    disabled={d.isImplemented}
                                    className={`
                                      rounded-xl px-4 py-2 text-sm font-semibold shadow transition
                                      ${d.isImplemented
                                        ? "bg-emerald-500/20 text-emerald-300 cursor-not-allowed"
                                        : "bg-white/20 text-white hover:bg-white/30"
                                      }
                                    `}>
                                      {d.isImplemented ? "In Use" : "Use Model"}
                                    </button>
                                    <button 
                                    onClick={() => deleteModel(d)}
                                    className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2">
                                      Delete
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