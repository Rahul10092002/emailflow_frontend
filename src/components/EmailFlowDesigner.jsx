import { useState, useCallback, useRef, useEffect } from "react";
import ReactFlow, {
  ReactFlowProvider,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
} from "reactflow";
import { toast } from "react-toastify";
import axios from "axios";
import { API_URL } from "../config";
import { useSearchParams } from "react-router-dom";
import { Target } from "lucide-react";

// Node types
import ColdEmailNode from "./nodes/ColdEmailNode";
import DelayNode from "./nodes/DelayNode";
import LeadSourceNode from "./nodes/LeadSourceNode";
import ConditionNode from "./nodes/ConditionNode";
import GoalNode from "./nodes/GoalNode";

// Components
import LeadSourceModal from "./modals/LeadSourceModal";
import SelectedLeadSources from "./SelectedLeadSources";
import EmptyFlowState from "./EmptyFlowState";
import NodeTypeMenu from "./NodeTypeMenu";

// Context
import { useFlowContext } from "../context/FlowContext";
import { EmailProvider, useEmail } from "../context/EmailContext";

const nodeTypes = {
  coldEmail: ColdEmailNode,
  delay: DelayNode,
  leadSource: LeadSourceNode,
  conditionNode: ConditionNode,
  goalNode: GoalNode,
};

