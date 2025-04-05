import { createContext, useContext, useState } from "react";

const FlowContext = createContext();

export function FlowProvider({ children }) {
  const [selectedLeadSources, setSelectedLeadSources] = useState([]);
  const [isLeadSourceModalOpen, setIsLeadSourceModalOpen] = useState(false);

  const addLeadSources = (sources) => {
    setSelectedLeadSources(sources);
  };

  const openLeadSourceModal = () => {
    setIsLeadSourceModalOpen(true);
  };

  const closeLeadSourceModal = () => {
    setIsLeadSourceModalOpen(false);
  };

  return (
    <FlowContext.Provider
      value={{
        selectedLeadSources,
        addLeadSources,
        isLeadSourceModalOpen,
        openLeadSourceModal,
        closeLeadSourceModal,
      }}
    >
      {children}
    </FlowContext.Provider>
  );
}

export function useFlowContext() {
  return useContext(FlowContext);
}
