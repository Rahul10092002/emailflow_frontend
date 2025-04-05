import { useCallback, useEffect, useState } from "react";
import { Handle, Position } from "reactflow";
import { Mail, MoreHorizontal, Plus } from "lucide-react";
import { useEmail } from "../../context/EmailContext";

const ColdEmailNode = ({ id, data, isConnectable }) => {
  const { recipientEmail } = useEmail(); // Get global recipient email
  const [emailData, setEmailData] = useState({
    recipient: recipientEmail || "",
    subject: data.subject || "",
    body: data.body || "",
  });
  const [showMenu, setShowMenu] = useState(false);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setEmailData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    [setEmailData]
  );
  useEffect(() => {
    setEmailData((prev) => ({
      ...prev,
      recipient: recipientEmail, // Sync with context
    }));
  }, [recipientEmail]);
  const handleAddNode = (e) => {
    e.stopPropagation();
    if (typeof data.onAddNode === "function") {
      data.onAddNode(e, id);
    }
  };

  return (
    <div className="relative rounded-md border bg-white border-blue-100 shadow-sm w-60">
      <div className="flex items-center justify-between border-b border-blue-100 bg-blue-50 p-2 text-blue-700">
        <h4 className="flex items-center text-xs  font-semibold">
          <Mail className="mr-1.5 h-3.5 w-3.5" />
          Cold Email
        </h4>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="text-blue-700 hover:text-blue-900 focus:outline-none"
        >
          <MoreHorizontal className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="p-3 pb-6 space-y-2">
        <div className="space-y-1">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Recipient
          </label>
          <input
            name="recipient"
            placeholder="recipient@example.com"
            value={recipientEmail}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-1 text-xs shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-1">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Subject
          </label>
          <input
            name="subject"
            placeholder="Email subject"
            value={emailData.subject}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-1 text-xs shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-1">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Email Body
          </label>
          <textarea
            name="body"
            placeholder="Write your email content here..."
            value={emailData.body}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-1 text-xs shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
          background: "#4f46e5",
          border: "2px solid white",
          top: "-6px",
        }}
      />

      <button
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 cursor-pointer"
        onClick={handleAddNode}
      >
        <div className="rounded-full border-2 border-white bg-blue-600 p-1 shadow-md hover:bg-blue-700">
          <Plus className="h-3 w-3 text-black" />
        </div>
      </button>

      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        style={{
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          background: "#4f46e5",
          border: "2px solid white",
          bottom: "-6px",
        }}
      />
    </div>
  );
};

export default ColdEmailNode;
