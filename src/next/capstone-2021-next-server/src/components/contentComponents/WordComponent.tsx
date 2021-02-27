import React from 'react';
import { Paragraph } from "../../types";
import { ClearRounded } from "@material-ui/icons";

type Props = {
    paragraph: Paragraph
    index: number
    onChangeTextArea: (modified: string, index: number, type: number) => void,
    translateWhenBlurred: (index: number) => void
    deleteParagraphOfIndex: (index: number) => void
    backgroundColor?: string
}

const WordComponent: React.FunctionComponent<Props> = ({ paragraph, index, onChangeTextArea, translateWhenBlurred, deleteParagraphOfIndex,
                                                            backgroundColor}) => {
    return (
        <div style={{ display: 'flex', marginTop: '12px', alignItems: 'center' }}>
            <p style={{ fontSize: '20px', fontFamily: 'Helvetica Neue, Light', width: '70px' }}>
                # {index + 1}
            </p>
            <div style={{ width: backgroundColor ? '500px' : '420px', background: `${backgroundColor ? backgroundColor : '#F4F4F4'} 0% 0% no-repeat padding-box`
                , boxShadow: '0px 3px 6px 0px #00000029', borderRadius: '12px', display: 'flex', alignItems: 'center' }}>
                                <textarea value={paragraph.eng} placeholder={'단어를 입력해주세요.'}
                                          onChange={(e) => onChangeTextArea(e.target.value, index, 0)}
                                          onBlur={() => translateWhenBlurred(index)}
                                          style={{ width: '396px', height: '100%', outline: 'none', border: 0, borderRadius: '12px', textAlign: 'left'
                                              , color: '#707070', fontSize: '19px', fontFamily: 'Helvetica Neue, Light',
                                              background: '#F4F4F4 0% 0% no-repeat padding-box', resize: 'none', margin: '8px auto' }}
                                />
            </div>
            <div style={{ width: '420px', background: '#F4F4F4 0% 0% no-repeat padding-box'
                , boxShadow: '0px 3px 6px 0px #00000029', borderRadius: '12px', marginLeft: '20px' }}>
                                <textarea value={paragraph.kor} placeholder={'한국어 뜻을 입력해주세요.'}
                                          onChange={(e) => onChangeTextArea(e.target.value, index, 1)}
                                          style={{ width: '396px', height: '100%', outline: 'none', border: 0, borderRadius: '12px', textAlign: 'left'
                                              , color: '#707070', fontSize: '19px', fontFamily: 'Helvetica Neue, Light',
                                              background: '#F4F4F4 0% 0% no-repeat padding-box', resize: 'none', margin: '8px' }}
                                />
            </div>
            <ClearRounded fontSize={'large'} onClick={() => deleteParagraphOfIndex(index)} style={{ cursor: 'pointer'}} />
        </div>
    )
}

export default WordComponent;