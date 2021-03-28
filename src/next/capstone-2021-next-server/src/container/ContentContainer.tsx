import React from 'react';
import { Tab, TabTitleShell, TabTitle } from '../components/commonStyled';
import {ContFramework, ContSentence, ContWord} from "../components";

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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', paddingLeft: '40pt' }}>
            <div className={"ovf"} style={{ display: 'inline', width: '800pt', height: '50pt', overflowX: 'auto', whiteSpace: 'nowrap', marginBottom: '16pt' }}>
                {
                    ContentTabs.map((tabProps: ContentTabProps) => (
                            <Tab key={tabProps.key} selected={tabProps.key === currentIdx} width={'250pt'} height={'45pt'}>
                                <TabTitleShell>
                                    <TabTitle fontSize={'16pt'}>
                                        {tabProps.title}
                                    </TabTitle>
                                </TabTitleShell>
                            </Tab>
                        ))
                }
            </div>
            <div style={{ width: '100%', marginBottom: '16pt', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div>
                    { currentIdx === 0 && <ContFramework modifyTab={modifyTab} /> }
                    { currentIdx === 1 && <ContWord modifyTab={modifyTab} /> }
                    { currentIdx === 2 && <ContSentence /> }
                </div>
            </div>
        </div>
    )
}

export default ContentContainer;