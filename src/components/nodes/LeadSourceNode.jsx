import { useState, useCallback, useEffect } from "react";
import { Handle, Position, useReactFlow } from "reactflow";
import { Users, MoreHorizontal, Plus } from "lucide-react";
import { useEmail } from "../../context/EmailContext";

const LeadSourceNode = ({ id, data, isConnectable }) => {
  const { recipientEmail } = useEmail(); // Get global recipient email

  const [sourceData, setSourceData] = useState({
    name: data.name || "",
    description: data.description || "",
    recipient: recipientEmail,
  });
  const [showMenu, setShowMenu] = useState(false);
  const { deleteElements, setNodes, getNode } = useReactFlow();
  useEffect(() => {
    setSourceData((prev) => ({
      ...prev,
      recipient: recipientEmail, // Sync with context
    }));
  }, [recipientEmail]);
  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setSourceData((prev) => ({
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
        type: "leadSource",
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

  const handleAddNode = (e) => {
    e.stopPropagation();
    if (typeof data.onAddNode === "function") {
      data.onAddNode(e, id);
    }
  };

  return (
    <div className="relative  rounded-md border border-green-100 shadow-sm w-56">
      <div className="flex items-center justify-between border-b border-green-100 bg-green-50 p-2 text-green-700">
        <h4 className="flex items-center text-xs font-semibold">
          <Users className="mr-1.5 h-3.5 w-3.5" />
          Lead Source
        </h4>
        <button
          onClick={toggleMenu}
          className="text-green-700 hover:text-green-900 focus:outline-none"
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
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Source Name
          </label>
          <input
            name="name"
            placeholder="Website Form"
            value={sourceData.name}
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
            placeholder="Describe your lead source..."
            value={sourceData.description}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-1 text-xs shadow-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            rows={2}
          />
        </div>
      </div>

      {/* Add connector button - with larger clickable area */}
      <button
        className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 z-50 cursor-pointer"
        onClick={handleAddNode}
        style={{
          width: "24px",
          height: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="rounded-full border-2 border-white bg-green-500 p-1 shadow-md hover:bg-green-600">
          <Plus className="h-3 w-3 text-black" />
        </div>
      </button>

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        style={{
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          background: "#10b981",
          border: "2px solid white",
          bottom: "-6px",
        }}
      />
    </div>
  );
};

export default LeadSourceNode;
