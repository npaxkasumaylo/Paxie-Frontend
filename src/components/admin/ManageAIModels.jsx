import {useEffect,useState } from "react";
import { api } from "../../api/api";

export default function ManageAiModels({ notify }) {

const [aiProviders, setAIProviders] = useState("");
const [providers, setProviders] = useState([]);
const [apiKey, setApiKey] = useState("");
const [model, setModel] = useState("");
const [temperature, setTemperature] = useState("");
const [saving, setSaving] = useState(false);
const [details, setDetails] =useState([]);

const [endpoint, setEndpoint] = useState("");
const [apiVersion, setApiVersion] = useState("");

const [isEditing, setIsEditing] = useState(false);
const [editingId, setEditingId] = useState(null);



const isAzureOpenAI =
  providers.find(p => String(p.id) === String(aiProviders))?.name === "AzureOpenAI";

//loads all Ai Providers
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


//gets model credentials
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


//Encrypts Api Key
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

//Encrypts Endpoint
const encryptEndPoint = async (publicKeyBase64, endpoint) => {
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
    new TextEncoder().encode(endpoint)
  );

  return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
};


//Add new created model
const addNewAiModel = async (e) => {
    e.preventDefault();

    if (!aiProviders) {
      notify?.("Please select an AI provider", "error");
      return;
    }

    if (!model) {
      notify?.("Please select an AI model", "error");
      return;
    }

    if (!apiKey?.trim()) {
    notify?.("Please enter an API key", "error");
    return;
  }

    setSaving(true);

    try {
      const securityRes = await api.getSecurityKey();
      const encryptedApiKey = await encryptApiKey(securityRes.data, apiKey);
      const encryptedEndPoint = await encryptEndPoint(securityRes.data, endpoint)

      const providerName =providers.find((p) => String(p.id) === String(aiProviders))?.name;

      const modelDetails = {
        serviceProvider: providerName,
        modelName:model,
        apiKey: encryptedApiKey,
        isActive: true,
        temperature: Number(temperature),
        ...(isAzureOpenAI && {
          endpoint: encryptedEndPoint,
          apiVersion: apiVersion
        })
      };
        await api.addModelCredentials(modelDetails);

      notify?.("Successfully added new AI model!", "success");
      getDetails();
      cancel();
      console.log(modelDetails)
    } catch(e) {
        console.error(e);
      notify?.("Something went wrong", "error");
    }finally{
        setSaving(false);
    } 
};


//prefill forms
const editAiModel= (row) => {
  setIsEditing(true);
  setEditingId(row.id);

  const provider = providers.find(p => p.name === row.serviceProvider);
  setAIProviders(provider?.id ?? "");
  setModel(row.modelName ?? "");
  setTemperature(row.temperature ?? "");
  setApiKey("");
  setEndpoint("");
  setApiVersion(row.apiVersion ?? "");

}

//updates Ai models
const updateAiModel = async (e) => {
  e.preventDefault();

  if(!editingId){
    notify?.("No model selected for editing.", "error");
    return;
  }

   const providerName =
    providers.find((p) => String(p.id) === String(aiProviders))?.name;

  if (!providerName) {
    notify?.("Provider not found.", "error");
    return;
  }

  if (!model?.trim()) {
    notify?.("Please enter an AI model", "error");
    return;
  }

  if (temperature === "" || temperature === null || temperature === undefined) {
    notify?.("Please enter temperature", "error");
    return;
  }

  // If Azure and you want apiVersion required during edit:
  if (isAzureOpenAI && !apiVersion?.trim()) {
    notify?.("Please enter API version", "error");
    return;
  }

  setSaving(true);

  try {
    const securityRes = await api.getSecurityKey();

    const currentRes = await api.getModelCredentialsById(editingId);
    const current = currentRes.data;

    // Update only if user typed new apiKey/endpoint
    const encryptedApiKey = apiKey?.trim() ? await encryptApiKey(securityRes.data, apiKey): null;

    const encryptedEndPoint = endpoint?.trim()? await encryptEndPoint(securityRes.data, endpoint): null;

    const payload = {
      id: current.id,
      apiKey: encryptedApiKey,
      modelName: model,
      temperature: Number(temperature),
      isImplemented: current.isImplemented,
      isActive: current.isActive,
      serviceProvider: current.serviceProvider,
      endpoint: encryptedEndPoint || "",
      apiVersion: apiVersion || "",
    };

    console.log(payload)

    await api.editModelCredentials(payload); 

    notify?.("Model updated successfully.", "success");
    getDetails();
    cancel(); // reuse your reset
  } catch (err) {
    console.error(err);
    notify?.("Failed to update model.", "error");
  } finally {
    setSaving(false);
  }
  
}


