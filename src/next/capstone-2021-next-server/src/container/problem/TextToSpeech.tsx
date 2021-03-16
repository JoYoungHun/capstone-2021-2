import React from 'react';
import Speech from 'speak-tts';
import { speakProps } from "../../../utils/propTypes";
import { VolumeUp } from "@material-ui/icons";

type Props = {
    text: string
}

const TextToSpeech: React.FunctionComponent<Props> = ({ text }) => {
    const speech = new Speech();
    speech.init({
        'volume': 1,
        'lang': 'en-US',
        'rate': 1,
        'pitch': 1,
        'voice': 'Google US English',
        'splitSentences': true,
    });

    return (
        <VolumeUp fontSize={'large'} style={{ color: '#FFE94A', cursor: 'pointer' }}
                  onClick={() => speech.speak({
                      ...speakProps,
                      text: text,
                  }).then()} />
    )
}

export default TextToSpeech;