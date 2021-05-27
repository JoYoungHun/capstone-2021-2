import React from 'react';
import { useQuery } from "@apollo/client";
import { useRouter, NextRouter } from "next/router";
import { Button, Divider } from "@material-ui/core";
import {
    GET_BUBBLES,
    GET_MY_CONTENTS,
    GET_MY_DETAIL,
    GET_RECENT_VIEWED_CONTENTS,
    GET_RECOMMENDED_VIDEOS
} from "../graphQL/quries";
import { DashboardSlider, Error, Loading, RecentReport } from "../components";
import Cookies from 'js-cookie';
import moment from 'moment'
import PerfectScrollbar from "react-perfect-scrollbar";

type Props = {

}

const DashboardContainer: React.FunctionComponent<Props> = ({ }) => {
    const router: NextRouter = useRouter();
    const { data, loading, error } = useQuery(GET_MY_DETAIL, { fetchPolicy: 'network-only' })
    const myContents = useQuery(GET_MY_CONTENTS, { fetchPolicy: 'network-only' })
    const recentViewed = useQuery(GET_RECENT_VIEWED_CONTENTS, { fetchPolicy: 'network-only', variables: { pr: { page: 1, renderItem: 8 }}})
    const todayYoutubeVideos = useQuery(GET_BUBBLES, { variables: { pr: { page: 1, renderItem: 8 }, keyword: '', dFilter: moment().format('YYYY-MM-DD') }})
    const recommended = useQuery(GET_RECOMMENDED_VIDEOS, { variables: { pr: { page: 1, renderItem: 8 }}})

    if (loading) return <Loading />
    else if (error) return <Error msg={error.message} />

    return (
        <PerfectScrollbar style={{ width: '100%', marginBottom: '8vh' }}>
            <div style={{ width: '100%', height: '100vh', display: 'flex', padding: '12pt', justifyContent: 'center' }}>
                <div style={{ width: '75rem' }}>
                    <DashboardSlider title={'Recently viewed contents'} cards={recentViewed.data?.recentViewed} bubbles={[]} />
                    <DashboardSlider title={'YouTube videos added today'} cards={[]} bubbles={todayYoutubeVideos.data?.ocean.bubbles} />
                    <DashboardSlider title={'Recommended contents for you'} cards={[]} bubbles={recommended.data?.recommended} />
                    <DashboardSlider title={'List of content created by me'} cards={myContents.data?.myContents} bubbles={[]} />
                </div>
                <Divider variant={"middle"} orientation={"vertical"} />
                <div style={{ width: '25rem' }}>
                    <PerfectScrollbar>
                        <div style={{ width: '100%', cursor: 'pointer', height: '20vh', display: 'flex', justifyContent: 'flex-end' }}
                             onClick={() => Cookies.get('dove-token') && router.push('/mypage').then() }>
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
                        <div style={{ width: '25rem', height: '60vh' }}>
                            <RecentReport />
                        </div>
                    </PerfectScrollbar>
                </div>
            </div>
        </PerfectScrollbar>

    )
}

export default DashboardContainer;