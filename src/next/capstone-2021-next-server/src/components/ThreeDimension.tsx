import React from 'react';
import { ForceGraph3D } from "react-force-graph";
import { GraphDataType } from "../types";

// Node, Link type mismatch
// so change it to any type
type Props = {
    width: number,
    height: number
    graphData: GraphDataType
    onNodeClick: (node: any, evt: MouseEvent) => void
}

const ThreeDimension: React.FunctionComponent<Props> = ({ width, height, graphData, onNodeClick }) => {
    const graphDat = {
        nodes: graphData.nodes.map((node, index) => ({
            id: node?.name,
            name: node?.name,
            group: Math.ceil(index % 10)
        })),
        links: graphData.links
    }

    return (
        <ForceGraph3D
            width={width}
            height={height}
            graphData={graphDat}
            controlType={'orbit'}
            nodeAutoColorBy={'group'}
            backgroundColor={'#224761'}
            linkColor={'#000040'}
            linkOpacity={0.8}
            onNodeClick={(node, evt) => onNodeClick(node, evt)}
        />
    )
}

export default ThreeDimension;