import React from 'react';
import { NextRouter, useRouter } from "next/router";
import { useSelector, useDispatch } from 'react-redux';
import { Button, OutlinedInput } from "@material-ui/core";
import { RootState } from "../../../modules";
import { IndexProps, Paragraph, Solved } from "../../../types";
import { storePassedProblem } from "../../../reducers/ProbReducer";
import { useMutation } from "@apollo/client";
import { POST_REWRITE_REPORT } from "../../../graphQL/quries";
import Cookies from 'js-cookie';
import Notiflix from 'notiflix';
import dynamic from "next/dynamic";
const TextToSpeech = dynamic(() => import('../TextToSpeech'), { ssr: false });

type Props = {

}

const SubjectiveSentence: React.FunctionComponent<Props> = ({ }) => {
    const router: NextRouter = useRouter();
    const dispatch = useDispatch();
    const sentences = useSelector((state: RootState) => state.ProbReducer);
    let { id, problems, passed } = sentences;

    const [ indexes, setIndexes ] = React.useState<IndexProps>({
        currentIdx: 0,
        tried: 0,
    })
    let { currentIdx, tried } = indexes;
    const [ answer, setAnswer ] = React.useState<string>('');

    const [ hint, setHint ] = React.useState<string>('');
    const onEnterAnswer = async () => {
        const currentTry: number = tried + 1;
        const problem: Paragraph = problems[currentIdx];
        let updatedPassed: Solved[] = [];
        let userAnswered: string = answer.toLowerCase(), correctAnswer = problem.eng.toLowerCase();
        if ((correctAnswer === userAnswered) || (correctAnswer !== userAnswered && currentTry === 3)) {
            if (correctAnswer === userAnswered) Notiflix.Notify.Success('Correct!');
            else Notiflix.Notify.Failure('Failed... NexT!');

            updatedPassed = [ ...passed, { id: problem.id, eng: problem.eng,
                passed: correctAnswer === userAnswered, tried: currentTry }]
            if (currentIdx < problems.length - 1) {
                dispatch(storePassedProblem([ ...updatedPassed]))
                setIndexes({ currentIdx: currentIdx + 1, tried: 0 })
                setAnswer('');
            } else {
                // TODO: prevent currentIdx + 1 > length
                Notiflix.Confirm.Show(
                    'Test Completed!',
                    'I want to leave it to my report!',
                    'Yes',
                    'No',
                    () => onClickRewriteReport(updatedPassed),
                    () => router.back()
                )
            }
        } else {
            Notiflix.Notify.Failure('Failed...');
            setIndexes({ ...indexes, tried: tried + 1 });
        }
    }

    React.useEffect(() => {
        if (!problems || problems.length === 0) {
            router.back();
            Notiflix.Notify.Failure('잘못된 접근 방식입니다. 이전 페이지로 이동합니다.');
        }
    }, [ problems ])

    React.useEffect(() => {
        if (problems && problems[currentIdx].eng) {
            let split: string[] = problems[currentIdx].eng.split(" ");
            let hide: number = split.length / (4 - tried);
            let index: number = 0;
            let filtered: string = '';
            for (let i = 0; i < split.length; i++) {
                let rand: number = Math.floor(Math.random() * 10);
                if (rand >= 6 && index < hide) {
                    split[i] = split[i].replace(/[^ ]/gi, "_");
                    index++;
                }
                filtered += split[i] + (i === split.length ? '' : ' ');
            }
            setHint(filtered);
        }
    }, [ tried ])

    const onClickRewriteReport = async (passed: Solved[]) => {
        Notiflix.Loading.Hourglass('Rewrite report...');
        return rewrite({variables: { input: { level: 4, solved: passed, content: id }}});
    }

    const [ rewrite ] = useMutation(POST_REWRITE_REPORT, { onCompleted: data => {
            if (data && data.rewrite && data.rewrite.status === 200) {
                router.back();
                Notiflix.Loading.Remove(1000);
            }
        }});

    return (
        <div style={{ width: '100%', height: '100%', overflowY: 'scroll' }}>
            <div style={{ width: '100%', height: '300pt', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <span style={{ fontFamily: 'sans-serif', fontSize: '32pt', fontWeight: 'bold' }}>
                    { problems.length > 0 ? problems[currentIdx].kor : '-' }
                </span>
                {
                    tried > 0 && hint !== '' &&
                        <React.Fragment>
                            <br />
                            <span style={{ fontFamily: 'sans-serif', fontSize: '16pt', fontWeight: 'lighter' }}>
                                { hint }
                            </span>
                        </React.Fragment>
                }
                <br />
                <span>
                    {`도전횟수 ${tried + 1}`}
                </span>
                <br />
                <TextToSpeech text={problems.length > 0 ? problems[currentIdx].eng : 'error occurred. please push the back button.'} />
            </div>
            <div style={{ width: '100%', height: '300pt', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', height: '60pt', alignItems: 'center' }}>
                    <OutlinedInput
                        style={{ width: '580pt', height: '60pt', fontSize: '21pt', color: Cookies.get('dove-dark-mode') === 'true' ? '#FFF' : '#000',
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
    )
}

export default SubjectiveSentence;