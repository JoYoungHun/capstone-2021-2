import React from 'react';
import { ResponsiveRadar } from '@nivo/radar';
import { RadarPiece } from "../../types";

type Props = {
    data: RadarPiece[]
}
//
// const demo = [
//     {
//         "taste": "fruity",
//         "total": 100,
//         "correct": 50,
//     },
//     {
//         "taste": "bitter",
//         "total": 100,
//         "correct": 50,
//     },
//     {
//         "taste": "heavy",
//         "total": 100,
//         "correct": 50,
//     },
//     {
//         "taste": "strong",
//         "total": 100,
//         "correct": 50,
//     },
//     {
//         "taste": "sunny",
//         "total": 100,
//         "correct": 50,
//     }
// ]

const Radar: React.FunctionComponent<Props> = React.memo(({ data }) => {
    return (
        <div className="chart" style={{ width: '600pt', height: '300pt' }}>
            <ResponsiveRadar
                data={data}
                keys={[ 'total', 'correct' ]}
                indexBy="taste"
                maxValue="auto"
                margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
                curve="linearClosed"
                borderWidth={2}
                borderColor={{ from: 'color' }}
                gridLevels={5}
                gridShape="circular"
                gridLabelOffset={36}
                enableDots={true}
                dotSize={10}
                dotColor={{ theme: 'background' }}
                dotBorderWidth={2}
                dotBorderColor={{ from: 'color' }}
                enableDotLabel={true}
                dotLabel="value"
                dotLabelYOffset={-12}
                colors={{ scheme: 'nivo' }}
                fillOpacity={0.25}
                blendMode="multiply"
                animate={true}
                isInteractive={true}
                legends={[
                    {
                        anchor: 'top-left',
                        direction: 'column',
                        translateX: -50,
                        translateY: -40,
                        itemWidth: 80,
                        itemHeight: 20,
                        itemTextColor: '#999',
                        symbolSize: 12,
                        symbolShape: 'circle',
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemTextColor: '#000'
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

export default Radar;