import {useEffect,useState, useMemo } from "react";
import { api } from "../../api/api";

export default function ModelCosting({notify, onSaved, editingRow}) {
    const [aiProviders, setAIProviders] = useState("");
    const [providers, setProviders] = useState([]);

    const [models, setModels] = useState([]);
    const [model, setModel] = useState("");
    
    const [inputCost, setInputCost] =  useState ("");
    const [outputCost, setOutputCost] = useState ("");

    const [saving, setSaving] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const selectedProvider = useMemo(
    () => providers.find((p) => String(p.id) === String(aiProviders)),
    [providers, aiProviders]
  );

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


     useEffect(() => {
    const loadModels = async () => {
      if (!selectedProvider?.name) {
        setModels([]);
        setModel("");
        return;
      }

      try {
        const res = await api.getProviderModels(selectedProvider.name); // ✅ "AzureAIFoundry"
        setModels(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error(e);
        setModels([]);
        setModel("");
        notify?.("Failed to load provider models.", "error");
      }
    };

    loadModels();
  }, [selectedProvider?.name]);


  //add new model costing
  const addModelCosting = async (e) => {
    e.preventDefault();

    if (!aiProviders) {
      notify?.("Please select an AI provider", "warning");
      return;
    }

    if (!model) {
      notify?.("Please select an AI model", "warning");
      return;
    }

    if (!inputCost){
      notify?.("Please enter an Input cost", "warning")
    }

    if (!outputCost){
      notify?.("Please enter an Input cost", "warning")
    }

    setSaving(true);

    try {
      const modelcost = {
        modelName:model,
        inputPricePerMillionToken:Number(inputCost),
        cachedinputPricePerMillionToken:0,
        serviceProviderId: Number(aiProviders),
        outputPricePerMillionToken:Number(outputCost),
      };
        await api.addModelCost(modelcost);

      notify?.("Successfully added new model cost");
      onSaved?.();
      cancel();
      console.log(modelcost)
    } catch(e) {
        console.error(e);
      notify?.("Something went wrong", "error");
    }finally{
        setSaving(false);
    } 
};


//update form
useEffect(() => {
  if (!editingRow) return;

  setIsEditing(true);
  setEditingId(editingRow.id);

  setAIProviders(String(editingRow.serviceProviderId ?? ""));
  setModel(editingRow.modelName ?? "");
  setInputCost(editingRow.inputPricePerMillionToken ?? "");
  setOutputCost(editingRow.outputPricePerMillionToken ?? "");

}, [editingRow]);

//update model cost
const updateModelCosting = async (e) => {
  e.preventDefault();

  if(!editingId){
    notify?.("No model selected for editing.", "error");
    return;
  }

  const providerName = providers.find((p) => String(p.id) === String(aiProviders))?.name;

  if (!providerName) {
    notify?.("Provider not found.", "error");
    return;
  }

  if (!model?.trim()) {
    notify?.("Please enter an AI model", "error");
    return;
  }

  if (!inputCost?.trim()) {
    notify?.("Please enter an AI model", "error");
    return;
  }
  if (!outputCost?.trim()) {
    notify?.("Please enter an AI model", "error");
    return;
  }

  setSaving(true);

  try {
    const payload = {
      id: editingId,
      modelName: model, // or keep current.modelName if model is locked
      inputPricePerMillionToken: Number(inputCost),
      outputPricePerMillionToken: Number(outputCost),
      serviceProviderId: Number(aiProviders),
    };

    console.log(payload)
    await api.editModelCost(payload); 

    notify?.("Model updated successfully.", "success");
    onSaved?.();
    cancel(); // reuse your reset
  } catch (err) {
    console.error(err);
    notify?.("Failed to update model.", "error");
  } finally {
    setSaving(false);
  }
  
}



//clear forms
const cancel = () => {
    setAIProviders("");
    setModel("");
    setInputCost("");
    setOutputCost("");
    setIsEditing(false);
    setEditingId(null);
}
     

    return (
        <div>
        <form  className="space-y-2" onSubmit={isEditing? updateModelCosting : addModelCosting}>
        <label className="block">

          <span className="text-white/90 text-sm">AI Provider</span>
        <select
            value={aiProviders}
            onChange={(e) => setAIProviders(e.target.value)}
            disabled={isEditing}
            className="mt-2 block w-full rounded-lg bg-white/10 border border-white/20 px-4 py-1.5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/80"
            >
            <option className="text-gray-900" value="">Select AI provider</option>
            {providers.map((p) => (
              <option key={p.id} value={p.id} className="text-gray-900">
                {p.name}
              </option>
            ))}
        </select>
        </label>  
        <label className="block">

             <span className="text-white/90 text-sm">AI Model</span>
            <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                disabled={isEditing || !aiProviders}
                className="mt-2 block w-full rounded-lg bg-white/10 border border-white/20 px-4 py-1.5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/80"
                >
                <option className="text-gray-900" value="">Select an AI model</option>
                {models.map((m) => (
                    <option
                    key={m.id}
                    value={m.modelName}
                    className="text-gray-900"
                >
                    {m.modelName}
                </option>
                ))}
            </select>
        </label>  
        <label className="block">
            <span className="text-white/90 text-sm">Input Cost</span>
            <input
                type="text"
                value={inputCost}
                onChange={(e) => setInputCost(e.target.value)}
                placeholder="Input cost amount per million token"
                className="mt-2 block w-full rounded-lg bg-white/10 border border-white/20 px-4 py-1.5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/80"
                />
        </label>

        <label className="block">
            <span className="text-white/90 text-sm">Output Cost</span>
            <span className="text-white/90 text-sm"></span>
            <input
              type="text"
              value={outputCost}
              onChange={(e) => setOutputCost(e.target.value)}
              placeholder="Output cost amount per million token"
              className="mt-2 block w-full rounded-lg bg-white/10 border border-white/20 px-4 py-1.5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/80"
            />
          </label>



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
        </div>
    )
}