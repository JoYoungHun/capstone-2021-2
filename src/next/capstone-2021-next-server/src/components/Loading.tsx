import React from 'react';
import Loader from 'react-loader-spinner';

type LoadingProps = {
    color?: string
}

const Loading: React.FunctionComponent<LoadingProps> = ({ color }) => {
    React.useEffect(() => {
        /*
        const timer = setTimeout(() => {
            window.location.reload();
        }, 10000)

        return () => clearTimeout(timer);
         */
    }, [])
    return (
        <div style={{ width: '100%', height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <Loader
                type="Puff"
                color={color ? color : "#00BFFF"}
                height={100}
                width={100}
                timeout={10000} // 10 secs
            />
            <span style={{ color: '#000', fontWeight: 'bold', fontFamily: 'sans-serif', fontSize: '24pt', marginTop: '8pt' }}>
                Loading...
            </span>
        </div>
    )
}

export default Loading;