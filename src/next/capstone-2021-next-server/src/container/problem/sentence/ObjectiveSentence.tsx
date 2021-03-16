import React from 'react';
import { NextRouter, useRouter } from "next/router";
import { useSelector, useDispatch } from 'react-redux';
import {useLazyQuery, useMutation, useQuery} from "@apollo/client";
import {GET_CHOICES, POST_REWRITE_REPORT} from "../../../graphQL/quries";
import { RootState } from "../../../modules";
import { IndexProps, Paragraph } from "../../../types";
import { storePassedProblem } from "../../../reducers/ProbReducer";
import Choose from "../Choose";
import Notiflix from 'notiflix';
import dynamic from "next/dynamic";
const TextToSpeech = dynamic(() => import('../TextToSpeech'), { ssr: false })

type Props = {

}

const ObjectiveSentence: React.FunctionComponent<Props> = ({ }) => {
    const router: NextRouter = useRouter();
    const dispatch = useDispatch();
    const sentences = useSelector((state: RootState) => state.ProbReducer);
    let { id, problems, passed } = sentences;

    const [ indexes, setIndexes ] = React.useState<IndexProps>({
        currentIdx: 0,
        tried: 0,
    })
    let { currentIdx, tried } = indexes;

    const onChooseAnswer = async (choose: Paragraph) => {
        const currentTry: number = tried + 1;
        const problem: Paragraph = problems[currentIdx];
        if ((problem.id === choose.id) || (problem.id !== choose.id && currentTry === 3)) {
            if (problem.id === choose.id) Notiflix.Notify.Success('Correct!');
            else Notiflix.Notify.Failure('Failed... NexT!');

            if (currentIdx < problems.length - 1) {
                dispatch(storePassedProblem([ ...sentences.passed, { id: problem.id, eng: problem.eng,
                    passed: problem.id === choose.id, tried: currentTry }]))
                await new Promise((resolve) => {
                    refetch({ option: 1, except: problems[currentIdx + 1].id })
                    resolve(true);
                }).then(() => setIndexes({ currentIdx: currentIdx + 1, tried: 0 }))
            } else {
                // TODO: prevent currentIdx + 1 > length
                Notiflix.Confirm.Show(
                    'Test Completed!',
                    'I want to leave it to my report!',
                    'Yes',
                    'No',
                    () => onClickRewriteReport(),
                    () => router.back(),
                )
            }
        } else {
            Notiflix.Notify.Failure('Failed...');
            setIndexes({ ...indexes, tried: tried + 1 });
        }
    }

    const onClickRewriteReport = async () => {
        Notiflix.Loading.Hourglass('Rewrite report...');
        return rewrite({variables: { input: { level: 3, solved: passed, content: id }}});
    }

    const [ rewrite ] = useMutation(POST_REWRITE_REPORT, { onCompleted: data => {
            if (data && data.rewrite && data.rewrite.status === 200) {
                router.back();
                Notiflix.Loading.Remove(1000);
            }
        }});

    React.useEffect(() => {
        if (!problems || problems.length === 0) {
            router.back();
            Notiflix.Notify.Failure('잘못된 접근 방식입니다. 이전 페이지로 이동합니다.');
        }
    }, [ problems ])

    const { data, loading, refetch } = useQuery(GET_CHOICES, { variables: { option: 1, except: problems.length > 0 && problems[0].id ? problems[0].id : -1 }})
    return (
        <div style={{ width: '100%', height: '100%', overflowY: 'scroll' }}>
            <div style={{ width: '100%', height: '300pt', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <span style={{ fontFamily: 'sans-serif', fontSize: '32pt', fontWeight: 'bold' }}>
                    { problems.length > 0 ? problems[currentIdx].kor : '-' }
                </span>
                <br />
                <span>
                    {`도전횟수 ${tried + 1}`}
                </span>
                <br />
                <TextToSpeech text={problems.length > 0 ? problems[currentIdx].eng : 'error occurred. please push the back button.'} />
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
                                <Choose text={data.choices.problems[0].eng} onClick={() => onChooseAnswer(data.choices.problems[0])} />
                                <Choose text={data.choices.problems[1].eng} onClick={() => onChooseAnswer(data.choices.problems[1])} />
                            </div>
                            <div style={{ width: '100%', height: '100pt', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '12pt' }}>
                                <Choose text={data.choices.problems[2].eng} onClick={() => onChooseAnswer(data.choices.problems[2])} />
                                <Choose text={data.choices.problems[3].eng} onClick={() => onChooseAnswer(data.choices.problems[3])} />
                            </div>
                        </React.Fragment>
                }
            </div>
        </div>
    )
}

export default ObjectiveSentence;