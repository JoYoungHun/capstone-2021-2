import React from 'react';
import { Tab, TabTitleShell, TabTitle } from '../components/commonStyled';
import {ContFramework, ContSentence, ContWord} from "../components";
import PerfectScrollbar from "react-perfect-scrollbar";

type Props = {

}

type ContentTabProps = {
    title: string,
    key: number,
}

const ContentTabs: ContentTabProps[] = [
    { title: '컨텐츠 만들기', key: 0 },
    { title: '단어 만들기', key: 1 },
    { title: '문장 만들기', key: 2 }
]

const ContentContainer: React.FunctionComponent<Props> = ({ }) => {
    const [ currentIdx, setCurrentIdx ] = React.useState<number>(0);

    const modifyTab = (modified: number) => {
        if (currentIdx !== modified)
            setCurrentIdx(modified);
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', overflow: 'auto' }}>
            <PerfectScrollbar>
                <div className={"ovf"} style={{ display: 'inline', width: '62.5rem', height: '10vh', overflowX: 'auto', whiteSpace: 'nowrap', marginBottom: '16pt' }}>
                    {
                        ContentTabs.map((tabProps: ContentTabProps) => (
                                <Tab key={tabProps.key} selected={tabProps.key === currentIdx} width={'21rem'} height={'10vh'}>
                                    <TabTitleShell>
                                        <TabTitle fontSize={'16pt'}>
                                            {tabProps.title}
                                        </TabTitle>
                                    </TabTitleShell>
                                </Tab>
                            ))
                    }
                </div>
            </PerfectScrollbar>
            <div style={{ width: '100%', marginBottom: '2rem', marginTop: '2rem', padding: '1rem' }}>
                { currentIdx === 0 && <ContFramework modifyTab={modifyTab} /> }
                { currentIdx === 1 && <ContWord modifyTab={modifyTab} /> }
                { currentIdx === 2 && <ContSentence /> }
            </div>
        </div>
    )
}

export default ContentContainer;