//soft delete for models
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

//cancel button
const cancel = () => {
    setAIProviders("");
    setModel("");
    setApiKey("");
    setTemperature("");
    setEndpoint("");
    setApiVersion("");

    setIsEditing(false);
    setEditingId(null);
}

//switching AI models
const handleUseModel = async (row) => {
  try {
    await api.switchModel(row.id);
    await api.editModelCredentialsByUsedModel({
      id: row.id,
      isImplemented: true,
    });
    notify?.("Model switched successfully.", "success");
    getDetails();
  } catch (e) {
    console.error(e);
    notify?.(
      e?.response?.data?.detail?.[0]?.msg ||
        e?.response?.data?.message ||
        "Failed to switch model.",
      "error"
    );
  }
};


    return (
        <div>
            <form onSubmit={isEditing ? updateAiModel : addNewAiModel} className="space-y-2">
        <label className="block">

             <span className="text-white/90 text-sm">AI Provider</span>
            <select
                value={aiProviders}
                onChange={(e) => setAIProviders(e.target.value)}
                disabled={isEditing}
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
            <input
                value={model}
                onChange={(e) => setModel(e.target.value)}
                disabled={!aiProviders && !isEditing}
                placeholder="e.g gpt-5-mini-FGT1"
                className="mt-2 block w-full rounded-lg bg-white/10 border border-white/20 px-4 py-1.5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/80"
                />
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
              min={0}
              max={1}
              step={0.01}
              required
                value={temperature}
                onChange={(e) => {
              const value = Number(e.target.value);
              if (value >= 0 && value <= 1) {
                setTemperature(value);
              }
            }}
              placeholder="0-1 (e.g 0.7)"
              className="mt-2 block w-full rounded-lg bg-white/10 border border-white/20 px-4 py-1.5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/80"
            />
          </label>


        {isAzureOpenAI &&(
          <>
          <label className="block">
            <span className="text-white/90 text-sm">Endpoint</span>
            <input
              type="text"
              required
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}

              placeholder="e.g https://my-openai-resource.openai.azure.com/"
              className="mt-2 block w-full rounded-lg bg-white/10 border border-white/20 px-4 py-1.5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/80"
            />
          </label>

            <label className="block">
            <span className="text-white/90 text-sm">Api Version</span>
            <input
              type="text"
              required
                value={apiVersion}
                onChange={(e) => setApiVersion(e.target.value)}
              placeholder="e.g 2024-02-15-preview"
              className="mt-2 block w-full rounded-lg bg-white/10 border border-white/20 px-4 py-1.5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/80"
            />
          </label>
          </>
          )}
        <div className="pt-5">
            <button 
                 type="submit" 
                disabled={saving}
                className={`w-full bg-white text-[#183398] hover:bg-white/25  hover:text-white text-md font-bold py-1.5 rounded-full transition`}
            >
              {saving ? "SAVING..." : isEditing ? "UPDATE" : "SAVE"}
            </button>
        </div>
            </form>
            <button 
            onClick={cancel}
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
                                    <button 
                                     onClick={() => editAiModel(d)}
                                    disabled={d.isImplemented}
                                    className={`
                                      rounded-xl px-4 py-2 text-sm font-bold shadow transition
                                      ${d.isImplemented 
                                        ? "bg-white/10 text-white cursor-not-allowed" 
                                        : "bg-white/90 text-[#183398] hover:bg-white/70"}`}>
                                    Edit
                                    </button>
                                    <button 
                                    onClick={() => handleUseModel(d)}
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
                                    disabled={d.isImplemented}
                                    className={`
                                    rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-md transition 
                                    ${d.isImplemented 
                                      ? "bg-white/20 text-white hover:bg-white/30 cursor-not-allowed"
                                      : "bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
                                     }
                                    `}>
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