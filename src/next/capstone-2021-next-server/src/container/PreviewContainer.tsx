import React from 'react';
import {ApolloQueryResult, useLazyQuery, useQuery} from "@apollo/client";
import YouTube from "react-youtube";
import { useSelector } from 'react-redux';
import { parseYoutube } from "../../utils/func";
import { YellowBtn } from "../components/contentComponents/commons";
import { EqualizerRounded, LanguageRounded } from "@material-ui/icons";
import LevelMenu from "../components/LevelMenu";
import LanguageMenu from "../components/LanguageMenu";
import { GET_CONTENT_SUMMARY } from "../graphQL/quries";
import { NextRouter, useRouter } from "next/router";
import {ContentDetails, SummaryShell} from "../types";
import { Divider } from "@material-ui/core";
import { RootState } from "../modules";
import useIntersectionObserver from "../hooks/useIntersectionObserver";
import Loader from "react-loader-spinner";
import {LevelGuideModal, SentenceChooseLevelModal, WordChooseLevelModal} from "../components/modals";
import Notiflix from 'notiflix';

type Props = {
}

type OptionProps = {
    level: number,
    language: string
}

type SummaryViewState = {
    shells: SummaryShell[],
    isFetching: boolean,
    hasMore: boolean,
}

type PreviewContainerModalState = {
    hiddenGuideModal: boolean,
    hiddenWordModal: boolean,
    hiddenSentenceModal: boolean,
}

