import React from 'react';
import { Divider } from "@material-ui/core";
import styled from 'styled-components';
import { SudoNavigation } from "../../src/components";
import { CategoryManagement, ContentManagement, UserManagement } from "../../src/container";
import { NextRouter, useRouter } from "next/router";
import Axios, { AxiosResponse } from "axios";
import Cookies from 'js-cookie';
import { SERVER_ADDRESS } from "../../src/env";
import Notiflix from 'notiflix';

const TabTitle = styled.span`
    font-family: sans-serif;
    font-size: 32pt;
    font-weight: bold;
    margin-bottom: 24pt;
`

const Sudo = ({ code }: { code: number }) => {
    const router: NextRouter = useRouter();
    React.useEffect(() => {
        if (code === 401) {
            router.push('/login').then(() => Notiflix.Report.Failure('Session Timeout!', '세션이 만료됐거나, 로그인 된 상태가 아닙니다.', 'OK! I will check.'));
        } else if (code === 406) {
            router.push('/').then(() => Notiflix.Notify.Failure('접근 권한이 없습니다.'));
        }
    }, [ ])

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
                    current === "0" &&
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                            <TabTitle>
                                컨텐츠 관리
                            </TabTitle>
                            <ContentManagement preventSSR={current !== "0"} />
                        </div>
                }
                {
                    current === "1" &&
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                            <TabTitle>
                                사용자 관리
                            </TabTitle>
                            <UserManagement />
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

Sudo.getInitialProps = async () => {
    const token: string | string[] | undefined = Cookies.get('dove-token');
    const res: AxiosResponse = await Axios.get(`${SERVER_ADDRESS}/authorized/check`, { headers: { Authorization: token ? `Bearer ${token}` : ''}})
    return { code: res.data };
}

export default Sudo;