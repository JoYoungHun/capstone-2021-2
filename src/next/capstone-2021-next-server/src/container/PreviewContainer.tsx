import React, {useRef} from 'react';
import YouTube from "react-youtube";
import { parseYoutube } from "../../utils/func";
import { YellowBtn } from "../components/contentComponents/commons";
import { EqualizerRounded, LanguageRounded } from "@material-ui/icons";
import LevelMenu from "../components/LevelMenu";
import LanguageMenu from "../components/LanguageMenu";
import { useLazyQuery } from "@apollo/client";
import { GET_CONTENT_SUMMARY } from "../graphQL/quries";
import {NextRouter, useRouter} from "next/router";
import {SummaryShell} from "../types";
import {Loading} from "../components";
import { Divider } from "@material-ui/core";

type Props = {
    ref?: string,
}

type OptionProps = {
    level: number,
    language: string
}

const PreviewContainer: React.FunctionComponent<Props> = ({ ref }) => {
    const router: NextRouter = useRouter();
    const [ options, setOptions ] = React.useState<OptionProps>({
        level: 0,
        language: 'KOR & ENG'
    })
    const [ shells, setShells ] = React.useState<SummaryShell[]>([ ]);
    const page: React.MutableRefObject<number> = useRef(1);

    let { level, language } = options;

    const modifyLevel = (modified: number) => {
        if (level !== modified)
            setOptions({ ...options, level: modified })
    }

    const modifyLanguage = (modified: string) => {
        if (language !== modified)
            setOptions({ ...options, language: modified })
    }

    React.useEffect(() => {
        const contentKey: string | string[] | undefined = router.query?.ct;
        if (contentKey && typeof(contentKey) === 'string') {
            summary({ variables: {
                content: parseInt(contentKey),
                level: level,
                page: page.current,
                } })
        }
    }, [ page, options.level, router.query ])

    const [ summary, { loading, error } ] = useLazyQuery(GET_CONTENT_SUMMARY, { onCompleted: response => {
            if (response.summary) {
                setShells(response.summary.shells);
            }
        }})

    return (
        <div style={{ width: '100%', height: 'calc(100% - 60pt)', backgroundColor: '#363537', display: 'flex' }}>
            <div style={{ width: '700pt', height: '700pt', marginLeft: '32pt' }}>
                <div style={{ width: '100%', height: '340pt' }}>
                    <div style={{ height: '50pt' }}/>
                    <YouTube videoId={parseYoutube(ref)} opts={{ width: '100%', playerVars: { }}} />
                </div>
                <div style={{ width: '100%', height: '150pt', display: 'flex', alignItems: 'flex-start' }}>
                    <div style={{ width: '200pt', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <EqualizerRounded style={{ color: '#FFF' }} />
                        <span style={{ color: '#FFF', fontSize: '18pt', fontWeight: 'bold', paddingLeft: '4pt' }}>
                            난이도
                        </span>
                        <LevelMenu modifyLevel={modifyLevel} selected={level} />
                    </div>
                    <div style={{ width: '500pt', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <LanguageRounded style={{ color: '#FFF' }} />
                        <span style={{ color: '#FFF', fontSize: '18pt', fontWeight: 'bold' }}>
                            표시 언어
                        </span>
                        <LanguageMenu modifyLanguage={modifyLanguage} selected={language} />
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', fontFamily: 'sans-serif' }}>
                    <YellowBtn width={'150pt'} height={'36pt'} onClick={() => {}}>
                        <span style={{ color: '#000', fontWeight: 'bold' }}>
                            단어 문제 풀기
                        </span>
                    </YellowBtn>
                    <YellowBtn width={'150pt'} height={'36pt'} marginLeft={'16pt'} onClick={() => {}}>
                        <span style={{ color: '#000', fontWeight: 'bold' }}>
                            문장 문제 풀기
                        </span>
                    </YellowBtn>
                </div>
            </div>
            <div style={{ marginLeft: '16pt', width: 'calc(100% - 700pt)', height: '700pt', paddingRight: '16pt' }}>
                <div style={{ width: '100%', height: '100%', backgroundColor: '#000', paddingLeft: '1pt', paddingRight: '1pt' }}>
                    <div style={{ backgroundColor: '#000', width: '100%', height: '50pt', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <span style={{ color: '#FFF', fontWeight: 'bold', fontSize: '15pt' }}>
                            요약
                        </span>
                    </div>
                    <div style={{ height: '100%', width: '100%', backgroundColor: '#363537', color: '#FFF', fontWeight: 'bold',
                        paddingTop: '12pt', paddingLeft: '8pt', paddingRight: '8pt' }}>
                        {
                            shells.map((shell: SummaryShell, index: number) => (
                                    <div key={`shell-${index}`} style={{ width: '100%', marginBottom: '16pt' }}>
                                        <div style={{ width: '100%', marginBottom: '4pt' }}>
                                            <span>{shell.originalText}</span>
                                            <br />
                                            <br />
                                            <span>{shell.translatedKor}</span>
                                        </div>
                                        <Divider variant={'inset'} component={'hr'} orientation={'horizontal'} />
                                    </div>
                            ))
                        }
                        {
                            loading && <Loading />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PreviewContainer;