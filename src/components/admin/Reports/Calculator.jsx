import { useState, useEffect, useMemo } from "react";
import { api } from "../../../api/api";
import { LoaderCircle,FileText } from "lucide-react";

const MODELS =[

  ];

export default function Calculator() {
  const [file, setFile] = useState(null);

  const [providers, setProviders] = useState([]);
  const [provider, setProvider] = useState(""); 

  const [allModels, setAllModels] = useState([]);
  const [models, setModels] = useState([]);
  const [model, setModel] = useState("");

  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [counts, setCounts] = useState({
    words: 0,
    chars: 0,
    charsNoSpaces: 0,
  });

   const selectedProvider = useMemo(() => {
    return providers.find((p) => String(p.id) === String(provider));
  }, [providers, provider]);

useEffect(() => {
  const loadData = async () => {
    try {
      const [providersRes, modelsRes] = await Promise.all([
        api.getAllProviders(),
        api.getModelCredentials()
      ]);

      setProviders(providersRes.data || []);
      setAllModels(modelsRes.data || []);
    } catch (e) {
      console.error(e);
      setProviders([]);
      setAllModels([]);
    }
  };

  loadData();
}, []);

useEffect(() => {
  if (!selectedProvider) {
    setModels([]);
    setModel("");
    return;
  }

  const providerName = String(selectedProvider.name || "").trim().toLowerCase();

 const filtered = allModels
      .filter((m) => {
        const sp = String(m?.serviceProvider || "").trim().toLowerCase();
        return sp === providerName;
      });

  console.log("Filtered models for provider", provider, filtered);

  setModels(filtered);
  setModel(""); // reset selected model
}, [selectedProvider, allModels]);

useEffect(() => {
  setIsTyping(true);
 
  const t = setTimeout(() => {
    const charsNoSpaces = inputText.length;
    const chars = inputText.replace(/\s/g, "").length;
    const words = inputText.trim() ? inputText.trim().split(/\s+/).length : 0; 

    setCounts({ words, chars, charsNoSpaces });
    setIsTyping(false); 
  }, 300); 

  return () => clearTimeout(t);
}, [inputText]);


const cancelCalculate = () => {
		setFile(null);
		setInputText("");
	}


  return (
    <>
      {/* Top 2 panels */}
      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Input & Configuration */}
        <div className="w-full p-2 px-2 pb-16 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl">
          <div className="flex items-start gap-3 border-b border-slate-100 px-6 py-5">
            <div className="mt-0.5 text-xl"></div>
            <div className="flex-1">
              <h2 className="text-lg text-white font-semibold">Input &amp; Configuration</h2>
              <p className="mt-1 text-sm text-white ">
                Select a model and enter your text to calculate tokens
              </p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm outline-none focus:ring-2 focus:ring-slate-200"
              >

                <option value="">Select Provider</option>
                {providers.map((p) => (
              <option key={p.id} value={p.id} className="text-gray-900">
                {p.name}
              </option>
            ))}
              </select>

              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                disabled={!selectedProvider}
                className="h-10 w-48 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm outline-none focus:ring-2 focus:ring-slate-200"
              >
                <option value="">
                  {!selectedProvider ? "Select Provider First" : "Select Model"}
                </option>
                {models.length > 0 ? (
                  models.map((m) => (
                    <option key={m.modelName} value={m.modelName}>
                      {m.modelName}
                    </option>
                  ))
                ) : selectedProvider ? (
                  <option disabled>No models available</option>
                ) : null}
              </select>
            </div>
          </div>

          <div className="px-6 py-4">
            <div className="text-sm font-medium text-white">Upload Document</div>
          <div className="mt-3 h-56 flex w-full relative flex-col items-center justify-center border-2 border-dashed border-white/30 rounded-lg hover:bg-white/10 cursor-pointer">
            <input 
              type="file" 
              accept=".pdf"
              onChange={(e) => {
                const f = e.target.files?.[0] || null;
                setFile(f);
                e.target.value = ""; // allows re-uploading the same file
              }}
              className="border border-white/20 cursor-pointer text-white w-full h-full absolute opacity-0" 
            />
                {file != null ? (
                  <div className="w-full justify-center flex p-2 hover:bg-white/20 cursor-pointer">
                      <FileText size={30} className="mr-2 text-white/90" />
                      <p className="text-white/90 text-2xl">{file.name}</p>
                  </div>
                ) : (
                  <div className="text-white/90 mt-4">Click to upload or drag and drop</div>
                )}
            </div>
          </div>

          <div className="px-6">
            <div className="text-sm font-medium text-white">Input Text</div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter your text here to calculate tokens..."
              className="mt-3 h-56 w-full resize-none rounded-lg bg-white/10 border border-white/20  px-4 py-1.5 text-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/80"
            />
          </div>

          <div className="flex w-full"> 
            <button 
              className="w-full mt-6 bg-white/90 hover:bg-white/50 text-gray-800 font-semibold py-2 px-4 rounded-full shadow-lg">
              <span>Calculate Tokens</span>
            </button>
            {/* Cancel Button */}
            <button 
              onClick={cancelCalculate}
              className="w-full mt-6 ml-4 bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded-full shadow-lg">
              Cancel
            </button>
          </div>
        </div>

        {/* Analysis Results */}
        <div className="w-full p-2 px-2 pb-16 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl">
          <div className="border-b border-slate-100 px-6 py-5">
            <h2 className="text-lg text-white font-semibold">Analysis Results</h2>
            <p className="mt-1 text-sm text-white ">
                Based on the selected model and provider, the estimated cost for processing this input is displayed below. Please note that actual costs may vary based on the provider's pricing and the specific model's tokenization.
              </p>
          </div>

          <div className="px-6 py-5">
            {/* 2x2 stat grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border text-center border-white/20 bg-white/10 px-5 py-4">
                <div className="text-3xl text-white font-bold tracking-tight">{isTyping ? <LoaderCircle className="animate-spin mx-auto" size={24} /> : counts.tokens || "0"}</div>
                <div className="mt-1 text-sm text-white/60">Tokens</div>
              </div>

              <div className="rounded-2xl border text-center border-white/20 bg-white/10 px-5 py-4">
                <div className="text-3xl text-white font-bold tracking-tight">{isTyping ? <LoaderCircle className="animate-spin mx-auto" size={24} /> : counts.words}</div>
                <div className="mt-1 text-sm text-white/60">Words</div>
              </div>

              <div className="rounded-2xl border text-center border-white/20 bg-white/10 px-5 py-4">
                <div className="text-3xl text-white font-bold tracking-tight">{isTyping ? <LoaderCircle className="animate-spin mx-auto" size={24} /> : counts.chars}</div>
                <div className="mt-1 text-sm text-white/60">Characters</div>
              </div>

              <div className="rounded-2xl border text-center border-white/20 bg-white/10 px-5 py-4">
                <div className="text-3xl text-white font-bold tracking-tight">{isTyping ? <LoaderCircle className="animate-spin mx-auto" size={24} /> : counts.charsNoSpaces}</div>
                <div className="mt-1 text-sm text-white/60">Total Characters</div>
              </div>
            </div>
               
            <div className="mt-6 border-t border-slate-100 pt-4 text-sm">
              <h2 className="text-lg text-white font-semibold">Reflection Model Cost</h2>
              <div className="flex items-center justify-between py-1">
                <span className="text-white">Input Cost:</span>
                <span className="font-semibold text-white">$0</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-white">Output Cost:</span>
                <span className="font-semibold text-white">$0</span>
              </div> 
          
            </div>

            {/* Costs */}
            <div className="mt-6 border-t border-slate-100 pt-4 text-sm">
              <div className="flex items-center justify-between py-1">
                <span className="font-bold text-white text-lg">Total input Cost:</span>
                <span className="font-bold text-white text-lg">$0</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="font-bold text-white text-lg">Total output Cost:</span>
                <span className="font-bold text-white text-lg">$0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

