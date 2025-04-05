import { useState, useCallback } from "react";
import { Handle, Position, useReactFlow } from "reactflow";
import { Clock, MoreHorizontal, Plus } from "lucide-react";

const DelayNode = ({ id, data, isConnectable }) => {
  const [delayData, setDelayData] = useState({
    amount: data.amount || "1",
    unit: data.unit || "days",
  });
  const [showMenu, setShowMenu] = useState(false);
  const { deleteElements, setNodes, getNode } = useReactFlow();

  const handleAmountChange = useCallback(
    (e) => {
      const value = e.target.value;
      setDelayData((prev) => ({
        ...prev,
        amount: value,
      }));

      // Update node data
      data.amount = value;
    },
    [data]
  );

  const handleUnitChange = useCallback(
    (e) => {
      const value = e.target.value;
      setDelayData((prev) => ({
        ...prev,
        unit: value,
      }));

      // Update node data
      data.unit = value;
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
        type: "delay",
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

  // Format the delay text
  const getDelayText = () => {
    return `⏱ Wait ${delayData.amount} ${delayData.unit}`;
  };

  const handleAddNode = (e) => {
    e.stopPropagation();
    if (typeof data.onAddNode === "function") {
      data.onAddNode(e, id);
    }
  };

  return (
    <div className="relative  rounded-md border border-secondary-100 shadow-sm w-48">
      <div className="flex items-center justify-between border-b border-secondary-100 bg-secondary-50 p-2 text-secondary-700">
        <h4 className="flex items-center text-xs font-semibold">
          <Clock className="mr-1.5 h-3.5 w-3.5" />
          {getDelayText()}
        </h4>
        <button
          onClick={toggleMenu}
          className="text-secondary-700 hover:text-secondary-900 focus:outline-none"
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
      <div className="p-3">
        <div className="space-y-1">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Wait for
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              value={delayData.amount}
              onChange={handleAmountChange}
              className="w-16 rounded-md border border-gray-300 px-3 py-1 text-xs shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />

            <select
              value={delayData.unit}
              onChange={handleUnitChange}
              className="flex-1 rounded-md border border-gray-300 px-3 py-1 text-xs shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none bg-white bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236b7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%20%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25em_1.25em] bg-[right_0.3rem_center] bg-no-repeat pr-7"
            >
              <option value="minutes">Minutes</option>
              <option value="hours">Hours</option>
              <option value="days">Days</option>
              <option value="weeks">Weeks</option>
            </select>
          </div>
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
          background: "#f97316",
          border: "2px solid white",
          top: "-6px",
        }}
      />

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
        <div className="rounded-full border-2 border-white bg-secondary-500 p-1 shadow-md hover:bg-secondary-600">
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
          background: "#f97316",
          border: "2px solid white",
          bottom: "-6px",
        }}
      />
    </div>
  );
};

export default DelayNode;
