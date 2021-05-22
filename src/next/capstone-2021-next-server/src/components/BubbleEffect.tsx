import React from 'react';

type Props = {
    zIndex?: number
    id?: string
}

const BubbleEffect: React.FunctionComponent<Props> = ({ zIndex }) => {
    return (
        <div id="background-wrap" style={{ zIndex: zIndex ? zIndex : 0.5 }}>
            <div className="bubble x1"/>
            <div className="bubble x2"/>
            <div className="bubble x3"/>
            <div className="bubble x4"/>
            <div className="bubble x5"/>
            <div className="bubble x6"/>
            <div className="bubble x7"/>
            <div className="bubble x8"/>
            <div className="bubble x9"/>
            <div className="bubble x10"/>
        </div>
    );
}

export default BubbleEffect;