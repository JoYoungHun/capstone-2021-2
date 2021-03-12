import React from 'react';
import { NextRouter, useRouter } from "next/router";
import { useSelector, useDispatch } from 'react-redux';
import { Button, OutlinedInput } from "@material-ui/core";
import { VolumeUp } from "@material-ui/icons";
import { RootState } from "../../../modules";
import { IndexProps, Paragraph } from "../../../types";
import { storePassedProblem } from "../../../reducers/ProbReducer";
import { speakProps } from "../../../../utils/propTypes";
import Cookies from 'js-cookie';
import Notiflix from 'notiflix';
import Speech from 'speak-tts';

type Props = {

}

const TopLevelWord: React.FunctionComponent<Props> =({ }) => {
    const router: NextRouter = useRouter();
    const dispatch = useDispatch();
    const words = useSelector((state: RootState) => state.ProbReducer);
    let { problems } = words;

    const [ indexes, setIndexes ] = React.useState<IndexProps>({
        currentIdx: 0,
        tried: 0,
    })
    let { currentIdx, tried } = indexes;
    const [ answer, setAnswer ] = React.useState<string>('');

    const onEnterAnswer = async () => {
        const currentTry: number = tried + 1;
        const problem: Paragraph = problems[currentIdx];
        if ((problem.eng === answer) || (problem.eng !== answer && currentTry === 3)) {
            if (problem.eng === answer) Notiflix.Notify.Success('Correct!');
            else Notiflix.Notify.Failure('Failed... NexT!');

            if (currentIdx < problems.length - 1) {
                dispatch(storePassedProblem([ ...words.passed, { id: problem.id, eng: problem.eng, passed: currentTry !== 3, tried: currentTry }]))
                setIndexes({ currentIdx: currentIdx + 1, tried: 0 })
                setAnswer('');
            } else {
                // TODO: prevent currentIdx + 1 > length
                Notiflix.Confirm.Show(
                    'Test Completed!',
                    'I want to leave it to my report!',
                    'Yes',
                    'No',
                    () => Notiflix.Report.Success('준비중입니다...'),
                    () => router.back()
                )
            }
        } else {
            Notiflix.Notify.Failure('Failed...');
            setIndexes({ ...indexes, tried: tried + 1 });
        }
    }

    const speech = new Speech();
    speech.init({
        'volume': 1,
        'lang': 'en-US',
        'rate': 1,
        'pitch': 1,
        'voice': 'Google US English Male',
        'splitSentences': true,
    });

    return (
        <div style={{ width: '100%', height: '100%', overflowY: 'scroll' }}>
            <div style={{ width: '100%', height: '300pt', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <span style={{ fontFamily: 'sans-serif', fontSize: '32pt', fontWeight: 'bold' }}>
                    { problems[currentIdx].kor }
                </span>
                <br />
                <span>
                    {`도전횟수 ${tried + 1}`}
                </span>
                <br />
                <VolumeUp fontSize={'large'} style={{ color: '#FFE94A', cursor: 'pointer' }}
                          onClick={() => speech.speak({
                              ...speakProps,
                              text: problems[currentIdx].eng,
                          }).then()} />
            </div>
            <div style={{ width: '100%', height: '300pt', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', height: '60pt', alignItems: 'center' }}>
                    <OutlinedInput
                        style={{ width: '370pt', height: '60pt', fontSize: '21pt', color: Cookies.get('dove-dark-mode') === 'true' ? '#FFF' : '#000',
                            border: `${Cookies.get('dove-dark-mode') === 'true' ? '2' : '0'}px solid ${Cookies.get('dove-dark-mode') === 'true' ? '#FFF' : '#000'}` }}
                        value={answer} onChange={(e) => setAnswer(e.target.value)}
                        placeholder={'정답을 입력해주세요.'}
                        onKeyDown={(e) => { if (e.key === 'Enter') onEnterAnswer().then(() => { }) }}/>
                    <Button style={{ marginLeft: '12pt', width: '100pt', height: '60pt', background: '#FFE94A 0% 0% no-repeat padding-box', boxShadow: '0px 3px 6px #00000029',
                        border: 0, borderRadius: '12pt' }} onClick={() => onEnterAnswer()}>
                        <span style={{ color: '#000', fontSize: '13pt', fontWeight: 'bold' }}>
                            정답!
                        </span>
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default TopLevelWord;