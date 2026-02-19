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
        <div className="w-full overflow-x-auto rounded-2xl border border-white/15 bg-white/10 backdrop-blur-lg shadow-2xl">
            <table className="w-full min-w-[720px] table-auto border-collapse">
                <thead className="bg-white/10">
                    <tr className="[&>th]:px-10 [&>th]:py-4 [&>th]:text-center [&>th]:text-xl [&>th]:font-semibold [&>th]:text-white/90 ">
                        <th>Total Ingestion Cost
                            <p className=" text-center text-xl text-white">$42.50</p>
                        </th>
                        <th>Total Running Cost
                            <p className=" text-center text-xl text-white">$12.85</p>
                        </th>
                        <th>Avg. Running Cost
                            <p className=" text-center text-xl text-white">$12.85</p>
                        </th>
                        <th>Total Token Usage
                            <p className=" text-center text-xl text-white">1.1M</p>
                        </th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-white/10">
                
                </tbody>
            </table>
        </div>

        <hr className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-lg shadow-2xl"/>

        <h1 className='text-lg font-bold text-white'>Graphs</h1>
            
        <div className="w-full overflow-x-auto rounded-2xl border border-white/15 bg-white/10 backdrop-blur-lg shadow-2xl">
            <div className="flex flex-col md:flex-row gap-4 p-4">
                <BarChart
                xAxis={[{ data: ['MC Frame 7'] }, {data:['MC Frame GA']}, {data:['MotionBoard']}, {data:['Dr.Sum']}]}
                series={[{ data: [15.57] }, { data: [11.20] }, { data: [10.15] }, { data: [6.05] }]}
                height={300}
                />

                <PieChart
                series={[{ innerRadius: 50, outerRadius: 100, data, arcLabel: 'value' }]}
                {...settings}
                />
            </div>
        </div>

        
        <hr className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-lg shadow-2xl"/>

        <h1  className='text-lg font-bold text-white'>Running Cost: per user query (live feed)</h1>
            
        <div className="w-full overflow-x-auto rounded-2xl border border-white/15 bg-white/10 backdrop-blur-lg shadow-2xl">
            <table className="w-full min-w-[720px] table-auto border-collapse">
                <thead className="bg-white/10">
                    <tr className="[&>th]:px-10 [&>th]:py-4 [&>th]:text-center [&>th]:text-xl [&>th]:font-semibold [&>th]:text-white/90">
                        <th>Timestamp</th>
                        <th>User Query</th>
                        <th>Answering Model Token</th>
                        <th>Reflection Model</th>
                        <th>Total Token</th>
                        <th>Query Cost</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-white/10">
                    <tr>
                        <td className="px-10 py-4 text-white/90 text-center">
                            <span>2024-06-01 12:00:00</span>
                        </td>
                        <td className="px-10 py-4 text-white/90 text-center">
                            <span>What is the weather today?</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </>
    )
}