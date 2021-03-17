import React from 'react';
import { ResponsivePie } from '@nivo/pie';
import { PiePiece } from "../../types";

type Props = {
    data: PiePiece[]
}

const colors = { 'correctness': '#1976d2', 'failure': '#e06377' }
const getColor = bar => colors[bar.id]

const Pie: React.FunctionComponent<Props> = React.memo(({ data }) => {
    return (
        <div className="chart" style={{ width: '600pt', height: '300pt' }}>
            <ResponsivePie
                colors={getColor}
                data={data}
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                borderWidth={1}
                borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
                radialLabelsSkipAngle={10}
                radialLabelsTextColor="#333333"
                radialLabelsLinkColor={{ from: 'color' }}
                sliceLabelsSkipAngle={10}
                sliceLabelsTextColor="#333333"
                defs={[
                    {
                        id: 'dots',
                        type: 'patternDots',
                        background: 'inherit',
                        color: 'rgba(255, 255, 255, 0.3)',
                        size: 4,
                        padding: 1,
                        stagger: true
                    },
                    {
                        id: 'lines',
                        type: 'patternLines',
                        background: 'inherit',
                        color: 'rgba(255, 255, 255, 0.3)',
                        rotation: -45,
                        lineWidth: 6,
                        spacing: 10
                    }
                ]}
                fill={[
                    {
                        match: {
                            id: 'failure'
                        },
                        id: 'dots'
                    },
                    {
                        match: {
                            id: 'correctness'
                        },
                        id: 'lines'
                    },
                ]}
                legends={[
                    {
                        anchor: 'bottom',
                        direction: 'row',
                        justify: false,
                        translateX: 0,
                        translateY: 56,
                        itemsSpacing: 0,
                        itemWidth: 100,
                        itemHeight: 18,
                        itemTextColor: '#999',
                        itemDirection: 'left-to-right',
                        itemOpacity: 1,
                        symbolSize: 18,
                        symbolShape: 'circle',
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemTextColor: '#FFF'
                                }
                            }
                        ]
                    }
                ]}
            />
            <style jsx>{`
                    .chart {
                        margin: 12pt;
                        padding: 4pt;
                        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
                            transition: 0.3s;
                    }
                    .chart:hover {
                        box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
                    }
                `}</style>
        </div>
    );
});

export default Pie;