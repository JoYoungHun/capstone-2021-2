import React from 'react';
import { useMutation } from "@apollo/client";
import { CloseOutlined } from "@material-ui/icons";
import { Button, Modal } from "@material-ui/core";
import { DELETE_REMOVE_CONTENT } from "../../graphQL/quries";
import Notiflix from 'notiflix';
import {routeHttpStatus} from "../../../utils/func";
import { NextRouter, useRouter } from "next/router";

type Props = {
    hidden: boolean
    context: {
        id: number,
        title: string,
        message: string,
    }
    reRenderContentList: () => void
    close: () => void
}

const D_ContentModal: React.FunctionComponent<Props> = ({ hidden, context, reRenderContentList, close }) => {
    const router: NextRouter = useRouter();
    const [ deleteContent, { }] = useMutation(DELETE_REMOVE_CONTENT, { onCompleted: async (data) => {
            if (data.deleteContent.status === 200 && reRenderContentList) {
                close();
                reRenderContentList();
            } else routeHttpStatus(router, data.deleteContent.status, data.deleteContent.message);
        }})

    return (
        <Modal open={!hidden} style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <div style={{ width: '400pt', background: '#FFF 0% 0% no-repeat padding-box', height: '120pt', padding: '8pt' }}>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ color: '#000', fontSize: '11pt', fontWeight: 'bold' }}>
                        { `< ${context.title} >`}
                    </p>
                    <CloseOutlined style={{ cursor: 'pointer', color: '#d64161' }} fontSize={"large"} color={"primary"} onClick={() => close()} />
                </div>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', paddingLeft: '8pt', paddingRight: '8pt' }}>
                    <span style={{ color: 'red', fontSize: '14pt', fontWeight: 600 }}>
                        {context.message}
                    </span>
                    <Button style={{ width: '100%', height: '30pt', backgroundColor: 'red', marginTop: '12pt' }}
                            onClick={() => deleteContent({ variables: { id: context.id }}).then(() => Notiflix.Loading.Remove(300))}>
                        <span style={{ color: '#FFF', fontSize: '11pt', fontWeight: 'bold' }}>
                            삭제하기
                        </span>
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default D_ContentModal;