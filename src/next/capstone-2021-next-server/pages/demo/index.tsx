import React from 'react';
import Notiflix from 'Notiflix';
import dynamic from "next/dynamic";
import TextInput from "../../src/components/TextInput";
const ThreeDimension = dynamic(() => import('../../src/components/ThreeDimension'), { ssr: false })

type Window = {
    width: number,
    height: number
}

const Demo = () => {
    const [ keyword, setKeyword ] = React.useState<string>('국민');
    const [ windowSize, setWindowSize ] = React.useState<Window>({
        width: 0,
        height: 0,
    })

    React.useEffect(() => {
        Notiflix.Loading.Hourglass('Rendering 3D View...');
        if (window !== undefined) {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight })
        }
        Notiflix.Loading.Remove(1000);
    }, [ ])

    return (
        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <div style={{ width: '100%', height: windowSize.height / 1.2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ThreeDimension width={windowSize.width} height={windowSize.height / 1.2} />
            </div>
            <div style={{ zIndex: 1 }}>
                <TextInput width={'40rem'} height={'6rem'} value={keyword} onChangeValue={(e) => setKeyword(e)} />
            </div>
        </div>
    )
}

export default Demo;
