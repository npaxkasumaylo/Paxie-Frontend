import nPaxImage from "../../assets/npax-white.png";
import BotIcon from "../BotIcon";

 const handleLogout = () => {
		localStorage.removeItem("authToken");
		localStorage.removeItem("currentUser");
		navigate("/admin/login");
	}

export default function AdminNavBar() {
	return (
		<>
			{/* NavBar */}
				<nav className="w-full p-2.5 px-5 flex justify-between items-center bg-[#003bad]/50 backdrop-blur-lg border-b border-white/10">
					<div className="flex items-center justify-center gap-2">
						<img src={nPaxImage} alt="nPax Logo" className=" h-8" />
						<div className="bg-white rounded-full p-1">
								<BotIcon h={30} w={30}/>
						</div>
						<label className="text-white font-semibold text-xl">AI KNOWLEDGE EMBEDDING MANAGER</label>
					</div>
				
					<div>
						<button onClick={handleLogout} className="text-white hover:underline">Logout</button>
					</div>
				</nav>
		</>
	) 
}