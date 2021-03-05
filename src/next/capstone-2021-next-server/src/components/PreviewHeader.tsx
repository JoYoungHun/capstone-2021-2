import React from 'react';
import {ArrowBackRounded} from "@material-ui/icons";

type Props = {
    title: string,
    goBack: () => void,
}

const PreviewHeader: React.FunctionComponent<Props> = ({ title, goBack }) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60pt', background: '#FFE94A 0% 0% no-repeat padding-box' }}>
            <ArrowBackRounded fontSize={'large'} style={{ position: 'absolute', left: '12pt', top: '32pt', color: '#000', cursor: 'pointer' }} onClick={() => goBack()} />
            <span style={{ fontSize: '14pt', fontWeight: 'bold', color: '#000', verticalAlign: 'center' }}>
                { title }
            </span>
        </div>
    )
}

export default PreviewHeader;