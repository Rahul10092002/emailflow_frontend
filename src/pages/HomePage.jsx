"use client"
import { Link } from "react-router-dom"
import EmailFlowDesigner from "../components/EmailFlowDesigner"
import { useAuth } from "../context/AuthContext"

const HomePage = () => {
  const {  logout } = useAuth()

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-md py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">
            Email Marketing Flow Designer
          </h1>
          <div className="flex items-center space-x-4">
            <Link
              to="/dashboard"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
            >
              Dashboard
            </Link>
            <button
              onClick={logout}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container py-6">
          <EmailFlowDesigner />
        </div>
      </main>
    </div>
  );
}

export default HomePage

