import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from "../modules";

type Props = {
}

const HealthBar: React.FunctionComponent<Props> = ({  }) => {
    const gauge = useSelector((state: RootState) => state.HealthGaugeReducer);
    let { hp } = gauge;

    return (
        <React.Fragment>
            <div style={{ marginTop: '1rem', height: '5vh', width: '32rem', backgroundColor: '#e0e0de', borderRadius: 50 }}>
                <div style={{ height: '100%', width: `${hp}%`, backgroundColor: hp > 70 ? '#1976d2' : hp > 40 ? '#FFE94A' : '#c83349', borderRadius: 'inherit', textAlign: 'right',
                    transition: 'all 1s ease-in-out' }}>
                    <span style={{ padding: 5, color: '#000', fontWeight: 'bold', verticalAlign: 'middle', lineHeight: '5vh' }}>{`${hp}%`}</span>
                </div>
            </div>
        </React.Fragment>
    );
}

export default HealthBar;