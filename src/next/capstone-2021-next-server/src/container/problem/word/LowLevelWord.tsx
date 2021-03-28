import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NextRouter, useRouter } from "next/router";
import {useMutation, useQuery} from "@apollo/client";
import {GET_CHOICES, POST_REWRITE_REPORT} from "../../../graphQL/quries";
import { RootState } from "../../../modules";
import { storePassedProblem } from "../../../reducers/ProbReducer";
import { IndexProps, Paragraph, Solved } from "../../../types";
import Choose from "../Choose";
import Notiflix from 'notiflix';
import dynamic from "next/dynamic";
const TextToSpeech = dynamic(() => import('../TextToSpeech'), { ssr: false });

type Props = {

}

const LowLevelWord: React.FunctionComponent<Props> = ({ }) => {
    const router: NextRouter = useRouter();
    const dispatch = useDispatch();
    const words = useSelector((state: RootState) => state.ProbReducer);
    const [ indexes, setIndexes ] = React.useState<IndexProps>({
        currentIdx: 0,
        tried: 0,
    })
    let { currentIdx, tried } = indexes;

    const onChooseAnswer = async (choose: Paragraph) => {
        const currentTry: number = tried + 1;
        const problem: Paragraph = problems[currentIdx];
        let updatedPassed: Solved[] = [];
        if ((problem.id === choose.id) || (problem.id !== choose.id && currentTry === 3)) {
            if (problem.id === choose.id) Notiflix.Notify.Success('Correct!');
            else Notiflix.Notify.Failure('Failed... NexT!');

            updatedPassed = [ ...passed, { id: problem.id, eng: problem.eng,
                passed: problem.id === choose.id, tried: currentTry }]
            if (currentIdx < problems.length - 1) {
                dispatch(storePassedProblem([ ...updatedPassed ]))
                await new Promise((resolve) => {
                    refetch({ option: 0, except: problems[currentIdx + 1].id })
                    resolve(true);
                }).then(() => setIndexes({ currentIdx: currentIdx + 1, tried: 0 }))
            } else {
                // TODO: prevent currentIdx + 1 > length
                Notiflix.Confirm.Show(
                    'Test Completed!',
                    'I want to leave it to my report!',
                    'Yes',
                    'No',
                    () => onClickRewriteReport(updatedPassed),
                    () => router.back(),
                )
            }
        } else {
            Notiflix.Notify.Failure('Failed...');
            setIndexes({ ...indexes, tried: tried + 1 });
        }
    }

    let { id, level, problems, passed } = words;
    React.useEffect(() => {
        if (!problems || problems.length === 0) {
            router.back();
            Notiflix.Notify.Failure('잘못된 접근 방식입니다. 이전 페이지로 이동합니다.');
        }
    }, [ problems ])

    const onClickRewriteReport = async (passed: Solved[]) => {
        Notiflix.Loading.Hourglass('Rewrite report...');
        return rewrite({variables: { input: { level: level, solved: passed, content: id }}});
    }

    const [ rewrite ] = useMutation(POST_REWRITE_REPORT, { onCompleted: data => {
            if (data && data.rewrite && data.rewrite.status === 200) {
                router.back();
                Notiflix.Loading.Remove(1000);
            }
        }});

    const { data, loading, refetch } = useQuery(GET_CHOICES, { variables: { option: 0, except: problems.length > 0 && problems[0].id ? problems[0].id : -1 }})
    return (
        <div style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
            <div style={{ width: '100%', height: '300pt', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <span style={{ fontFamily: 'sans-serif', fontSize: '32pt', fontWeight: 'bold' }}>
                    {
                        level === 0 && problems.length > 0 &&
                        problems[currentIdx].eng
                    }
                    {
                        level === 1 && problems.length > 0 &&
                        problems[currentIdx].kor
                    }
                </span>
                <br />
                <span>
                    {`도전횟수 ${tried + 1}`}
                </span>
                <br />
                {
                    level === 1 &&
                        <TextToSpeech text={problems[currentIdx].eng} />
                }
            </div>
            <div style={{ width: '100%', height: '300pt', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>
                {
                    loading || !data ?
                        <span>
                            Fetching choices....
                        </span>
                        :
                        <React.Fragment>
                            <div style={{ width: '100%', height: '100pt', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Choose text={level === 0 ? data.choices.problems[0].kor : data.choices.problems[0].eng} onClick={() => onChooseAnswer(data.choices.problems[0])} />
                                <Choose text={level === 0 ? data.choices.problems[1].kor : data.choices.problems[1].eng} onClick={() => onChooseAnswer(data.choices.problems[1])} />
                            </div>
                            <div style={{ width: '100%', height: '100pt', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '12pt' }}>
                                <Choose text={level === 0 ? data.choices.problems[2].kor : data.choices.problems[2].eng} onClick={() => onChooseAnswer(data.choices.problems[2])} />
                                <Choose text={level === 0 ? data.choices.problems[3].kor : data.choices.problems[3].eng} onClick={() => onChooseAnswer(data.choices.problems[3])} />
                            </div>
                        </React.Fragment>
                }
            </div>
        </div>
    )
}

export default LowLevelWord;