const PreviewContainer: React.FunctionComponent<Props> = ({ }) => {
    const router: NextRouter = useRouter();
    const contentDetails = useSelector((state: RootState) => state.ContReducer);
    const [ modals, setModals ] = React.useState<PreviewContainerModalState>({
        hiddenGuideModal: true,
        hiddenWordModal: true,
        hiddenSentenceModal: true,
    });
    let { hiddenGuideModal, hiddenWordModal, hiddenSentenceModal } = modals;

    const [ options, setOptions ] = React.useState<OptionProps>({
        level: 0,
        language: 'KOR & ENG'
    })
    const [ summaryView, setSummaryView ] = React.useState<SummaryViewState>({
        shells: [],
        isFetching: false,
        hasMore: false,
    })
    let { level, language } = options;

    // instance
    const page: React.MutableRefObject<number> = React.useRef(1);
    const totalPage: React.MutableRefObject<number> = React.useRef(0);
    const rootRef = React.useRef<HTMLDivElement | undefined>(undefined);
    const targetRef = React.useRef<HTMLDivElement | undefined>(undefined);

    useIntersectionObserver({
        root: rootRef.current,
        target: targetRef.current,
        threshold: 0.8,
        onIntersect: async ([{ isIntersecting }]) => {
            let contentKey: number | undefined = getCtKey();
            // console.log('intersected', isIntersecting, contentKey, summaryView.isFetching, summaryView.hasMore, page.current, totalPage.current);
            if (isIntersecting && contentKey && !summaryView.isFetching && summaryView.hasMore && page.current + 1 <= totalPage.current) {
                Notiflix.Loading.Hourglass('Fetching summaries...');
                setSummaryView({ ...summaryView, isFetching: true })
                await refetch({ content: contentKey, page: page.current + 1, level }).then(() => { })
                page.current++;
            }
        }
    });

    const modifyLevel = (modified: number) => {
        if (level !== modified)
            setOptions({ ...options, level: modified })
    }

    const modifyLanguage = (modified: string) => {
        if (language !== modified)
            setOptions({ ...options, language: modified })
    }

    const onCloseGuideModal = () => {
        setModals({ ...modals, hiddenGuideModal: true });
    }

    const onCloseWordModal = () => {
        setModals({ ...modals, hiddenWordModal: true })
    }

    const onCloseSentenceModal = () => {
        setModals({ ...modals, hiddenSentenceModal: true })
    }

    const getCtKey = () => {
        let contentKey: number | undefined = contentDetails.frame.id;
        let ct: string | string[] | undefined = router.query?.ct;
        if (!contentKey && typeof ct === 'string')
            contentKey = parseInt(ct)
        return contentKey;
    }

    React.useEffect(() => {
        let contentKey: number | undefined = getCtKey();
        if (contentKey) {
            Notiflix.Loading.Hourglass('Fetching summaries...');
            page.current = 1;
            summary({ variables: { content: contentKey, level, page: page.current }})
        }
    }, [ level, router.query?.ct ])

    const [ summary, { refetch }] = useLazyQuery(GET_CONTENT_SUMMARY, { fetchPolicy: 'cache-and-network', onCompleted: data => {
        if (data && data.summary) {
            let added: SummaryShell[] = page.current === 1 ? [ ...data.summary.shells ] : [ ...summaryView.shells, ...data.summary.shells ]
            setSummaryView({ isFetching: false, shells: [ ...added ], hasMore: page.current < data.summary.totalPages })
            totalPage.current = data.summary.totalPages;
            Notiflix.Loading.Remove(1000);
        }
    }})

    return (
        <div style={{ width: '100%', height: 'calc(100% - 60pt)', backgroundColor: '#363537' }}>
            <div style={{ height: '40pt', width: '100%' }} />
            <div style={{ width: '100%', height: 'calc(100% - 100pt)', display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ width: '700pt', height: '700pt', marginLeft: '32pt' }}>
                    <div style={{ width: '100%', height: '400pt' }}>
                        <YouTube videoId={parseYoutube(contentDetails.frame.ref)} opts={{ width: '100%', height: '500pt', playerVars: { }}} />
                    </div>
                    <div style={{ width: '100%', height: '100pt', display: 'flex', alignItems: 'flex-start' }}>
                        <div style={{ width: '200pt', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <EqualizerRounded style={{ color: '#FFF', cursor: 'pointer' }} onClick={() => setModals({ ...modals, hiddenGuideModal: false })} />
                            <span style={{ color: '#FFF', fontSize: '18pt', fontWeight: 'bold', paddingLeft: '4pt' }}>
                                난이도
                            </span>
                            <LevelMenu modifyLevel={modifyLevel} selected={level} />
                        </div>
                        <div style={{ width: '500pt', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <LanguageRounded style={{ color: '#FFF' }} />
                            <span style={{ color: '#FFF', fontSize: '18pt', fontWeight: 'bold', paddingLeft: '4pt' }}>
                                표시 언어
                            </span>
                            <LanguageMenu modifyLanguage={modifyLanguage} selected={language} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', fontFamily: 'sans-serif' }}>
                        <YellowBtn width={'150pt'} height={'36pt'} onClick={() => setModals({ ...modals, hiddenWordModal: false })}>
                            <span style={{ color: '#000', fontWeight: 'bold' }}>
                                단어 문제 풀기
                            </span>
                        </YellowBtn>
                        <YellowBtn width={'150pt'} height={'36pt'} marginLeft={'16pt'} onClick={() => setModals({ ...modals, hiddenSentenceModal: false })}>
                            <span style={{ color: '#000', fontWeight: 'bold' }}>
                                문장 문제 풀기
                            </span>
                        </YellowBtn>
                    </div>
                </div>
                <div style={{ width: 'calc(100% - 800pt)', height: '600pt', paddingRight: '32pt' }}>
                    <div style={{ width: '100%', height: '100%', backgroundColor: '#000', paddingLeft: '1pt', paddingRight: '1pt' }}>
                        <div style={{ backgroundColor: '#000', width: '100%', height: '50pt', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <span style={{ color: '#FFF', fontWeight: 'bold', fontSize: '15pt' }}>
                                요약
                            </span>
                        </div>
                        <div ref={rootRef} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'column',
                            height: '550pt', width: '100%', color: '#FFF', fontWeight: 'bold', minHeight: '550pt',
                            paddingTop: '12pt', paddingLeft: '8pt', paddingRight: '8pt', paddingBottom: '12pt', overflow: 'scroll' }}>
                            {
                                summaryView.shells.map((shell: SummaryShell, index: number) => (
                                        <div key={`shell-${index}`} style={{ width: '100%' }}>
                                            <div style={{ width: '100%', marginBottom: '4pt', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                                                {
                                                    language !== 'KOR' &&
                                                        <React.Fragment>
                                                            <span>{shell.originalText}</span>
                                                            <br />
                                                            <br />
                                                        </React.Fragment>
                                                }
                                                {
                                                    language !== 'ENG' &&
                                                        <span>
                                                            {shell.translatedKor}
                                                        </span>
                                                }
                                            </div>
                                            <br />
                                            <Divider variant={'inset'} component={'hr'} orientation={'horizontal'} />
                                        </div>
                                ))
                            }
                            {
                                summaryView.isFetching && <Loader
                                    type={"ThreeDots"}
                                    color={"#00BFFF"}
                                    height={60}
                                    width={60}
                                    timeout={10000} // 10 secs
                                />
                            }
                            <div ref={targetRef} style={{ minHeight: '50pt' }}/>
                        </div>
                    </div>
                </div>
            </div>
            { !hiddenGuideModal && <LevelGuideModal hidden={hiddenGuideModal} close={onCloseGuideModal} /> }
            { !hiddenWordModal && <WordChooseLevelModal hidden={hiddenWordModal} close={onCloseWordModal} getCtKey={getCtKey} /> }
            { !hiddenSentenceModal && <SentenceChooseLevelModal hidden={hiddenSentenceModal} close={onCloseSentenceModal} getCtKey={getCtKey} />}
        </div>
    )
}

export default PreviewContainer;