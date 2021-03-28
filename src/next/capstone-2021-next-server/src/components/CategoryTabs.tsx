import React from 'react';
import { Category } from "../types";
import { Tab, TabTitleShell, TabTitle } from "./commonStyled";

type Props = {
    categories?: Category[],
    tabs?: string[]
    currentIdx: number,
    modifyTab: (modify: number) => void
}

const CategoryTabs = ({ categories, tabs, currentIdx, modifyTab }: Props) => {
    return (
        <div style={{ display: 'inline', width: '800pt', height: '50pt', overflowX: 'auto', whiteSpace: 'nowrap', marginBottom: '16pt' }}>
            <Tab selected={currentIdx === 0} onClick={() => modifyTab(0)}>
                <TabTitleShell>
                    <TabTitle>
                        전체
                    </TabTitle>
                </TabTitleShell>
            </Tab>
            { categories && categories.length > 0 && categories.map((datum: Category, index: number) => (
                <Tab key={datum.id} selected={currentIdx === index + 1} onClick={() => modifyTab(index + 1)}>
                    <TabTitleShell>
                        <TabTitle>
                            {datum.name}
                        </TabTitle>
                    </TabTitleShell>
                </Tab>
            ))}
            { tabs && tabs.length > 0 && tabs.map((tab: string, index: number) => (
                <Tab key={`${tab}-${index}`} selected={currentIdx === index + 1} onClick={() => modifyTab(index + 1)}>
                    <TabTitleShell>
                        <TabTitle>
                            {tab}
                        </TabTitle>
                    </TabTitleShell>
                </Tab>
            ))}
        </div>
    )
}

export default CategoryTabs;