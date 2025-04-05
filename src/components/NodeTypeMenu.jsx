import { useState } from "react";
import { Mail, Clock, Users, GitBranch, Flag } from "lucide-react";

const nodeTypes = [
  {
    type: "coldEmail",
    label: "Cold Email",
    icon: <Mail className="h-4 w-4" />,
    description: "Send an email to the lead",
  },
  {
    type: "delay",
    label: "Delay",
    icon: <Clock className="h-4 w-4" />,
    description: "Wait for a period of time",
  },
  {
    type: "leadSource",
    label: "Lead Source",
    icon: <Users className="h-4 w-4" />,
    description: "Define where leads come from",
  },
  {
    type: "conditionNode",
    label: "Condition",
    icon: <GitBranch className="h-4 w-4" />,
    description: "Branch based on conditions",
  },
  {
    type: "goalNode",
    label: "Goal",
    icon: <Flag className="h-4 w-4" />,
    description: "Define conversion goals",
  },
];

const NodeTypeMenu = ({ position, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredNodeTypes = nodeTypes.filter((nodeType) =>
    nodeType.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="absolute z-50 w-64 rounded-md border border-gray-200 bg-white shadow-lg"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div className="border-b border-gray-200 p-2">
        <input
          type="text"
          placeholder="Search node types..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          autoFocus
        />
      </div>
      <div className="max-h-60 overflow-y-auto p-1">
        {filteredNodeTypes.length > 0 ? (
          filteredNodeTypes.map((nodeType) => (
            <button
              key={nodeType.type}
              onClick={() => onSelect(nodeType.type)}
              className="flex w-full items-center gap-3 rounded-md p-2 text-left text-sm hover:bg-gray-100"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 text-gray-600">
                {nodeType.icon}
              </div>
              <div>
                <div className="font-medium">{nodeType.label}</div>
                <div className="text-xs text-gray-500">
                  {nodeType.description}
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="p-2 text-center text-sm text-gray-500">
            No node types found
          </div>
        )}
      </div>
    </div>
  );
};

export default NodeTypeMenu;