const EmailFlowDesigner = () => {
  const [searchParams] = useSearchParams();
  const flowchartId = searchParams.get("id");
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [flowName, setFlowName] = useState("My Email Sequence");
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [nodeTypeMenuPosition, setNodeTypeMenuPosition] = useState(null);
  const [sourceNodeId, setSourceNodeId] = useState(null);
  const [sourceHandleId, setSourceHandleId] = useState(null);
  const [isAddingFirstNode, setIsAddingFirstNode] = useState(false);
  const { recipientEmail, setRecipientFromLead } = useEmail();
  const {
    selectedLeadSources,
    addLeadSources,
    isLeadSourceModalOpen,
    openLeadSourceModal,
    closeLeadSourceModal,
  } = useFlowContext();

  // Load flowchart if ID is provided
  useEffect(() => {
    if (flowchartId) {
      loadFlowchart(flowchartId);
    } else {
      setHistory([{ nodes: [], edges: [] }]);
      setHistoryIndex(0);
    }
  }, [flowchartId]);

  const loadFlowchart = async (id) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/flowchart/${id}`);
      const {
        name,
        nodes: loadedNodes,
        edges: loadedEdges,
      } = response.data.flowchart;

      const nodesWithHandlers = loadedNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          onAddNode: handleNodeTypeMenuOpen,
        },
      }));
      setRecipientFromLead(loadedNodes[0]?.data?.recipient || recipientEmail);
      setFlowName(name);
      setNodes(nodesWithHandlers);
      setEdges(loadedEdges);
      setHistory([{ nodes: nodesWithHandlers, edges: loadedEdges }]);
      setHistoryIndex(0);
    } catch (error) {
      toast.error("Failed to load flowchart");
      console.error("Error loading flowchart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onConnect = useCallback(
    (params) => {
      saveToHistory();
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
            style: {
              stroke: "#000",
              strokeWidth: 3,
              strokeDasharray: "5,5",
            },
          },
          eds
        )
      );
    },
    [setEdges]
  );

  const saveToHistory = useCallback(() => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
    });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex, nodes, edges]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      const nodesWithHandlers = prevState.nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          onAddNode: handleNodeTypeMenuOpen,
        },
      }));
      setNodes(nodesWithHandlers);
      setEdges(prevState.edges);
      setHistoryIndex(historyIndex - 1);
    }
  }, [history, historyIndex, setNodes, setEdges]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      const nodesWithHandlers = nextState.nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          onAddNode: handleNodeTypeMenuOpen,
        },
      }));
      setNodes(nodesWithHandlers);
      setEdges(nextState.edges);
      setHistoryIndex(historyIndex + 1);
    }
  }, [history, historyIndex, setNodes, setEdges]);

  const addNode = useCallback(
    (type, sourceNode = null, sourceHandle = null) => {
      saveToHistory();

      let position = { x: 100, y: 100 };

      if (reactFlowInstance) {
        if (sourceNode) {
          const sourceNodeObj = nodes.find((node) => node.id === sourceNode);
          if (sourceNodeObj) {
            position = {
              x: sourceNodeObj.position.x + 400, // ← left of source node
              y: sourceNodeObj.position.y,
            };

            if (sourceHandle === "no") {
              position.y += 150;
            } else if (sourceHandle === "yes") {
              position.y -= 150;
            }
          }
        } else {
          position = reactFlowInstance.project({
            x: reactFlowWrapper.current.offsetWidth / 2,
            y: reactFlowWrapper.current.offsetHeight / 3,
          });
        }
      }

      let defaultData = { label: type };
      const nodeType = type;

      switch (type) {
        case "coldEmail":
          defaultData = {
            ...defaultData,
            subject: "New Email",
            body: "Write your email content here...",
            recipient: recipientEmail,
          };
          break;
        case "delay":
          defaultData = {
            ...defaultData,
            amount: "1",
            unit: "days",
          };
          break;
        case "leadSource":
          defaultData = {
            ...defaultData,
            recipient: recipientEmail,
            name: "New Lead Source",
            description: "Describe your lead source...",
          };
          break;
        case "conditionNode":
          defaultData = {
            ...defaultData,
            type: "opened",
            value: "",
          };
          break;
        case "goalNode":
          defaultData = {
            ...defaultData,
            recipient: recipientEmail,
            name: "Conversion Goal",
            description: "Describe your conversion goal...",
          };
          break;
      }

      defaultData.onAddNode = handleNodeTypeMenuOpen;

      const newNodeId = `node_${Date.now()}`;
      const newNode = {
        id: newNodeId,
        type: nodeType,
        position,
        data: defaultData,
      };

      setNodes((nds) => nds.concat(newNode));

      if (sourceNode) {
        const newEdge = {
          id: `edge_${sourceNode}_${newNodeId}`,
          source: sourceNode,
          target: newNodeId,
          animated: true,
          style: { stroke: "#6366f1", strokeWidth: 2 },
        };

        if (sourceHandle) {
          newEdge.sourceHandle = sourceHandle;
        }

        setEdges((eds) => eds.concat(newEdge));
      }

      return newNodeId;
    },
    [setNodes, setEdges, saveToHistory, reactFlowInstance, nodes]
  );

  const handleNodeTypeMenuOpen = useCallback(
    (event, nodeId, sourceHandle = null) => {
      event.stopPropagation();
      const rect = event.currentTarget.getBoundingClientRect();
      const position = {
        x: rect.left,
        y: rect.bottom + window.scrollY,
      };
      setNodeTypeMenuPosition(position);
      setSourceNodeId(nodeId);
      setSourceHandleId(sourceHandle);
    },
    []
  );

  const handleNodeTypeSelect = useCallback(
    (nodeType) => {
      if (isAddingFirstNode) {
        addNode(nodeType);
        setIsAddingFirstNode(false);
      } else if (sourceNodeId) {
        addNode(nodeType, sourceNodeId, sourceHandleId);
      }
      setNodeTypeMenuPosition(null);
      setSourceNodeId(null);
      setSourceHandleId(null);
    },
    [addNode, isAddingFirstNode, sourceNodeId, sourceHandleId]
  );

  const closeNodeTypeMenu = useCallback(() => {
    setNodeTypeMenuPosition(null);
    setSourceNodeId(null);
    setSourceHandleId(null);
    setIsAddingFirstNode(false);
  }, []);

  const handleAddFirstNode = useCallback(() => {
    setIsAddingFirstNode(true);
    const position = {
      x: window.innerWidth / 2 - 100,
      y: window.innerHeight / 2,
    };
    setNodeTypeMenuPosition(position);
  }, []);

  const saveFlowchart = useCallback(async () => {
    try {
      const method = flowchartId ? "put" : "post";
      const url = flowchartId
        ? `${API_URL}/api/flowchart/${flowchartId}`
        : `${API_URL}/api/flowchart`;

      const nodesToSave = nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          recipient: recipientEmail,
          onAddNode: undefined,
        },
      }));

      const response = await axios[method](url, {
        name: flowName,
        nodes: nodesToSave,
        edges,
        leadSources: selectedLeadSources,
      });

      if (response.status === 200 || response.status === 201) {
        toast.success(`Flowchart ${flowchartId?"updated":"saved"} successfully`);
        if (!flowchartId && response.data.flowchartId) {
          window.history.replaceState(
            null,
            "",
            `/?id=${response.data.flowchartId}`
          );
        }
      }
    } catch (error) {
      toast.error("Failed to save flowchart");
      console.error("Error saving flowchart:", error);
    }
  }, [flowchartId, flowName, nodes, edges, selectedLeadSources]);

  const runEmailSequence = useCallback(async () => {
    if (!flowchartId) {
      toast.warning("Please save the flowchart before running the sequence");
      return;
    }

    try {
      const nodesToSend = nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          recipient: recipientEmail,
          onAddNode: undefined,
        },
      }));

      const response = await axios.post(`${API_URL}/api/schedule-email`, {
        flowchartId,
        nodes: nodesToSend,
        edges,
        leadSources: selectedLeadSources,
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Email sequence scheduled successfully");
      }
    } catch (error) {
      toast.error("Failed to schedule email sequence");
      console.error("Error scheduling email sequence:", error);
    }
  }, [flowchartId, nodes, edges, selectedLeadSources]);

  const handleFlowNameChange = (e) => {
    setFlowName(e.target.value);
  };

  const handleLeadSourceSave = (sources) => {
    addLeadSources(sources);
  };

  const isFlowEmpty = nodes.length === 0;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (nodeTypeMenuPosition && !event.target.closest(".node-type-menu")) {
        closeNodeTypeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [nodeTypeMenuPosition, closeNodeTypeMenu]);

  if (isLoading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <input
          type="text"
          value={flowName}
          onChange={handleFlowNameChange}
          className="rounded-md border-0 bg-transparent px-2 py-1 text-xl font-semibold text-gray-900 focus:border-gray-300 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-300"
          placeholder="Enter flow name"
        />

        <button
          onClick={openLeadSourceModal}
          className="flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          <Target className="mr-1.5 h-4 w-4 text-blue-600" />
          🎯 Choose Lead Source
        </button>
      </div>

      <SelectedLeadSources />

      <ReactFlowProvider>
        <div
          ref={reactFlowWrapper}
          className="h-[70vh] w-full overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm"
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            colorMode="dark"
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            minZoom={0.1}
            maxZoom={1.5}
            defaultZoom={0.8}
            onInit={setReactFlowInstance}
            nodesDraggable={true}
            nodesConnectable={true}
            elementsSelectable={true}
            deleteKeyCode={["Backspace", "Delete"]}
            multiSelectionKeyCode={["Control", "Meta"]}
            selectionKeyCode={["Shift"]}
            snapToGrid={true}
            snapGrid={[15, 15]}
            connectionMode="loose"
            defaultEdgeOptions={{
              animated: false,
              type: "straight",
              style: {
                stroke: "#4ade80",
                strokeWidth: 3,
              },
            }}
          >
            {isFlowEmpty ? (
              <EmptyFlowState
                onAddFirstNode={handleAddFirstNode}
                recipientEmail={recipientEmail}
              />
            ) : (
              <>
                <Controls />
                <MiniMap />
                <Background variant="dots" gap={12} size={1} />
              </>
            )}

            <Panel
              position="top-right"
              className="m-2 rounded-md border border-gray-200 bg-white shadow-sm"
            >
              <div className="flex flex-col gap-2 p-3">
                <button
                  onClick={handleUndo}
                  disabled={historyIndex <= 0}
                  className="flex w-full items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M3 7v6h6"></path>
                    <path d="M3 13c0-4.97 4.03-9 9-9a9 9 0 0 1 6 2.3L21 9"></path>
                  </svg>
                  Undo
                </button>
                <button
                  onClick={handleRedo}
                  disabled={historyIndex >= history.length - 1}
                  className="flex w-full items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M21 7v6h-6"></path>
                    <path d="M21 13c0-4.97-4.03-9-9-9a9 9 0 0 0-6 2.3L3 9"></path>
                  </svg>
                  Redo
                </button>
                <button
                  onClick={saveFlowchart}
                  className="flex w-full items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                  </svg>
                  Save
                </button>
                <button
                  onClick={runEmailSequence}
                  className="flex w-full items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                  Run Sequence
                </button>
              </div>
            </Panel>
          </ReactFlow>
        </div>
      </ReactFlowProvider>

      <LeadSourceModal
        isOpen={isLeadSourceModalOpen}
        onClose={closeLeadSourceModal}
        onSave={handleLeadSourceSave}
        selectedLeads={selectedLeadSources}
      />

      {nodeTypeMenuPosition && (
        <div className="node-type-menu">
          <NodeTypeMenu
            position={nodeTypeMenuPosition}
            onSelect={handleNodeTypeSelect}
            onClose={closeNodeTypeMenu}
          />
        </div>
      )}
    </div>
  );
};

export default EmailFlowDesigner;
