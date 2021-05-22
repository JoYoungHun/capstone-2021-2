import React from 'react';
import { NextRouter, useRouter } from "next/router";
import { useSelector, useDispatch } from 'react-redux';
import { useMutation } from "@apollo/client";
import { POST_REWRITE_REPORT } from "../../../graphQL/quries";
import { Button, OutlinedInput } from "@material-ui/core";
import { RootState } from "../../../modules";
import { IndexProps, Paragraph, Solved } from "../../../types";
import { storePassedProblem } from "../../../reducers/ProbReducer";
import Cookies from 'js-cookie';
import Notiflix from 'notiflix';
import dynamic from "next/dynamic";
import { routeHttpStatus } from "../../../../utils/func";
import { HealthBar } from "../../../components";
import {gainHealthPower, loseHealthPower} from "../../../reducers/HealthGaugeReducer";
const TextToSpeech = dynamic(() => import('../TextToSpeech'), { ssr: false });

type Props = {

}

const TopLevelWord: React.FunctionComponent<Props> =({ }) => {
    const router: NextRouter = useRouter();
    const dispatch = useDispatch();
    const words = useSelector((state: RootState) => state.ProbReducer);
    const { hp, offset } = useSelector((state: RootState) => state.HealthGaugeReducer);
    let { id, problems, passed } = words;

    const [ indexes, setIndexes ] = React.useState<IndexProps>({
        currentIdx: 0,
        tried: 0,
    })
    let { currentIdx, tried } = indexes;
    const [ answer, setAnswer ] = React.useState<string>('');

    const onEnterAnswer = async () => {
        const currentTry: number = tried + 1;
        const problem: Paragraph = problems[currentIdx];
        let updatedPassed: Solved[] = [];
        let currentGauge: number = hp;
        if ((problem.eng === answer) || (problem.eng !== answer && currentTry === 3)) {
            if (problem.eng === answer) {
                Notiflix.Notify.Success('Correct!');
                dispatch(gainHealthPower());
            } else {
                Notiflix.Notify.Failure('Failed... NexT!');
                currentGauge -= offset;
                dispatch(loseHealthPower());
            }

            updatedPassed = [ ...passed, { id: problem.id, eng: problem.eng,
                passed: problem.eng === answer, tried: currentTry }]
            if (currentIdx < problems.length - 1) {
                dispatch(storePassedProblem([ ...updatedPassed ]))
                setIndexes({ currentIdx: currentIdx + 1, tried: 0 })
                setAnswer('');
            } else {
                // TODO: prevent currentIdx + 1 > length
                if (currentGauge > 0) {
                    Notiflix.Confirm.Show(
                        'Test Completed!',
                        'I want to leave it to my report!',
                        'Yes',
                        'No',
                        () => onClickRewriteReport(updatedPassed),
                        () => router.back()
                    )
                }
            }
        } else {
            Notiflix.Notify.Failure('Failed...');
            dispatch(loseHealthPower());
            currentGauge -= offset;
            setIndexes({ ...indexes, tried: tried + 1 });
        }

        if (currentGauge <= 0) {
            Notiflix.Report.Failure('통과 실패!', 'Failed to pass the exam...', 'Return to preview', () => words.id ? router.push(`/preview?ct=${words.id}`) : router.back());
        }
    }

    React.useEffect(() => {
        if (!problems || problems.length === 0) {
            router.back();
            Notiflix.Notify.Failure('잘못된 접근 방식입니다. 이전 페이지로 이동합니다.');
        }
    }, [ problems ])

    const onClickRewriteReport = async (passed: Solved[]) => {
        Notiflix.Loading.Hourglass('Rewrite report...');
        return rewrite({variables: { input: { level: 2, solved: passed, content: id }}});
    }

    const [ rewrite ] = useMutation(POST_REWRITE_REPORT, { onCompleted: data => {
            if (data && data.rewrite && data.rewrite.status === 200) {
                router.back();
                Notiflix.Loading.Remove(1000);
            } else routeHttpStatus(router, data.rewrite.status, data.rewrite.message);
        }});

    return (
        <div className={"ovf"} style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
            <div style={{ width: '100%', height: '50vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                paddingLeft: '4rem', paddingRight: '4rem' }}>
                <span style={{ fontFamily: 'sans-serif', fontSize: '32pt', fontWeight: 'bold' }}>
                    { problems.length > 0 ? problems[currentIdx].kor : '-' }
                </span>
                <br />
                <span>
                    {`도전횟수 ${tried + 1}`}
                </span>
                <br />
                <TextToSpeech text={problems.length > 0 ? problems[currentIdx].eng : 'error occurred. please push the back button.'} />
                <HealthBar />
            </div>
            <div style={{ width: '100%', height: '50vh', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', height: '9vh', alignItems: 'center' }}>
                    <OutlinedInput
                        style={{ width: '42rem', height: '9vh', fontSize: '21pt', color: Cookies.get('dove-dark-mode') === 'true' ? '#FFF' : '#000',
                            border: `${Cookies.get('dove-dark-mode') === 'true' ? '2' : '0'}px solid ${Cookies.get('dove-dark-mode') === 'true' ? '#FFF' : '#000'}` }}
                        value={answer} onChange={(e) => setAnswer(e.target.value)}
                        placeholder={'정답을 입력해주세요.'}
                        onKeyDown={(e) => { if (e.key === 'Enter') onEnterAnswer().then(() => { }) }}/>
                    <Button style={{ marginLeft: '12pt', width: '8rem', height: '9vh', background: '#FFE94A 0% 0% no-repeat padding-box', boxShadow: '0px 3px 6px #00000029',
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