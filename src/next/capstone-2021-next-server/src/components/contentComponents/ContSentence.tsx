import React from 'react';
import { NextRouter, useRouter } from "next/router";
import { useSelector, useDispatch } from 'react-redux';
import {useLazyQuery, useMutation} from "@apollo/client";
import { AddRounded } from "@material-ui/icons";
import { RootState } from "../../modules";
import {initializeContent, storeSentence} from "../../reducers/ContReducer";
import {GET_TRANSLATE, POST_CREATE_CONTENT} from "../../graphQL/quries";
import { Paragraph } from "../../types";
import { YellowBtn } from "./commons";
import SentenceComponent from "./SentenceComponent";
import Notiflix from 'notiflix';
import {routeHttpStatus} from "../../../utils/func";

type Props = {

}

const ContSentence: React.FunctionComponent<Props> = () => {
    const dispatch = useDispatch();
    const content = useSelector((state: RootState) => state.ContReducer);
    let { sentences } = content;
    const router: NextRouter = useRouter();

    const onCompleteEditContent = () => {
        if (sentences.length === 0) {
            Notiflix.Report.Failure('문장을 한 세트 이상 입력해주세요.', 'Please fill out sentence fields more than 1 set.', 'OK! I will check.');
        } else {
            Notiflix.Loading.Hourglass('Saving Contents...');
            const filteredWords = content.words.filter((word: Paragraph) => word.eng !== '' && word.kor !== '');
            const filteredSentences = content.sentences.filter((sentence: Paragraph) => sentence.eng !== '' && sentence.kor !== '');

            create({ variables: { input: { ...content.frame, words: filteredWords, sentences: filteredSentences } }})
                .then( async (res) => {
                    if (res && res.data && res.data.createContent.status === 200) {
                        await new Promise((resolve) => {
                            dispatch(initializeContent())
                            resolve(true)
                        }).then(() => {
                            Notiflix.Loading.Remove(1000);
                            router.push('/home?tb=0').then();
                        })
                    } else routeHttpStatus(router, res.data.createContent.status, res.data.createContent.message);
                });
        }
    }

    const addTenMoreParagraphs = () => {
        if (sentences) {
            let temporary: Paragraph[] = [ ...sentences ]
            for (let i = 0; i < 10; i++)
                temporary.push({ eng: '', kor: '' })

            dispatch(storeSentence([ ...temporary ]))
        }
    }

    const onChangeTextArea = async (modified: string, index: number, type: number) => {
        if (content) {
            let temporary: Paragraph[] = [ ...sentences ];
            if (type === 0) {
                temporary[index].eng = modified;
            } else if (type === 1) {
                temporary[index].kor = modified;
            }
            temporary[index].id = undefined
            dispatch(storeSentence([ ...temporary ]))
        }
    }

    const translateWhenBlurred = async (index: number) => {
        if (sentences[index].eng === '') return;
        translate({ variables: { q: sentences[index].eng, idx: index }})
    }

    const [ translate, {  }] = useLazyQuery(GET_TRANSLATE, { onCompleted: data => {
            let temporary: Paragraph[] = [ ...sentences ];
            temporary[data.translate.idx].kor = data.translate.translated[0];
            dispatch(storeSentence([ ...temporary ]))
        }});

    const [ create, { }] = useMutation(POST_CREATE_CONTENT);

    return (
        <React.Fragment>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', width: '64rem', marginTop: '9vh' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '31.5rem' }}>
                        <span style={{ fontSize: '19px', fontWeight: 'bold', fontFamily: 'Helvetica Neue, Bold' }}>
                            영어 가사/캡션
                        </span>
                        <span style={{ color: '#707070', fontFamily: 'Helvetica Neue, Light', fontSize: '13px', marginTop: '4px' }}>
                            영어 원문 또는 한국어 번역을 직접 수정하려면 입력창을 클릭하세요.
                        </span>
                    </div>
                    <span style={{ fontSize: '19px', fontWeight: 'bold', fontFamily: 'Helvetica Neue, Bold', marginLeft: '2.2rem' }}>
                        한국어 뜻 (자동으로 입력됩니다)
                    </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginTop: '14pt' }}>
                    <div style={{ width: '31.2rem', background: '#F2F2F2 0% 0% no-repeat padding-box',
                        boxShadow: '0px 3px 6px #00000029', border: '0px solid #707070' }}>
                        {
                            sentences && sentences.length > 0 &&
                            sentences.map(( paragraph: Paragraph, index: number ) => (
                                <SentenceComponent key={paragraph.id ? paragraph.id : 'paragraph' + index}
                                               backgroundColor={index % 2 === 0 ? '#fff' : '#F2F2F2'} text={paragraph.eng}
                                               index={index} type={0} onChangeTextArea={onChangeTextArea} translateWhenBlurred={translateWhenBlurred} />
                            ))
                        }
                    </div>
                    <div style={{ width: '31.2rem', background: '#F2F2F2 0% 0% no-repeat padding-box',
                        boxShadow: '0px 3px 6px #00000029', border: '0px solid #707070', marginLeft: '2.2rem' }}>
                        {
                            sentences && sentences.length > 0 &&
                            sentences.map(( paragraph: Paragraph, index: number ) => (
                                <SentenceComponent backgroundColor={index % 2 === 0 ? '#fff' : '#F2F2F2'} text={paragraph.kor}
                                                   index={index} type={1} onChangeTextArea={onChangeTextArea} />
                            ))
                        }
                    </div>
                </div>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '3.1rem' }}>
                    <div style={{ width: '45px', height: '45px', borderRadius: '23px', display: 'flex', justifyContent: 'center', alignItems: 'center'
                        , background: '#0074C9 0% 0% no-repeat padding-box', border: 0, cursor: 'pointer' }}
                         onClick={() => addTenMoreParagraphs()}>
                        <AddRounded color={'primary'} fontSize={'large'} />
                    </div>
                    <p style={{ color: '#707070', fontFamily: 'Helvetica Neue, Light', fontSize: '18px' }}>
                        10칸 더 추가하기
                    </p>
                </div>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                    <YellowBtn onClick={() => onCompleteEditContent()}>
                    <span style={{ fontFamily: 'sans-serif', color: '#000', fontWeight: 'bold', fontSize: '14px' }}>
                        완료하기
                    </span>
                    </YellowBtn>
                </div>
            </div>
        </React.Fragment>
    )
}

export default ContSentence;