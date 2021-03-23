import React from 'react';
import { useQuery } from "@apollo/client";
import { useRouter, NextRouter } from "next/router";
import { GET_MY_DETAIL } from "../graphQL/quries";
import { Error, Loading, RecentReport } from "../components";
import {Button, Divider} from "@material-ui/core";
import Cookies from 'js-cookie';

type Props = {

}

const DashboardContainer: React.FunctionComponent<Props> = ({ }) => {
    const router: NextRouter = useRouter();

    const { data, loading, error } = useQuery(GET_MY_DETAIL, { fetchPolicy: 'network-only' })
    if (loading) return <Loading />
    else if (error) return <Error msg={error.message} />

    return (
        <div style={{ width: '100%', height: '100vh', display: 'flex', padding: '12pt' }}>
            <div style={{ width: '1000pt', height: '100vh' }}>

            </div>
            <Divider variant={"middle"} orientation={"vertical"} />
            <div style={{ width: 'calc(100% - 1000pt)', height: '100vh' }}>
                <div style={{ width: '100%', cursor: 'pointer', height: '150pt', display: 'flex', justifyContent: 'flex-end' }} onClick={() => router.push('/mypage').then()}>
                    {
                        data && data.myInfo && data.myInfo.profile ?
                            <img src={data.myInfo.profile.url} width={'150pt'} height={'150pt'} alt={'profile'} style={{ objectFit: 'cover', borderRadius: '18pt' }} />
                            :
                            Cookies.get('dove-token') ?
                                <Button style={{ backgroundColor: Cookies.get('dove-dark-mode') === 'true' ? '#b2c2bf' : '#1976d2' }}>
                                        <span style={{ color: Cookies.get('dove-dark-mode') === 'true' ? '#000' : '#FFF' }}>
                                            프로필 변경
                                        </span>
                                </Button>
                                :
                                <span>
                                    로그인이 필요한 서비스입니다.
                                </span>
                    }
                </div>
                <div style={{ width: '100%', height: 'calc(100vh - 150pt)' }}>
                    <RecentReport />
                </div>
            </div>
        </div>
    )
}

export default DashboardContainer;