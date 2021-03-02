import React from 'react'
import dynamic from "next/dynamic";
import Image from "next/image";

type Props = {
    modifyTheme: () => void,
    toggle: boolean
}

const ThemeToggleBtn = ({ modifyTheme, toggle }: Props ) => (
    <button style={{ position: 'absolute', left: '10pt', top: '10pt', zIndex: 10, cursor: 'pointer',
        width: '60pt', height: '20pt', border: '0px solid #000', borderRadius: '12pt', backgroundColor: !toggle ? 'gray' : '#FFF' }}
            onClick={() => modifyTheme()}>
        <Image src={!toggle ? "/crescentBg.png" : "/sun-icon.jpg"} width={'20pt'} height={'20pt'} />
    </button>
)

export default dynamic(() => Promise.resolve(ThemeToggleBtn), {
    ssr: false
})
