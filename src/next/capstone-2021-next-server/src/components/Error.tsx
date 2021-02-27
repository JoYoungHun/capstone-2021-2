import React from 'react';

type ErrorProps = {
    msg: string
}

const Error: React.FunctionComponent<ErrorProps> = ({ msg }) => {
    return (
        <div>
            <span style={{ color: 'red', fontSize: '24pt', fontWeight: 'bold', fontFamily: 'sans-serif' }}>
                Error Occurred!
            </span>
            <br />
            <span style={{ color: '#000', fontSize: '18pt', fontFamily: 'sans-serif' }}>
                {`${msg}`}
            </span>
        </div>
    )
}

export default Error;