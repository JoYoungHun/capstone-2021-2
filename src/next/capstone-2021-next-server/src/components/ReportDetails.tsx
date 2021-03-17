import React from 'react';
import { ReportDetailsProps } from "../types";
import { AssignmentIndRounded } from "@material-ui/icons";

type Props = {
    details: ReportDetailsProps,
    selectedValue: number,
}

const ReportDetails: React.FunctionComponent<Props> = ({ details, selectedValue }) => {
    return (
        <React.Fragment>
            <div className="chart" style={{ color: '#000', fontFamily: 'sans-serif', fontWeight: 'bold', width: '600pt', padding: '24pt' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <AssignmentIndRounded fontSize={'large'} />
                    <span style={{ fontSize: '22pt', marginLeft: '8pt' }}>
                        { selectedValue === 0 ? '총 정답률 통계' : selectedValue === 1 ? '단어 정답률 통계' : '문장 정답률 통계' }
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <ul>
                        <li style={{ fontSize: '17pt' }}>
                            {`총 문제 개수 ${ selectedValue === 0 ? details.wordLen + details.sentenceLen : selectedValue === 1 ? details.wordLen : details.sentenceLen }`}
                        </li>
                        <li style={{ color: '#1976d2', fontSize: '13pt' }}>
                            {`총 정답 개수 ${ selectedValue === 0 ? details.correctWordsLev1 + details.correctWordsLev2 + details.correctWordsLev3 + details.correctSentencesLev1 + details.correctSentencesLev2 
                                : selectedValue === 1 ? details.correctWordsLev1 + details.correctWordsLev2 + details.correctWordsLev3 
                                    : details.correctSentencesLev1 + details.correctSentencesLev2 }`}
                        </li>
                        <li style={{ color: '#e06377', fontSize: '13pt' }}>
                            {`총 오답 개수 ${ selectedValue === 0 ? details.wordLen + details.sentenceLen - 
                                (details.correctWordsLev1 + details.correctWordsLev2 + details.correctWordsLev3 + details.correctSentencesLev1 + details.correctSentencesLev2) 
                                : selectedValue === 1 ? details.wordLen - (details.correctWordsLev1 + details.correctWordsLev2 + details.correctWordsLev3) 
                                    : details.sentenceLen - (details.correctSentencesLev1 + details.correctSentencesLev2) }`}
                        </li>
                    </ul>
                    <ul>
                        <li style={{ fontSize: '13pt' }}>
                            {`레벨 당 단어 문제 개수 ${details.wordLen / 3}`}
                        </li>
                        <li style={{ fontSize: '13pt' }}>
                            {`레벨 당 문장 문제 개수 ${details.sentenceLen / 2}`}
                        </li>
                    </ul>
                </div>
                <ul>
                    <li style={{ fontSize: '15pt' }}>
                        {`단어 Level 1 (한국어 -> 영어)`}
                    </li>
                    <li>
                        {`Level 1 정답 개수 ${details.correctWordsLev1} / ${details.wordLen / 3}`}
                    </li>
                </ul>
                <ul>
                    <li style={{ fontSize: '15pt' }}>
                        {`단어 Level 2 (영어 -> 한국어)`}
                    </li>
                    <li>
                        {`Level 2 정답 개수 ${details.correctWordsLev2} / ${details.wordLen / 3}`}
                    </li>
                </ul>
                <ul>
                    <li style={{ fontSize: '15pt' }}>
                        {`단어 Level 3 (한국어 -> 영어 쓰기)`}
                    </li>
                    <li>
                        {`Level 3 정답 개수 ${details.correctWordsLev3} / ${details.wordLen / 3}`}
                    </li>
                </ul>
                <ul>
                    <li style={{ fontSize: '15pt' }}>
                        {`객관식 문장 Level 1`}
                    </li>
                    <li>
                        {`객관식 문장 정답 개수 ${details.correctSentencesLev1} / ${details.sentenceLen / 2}`}
                    </li>
                </ul>
                <ul>
                    <li style={{ fontSize: '15pt' }}>
                        {`주관식 문장 Level 2`}
                    </li>
                    <li>
                        {`주관식 문장 정답 개수 ${details.correctSentencesLev2} / ${details.sentenceLen / 2}`}
                    </li>
                </ul>
            </div>
            <style jsx>{`
                    .chart {
                        margin: 12pt;
                        padding: 4pt;
                        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
                            transition: 0.3s;
                    }
                    .chart:hover {
                        box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
                    }
                `}</style>
        </React.Fragment>
    )
}

export default ReportDetails;