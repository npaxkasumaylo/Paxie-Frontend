import {useEffect,useState, useMemo } from "react";
import { api } from "../../api/api";

export default function ModelCosting({notify}) {

    const [aiProviders, setAIProviders] = useState("");
    const [providers, setProviders] = useState([]);

    const [models, setModels] = useState([]);
    const [model, setModel] = useState("");
    
    const [inputCost, setInputCost] =  useState ("");
    const [outputCost, setOutputCost] = useState ("");

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

  
     

    return (
        <div>
        <form  className="space-y-2">
        <label className="block">

            <span className="text-white/90 text-sm">AI Provider</span>
        <select
            value={aiProviders}
            onChange={(e) => setAIProviders(e.target.value)}
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
                disabled={!aiProviders}
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
                required
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
              required
              placeholder="Output cost amount per million token"
              className="mt-2 block w-full rounded-lg bg-white/10 border border-white/20 px-4 py-1.5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/80"
            />
          </label>



        <div className="pt-5">
            <button 
                type="submit" 
                className={`w-full bg-white text-[#183398] hover:bg-white/25  hover:text-white text-md font-bold py-1.5 rounded-full transition`}
            >
                SAVE
            </button>
        </div>
            </form>
            <button 
                className={`w-full mt-2 bg-red-600 hover:bg-red-700 text-white text-md font-bold py-1.5 rounded-full transition`}>
                    CANCEL
            </button>
        </div>
    )
}