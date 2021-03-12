import React from 'react';
import { Button } from "@material-ui/core";
import Cookies from 'js-cookie';

type Props = {
    text: string,
    onClick: () => void
}

const Choose: React.FunctionComponent<Props> = ({ text, onClick }) => {
    return (
        <Button style={{ width: '300pt', height: '100pt', border: '0.75px solid #00000029', borderRadius: '12pt', margin: '12pt',
            backgroundColor: Cookies.get('dove-dark-mode') === 'true' ? '#FFF' : '#363537', textTransform: 'lowercase', overflow: 'scroll' }} onClick={onClick}>
            <span style={{ fontSize: '16pt', fontWeight: 'bold', fontFamily: 'sans-serif', color: Cookies.get('dove-dark-mode') === 'true' ? '#000' : '#FFF' }}>
                { text }
            </span>
        </Button>
    )
}

export default Choose;