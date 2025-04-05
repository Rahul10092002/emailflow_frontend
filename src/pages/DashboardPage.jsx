import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { API_URL } from "../config";
import { useAuth } from "../context/AuthContext";
import { Edit, PlayCircle } from "lucide-react";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [flowcharts, setFlowcharts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFlowcharts();
  }, []);

  const fetchFlowcharts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/flowchart`);
      setFlowcharts(response.data.flowcharts || []);
    } catch (error) {
      toast.error("Failed to fetch flowcharts");
      console.error("Error fetching flowcharts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this flowchart?")) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/flowchart/${id}`);
      setFlowcharts(flowcharts.filter((flowchart) => flowchart._id !== id));
      toast.success("Flowchart deleted successfully");
    } catch (error) {
      toast.error("Failed to delete flowchart");
      console.error("Error deleting flowchart:", error);
    }
  };

  const handleRun = async (id) => {
    try {
      await axios.post(`${API_URL}/api/schedule-email`, { flowchartId: id });
      toast.success("Email sequence scheduled successfully");
    } catch (error) {
      toast.error("Failed to schedule email sequence");
      console.error("Error scheduling email sequence:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">
            Email Marketing Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 capitalize">
              Welcome, {user?.name}
            </span>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Your Email Sequences
            </h2>
            <Link
              to="/"
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create New Sequence
            </Link>
          </div>

          {flowcharts.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="mb-4 text-gray-600">
                You don't have any email sequences yet.
              </p>
              <Link
                to="/"
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create Your First Sequence
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {flowcharts.map((flowchart) => (
                <div
                  key={flowchart._id}
                  className="bg-white rounded-lg shadow overflow-hidden"
                >
                  <div className="p-4">
                    <h3
                      className="text-lg font-semibold text-gray-800 mb-1 cursor-pointer hover:text-blue-600"
                      onClick={() => navigate(`/?id=${flowchart._id}`)}
                    >
                      Flow Name: {flowchart.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(flowchart.createdAt).toDateString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 flex justify-end space-x-2">
                    <button
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-md"
                      onClick={() => navigate(`/?id=${flowchart._id}`)}
                      title="Edit"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      className="p-2 text-gray-500 hover:text-green-600 hover:bg-gray-100 rounded-md"
                      onClick={() => handleRun(flowchart._id)}
                      title="Run"
                    >
                      <PlayCircle className="h-5 w-5" />
                    </button>
                    <button
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-md"
                      onClick={() => handleDelete(flowchart._id)}
                      title="Delete"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
