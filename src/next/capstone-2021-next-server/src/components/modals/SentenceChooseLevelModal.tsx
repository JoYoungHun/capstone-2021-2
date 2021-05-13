import React from 'react';
import { useRouter, NextRouter } from "next/router";
import { useDispatch } from 'react-redux';
import {useLazyQuery, useQuery} from "@apollo/client";
import { CloseOutlined } from "@material-ui/icons";
import { Button, Modal, Slide } from "@material-ui/core";
import {GET_SENTENCES, GET_TROPHIES} from "../../graphQL/quries";
import { initializeProblems, storeLevel } from "../../reducers/ProbReducer";
import { routeHttpStatus } from "../../../utils/func";
import {settingOffset, settingTotal} from "../../reducers/HealthGaugeReducer";
import Notiflix from 'notiflix';
import Image from "next/image";

type Props = {
    hidden: boolean,
    close: () => void,
    getCtKey: () => number | undefined
}

type SentenceTrophy = {
    sentenceLev1: boolean,
    sentenceLev2: boolean,
}

const SentenceChooseLevelModal: React.FunctionComponent<Props> = ({ hidden, close, getCtKey }) => {
    const router: NextRouter = useRouter();
    const dispatch = useDispatch();

    const [ trophies, setTrophies ] = React.useState<SentenceTrophy>({
        sentenceLev1: false,
        sentenceLev2: false,
    })

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
                await getSentences();
                setTimeout(() => resolve(true), 1000);
            }).then(() => {
                dispatch(storeLevel(contentKey, selected));
                setTimeout(() => { router.push('/problem/sentence'); Notiflix.Loading.Remove(500); }, 1000);
            })
        }
    }

    const [ getSentences ] = useLazyQuery(GET_SENTENCES, { variables: { id: getCtKey() }, fetchPolicy: 'network-only',
        onCompleted: data => {
            if (data.allSentences && data.allSentences.status === 200) {
                dispatch(initializeProblems(data.allSentences.problems))
                dispatch(settingOffset(Math.ceil(100 / (data.allSentences.problems.length * 3))))
                dispatch(settingTotal(data.allSentences.problems.length))
            } else routeHttpStatus(router, data.allSentences.status, data.allSentences.message);
        }})

    const { error } = useQuery(GET_TROPHIES, { variables: { content: getCtKey() }, fetchPolicy: 'network-only',
        onCompleted: data => {
            if (data.trophies) {
                setTrophies({ ...data.trophies })
            }
        }})

    let { sentenceLev1, sentenceLev2 } = trophies;
    return (
        <Modal open={!hidden} style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Slide direction="down" in={!hidden} mountOnEnter unmountOnExit>
                <div style={{ width: '300pt', background: '#FFF 0% 0% no-repeat padding-box', height: '300pt', padding: '8pt' }}>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ color: '#000', fontSize: '11pt', fontWeight: 'bold' }}>
                            문장 문제 난이도 선택
                        </p>
                        <CloseOutlined style={{ cursor: 'pointer', color: '#d64161' }} fontSize={"large"} color={"primary"} onClick={() => close()} />
                    </div>
                    <div style={{ marginTop: '24pt', width: '100%', height: '150pt', display: 'flex', flexDirection: 'column',
                        justifyContent: 'center', alignItems: 'center', paddingLeft: '8pt', paddingRight: '8pt', color: '#000' }}>
                        <Level backgroundColor={'#1976d2'} onClick={() => onReadyToSolveProblems(0)}>
                            {
                                sentenceLev1 &&
                                <Image
                                    src={"/trophy.png"}
                                    alt="reward for lev1"
                                    width={30}
                                    height={30}
                                />
                            }
                            <span style={{ marginLeft: sentenceLev1 ? '.7rem' : 0, fontWeight: 'bold', fontSize: '12pt' }}>객관식</span>
                        </Level>
                        <Level backgroundColor={'mediumaquamarine'} onClick={() => onReadyToSolveProblems(1)}>
                            {
                                sentenceLev2 &&
                                <Image
                                    src={"/trophy.png"}
                                    alt="reward for lev2"
                                    width={30}
                                    height={30}
                                />
                            }
                            <span style={{ marginLeft: sentenceLev2 ? '.7rem' : 0, fontWeight: 'bold', fontSize: '12pt' }}>주관식</span>
                        </Level>
                    </div>
                </div>
            </Slide>
        </Modal>
    )
}

export default SentenceChooseLevelModal;