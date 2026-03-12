
export default function Settings() {
  return (
    <>
      <p className="text-sm text-gray-300 mb-4">
        Click a page to hide
      </p>
    <div className="w-full ">
      <form className="space-y-7">

        {/* Job Title */}
        <div className="flex items-center justify-between">
          <span className="text-white/90 text-xl font-semibold">Manage Files</span>
          <input
            type="checkbox"
            className="w-5 h-5"
          />
        </div>

        {/* Job Description */}
        <div className="flex items-center justify-between">
          <span className="text-white/90 text-xl font-semibold">Products and Service</span>
          <input
            type="checkbox"
            className="w-5 h-5"
          />
        </div>

        {/* Job Requirements */}
        <div className="flex items-center justify-between">
          <span className="text-white/90 text-xl font-semibold">Manage Jobs</span>
          <input
            type="checkbox"
            className="w-5 h-5"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-white/90 text-xl font-semibold">AI Models</span>
          <input
            type="checkbox"
            className="w-5 h-5"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-white/90 text-xl font-semibold">Model Costing</span>
          <input
            type="checkbox"
            className="w-5 h-5"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-white/90 text-xl font-semibold">System Prompt</span>
          <input
            type="checkbox"
            className="w-5 h-5"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-white/90 text-xl font-semibold">AI Reports</span>
          <input
            type="checkbox"
            className="w-5 h-5"
          />
        </div>

      </form>
    </div>
    </>
  );
}