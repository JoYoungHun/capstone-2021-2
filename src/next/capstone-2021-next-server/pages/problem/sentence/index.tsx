import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from "../../../src/modules";
import Histories from "../../../src/container/problem/Histories";
import ObjectiveSentence from "../../../src/container/problem/sentence/ObjectiveSentence";
import SubjectiveSentence from "../../../src/container/problem/sentence/SubjectiveSentence";

const SentenceProblem = () => {
    const { level } = useSelector((state: RootState) => state.ProbReducer);

    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'row' }}>
            {
                level === 0 ?
                    <ObjectiveSentence />
                    :
                    <SubjectiveSentence />
            }
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', marginRight: '2rem' }}>
                <Histories />
            </div>
        </div>
    )
}

export default SentenceProblem;