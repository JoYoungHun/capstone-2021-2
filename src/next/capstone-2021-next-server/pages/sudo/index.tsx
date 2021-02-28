import React from 'react';
import { Divider } from "@material-ui/core";
import styled from 'styled-components';
import { SudoNavigation } from "../../src/components";
import { CategoryManagement, ContentManagement } from "../../src/container";
import { NextRouter, useRouter } from "next/router";

const TabTitle = styled.span`
    font-family: sans-serif;
    font-size: 32pt;
    font-weight: bold;
    margin-bottom: 24pt;
`

const Sudo = () => {
    const router: NextRouter = useRouter();
    const current: string | string[] | undefined = router.query?.tb;

    const modifyTab = (selected: number) => {
        const current: string | string[] | undefined = router.query?.tb;
        if (current === String(selected)) return;
        else router.push('/sudo?tb=' + selected).then();
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
            <SudoNavigation modifyTab={modifyTab} goBack={() => router.push('/')}/>
            <Divider orientation={'vertical'} flexItem />
            <div style={{ width: 'calc(100% - 200pt)', marginTop: '100pt', paddingLeft: '16pt', paddingRight: '16pt' }}>
                {
                    (current === "0" || current === undefined) &&
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                            <TabTitle>
                                컨텐츠 관리
                            </TabTitle>
                            <ContentManagement preventSSR={true} />
                        </div>
                }
                {
                    current === "1" &&
                        <div style={{ width: '100%', backgroundColor: 'skyblue'}}>
                            <TabTitle>
                                사용자 관리
                            </TabTitle>
                        </div>
                }
                {
                    current === "2" &&
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                        <TabTitle>
                            카테고리 관리
                        </TabTitle>
                        <CategoryManagement />
                    </div>
                }
            </div>
        </div>
    )
}

export default Sudo;