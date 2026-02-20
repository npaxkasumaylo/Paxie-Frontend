import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';

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
                    $42.50
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
                    $12.85
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
                    $12.85
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
                    1.1M
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
                    // Axis line (bottom & left main lines)
                    '& .MuiChartsAxis-line': {
                    stroke: '#ffffff',
                    },

                    // Tick lines
                    '& .MuiChartsAxis-tick': {
                    stroke: '#ffffff',
                    },

                    // Axis labels (numbers + bar names)
                    '& .MuiChartsAxis-tickLabel': {
                    fill: '#ffffff',
                    },

                    // Grid lines
                    '& .MuiChartsGrid-line': {
                    stroke: 'rgba(255,255,255,0.2)', // softer white
                    },
                }}
                />

                <PieChart
                series={[{ innerRadius: 50, outerRadius: 100, data, arcLabel: 'value' }]}
                {...settings}
                />
            </div>
        </div>

        
        <hr className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-lg shadow-2xl"/>

        <h1  className='text-2xl font-bold text-white'>Running Cost: per user query (live feed)</h1>
            
        <div className="w-full rounded-2xl bg-[#0b1f3a] border border-blue-400/10 p-6 shadow-[0_0_40px_rgba(0,0,0,0.6)]">
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
                    <tr className="border-b border-blue-400/5 hover:bg-[#17365f]/70 transition-colors duration-200">
                        <td className="px-10 py-4 text-white/90 text-center">
                            <span>2024-06-01 12:00:00</span>
                        </td>
                        <td className="px-10 py-4 text-white/90 text-center">
                            <span>What is the weather today?</span>
                        </td>
                        <td className="px-10 py-4 text-white/90 text-center">
                            <span>271</span>
                        </td>
                        <td className="px-10 py-4 text-white/90 text-center">
                            <span>Mistral-Large-3</span>
                        </td>
                        <td className="px-10 py-4 text-white/90 text-center">
                            <span>1276</span>
                        </td>
                        <td className="px-10 py-4 text-white/90 text-center">
                            <span>$00005</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </>
    )
}