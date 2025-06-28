import { useContext, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";

const Auth = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/users/register`,
          formData,
          { withCredentials: true }
        );
        setUser({
          fullName: response.data.fullName,
          email: response.data.email,
        });
        navigate("survey", { state: formData });
      } else {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/users/login`,
          formData,
          { withCredentials: true }
        );
        setUser({
          fullName: response.data.fullName,
          email: response.data.email,
        });
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center text-indigo-700">
          {isRegister ? "Register" : "Login"}
        </h2>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {isRegister && (
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />

          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition cursor-pointer"
          >
            {isRegister ? "Next" : "Login"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            onClick={toggleMode}
            className="text-indigo-500 font-semibold cursor-pointer hover:underline"
          >
            {isRegister ? "Login here" : "Register here"}
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
