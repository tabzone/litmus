import React, { useEffect, useState } from 'react';
import DagreGraph, { d3Link, d3Node } from '../../../components/DagreGraph';
import { Nodes } from '../../../models/graphql/workflowData';
import useActions from '../../../redux/actions';
import * as NodeSelectionActions from '../../../redux/actions/nodeSelection';
import * as TabActions from '../../../redux/actions/tabs';
import useStyles from './styles';

interface GraphData {
  nodes: d3Node[];
  links: d3Link[];
}
interface ArgoWorkflowProps {
  nodes: Nodes;
}

const ArgoWorkflow: React.FC<ArgoWorkflowProps> = ({ nodes }) => {
  const classes = useStyles();
  // Redux action call for updating selected node
  const nodeSelection = useActions(NodeSelectionActions);
  const tabs = useActions(TabActions);

  const [graphData, setGraphData] = useState<GraphData>({
    nodes: [],
    links: [],
  });

  // Get the selected Node
  const [selectedNodeID, setSelectedNodeID] = useState<string>(
    Object.keys(nodes)[0]
  );

  useEffect(() => {
    const data: GraphData = {
      nodes: [],
      links: [],
    };

    for (const key of Object.keys(nodes)) {
      const node = nodes[key];

      data.nodes.push({
        id: key,
        class: `${node.phase} ${node.type}`,
        label: node.type !== 'StepGroup' ? node.name : '',
        labelType: 'html',
      });

      if (node.children) {
        node.children.map((child) =>
          data.links.push({
            source: key,
            target: child,
            config: {
              arrowheadStyle: 'display: arrowhead',
            },
          })
        );
      }
    }

    setGraphData({
      nodes: [...data.nodes],
      links: [...data.links],
    });
  }, [nodes]);

  useEffect(() => {
    nodeSelection.selectNode({
      ...nodes[selectedNodeID],
      pod_name: selectedNodeID,
    });
  }, [selectedNodeID]);

  return graphData.nodes.length ? (
    <DagreGraph
      className={classes.dagreGraph}
      nodes={graphData.nodes}
      links={graphData.links}
      config={{
        ranker: 'tight-tree',
      }}
      animate={1000}
      shape="rect"
      fitBoundaries
      zoomable
      onNodeClick={({ original }) => {
        const nodeID = Object.keys(nodes).filter(
          (key) => key === original?.id
        )[0];
        setSelectedNodeID(nodeID);
        tabs.changeWorkflowDetailsTabs(1);
      }}
    />
  ) : (
    <div>Loading Graph...</div>
  );
};

export default ArgoWorkflow;
