import React from 'react'
import { NextRouter, useRouter } from "next/router";
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from "@apollo/client";
import { Button, Divider, makeStyles, Tab, Tabs } from "@material-ui/core";
import { GET_USER_DETAIL } from "../graphQL/quries";
import { Error, Loading, UserAccordion } from "./index";
import { RootState } from "../modules";
import { modifyAppTabs } from "../reducers/AppNavReducer";
import Cookies from 'js-cookie'

type Props = {

}

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    tabs: {
        borderRight: `0px solid ${theme.palette.divider}`,
    },
}));

const AppNavigation: React.FunctionComponent<Props> = React.memo(({ }) => {
    const dispatch = useDispatch();
    const appNav = useSelector((state: RootState) => state.AppNavReducer);

    const router: NextRouter = useRouter();
    const classes = useStyles();

    React.useEffect(() => {
        if (appNav.value != router.query.tb) {
            let tabIdx: number = Number(router.query?.tb);
            if (isNaN(tabIdx)) tabIdx = 0;

            dispatch(modifyAppTabs(tabIdx));
        }

    }, [ router.query?.tb ])

    const { loading, error, data } = useQuery(GET_USER_DETAIL, { fetchPolicy: 'network-only' });
    if (loading) return <Loading />;
    if (error) return <Error msg={error.message} />;

    return (
        <React.Fragment>
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', height: '100pt', border: '3pt',
                position: 'fixed', top: 0, left:0, right: 0, zIndex: 1,
                backgroundColor: Cookies.get('dove-dark-mode') === 'true' ? '#b2c2bf' : '#1976d2' }}>
                <div style={{ width: 'calc(100% - 70pt)', display: 'flex', justifyContent: 'center'}}>
                    <Tabs
                        style={{ color: Cookies.get('dove-dark-mode') === 'true' ? '#000' : '#FFF' }}
                        orientation="horizontal"
                        variant="scrollable"
                        value={appNav.value}
                        onChange={async (e, newValue: number) => {
                            await new Promise((resolve) => { dispatch(modifyAppTabs(newValue)); resolve(true); })
                                .then(() => router.push(`/?tb=${newValue}`).then())}}
                        aria-label="Main tabs"
                        className={classes.tabs}
                    >
                        <Tab style={{ fontWeight: 'bold' }} label="Hub" {...a11yProps(0)} />
                        <Tab style={{ fontWeight: 'bold' }} label="Dashboard" {...a11yProps(1)} />
                        <Tab style={{ fontWeight: 'bold' }} label="Report" {...a11yProps(2)} />
                        <Tab style={{ fontWeight: 'bold' }} label="Content" {...a11yProps(3)} />
                    </Tabs>
                </div>
                <div style={{ width: '70pt', display: 'flex', justifyContent: 'flex-end' }}>
                    {
                        data?.user ?
                            <React.Fragment>
                                <UserAccordion authority={data?.user.authority} />
                            </React.Fragment>
                            :
                            <Button style={{ width: '70pt', height: '40pt', background: '#FFE94A 0% 0% no-repeat padding-box'
                                , borderRadius: '10pt', border: 0, cursor: 'pointer', marginRight: '10pt' }}
                                    onClick={() => router.push('/login').then()}>
                                        <span style={{ fontSize: '12pt', fontWeight: 'bold' }}>
                                            Login
                                        </span>
                            </Button>
                    }
                </div>
            </div>
        </React.Fragment>
    )
})

export default AppNavigation;