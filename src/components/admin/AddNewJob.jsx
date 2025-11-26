import { useState } from "react"
import { api } from "../../api/api";

export default function AddNewJob({getAllJobs, notify, jobs}) {
	const [jobTitle, setJobTitle] = useState("");
	const [jobDescription, setJobDescription] = useState("");
	const [jobRequirements, setJobRequirements] = useState("");
	const [adding, setAdding] = useState(false);

	const addNewJob = async (e) => {
		e.preventDefault();
		setAdding(true);

		// Check uniqueness of a job opening
		const title = jobTitle.trim();
		if (jobs && jobs.some(j => j.jobTitle && j.jobTitle.toLowerCase() === title.toLowerCase())) {
			notify("A job with this title already exists.", "error");
			setAdding(false);
			return;
		}

		try {
			const res = await api.addJob({
				JobTitle: title,
				JobDescription: jobDescription,
				JobRequirements: jobRequirements,
				IsActive: true
			})
			notify("Successfully added new job!", "success")
			cancelAdd();
			getAllJobs();
		} catch(e) {
			console.error(e);
			notify("Something went wrong. Try again later", "error")
		} finally {
			setAdding(false);
		}
	}

	const cancelAdd = () => {
		setJobTitle("");
		setJobDescription("");
		setJobRequirements("");
	}

	return (
		<div>
			<form onSubmit={addNewJob} className="space-y-2">
					 <label className="block">
            <span className="text-white/90 text-sm">Job Title</span>
            <input
              type="text"
              required
							value={jobTitle}
							minLength={10}
							maxLength={100}
              onChange={(e) => setJobTitle(e.target.value)}
              className="mt-2 block w-full rounded-lg bg-white/10 border border-white/20 px-4 py-1.5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/80"
              placeholder="e.g Software Engineer"
            />
          </label>

					<label className="block">
            <span className="text-white/90 text-sm">Job Description</span>
            <textarea
              required
							value={jobDescription}
							minLength={10}
							maxLength={1500}
              onChange={(e) => setJobDescription(e.target.value)}
              className="mt-2 block w-full rounded-lg bg-white/10 border border-white/20 px-4 py-1.5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/80"
              placeholder="e.g Job Description"
            />
          </label>

					<label className="block">
            <span className="text-white/90 text-sm">Job Requirements</span>
            <textarea
              required
							value={jobRequirements}
							maxLength={1000}
              onChange={(e) => setJobRequirements(e.target.value)}
              className="mt-2 block w-full rounded-lg bg-white/10 border border-white/20 px-4 py-1.5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/80"
              placeholder="Enter job requirements"
            />
          </label>

					<div className="pt-5">
						<button 
							type="submit" 
							disabled={adding}
							className={`w-full ${adding ? 'bg-white/20 text-gray-500' : 'bg-white hover:bg-white/25 hover:text-white text-[#183398]'}  text-md font-bold py-1.5 rounded-full transition`}
            >
              {adding ? "SAVING..."  : "SAVE"}
            </button>
					</div>
			</form>
			<button 
				onClick={cancelAdd}
				disabled={adding}
				className={`w-full mt-2 ${adding ? 'bg-white/20 text-gray-500' : 'bg-red-600 hover:bg-red-700 text-white'}  text-md font-bold py-1.5 rounded-full transition`}>
					CANCEL
			</button>
		</div>
	)
}