import { Plus } from "lucide-react";

const EmptyFlowState = ({ onAddFirstNode, recipientEmail }) => {
  return (
    <div className="flex h-full flex-col items-center justify-center relative z-10">
      <div className="mb-6 rounded-full bg-blue-50 p-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-10 w-10 text-blue-600"
        >
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
          <polyline points="22,6 12,13 2,6"></polyline>
        </svg>
      </div>
      <h3 className="mb-2 text-xl font-bold text-gray-900">
        Start Building Your Email Flow
      </h3>
      <p className="mb-6 max-w-md text-center text-gray-500">
        Create a sequence of emails, delays, and conditions to engage with your
        leads effectively.
      </p>
      <div className="relative items-center justify-center flex flex-col gap-4">
        <button
          onClick={onAddFirstNode}
          className={`flex items-center rounded-lg px-6 py-3 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            recipientEmail
              ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
              : "bg-gray-300 cursor-not-allowed"
          }`}
          disabled={!recipientEmail}
        >
          <Plus className="mr-2 h-5 w-5" />
          Add First Node
        </button>

        {!recipientEmail && (
          <p className="mt-2 text-sm text-red-500">
            Please select a lead source to enable adding a node.
          </p>
        )}
      </div>
    </div>
  );
};

export default EmptyFlowState;
