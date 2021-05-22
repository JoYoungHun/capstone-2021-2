import React from 'react';
import { Button } from "@material-ui/core";
import Cookies from 'js-cookie';
import PerfectScrollbar from "react-perfect-scrollbar";

type Props = {
    text: string,
    onClick: () => void
}

const Choose: React.FunctionComponent<Props> = ({ text, onClick }) => {
    return (
        <Button className={"ovf"} style={{ width: '28rem', height: '16vh', border: '0.75px solid #00000029', borderRadius: '12pt', margin: '12pt', padding: '8pt',
            backgroundColor: Cookies.get('dove-dark-mode') === 'true' ? '#FFF' : '#363537', textTransform: 'lowercase', overflow: 'auto' }} onClick={onClick}>
            <PerfectScrollbar>
                <span style={{ fontSize: '16pt', fontWeight: 'bold', fontFamily: 'sans-serif', color: Cookies.get('dove-dark-mode') === 'true' ? '#000' : '#FFF' }}>
                    { text }
                </span>
            </PerfectScrollbar>
        </Button>
    )
}

export default Choose;