import React, {useRef} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLazyQuery } from "@apollo/client";
import {AddRounded, DescriptionRounded, PublishRounded, SettingsRounded} from "@material-ui/icons";
import { GET_TRANSLATE } from "../../graphQL/quries";
import { storeWord } from "../../reducers/ContReducer";
import { RootState } from "../../modules";
import { YellowBtn } from "./commons";
import { Paragraph } from "../../types";
import WordComponent from "./WordComponent";
import Notiflix from 'notiflix';
import {HoverEvtDiv} from "../commonStyled";
import {SERVER_ADDRESS} from "../../env";
import Cookies from 'js-cookie';
import Axios, {AxiosResponse} from 'axios';
import { getWordUploadExcelFormat } from "../../../utils/func";
import {NextRouter, useRouter} from "next/router";

type Props = {
    modifyTab: (modified: number) => void
}

const ContWord: React.FunctionComponent<Props> = ({ modifyTab }) => {
    const router: NextRouter = useRouter();
    const dispatch = useDispatch();
    const content = useSelector((state: RootState) => state.ContReducer);
    let { words } = content;
    const [ hiddenExcelOptions, setHiddenExcelOptions ] = React.useState<boolean>(true);

    const excelFile = useRef<any>();
    const onRouteToSentenceTab = () => {
        if (words.length === 0) {
            Notiflix.Report.Failure('단어를 한 세트 이상 입력해주세요.', 'Please fill out word fields more than 1 set.', 'OK! I will check.');
        } else {
            modifyTab(2);
        }
    }

    const addTenMoreParagraphs = () => {
        if (words) {
            let temporary: Paragraph[] = [ ...words ]
            for (let i = 0; i < 10; i++)
                temporary.push({ eng: '', kor: '' })

            dispatch(storeWord([ ...temporary ]))
        }
    }

    const onChangeTextArea = async (modified: string, index: number, type: number) => {
        if (content) {
            let temporary: Paragraph[] = [ ...words ];
            if (type === 0) {
                temporary[index].eng = modified;
            } else if (type === 1) {
                temporary[index].kor = modified;
            }
            temporary[index].id = undefined
            dispatch(storeWord([ ...temporary ]))
        }
    }

    const translateWhenBlurred = async (index: number) => {
        if (words[index].eng === '') return;
        translate({ variables: { q: words[index].eng, idx: index }})
    }

    const deleteParagraphOfIndex = (index: number) => {
        if (words) {
            let temporary: Paragraph[] = [ ...words ];
            temporary.splice(index,  1);
            dispatch(storeWord([ ...temporary ]))
        }
    }

    const uploadWordsAsExcel = async (e: File) => {
        const token = Cookies.get('dove-token')
        if (token) {
            Notiflix.Loading.Dots('Parsing excel...')
            let form = new FormData();
            form.append('excel', e)
            await Axios.post(`${SERVER_ADDRESS}/file/excel/upload`, form, {
                headers: { Authorization: token }
            })
                .then((res: AxiosResponse | false) => {
                    if (!res || res.status === 500) {
                        Notiflix.Notify.Failure('Network Error')
                    } else if (res && res.status === 200 && res.data && res.data.status === 200 && res.data.paragraphs) {
                        dispatch(storeWord([ ...res.data.paragraphs ]))
                        Notiflix.Notify.Success('Successfully parsed.')
                    } else if (res && res.status === 401) {
                        Notiflix.Notify.Failure('인증 기한이 만료됐습니다.\n로그인 페이지로 이동합니다.')
                        router.push('/login').then()
                    } else if (res && res.status === 406) {
                        Notiflix.Notify.Failure('접근 권한이 없습니다.');
                        router.back()
                    } else {
                        Notiflix.Report.Failure('잘못된 요청 형식입니다.')
                    }
                })
        }
    }

    const [ translate, {  }] = useLazyQuery(GET_TRANSLATE, { onCompleted: data => {
        let temporary: Paragraph[] = [ ...words ];
        temporary[data.translate.idx].kor = data.translate.translated[0];
        dispatch(storeWord([ ...temporary ]))
    }})

    return (
        <React.Fragment>
            <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                             onClick={() => setHiddenExcelOptions(!hiddenExcelOptions)}>
                            <span style={{ fontFamily: 'Helvetica Neue, Regular', fontSize: '18px', color: '#707070' }}>엑셀 설정</span>
                            <SettingsRounded style={{ marginLeft: '11px', fontSize: '24pt' }} />
                        </div>
                        {
                            !hiddenExcelOptions &&
                            <div style={{ background: '#FFF 0% 0% no-repeat padding-box', display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
                                border: 0, borderRadius: '5pt', boxShadow: '0px 3px 6px #00000029', paddingLeft: '12pt', paddingBottom: '8pt' }}>
                                <HoverEvtDiv style={{ width: '100%', display: 'flex',
                                    justifyContent: 'flex-end', alignItems: 'center', marginTop: '6px', cursor: 'pointer' }}
                                             onClick={() => getWordUploadExcelFormat()}
                                             borderColor={Cookies.get('dove-dark-mode') ? '#FFF' : undefined}>
                                    <span style={{ fontFamily: 'Helvetica Neue, Regular', fontSize: '18px', color: '#707070' }}>엑셀 양식 다운로드</span>
                                    <DescriptionRounded style={{ marginLeft: '11px', fontSize: '24pt', color: '#000' }} />
                                </HoverEvtDiv>
                                <HoverEvtDiv style={{ width: '100%', display: 'flex',
                                    justifyContent: 'flex-end', alignItems: 'center', marginTop: '6px', cursor: 'pointer' }}
                                             onClick={() => excelFile && excelFile.current.click()}
                                             borderColor={Cookies.get('dove-dark-mode') ? '#FFF' : undefined}>
                                    <span style={{ fontFamily: 'Helvetica Neue, Regular', fontSize: '18px', color: '#707070' }}>엑셀 파일로 한번에 올리기</span>
                                    <PublishRounded style={{ marginLeft: '11px', fontSize: '24pt', color: '#000' }} />
                                    <input hidden ref={excelFile} type={'file'} onChange={(e) =>
                                        e.target.files && e.target.files.length > 0 && uploadWordsAsExcel(e.target.files[0])
                                            .then(() => Notiflix.Loading.Remove(500))} />
                                </HoverEvtDiv>
                            </div>
                        }
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <div style={{ width: '70px' }}/>
                            <span style={{ fontFamily: 'Helvetica Neue, Light', fontSize: '18px', width: '440px' }}>
                                단어
                            </span>
                            <span style={{ fontFamily: 'Helvetica Neue, Light', fontSize: '18px' }}>
                                한국어 뜻
                            </span>
                        </div>
                        {
                            (words && words.length > 0) &&
                            words.map(( paragraph: Paragraph, index: number ) => (
                                <WordComponent key={paragraph.id ? paragraph.id : 'paragraph' + index} paragraph={paragraph} index={index}
                                               onChangeTextArea={onChangeTextArea} translateWhenBlurred={translateWhenBlurred}
                                               deleteParagraphOfIndex={deleteParagraphOfIndex} />
                            ))
                        }
                    </div>
                </div>
            </div>
            <div style={{ width: '1000px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '38pt' }}>
                <div style={{ width: '45px', height: '45px', borderRadius: '23px', display: 'flex', justifyContent: 'center', alignItems: 'center'
                    , background: '#0074C9 0% 0% no-repeat padding-box', border: 0, cursor: 'pointer' }}
                     onClick={() => addTenMoreParagraphs()}>
                    <AddRounded color={'primary'} fontSize={'large'} />
                </div>
                <p style={{ color: '#707070', fontFamily: 'Helvetica Neue, Light', fontSize: '18px' }}>
                    10칸 더 추가하기
                </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '24pt' }}>
                <YellowBtn onClick={() => onRouteToSentenceTab()}>
                    <span style={{ fontFamily: 'sans-serif', color: '#000', fontWeight: 'bold', fontSize: '14px' }}>
                        다음으로
                    </span>
                </YellowBtn>
            </div>
        </React.Fragment>
    )
}

export default ContWord;