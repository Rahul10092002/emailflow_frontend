import { X } from "lucide-react";
import { useFlowContext } from "../context/FlowContext";

const SelectedLeadSources = () => {
  const { selectedLeadSources } = useFlowContext();

  return (
    <div className="mb-4 mt-2">
      <div className="flex flex-wrap gap-2">
        <h2 className="mr-2 flex items-center font-medium text-gray-900">
          Lead Source:
        </h2>
        <div className="flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700">
          <span className="mr-1 font-medium">{selectedLeadSources.name}</span>
        </div>
      </div>
    </div>
  );
};

export default SelectedLeadSources;
