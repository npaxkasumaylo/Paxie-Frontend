import { useNavigate } from "react-router-dom";
import nPaxImage from "../../assets/npax-white.png";
import BotIcon from "../BotIcon";
import { api } from "../../api/api";



export default function AdminNavBar({ setMode }) {
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			await api.logout();
			navigate("/admin/login");
		} catch (e) {
			if(e.response.data.isLogout) {
				navigate("/admin/login");
			}
		}
		
	}

	return (
		<>
			<nav className="w-full p-2.5 px-5 flex items-center bg-[#003bad]/50 backdrop-blur-lg border-b border-white/10">

				{/* Left */}
				<div className="flex items-center gap-2 min-w-fit">
					<img src={nPaxImage} alt="nPax Logo" className="h-8" />
					<span className="text-white font-semibold text-lg">Admin Dashboard</span>
				</div>

				{/* Center */}
				<div className="flex flex-1 justify-center">
					<div className="flex items-center gap-6 flex-wrap justify-center ">
						<button className="text-white font-semibold px-3 py-2 rounded-lg 
						hover:bg-white/10 hover:shadow-md hover:-translate-y-[1px] 
						transition-all duration-200" 
						onClick={() => setMode("files")}>
							Manage Files
						</button>
						<button className="text-white font-semibold px-3 py-2 rounded-lg 
						hover:bg-white/10 hover:shadow-md hover:-translate-y-[1px] 
						transition-all duration-200" 
						onClick={() => setMode("producstandservices")}>
							Products and Services
						</button>
						<button className="text-white font-semibold px-3 py-2 rounded-lg 
						hover:bg-white/10 hover:shadow-md hover:-translate-y-[1px] 
						transition-all duration-200" 
						onClick={() => setMode("addJob")}>
							Manage Jobs
						</button>
						<button className="text-white font-semibold px-3 py-2 rounded-lg 
						hover:bg-white/10 hover:shadow-md hover:-translate-y-[1px] 
						transition-all duration-200" 
						onClick={() => setMode("models")}>
							AI Models
						</button>
						<button className="text-white font-semibold px-3 py-2 rounded-lg 
						hover:bg-white/10 hover:shadow-md hover:-translate-y-[1px] 
						transition-all duration-200" 
						onClick={() => setMode("costing")}>
							Model Costing
						</button>
						<button className="text-white font-semibold px-3 py-2 rounded-lg 
						hover:bg-white/10 hover:shadow-md hover:-translate-y-[1px] 
						transition-all duration-200" 
						onClick={() => setMode("systemPrompt")}>
							System Prompt
						</button>
						<button className="text-white font-semibold px-3 py-2 rounded-lg 
						hover:bg-white/10 hover:shadow-md hover:-translate-y-[1px] 
						transition-all duration-200" 
						onClick={() => setMode("report")}>
							AI Reports
						</button>
						<button className="text-white font-semibold px-3 py-2 rounded-lg 
						hover:bg-white/10 hover:shadow-md hover:-translate-y-[1px] 
						transition-all duration-200" 
						onClick={() => setMode("settings")}>
							Settings
						</button>
					</div>
				</div>

				{/* Right */}
				<div className="min-w-fit">
					<button onClick={handleLogout} className="text-white hover:underline">
						Logout
					</button>
				</div>

			</nav>
		</>
	) 
}