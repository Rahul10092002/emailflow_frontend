import { useState, useCallback, useEffect } from "react";
import { Handle, Position } from "reactflow";
import { GitBranch, MoreHorizontal, Plus } from "lucide-react";
import { useEmail } from "../../context/EmailContext";

const ConditionNode = ({ id, data, isConnectable }) => {
  const { recipientEmail } = useEmail();
  const [showMenu, setShowMenu] = useState(false);
  const [conditionData, setConditionData] = useState({
    type: data.type || "opened",
    value: data.value || "",
  });
  useEffect(() => {
    setConditionData((prev) => ({
      ...prev,
      recipient: recipientEmail, // Sync with context
    }));
  }, [recipientEmail]);
  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setConditionData((prev) => ({
        ...prev,
        [name]: value,
      }));
      data[name] = value;
    },
    [data]
  );

  const handleAddNode = (e, sourceHandle) => {
    e.stopPropagation();
    if (typeof data.onAddNode === "function") {
      data.onAddNode(e, id, sourceHandle);
    }
  };

  return (
    <div className="relative  rounded-md border border-indigo-100 shadow-sm w-56">
      <div className="flex items-center justify-between border-b border-indigo-100 bg-indigo-50 p-2 text-indigo-700">
        <h4 className="flex items-center text-xs font-semibold">
          <GitBranch className="mr-1.5 h-3.5 w-3.5" />
          Condition
        </h4>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="text-indigo-700 hover:text-indigo-900 focus:outline-none"
        >
          <MoreHorizontal className="h-3.5 w-3.5" />
        </button>
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
            Condition Type
          </label>
          <select
            name="type"
            value={conditionData.type}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-1 text-xs shadow-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="opened">Email Opened</option>
            <option value="clicked">Link Clicked</option>
            <option value="replied">Email Replied</option>
            <option value="notOpened">Email Not Opened</option>
            <option value="notClicked">Link Not Clicked</option>
          </select>
        </div>

        {conditionData.type === "clicked" && (
          <div className="space-y-1">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Link Contains
            </label>
            <input
              name="value"
              placeholder="e.g., /pricing"
              value={conditionData.value}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-1 text-xs shadow-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
        )}
      </div>

      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        style={{
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          background: "#6366f1",
          border: "2px solid white",
          top: "-6px",
        }}
      />

      <button
        className="absolute -bottom-6 left-[30%] transform -translate-x-1/2 z-50 cursor-pointer"
        onClick={(e) => handleAddNode(e, "yes")}
      >
        <div className="rounded-full border-2 border-white bg-green-500 p-1 shadow-md hover:bg-green-600">
          <Plus className="h-3 w-3 text-white" />
        </div>
      </button>

      <button
        className="absolute -bottom-6 left-[70%] transform -translate-x-1/2 z-50 cursor-pointer"
        onClick={(e) => handleAddNode(e, "no")}
      >
        <div className="rounded-full border-2 border-white bg-red-500 p-1 shadow-md hover:bg-red-600">
          <Plus className="h-3 w-3 text-white" />
        </div>
      </button>

      <Handle
        type="source"
        position={Position.Bottom}
        id="yes"
        isConnectable={isConnectable}
        style={{
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          background: "#22c55e",
          border: "2px solid white",
          bottom: "-6px",
          left: "30%",
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="no"
        isConnectable={isConnectable}
        style={{
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          background: "#ef4444",
          border: "2px solid white",
          bottom: "-6px",
          left: "70%",
        }}
      />
    </div>
  );
};

export default ConditionNode;
