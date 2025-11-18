import nPaxImage from "../../assets/npax-white.png";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  //Sample credentials for testing
  const credentials = {
    username: "admin@gmail.com",
    password: "admin123",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.login({UserName: username, Password: password});

      // localStorage.setItem("authToken", res.data.token);
      // localStorage.setItem("currentUser", JSON.stringify(res.data.user));
      setLoading(false);
      navigate("/admin/home");

    } catch (err) {
      const error = err.response || err;
      console.log(err);
      setError(error.data ? error.data: error.message + " Please try again."); 
      setLoading(false);
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/adminBG.png')] select-none">
      <div className="w-full max-w-md mx-4 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center rounded-full">
            <img src={nPaxImage} alt="nPax Logo" className=" h-16" />
          </div>
          <h1 className="mt-3 text-white text-2xl font-semibold">WELCOME BACK</h1>
          <p className=" text-white/80 text-sm">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block">
            <span className="text-white/90 text-sm">Username</span>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-2 block w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/80"
              placeholder="Enter your username"
            />
          </label>

          <label className="block">
            <span className="text-white/90 text-sm">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 block w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/80"
              placeholder="Enter your password"
            />
          </label>

          {error && <p className={`text-red-600 text-sm mt-2 font-medium
            bg-white p-1.5 px-2 rounded-b-lg`}>{error}</p>}
        
          <div className="py-8">
            <button 
                type="submit" 
                disabled={loading}
                className={`w-full ${loading ? 'bg-white/20 text-gray-500' : 'bg-white hover:bg-white/25 hover:text-white text-[#183398]'}  text-md font-bold py-1.5 rounded-full transition`}
            >
                {loading ? "LOGGING IN..."  : "LOG IN"}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
