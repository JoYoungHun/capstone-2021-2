import React from 'react';
import { ForceGraph3D } from "react-force-graph";
import { GraphDataType } from "../types";

const dummies = {
    nodes: [
        {
            "id": "국민",
            "name": "국민",
            "val": 1
        },
        {
            "id": "국민대",
            "name": "국민대",
            "val": 10
        },
        {
            "id": "국민대학",
            "name": "국민대학",
            "val": 10
        },
        {
            "id": "국민대학교",
            "name": "국민대학교",
            "val": 10
        },
        {
            "id": "재외국민",
            "name": "재외국민",
            "val": 10
        },
        {
            "id": "재외국민전형",
            "name": "재외국민전형",
            "val": 10
        },
    ],
    links: [
        {
            "source": "국민",
            "target": "국민대"
        },
        {
            "source": "국민대",
            "target": "국민대학"
        },
        {
            "source": "국민대학",
            "target": "국민대학교"
        },
        {
            "source": "국민",
            "target": "재외국민"
        },
        {
            "source": "국민",
            "target": "재외국민전형"
        },
        {
            "source": "재외국민",
            "target": "재외국민전형"
        },
    ]
}

const dummies2 = {
    nodes: [
        {
            "id": "2",
            "name": "범 내려 온다",
            "val": 10
        },
        {
            "id": "0",
            "name": "전범수",
            "val": 5
        }
    ],
    links: [

    ]
}

// Node, Link type mismatch
// so change it to any type
type Props = {
    width: number,
    height: number
    graphData: GraphDataType
}

const ThreeDimension: React.FunctionComponent<Props> = ({ width, height, graphData }) => {
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
        />
    )
}

export default ThreeDimension;