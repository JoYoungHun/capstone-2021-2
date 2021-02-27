import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLazyQuery } from "@apollo/client";
import { AddRounded } from "@material-ui/icons";
import { GET_TRANSLATE } from "../../graphQL/quries";
import { storeWord } from "../../reducers/ContReducer";
import { RootState } from "../../modules";
import { YellowBtn } from "./commons";
import { Paragraph } from "../../types";
import WordComponent from "./WordComponent";
import Notiflix from 'notiflix';

type Props = {
    modifyTab: (modified: number) => void
}

const ContWord: React.FunctionComponent<Props> = ({ modifyTab }) => {
    const dispatch = useDispatch();
    const content = useSelector((state: RootState) => state.ContReducer);
    let { words } = content;

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

    const [ translate, {  }] = useLazyQuery(GET_TRANSLATE, { onCompleted: data => {
        let temporary: Paragraph[] = [ ...words ];
        temporary[data.translate.idx].kor = data.translate.translated[0];
        dispatch(storeWord([ ...temporary ]))
    }})

    return (
        <React.Fragment>
            <div style={{ width: '100%' }}>
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