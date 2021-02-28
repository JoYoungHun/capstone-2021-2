import React from 'react';
import { NextRouter, useRouter } from "next/router";
import { useDispatch } from 'react-redux';
import { useLazyQuery } from "@apollo/client";
import { Divider } from "@material-ui/core";
import { TextRotateVerticalRounded } from '@material-ui/icons';
import YouTube from "react-youtube";
import Axios from 'axios'
import Notiflix from 'notiflix';
import { API_KEY, CLIENT_ID, REDIRECT, SCOPE } from "../../env";
import { parseYoutube } from "../../../utils/func";
import { Category, ContFrame } from "../../types";
import { storeContent } from "../../reducers/ContReducer";
import TextInput from "../TextInput";
import { YellowBtn } from "./commons";
import { GET_PARSE } from "../../graphQL/quries";
import { R_CategoryModal } from "../modals";

type Props = {
    modifyTab: (modified: number) => void
}

type RetrieveModalProps = {
    categoryNames: string,
    hidden: boolean
}

type FramePageStates = {
    frameInfo: ContFrame,
    modalState: RetrieveModalProps
}

const ContFramework: React.FunctionComponent<Props> = ({ modifyTab }) => {
    const router: NextRouter = useRouter();
    const dispatch = useDispatch();
    const [ framePageState, setFramePageState ] = React.useState<FramePageStates>({
        frameInfo: {
            ref: '',
            title: '',
            captions: '',
            categories: [],
        },
        modalState: {
            categoryNames: '',
            hidden: true
        }
    })
    let { ref, title, captions, categories } = framePageState.frameInfo;
    let { categoryNames, hidden } = framePageState.modalState;

    const modifyCategoryNameText = (selected: Category[]) => {
        let names: string = selected.map((ctg: Category) => ctg.name).toString();
        setFramePageState({
            frameInfo: {
                ...framePageState.frameInfo,
                categories: selected.map((ctg: Category) => ctg.id)
            }
            , modalState: {
                categoryNames: names.substr(0, names.length),
                hidden: true
            }
        });
    }

    const closeRetrieveModal = () => {
        setFramePageState({ ...framePageState, modalState: { hidden: true, categoryNames: '' }})
    }

    const onRouteToWordTab = async () => {
        if (ref === '' || title === '' || captions === '') {
            Notiflix.Report.Failure('모든 항목을 입력해주세요.', 'Checkout the all required fields.', 'OK! I will check.');
        } else {
            Notiflix.Loading.Hourglass('Parsing captions...')
            await parse({ variables: { captions: captions }})
        }
    }

    const fetchCaptions = async () => {
        const videoId: string = parseYoutube(ref);
        if (videoId !== '') {
            await Axios.get(`https://www.googleapis.com/youtube/v3/captions?videoId=${videoId}&key=${API_KEY}&part=snippet`, { })
                .then( async (res) => {
                    if (res.status === 200) {
                        let captionKey: string | undefined = undefined;
                        for (let i = 0; i < res.data.items.length; i++) {
                            if (res.data.items[i].snippet.language === 'en')
                                captionKey = res.data.items[i].id;
                        }
                        const hash: string | undefined = window.location.hash.substr(1);
                        const accessToken = hash.substr(hash.search(/(?<=^|&)access_token=/))
                            .split('&')[0]
                            .split('=')[1]
                        if (accessToken && captionKey) {
                            await Axios.get(`https://www.googleapis.com/youtube/v3/captions/${captionKey}?key=${API_KEY}`, {
                                headers: {
                                    Authorization: `Bearer ${accessToken}`
                                }
                            })
                                .then((response) => console.log('finally', response))
                        } else {
                            await getGoogleOAuthAccessToken();
                        }
                    }
                })
        }
    }

    const getGoogleOAuthAccessToken = async () => {
        await router.push(`https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&scope=${SCOPE}&redirect_uri=${REDIRECT}&response_type=token`)
    }

    const [ parse, { } ] = useLazyQuery(GET_PARSE, { onCompleted: async (parsed) => {
            await new Promise((resolve) => {
                dispatch(storeContent({ frame: { ref, title, captions, categories }, words: parsed.parse.words, sentences: parsed.parse.sentences }));
                resolve(true);
            }).then(() => {
                modifyTab(1)
                Notiflix.Loading.Remove(500);
            });
    }});
    return (
        <React.Fragment>
            <div style={{ width: '100%' }}>
                <div style={{ width: '500pt', marginBottom: '12pt' }}>
                    <div style={{ marginBottom: '8pt' }}>
                        <span style={{ fontFamily: 'sans-serif', fontSize: '12pt', fontWeight: 'bold' }}>
                            * 컨텐츠 제목을 입력해주세요.
                        </span>
                    </div>
                    <TextInput width={'500pt'} height={'40pt'} value={title}
                               onChangeValue={(e) => setFramePageState({ ...framePageState, frameInfo: { ...framePageState.frameInfo, title: e } } )}
                               placeholder={'ex) 나만의 컨텐츠 1'} />
                </div>
                <div style={{ width: '500pt', marginBottom: '12pt' }}>
                    <div style={{ marginBottom: '8pt' }}>
                        <span style={{ fontFamily: 'sans-serif', fontSize: '12pt', fontWeight: 'bold' }}>
                            - 영상의 카테고리를 선택해주세요.
                        </span>
                    </div>
                    <div onClick={() => setFramePageState({ ...framePageState, modalState: { ...framePageState.modalState, hidden: false }})}>
                        <TextInput width={'500pt'} height={'40pt'} value={categoryNames} onChangeValue={() => { }}
                                   placeholder={'선택된 카테고리들이 표시됩니다.'} readonly={true} />
                    </div>
                </div>
                <Divider variant={"middle"} orientation={"horizontal"} />
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', marginTop: '12pt' }}>
                    <div style={{ width: '500pt' }}>
                        <div style={{ marginBottom: '8pt' }}>
                            <span style={{ fontFamily: 'sans-serif', fontSize: '12pt', fontWeight: 'bold' }}>
                                * 참조한 영상의 주소를 입력해주세요.
                            </span>
                        </div>
                        <TextInput width={'500pt'} height={'40pt'} value={ref}
                                   onChangeValue={(e) => setFramePageState({ ...framePageState, frameInfo: { ...framePageState.frameInfo, ref: e } } )}
                                   placeholder={'ex) https://www.youtube.com/watch?v={videoId}'} onBlur={() => {}} />
                        <div style={{ marginTop: '24pt', width: '100%' }}>
                            <YouTube videoId={parseYoutube(ref)} opts={{ width: '100%', playerVars: { }}} />
                        </div>
                    </div>
                    <div style={{ width: '700pt', marginLeft: '24pt' }}>
                        <div style={{ height: '86pt', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <TextRotateVerticalRounded fontSize={'large'} color={'secondary'} />
                                <span style={{ fontFamily: 'sans-serif', fontSize: '16pt', fontWeight: 600, paddingLeft: '8pt' }}>
                                    * 자막(캡션)을 입력해주세요.
                                </span>
                            </div>
                            <YellowBtn onClick={() => fetchCaptions()}>
                                <span style={{ fontFamily: 'sans-serif', color: '#000', fontWeight: 'bold', fontSize: '8pt' }}>
                                    캡션 가져오기
                                </span>
                            </YellowBtn>
                        </div>
                        <div style={{ marginTop: '2pt' }}>
                            <textarea style={{ width: '700pt', height: '268pt', border: '1px solid gray', padding: '4pt', resize: 'none', borderRadius: '4pt' }}
                                      value={captions}
                                      onChange={(e) =>
                                          setFramePageState({ ...framePageState, frameInfo: { ...framePageState.frameInfo, captions: e.target.value } })} />
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '24pt' }}>
                <YellowBtn onClick={() => onRouteToWordTab()}>
                    <span style={{ fontFamily: 'sans-serif', color: '#000', fontWeight: 'bold', fontSize: '14px' }}>
                        다음으로
                    </span>
                </YellowBtn>
            </div>
            {
                !hidden &&
                    <R_CategoryModal hidden={hidden} close={closeRetrieveModal} setCategories={modifyCategoryNameText} />
            }
        </React.Fragment>
    )
}

export default ContFramework;