import { useState, useCallback, useEffect } from "react";
import { Handle, Position, useReactFlow } from "reactflow";
import { Flag, MoreHorizontal } from "lucide-react";
import { useEmail } from "../../context/EmailContext";

const GoalNode = ({ id, data, isConnectable }) => {
  const { recipientEmail } = useEmail(); // Get global recipient email
  const [showMenu, setShowMenu] = useState(false);
  const { deleteElements, setNodes, getNode } = useReactFlow();
  const [goalData, setGoalData] = useState({
    name: data.name || "",
    description: data.description || "",
    recipient: recipientEmail,
  });
  useEffect(() => {
    setGoalData((prev) => ({
      ...prev,
      recipient: recipientEmail, // Sync with context
    }));
  }, [recipientEmail]);
  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setGoalData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Update node data
      data[name] = value;
    },
    [data]
  );

  const handleDelete = () => {
    deleteElements({ nodes: [{ id }] });
  };

  const handleDuplicate = useCallback(() => {
    // Get the current node
    const currentNode = getNode(id);

    if (currentNode) {
      // Create a new node with the same data but offset position
      const newNode = {
        id: `node_${Date.now()}`,
        type: "goalNode",
        position: {
          x: currentNode.position.x + 50,
          y: currentNode.position.y + 50,
        },
        data: { ...currentNode.data },
      };

      setNodes((nds) => [...nds, newNode]);
    }

    setShowMenu(false);
  }, [getNode, id, setNodes]);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className="relative overflow-hidden rounded-md border border-success-100 shadow-sm w-56">
      <div className="flex items-center justify-between border-b border-success-100 bg-success-50 p-2 text-success-700">
        <h4 className="flex items-center text-xs font-semibold">
          <Flag className="mr-1.5 h-3.5 w-3.5" />
          Goal
        </h4>
        <button
          onClick={toggleMenu}
          className="text-success-700 hover:text-success-900 focus:outline-none"
        >
          <MoreHorizontal className="h-3.5 w-3.5" />
        </button>

        {showMenu && (
          <div className="absolute right-0 top-7 z-50 w-36 rounded-md border border-gray-200 bg-white shadow-lg">
            <ul className="py-1 text-xs">
              <li>
                <button
                  onClick={handleDuplicate}
                  className="flex w-full items-center px-3 py-2 text-left hover:bg-gray-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-3.5 w-3.5"
                  >
                    <rect
                      x="9"
                      y="9"
                      width="13"
                      height="13"
                      rx="2"
                      ry="2"
                    ></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  Duplicate
                </button>
              </li>
              <li>
                <button
                  onClick={handleDelete}
                  className="flex w-full items-center px-3 py-2 text-left text-red-600 hover:bg-red-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-3.5 w-3.5"
                  >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                  Delete
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
      <div className="p-3 space-y-2">
        <div className="space-y-1">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Recipient Email
          </label>
          <input
            name="recipient"
            value={recipientEmail}
            readOnly
            className="w-full rounded-md border border-gray-300 px-3 py-1 text-xs shadow-sm bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div className="space-y-1">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Goal Name
          </label>
          <input
            name="name"
            placeholder="e.g., Purchase Completed"
            value={goalData.name}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-1 text-xs shadow-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>

        <div className="space-y-1">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            placeholder="Describe this conversion goal..."
            value={goalData.description}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-1 text-xs shadow-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            rows={2}
          />
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        style={{
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          background: "#10b981",
          border: "2px solid white",
          top: "-6px",
        }}
      />
    </div>
  );
};

export default GoalNode;
