import React, { useState } from "react";
import { Tree } from "react-d3-tree";
import "./App.css";

const initialTreeData = [
  {
    id: "parent", // Assign an ID to the parent node
    name: "Parent",
    children: [
      {
        id: "child1", // Assign IDs to child nodes
        name: "Child One",
        children: [
          {
            id: "grandchild1",
            name: "Grandchild One",
          },
          {
            id: "grandchild2",
            name: "Grandchild Two",
          },
        ],
      },
      {
        id: "child3",
        name: "Child three",
        children: [
          {
            id: "grandchild3",
            name: "Grandchild One",
          },
          {
            id: "grandchild4",
            name: "Grandchild Two",
          },
        ],
      },
      {
        id: "child2",
        name: "Child Two",
      },
    ],
  },
];

const containerStyles = {
  width: "100%",
  height: "100vh",
};

const App = () => {
  const [treeData, setTreeData] = useState(initialTreeData);
  const [v, setV] = useState("step");
  const findNode = (node, nodeId) => {
    if (node.id === nodeId) {
      return node;
    }
    if (node.children) {
      for (let child of node.children) {
        const result = findNode(child, nodeId);
        if (result) return result;
      }
    }
    return null;
  };

  const addNode = (nodeName, parentNodeId, side) => {
    const newTreeData = JSON.parse(JSON.stringify(treeData));
    const parentNode = findNode(newTreeData[0], parentNodeId);

    if (parentNode) {
      if (!parentNode.children) {
        parentNode.children = [];
      }
      const newNode = { id: `${parentNodeId}-${Date.now()}`, name: nodeName }; // Assign a unique ID
      if (side === "left") {
        parentNode.children.unshift(newNode); // Add to the beginning of the children array
      } else {
        parentNode.children.push(newNode); // Add to the end of the children array
      }
      setTreeData(newTreeData);
    } else {
      alert("Parent node not found");
    }
  };

  const handleNodeClick = (nodeData) => {
    const nodeName = prompt("Enter the name of the new node:");
    if (nodeName) {
      const side = prompt("Enter the side to add the node (left/right):");
      if (side === "left" || side === "right") {
        addNode(nodeName, nodeData.id, side); // Pass nodeData.id as parentNodeId
      } else {
        alert("Invalid side. Please enter 'left' or 'right'.");
      }
    }
  };

  // Custom component to render nodes with centered text
  const nodeSize = { x: 200, y: 100 };
  const foreignObjectProps = {
    width: nodeSize.x,
    height: nodeSize.y,
    x: -100,
    y: -50,
  };

  const renderForeignObjectNode = ({
    nodeDatum,
    toggleNode,
    foreignObjectProps,
  }) => (
    <g>
      <foreignObject {...foreignObjectProps}>
        <div style={{ border: "1px solid black", backgroundColor: "#dedede" }}>
          <h3
            onClick={() => handleNodeClick(nodeDatum)}
            style={{ textAlign: "center" }}
          >
            {nodeDatum.name}
          </h3>
          {nodeDatum.children && (
            <button style={{ width: "100%" }} onClick={toggleNode}>
              {nodeDatum.__rd3t.collapsed ? "Expand" : "Collapse"}
            </button>
          )}
        </div>
      </foreignObject>
    </g>
  );

  return (
    <div>
      <select
        name="cars"
        id="cars"
        onChange={(e) => setV(e.currentTarget.value)}
      >
        <option value="step">step</option>
        <option value="diagonal">diagonal</option>
        <option value="elbow">elbow</option>
        <option value="straight">straight</option>
      </select>
      <div style={containerStyles}>
        <Tree
          data={treeData}
          orientation="vertical"
          translate={{ x: 400, y: 200 }}
          onNodeClick={handleNodeClick}
          rootNodeClassName="node__root"
          branchNodeClassName="node__branch"
          leafNodeClassName="node__leaf"
          svgClassName=""
          pathFunc={v}
          renderCustomNodeElement={(rd3tProps) =>
            renderForeignObjectNode({
              ...rd3tProps,
              foreignObjectProps,
            })
          }
          separation={{ siblings: 3, nonSiblings: 2.5 }}
        />
      </div>
    </div>
  );
};

export default App;
