import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLazyQuery } from "@apollo/client";
import { Divider } from "@material-ui/core";
import { TextRotateVerticalRounded } from '@material-ui/icons';
import { RootState } from "../../modules";
import YouTube from "react-youtube";
import Axios from 'axios'
import Notiflix from 'notiflix';
import { parseYoutube } from "../../../utils/func";
import { Category } from "../../types";
import {storeContent, storeFrame} from "../../reducers/ContReducer";
import TextInput from "../TextInput";
import { YellowBtn } from "./commons";
import { GET_PARSE } from "../../graphQL/quries";
import { R_CategoryModal } from "../modals";
import { FLASK_ADDRESS } from "../../env";
// import { CLIENT_ID, REDIRECT, SCOPE } from "../../env";

type Props = {
    modifyTab: (modified: number) => void
}

type RetrieveModalProps = {
    categoryNames: string,
    hidden: boolean
}

const ContFramework: React.FunctionComponent<Props> = ({ modifyTab }) => {
    const dispatch = useDispatch();
    const frameInfo = useSelector((state: RootState) => state.ContReducer)
    const [ modalState, setModalState ] = React.useState<RetrieveModalProps>({
        categoryNames: '',
        hidden: true,
    })

    let { ref, title, captions, categories } = frameInfo.frame;
    let { categoryNames, hidden } = modalState;

    const modifyCategoryNameText = (selected: Category[]) => {
        let names: string = selected.map((ctg: Category) => ctg.name).toString();
        dispatch(storeFrame({ ...frameInfo.frame, categories: selected.map((ctg: Category) => ctg.id) }))
        setModalState({
            categoryNames: names.substr(0, names.length),
            hidden: true
        })
    }

    const closeRetrieveModal = () => {
        setModalState({ hidden: true, categoryNames: '' })
    }

    const onRouteToWordTab = async () => {
        if (ref === '' || title === '' || captions === '') {
            Notiflix.Report.Failure('모든 항목을 입력해주세요.', 'Checkout the all required fields.', 'OK! I will check.');
        } else {
            Notiflix.Loading.Hourglass('Parsing captions...')
            await parse({ variables: { captions: captions.replaceAll('\r\n', '\. ') }})
        }
    }

    const fetchCaptions = async () => {
        const videoId: string = parseYoutube(ref);
        if (videoId !== '') {
            Notiflix.Loading.Dots('Fetching Captions...');
            await Axios.get(`${FLASK_ADDRESS}/transcript?videoId=${videoId}`)
                .then((res) => {
                    if (res.status === 200) {
                        Notiflix.Notify.Success('Successfully Fetch Captions!');
                        dispatch(storeFrame({ ...frameInfo.frame, captions: res.data.join('\r\n') }))
                    } else {
                        Notiflix.Notify.Failure('Subtitles(Captions) are disabled for this video.');
                    }
                })
        }
    }

    // const getGoogleOAuthAccessToken = async () => {
    //     await router.push(`https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&scope=${SCOPE}&redirect_uri=${REDIRECT}&response_type=token`)
    // }

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
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ width: '41.7rem', marginBottom: '12pt' }}>
                        <div style={{ marginBottom: '8pt' }}>
                            <span style={{ fontFamily: 'sans-serif', fontSize: '12pt', fontWeight: 'bold' }}>
                                * 컨텐츠 제목을 입력해주세요.
                            </span>
                        </div>
                        <TextInput width={'41.7rem'} height={'6vh'} value={title}
                                   onChangeValue={(e) => dispatch(storeFrame({ ...frameInfo.frame, title: e })) }
                                   placeholder={'ex) 나만의 컨텐츠 1'} />
                    </div>
                    <div style={{ width: '60.5rem' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                    <div style={{ width: '41.7rem', marginBottom: '12pt' }}>
                        <div style={{ marginBottom: '8pt' }}>
                            <span style={{ fontFamily: 'sans-serif', fontSize: '12pt', fontWeight: 'bold' }}>
                                - 영상의 카테고리를 선택해주세요.
                            </span>
                        </div>
                        <div onClick={() => setModalState({ ...modalState, hidden: false }) }>
                            <TextInput width={'41.7rem'} height={'6vh'} value={categoryNames} onChangeValue={() => { }}
                                       placeholder={'선택된 카테고리들이 표시됩니다.'} readonly={true} />
                        </div>
                    </div>
                    <div style={{ width: '60.5rem' }} />
                </div>
                <Divider variant={"middle"} orientation={"horizontal"} />
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', marginTop: '12pt', justifyContent: 'center' }}>
                    <div style={{ width: '41.7rem' }}>
                        <div style={{ marginBottom: '8pt' }}>
                            <span style={{ fontFamily: 'sans-serif', fontSize: '12pt', fontWeight: 'bold' }}>
                                * 참조한 영상의 주소를 입력해주세요.
                            </span>
                        </div>
                        <TextInput width={'41.7rem'} height={'6vh'} value={ref}
                                   onChangeValue={(e) => dispatch(storeFrame({ ...frameInfo.frame, ref: e })) }
                                   placeholder={'ex) https://www.youtube.com/watch?v={videoId}'} onBlur={() => {}} />
                        <div style={{ marginTop: '24pt', width: '100%' }}>
                            <YouTube videoId={parseYoutube(ref)} opts={{ width: '100%', playerVars: { }}} />
                        </div>
                    </div>
                    <div style={{ width: '58.5rem', marginLeft: '2rem', paddingTop: '.2rem' }}>
                        <div style={{ height: '12vh', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <TextRotateVerticalRounded fontSize={'large'} color={'secondary'} />
                                <span style={{ fontFamily: 'sans-serif', fontSize: '16pt', fontWeight: 600, paddingLeft: '0.8rem' }}>
                                    * 자막(캡션)을 입력해주세요.
                                </span>
                            </div>
                            <YellowBtn onClick={() => fetchCaptions().finally(() => Notiflix.Loading.Remove(500))}>
                                <span style={{ fontFamily: 'sans-serif', color: '#000', fontWeight: 'bold', fontSize: '8pt' }}>
                                    캡션 가져오기
                                </span>
                            </YellowBtn>
                        </div>
                        <div style={{ marginTop: '2pt', width: '100%' }}>
                            <textarea style={{ width: '100%', height: '278pt', border: '1px solid gray', padding: '4pt', resize: 'none', borderRadius: '4pt' }}
                                      value={captions}
                                      onChange={(e) =>
                                          dispatch(storeFrame({ ...frameInfo.frame, captions: e.target.value })) } />
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