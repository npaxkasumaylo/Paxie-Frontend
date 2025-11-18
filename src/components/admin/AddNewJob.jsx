import { useState } from "react"

export default function AddNewJob({getAllJobs}) {
	const [jobTitle, setJobTitle] = useState("");
	const [jobDescription, setJobDescription] = useState("");
	const [jobRequirements, setJobRequirements] = useState("");
	const [adding, setAdding] = useState(false);

	return (
		<>
			<form className="space-y-2">
					 <label className="block">
            <span className="text-white/90 text-sm">Job Title</span>
            <input
              type="text"
              required
							value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="mt-2 block w-full rounded-lg bg-white/10 border border-white/20 px-4 py-1.5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/80"
              placeholder="e.g Software Engineer"
            />
          </label>

					<label className="block">
            <span className="text-white/90 text-sm">Job Description</span>
            <textarea
              required
							value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="mt-2 block w-full rounded-lg bg-white/10 border border-white/20 px-4 py-1.5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/80"
              placeholder="e.g Software Engineer"
            />
          </label>

					<label className="block">
            <span className="text-white/90 text-sm">Job Requirements</span>
            <textarea
              required
							value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="mt-2 block w-full rounded-lg bg-white/10 border border-white/20 px-4 py-1.5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/80"
              placeholder="e.g Software Engineer"
            />
          </label>

					<div className="pt-5 space-y-2">
						<button 
							type="submit" 
							disabled={adding}
							className={`w-full ${adding ? 'bg-white/20 text-gray-500' : 'bg-white hover:bg-white/25 hover:text-white text-[#183398]'}  text-md font-bold py-1.5 rounded-full transition`}
            >
              {adding ? "SAVING..."  : "SAVE"}
            </button>
						<button 
							disabled={adding}
							className={`w-full ${adding ? 'bg-white/20 text-gray-500' : 'bg-red-600 hover:bg-red-700 text-white'}  text-md font-bold py-1.5 rounded-full transition`}>
								CANCEL
						</button>
					</div>
			</form>
		</>
	)
}