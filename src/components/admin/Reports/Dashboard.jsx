import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { useEffect, useMemo, useState } from "react";
import { api } from "../../../api/api";

const data = [
  { label: 'Answering Agent', value:  65, color: '#0088FE' },
  { label: 'Reflection Agent', value:  85 , color: '#00C49F' },
];

const settings = {
  margin: { right: 5 },
  width: 200,
  height: 200,
  hideLegend: true,
};


export default function Dashboard (){
    const [allLogs, setAllLogs] = useState([]);
    const pageSize = 10;

    //text-embedding-ada pricing
    const embeddingPrice = 0.10;

    //gpt-mini-5 pricing
    const llmInputPrice = 0.25;
    const llmOutputPrice = 2;

    //ministral-large-3
    const reflectionInput =0.50
    const reflectionOutput =1.50


    const TOKENS_UNIT = 1_000_000;

    const [queryLogs, setQueryLogs] = useState([]);

    const queryPageSize = 5; // or 100, depends on your API limits


    const getAllEmbeddingLogs = async () => {
  try {
    const collected = [];
    let p = 1;

    while (true) {
      const res = await api.getEmbeddingLogs(p, pageSize);
      const data = res?.data;

      const items = Array.isArray(data)
        ? data
        : (data?.items || data?.data || []);

      if (!Array.isArray(items) || items.length === 0) break;

      collected.push(...items);

      if (items.length < pageSize) break;

      p += 1;
    }

    setAllLogs(collected);
  } catch (e) {
    console.error(e);
    setAllLogs([]);
  }
};

const getAllQueryLogs = async () => {
  try {
    const collected = [];
    let p = 1;

    while (true) {
      const res = await api.getQueryLogs(p, queryPageSize);
      const data = res?.data;

      const items = Array.isArray(data)
        ? data
        : (data?.items || data?.data || []);

      if (!Array.isArray(items) || items.length === 0) break;

      collected.push(...items);

      if (items.length < queryPageSize) break;

      p += 1;
    }

    setQueryLogs(collected);
  } catch (e) {
    console.error(e);
    setQueryLogs([]);
  }
};

useEffect(() => {
  getAllEmbeddingLogs();
  getAllQueryLogs();
}, []);

//Total Ingestion cost calcualtion
const totalIngestionCost = useMemo(() => {

  return allLogs.reduce((acc, item) => {
    const embedding =
      (Number(item.textTokenCount || 0) / TOKENS_UNIT) * embeddingPrice;

    const input =
      (Number(item.imageTextTokenInput || 0) / TOKENS_UNIT) * llmInputPrice;

    const output =
      (Number(item.imageTextTokenOutput || 0) / TOKENS_UNIT) * llmOutputPrice;

    return acc + embedding + input + output;
  }, 0);
}, [allLogs, embeddingPrice, llmInputPrice, llmOutputPrice]);

//Total running cost calculation
const totalRunningTokensInput = useMemo(() => {
  return allLogs.reduce((acc, item) => {
    return acc + Number(item.imageTextTokenInput || 0);
  }, 0);
}, [allLogs]);

const totalRunningTokensOutput = useMemo(() => {
  return allLogs.reduce((acc, item) => {
    return acc + Number(item.imageTextTokenOutput || 0);
  }, 0);
}, [allLogs]);

const totalRunningCost = useMemo(() => {
  const inputCost =
    (totalRunningTokensInput / TOKENS_UNIT) * llmInputPrice;

  const outputCost =
    (totalRunningTokensOutput / TOKENS_UNIT) * llmOutputPrice;

  return inputCost + outputCost;
}, [
  totalRunningTokensInput,
  totalRunningTokensOutput,
  llmInputPrice,
  llmOutputPrice,
]);

//Average running cost
const avgRunningCost = useMemo(() => {
  if (!allLogs.length) return 0;
  return totalRunningCost / allLogs.length;
}, [totalRunningCost, allLogs.length]);


//Total token usage calculation
const totalTokenUsage = useMemo(() => {
  return allLogs.reduce((acc, item) => {
    return (
      acc +
      Number(item.textTokenCount || 0) +
      Number(item.imageTextTokenInput || 0) +
      Number(item.imageTextTokenOutput || 0)
    );
  }, 0);
}, [allLogs]);


const latestFiveQueries = useMemo(() => {
  return [...queryLogs]
    .sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp))
    .slice(0, 5);
}, [queryLogs]);

   return(
    <>  
        <div className="w-full rounded-2xl bg-[#0b1f3a] border border-blue-400/10 p-6 shadow-[0_0_40px_rgba(0,0,0,0.6)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Card 1 */}
                <div className="bg-[#11284a] border border-blue-400/10 rounded-xl p-6 
                                hover:bg-[#17365f] transition-all duration-300 
                                shadow-md hover:shadow-lg">
                <p className="text-sm text-blue-200/70 font-medium">
                    Total Ingestion Cost
                </p>
                <p className="mt-3 text-3xl font-semibold text-white">
                    ${totalIngestionCost.toFixed(4)}
                </p>
                </div>

                {/* Card 2 */}
                <div className="bg-[#11284a] border border-blue-400/10 rounded-xl p-6 
                                hover:bg-[#17365f] transition-all duration-300 
                                shadow-md hover:shadow-lg">
                <p className="text-sm text-blue-200/70 font-medium">
                    Total Running Cost
                </p>
                <p className="mt-3 text-3xl font-semibold text-white">
                    ${totalRunningCost.toFixed(4)}
                </p>
                </div>

                {/* Card 3 */}
                <div className="bg-[#11284a] border border-blue-400/10 rounded-xl p-6 
                                hover:bg-[#17365f] transition-all duration-300 
                                shadow-md hover:shadow-lg">
                <p className="text-sm text-blue-200/70 font-medium">
                    Avg. Running Cost
                </p>
                <p className="mt-3 text-3xl font-semibold text-white">
                    ${avgRunningCost.toFixed(4)}
                </p>
                </div>

                {/* Card 4 */}
                <div className="bg-[#11284a] border border-blue-400/10 rounded-xl p-6 
                                hover:bg-[#17365f] transition-all duration-300 
                                shadow-md hover:shadow-lg">
                <p className="text-sm text-blue-200/70 font-medium">
                    Total Token Usage
                </p>
                <p className="mt-3 text-3xl font-semibold text-white">
                    {totalTokenUsage.toLocaleString()}
                </p>
                </div>

            </div>

        </div>

        <hr className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-lg shadow-2xl"/>

        <div className='text-3xl font-bold text-white'>Graphs</div>
            
        <div className="w-full rounded-2xl bg-[#0b1f3a] border border-blue-400/10 p-6 shadow-[0_0_40px_rgba(0,0,0,0.6)]">
            <div className="flex flex-col md:flex-row gap-4 p-4">
                 <BarChart
                xAxis={[
                    {
                    stroke: 'rgba(255,255,255,0.6)',
                    id: 'barCategories',
                    data: ['McFrame GA', 'McFrame 7', 'MotionBoard'],
                    height: 28,
                    colors: ['#3b82f6', '#6366f1', '#8b5cf6']
                    },
                ]}
                series={[
                    {
                    data: [2, 5, 3],
                    },
                ]}
                height={300}
                sx={{
                    // Bottom & left axis lines
                    '& .MuiChartsAxis-line': {
                        stroke: '#ffffff',
                    },

                    // Tick lines
                    '& .MuiChartsAxis-tick': {
                        stroke: '#ffffff',
                    },

                    // Axis labels
                    '& .MuiChartsAxis-tickLabel': {
                        fill: '#ffffff',
                    },

                    // Horizontal & vertical grid lines
                    '& .MuiChartsGrid-line': {
                        stroke: 'rgba(255,255,255,0.3)',
                    },

                    // Some versions use this instead
                    '& .MuiChartsGrid-root line': {
                        stroke: 'rgba(255,255,255,0.3)',
                    },
                    }}
                />

                <PieChart
                series={[{ innerRadius: 50, outerRadius: 100, data, arcLabel: 'value' }]}
                {...settings}
                />
            </div>


            <iframe
                className='rounded-2xl'
                src="http://172.179.236.27:3000/public-dashboards/034fd1c78d744a139cc5b24df4391c8d"
                width="100%" height="400" frameBorder="0"
            >

            </iframe>
        </div>

        
        <hr className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-lg shadow-2xl"/>

        <h1  className='text-3xl font-bold text-white'>Running Cost: per user query (live feed)</h1>
            
        <div className="w-full overflow-x-auto rounded-2xl bg-[#0b1f3a] border border-blue-400/10 p-6 shadow-[0_0_40px_rgba(0,0,0,0.6)]">
            <table className="w-full min-w-[720px] table-auto border-collapse">
                <thead className="bg-[#132a4a] border-b border-blue-400/10">
                    <tr className="[&>th]:px-10 [&>th]:py-4 [&>th]:text-center [&>th]:text-xl [&>th]:font-semibold [&>th]:text-white/90">
                        <th>Timestamp</th>
                        <th>User Query</th>
                        <th>Answering Model Token</th>
                        <th>Reflection Model</th>
                        <th>Total Token</th>
                        <th>Query Cost</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-blue-400/5 bg-[#0e2545]">
                {queryLogs && queryLogs.length > 0 ? (
                latestFiveQueries.slice(0,5).map((item) => (
                    <tr className="border-b border-blue-400/5 hover:bg-[#17365f]/70 transition-colors duration-200">
                        <td className="px-10 py-4 text-white/90 text-center">
                            <span>{new Date(item.timeStamp).toLocaleString()}</span>
                        </td>
                        <td className="px-5 py-4 text-white/90 max-w-[100px]">
                            <span className="block truncate">{item.userQuery}</span>
                        </td>
                        <td className="px-10 py-4 text-white/90 text-center">
                            <span>
                            {(
                                Number(item.answeringTotalInputToken || 0) +
                                Number(item.answeringTotalOutputToken || 0)
                            ).toFixed(2)}
                            </span>
                        </td>
                        <td className="px-10 py-4 text-white/90 text-center">
                            <span>{item.reflectionModel}</span>
                        </td>
                        <td className="px-10 py-4 text-white/90 text-center">
                            <span>
                                {(
                                Number(item.reflectionTotalInputToken || 0) +
                                Number(item.answeringTotalInputToken || 0) +
                                Number(item.answeringTotalOutputToken || 0) +
                                Number(item.reflectionTotalOutputToken || 0) 
                            ).toFixed(2)}
                            </span>
                        </td>
                        <td className="px-10 py-4 text-white/90 text-center">
                            <span>
                                ${(
                                (Number(item.reflectionTotalInputToken || 0) / TOKENS_UNIT) * reflectionInput +
                                (Number(item.answeringTotalInputToken || 0) / TOKENS_UNIT) * llmInputPrice +
                                (Number(item.answeringTotalOutputToken || 0) / TOKENS_UNIT) * llmOutputPrice +
                                (Number(item.reflectionTotalOutputToken || 0) / TOKENS_UNIT) * reflectionOutput
                                ).toFixed(4)}
                            </span>
                        </td>
                    </tr>
                                ))
                        ) : (
                        <tr>
                            <td colSpan={13} className="px-5 py-16 text-center align-middle">
                                <p className="text-white/80 text-sm">No query logs yet.</p>
                            </td>
                        </tr>
                        )}
                </tbody>
            </table>
        </div>
    </>
    )
}