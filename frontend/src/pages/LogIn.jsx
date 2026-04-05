import React from 'react'

import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {serverUrl} from '../App.jsx';

const LogIn = () => {
  const navigate = useNavigate();
  const[loading, setLoading] = useState(false);
  const[error, setError] = useState("");
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
   try {
    setLoading(true);
    setError("");

    if(!form.email || !form.password){
      setError("All fields are madatory");
      setLoading(false);
      return;
    }


    const response = await axios.post(`${serverUrl}/api/auth/login`, form, { withCredentials: true } );
   
    alert("Login successful!");
    navigate("/");
   } catch (error) {
    console.error("Error during registration:", error);
    setError(error.response?.data?.message || "Registration failed");
    setLoading(false);
   }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-[350px]">
        
        <h2 className="text-2xl font-bold text-center mb-6">
          Login to your Account 🚀
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">


          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            LogIn
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-center mt-4">
          New to URL shortify!{" "}
          <span className="text-blue-600 cursor-pointer hover:underline" onClick={()=>navigate("/signup")}>
            SignUp
          </span>
        </p>
      </div>
    </div>
  );
};

export default LogIn;