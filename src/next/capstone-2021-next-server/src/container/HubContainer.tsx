import React from 'react';
import { NextRouter, useRouter } from "next/router";
import { useDispatch } from 'react-redux';
import { modifyAppTabs } from "../reducers/AppNavReducer";
import { Button } from "@material-ui/core";

type Props = {

}

const HubContainer: React.FunctionComponent<Props> = ({ }) => {
    const router: NextRouter = useRouter();
    const dispatch = useDispatch();

    return (
        <div style={{ width: '100%', overflowY: 'scroll' }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <Button style={{ background: '#FFE94A 0% 0% no-repeat padding-box'}}
                        onClick={async () => { await new Promise((resolve) => { dispatch(modifyAppTabs(3)); resolve(true); })
                            .then(() => router.push('/?tb=3').then()) }}>
                    <span style={{ fontFamily: 'sans-serif', fontWeight: 'bold', fontSize: '12pt' }}>
                        컨텐츠 만들기
                    </span>
                </Button>
            </div>
        </div>
    )
}

export default HubContainer;