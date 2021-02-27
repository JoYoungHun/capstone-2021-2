import React from 'react';

type Props = {
    backgroundColor: string,
    text: string,
    index: number
    type: number,
    onChangeTextArea: (modified: string, index: number, type: number) => void
    translateWhenBlurred?: (index: number) => void
}

const SentenceComponent: React.FunctionComponent<Props> = ({ backgroundColor, text, index, type,
                                                                onChangeTextArea, translateWhenBlurred }) => {
    return (
        <div style={{ background: `${backgroundColor} 0% 0% no-repeat padding-box`, borderRadius: '12px 12px 0px 0px', width: '500px',
            display: 'flex', flexDirection: 'row', alignItems: 'flex-start', paddingTop: '12px', paddingBottom: '3px', border: 0 }}>
            <span style={{ fontFamily: 'Helvetica Neue, Light', fontSize: '13px', color: '#707070', marginLeft: '12px', width: '50px', paddingTop: '3px' }}>
                {`# ${index + 1}`}
            </span>
            <textarea value={text} onChange={(e) => onChangeTextArea(e.target.value, index, type)}
                      onBlur={() => translateWhenBlurred && translateWhenBlurred(index)}
                      style={{ backgroundColor: backgroundColor, fontFamily: 'Helvetica Neue, Light', fontSize: '18px', color: '#707070',
                          paddingRight: '12px', wordBreak: 'break-all', border: 1, width: '100%', borderTopRightRadius: '12px', resize: 'none' }}>
            </textarea>
        </div>
    )
}

export default SentenceComponent;