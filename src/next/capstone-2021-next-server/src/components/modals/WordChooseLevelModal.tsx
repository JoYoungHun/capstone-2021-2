import React from 'react';
import { NextRouter, useRouter } from "next/router";
import { useDispatch } from 'react-redux';
import { CloseOutlined } from "@material-ui/icons";
import { Button, Modal, Slide } from "@material-ui/core";
import { useLazyQuery } from "@apollo/client";
import { GET_WORDS } from "../../graphQL/quries";
import { initializeProblems, storeLevel } from "../../reducers/ProbReducer";
import Notiflix from 'notiflix'

type Props = {
    hidden: boolean,
    close: () => void
    getCtKey: () => number | undefined
}

const WordChooseLevelModal: React.FunctionComponent<Props> = ({ hidden, close, getCtKey }) => {
    const router: NextRouter = useRouter();
    const dispatch = useDispatch();
    const Level = ({ children, backgroundColor, onClick }) => (
        <Button style={{ width: '180pt', height: '50pt', backgroundColor: backgroundColor ? backgroundColor : '#FFE94A', margin: '12pt',
            border: 0, boxShadow: '0px 3px 6px #00000029' }} onClick={onClick}>
            {children}
        </Button>
    )

    const onReadyToSolveProblems = async ( selected: number ) => {
        let contentKey: number | undefined = getCtKey();
        if (contentKey) {
            // initialize states
            Notiflix.Loading.Dots('Preparing problems...');
            await new Promise(async (resolve) => {
                await getWords();
                setTimeout(() => resolve(true), 1000);
            }).then(() => {
                dispatch(storeLevel(contentKey, selected));
                setTimeout(() => { router.push('/problem/word'); Notiflix.Loading.Remove(500); }, 1000);
            })
        }
    }

    const [ getWords ] = useLazyQuery(GET_WORDS, { variables: { id: getCtKey() },
        onCompleted: data => {
            if (data.allWords && data.allWords.status === 200) {
                dispatch(initializeProblems(data.allWords.problems))
            } else {
                router.push('/').then(() => { });
            }
        }})

    return (
        <Modal open={!hidden} style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', transition: 'all ease 1s' }}>
            <Slide direction="down" in={!hidden} mountOnEnter unmountOnExit>
                <div style={{ width: '300pt', background: '#FFF 0% 0% no-repeat padding-box', height: '300pt', padding: '8pt' }}>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ color: '#000', fontSize: '11pt', fontWeight: 'bold' }}>
                            단어 문제 난이도 선택
                        </p>
                        <CloseOutlined style={{ cursor: 'pointer', color: '#d64161' }} fontSize={"large"} color={"primary"} onClick={() => close()} />
                    </div>
                    <div style={{ marginTop: '24pt', width: '100%', height: '200pt', display: 'flex', flexDirection: 'column',
                        justifyContent: 'center', alignItems: 'center', paddingLeft: '8pt', paddingRight: '8pt', color: '#000' }}>
                        <Level backgroundColor={'#1976d2'} onClick={() => onReadyToSolveProblems(0)}>
                            <span style={{ fontWeight: 'bold', fontSize: '12pt' }}>Level 1</span>
                        </Level>
                        <Level backgroundColor={'mediumaquamarine'} onClick={() => onReadyToSolveProblems(1)}>
                            <span style={{ fontWeight: 'bold', fontSize: '12pt' }}>Level 2</span>
                        </Level>
                        <Level backgroundColor={'lightcoral'} onClick={() => onReadyToSolveProblems(2)}>
                            <span style={{ fontWeight: 'bold', fontSize: '12pt' }}>Level 3</span>
                        </Level>
                    </div>
                </div>
            </Slide>
        </Modal>
    )
}

export default WordChooseLevelModal;