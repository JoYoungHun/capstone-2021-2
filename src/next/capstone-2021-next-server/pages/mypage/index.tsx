import React, {useRef} from 'react';
import { useMutation, useQuery } from "@apollo/client";
import { Button, CircularProgress, TextField } from "@material-ui/core";
import { User } from "../../src/types";
import { Error, Loading } from "../../src/components";
import { GET_MY_DETAIL, PUT_UPDATE_USER_INFO } from "../../src/graphQL/quries";
import Cookies from 'js-cookie';
import Notiflix from 'notiflix';
import Axios from 'axios';
import { NextRouter, useRouter } from "next/router";
import {SERVER_ADDRESS} from "../../src/env";
import { ArrowBackRounded } from "@material-ui/icons";
import { routeHttpStatus } from "../../utils/func";

type UpdateUserProps = {
    userProps?: User,
    password: string,
}

const MyPage = ({ }) => {
    const [ myInfo, setMyInfo ] = React.useState<UpdateUserProps>({
        password: ''
    })
    let { password, userProps } = myInfo;
    const router: NextRouter = useRouter();

    const [ updateUserInfo, { } ] = useMutation(PUT_UPDATE_USER_INFO, { onCompleted: data => {
        if (data.updateUserInfo.status === 200) {
            Notiflix.Loading.Remove(1000);
            router.back();
        } else routeHttpStatus(router, data.updateUserInfo.status, data.updateUserInfo.message);
    }})
    const onUpdateMyInfo = async () => {
        if (myInfo.userProps) {
            Notiflix.Loading.Hourglass('Updating info...');
            await updateUserInfo({ variables: { input: {
                id: userProps.id,
                password: password === '' ? undefined : password,
                name: userProps.name,
                profile: userProps.profile.id
            }}})
        }
    }

    const profileRef = useRef<any>();
    const uploadProfileImage = async (e: File) => {
        const token = Cookies.get('dove-token');
        if (e && token) {
            Notiflix.Loading.Hourglass('Uploading profile...');
            let formData = new FormData();
            formData.append('file', e);
            await Axios.post(`${SERVER_ADDRESS}/file/upload`, formData, { headers: {
                Authorization: `Bearer ${token}`}})
                .then(async (res) => {
                    if (res && res.status === 200 && res.data) {
                        setMyInfo({ ...myInfo, userProps: { ...userProps, profile: { id: res.data.fileId, url: res.data.path }}})
                    } else if (res.status === 401) {
                        router.push('/login').then(() => Notiflix.Report.Failure('Session Timeout!', '세션이 만료됐거나, 로그인 된 상태가 아닙니다.', 'OK! I will check.'));
                    } else if (res.status === 406) {
                        router.push('/').then(() => Notiflix.Notify.Failure('접근 권한이 없습니다.'));
                    } else {
                        Notiflix.Notify.Failure(res.statusText);
                    }
                })
        }
    }

    const { loading, error } = useQuery(GET_MY_DETAIL, { onCompleted: response => {
        if (response.myInfo) {
            setMyInfo({ ...myInfo, userProps: { ...response.myInfo } })
        }}, fetchPolicy: 'network-only' })
    if (loading) return <Loading />
    else if (error) return <Error msg={error.message} />

    return (
        <React.Fragment>
            <ArrowBackRounded style={{ position: 'absolute', top: '35pt', left: '35pt', cursor: 'pointer' }} fontSize={'large'}
                onClick={() => router.back()} />
            <div className={"ovf"} style={{ width: '100%', height: '100vh', overflow: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ width: '260pt', height: '500pt', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                     onClick={() => profileRef && profileRef.current.click()}>
                    {
                        userProps && userProps.profile ?
                            <img src={userProps.profile.url} width={'200pt'} height={'200pt'} alt={'profile'} style={{ objectFit: 'cover', cursor: 'pointer' }} />
                            :
                            <Button style={{ backgroundColor: Cookies.get('dove-dark-mode') === 'true' ? '#b2c2bf' : '#1976d2' }}>
                                <span style={{ color: Cookies.get('dove-dark-mode') === 'true' ? '#000' : '#FFF' }}>
                                    프로필 변경
                                </span>
                            </Button>
                    }
                </div>
                <input hidden ref={profileRef} type={'file'} onChange={(e) =>
                    e.target.files && e.target.files.length > 0 && uploadProfileImage(e.target.files[0])
                        .then(() => Notiflix.Loading.Remove(500))} />
                <div style={{ width: '260pt', border: 0, borderRadius: '30pt', height: '500pt',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '100%', height: '200pt', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', margin: '12pt' }}>
                            <TextField label={'Email (readonly)'} value={userProps ? userProps.email : ''} style={{ width: '100%' }}
                                       InputProps={{ readOnly: true }}/>
                        </div>
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', margin: '12pt' }}>
                            <TextField label={'Name'} value={userProps ? userProps.name : ''} style={{ width: '100%' }}
                                       onChange={(e) =>
                                           setMyInfo({ ...myInfo, userProps: { ...userProps, name: e.target.value }})}/>
                        </div>
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', margin: '12pt' }}>
                            <TextField label={'Password'} value={password} style={{ width: '100%' }} type={'password'}
                                       onChange={(e) => setMyInfo({ ...myInfo, password: e.target.value })}/>
                        </div>
                    </div>
                    <Button onClick={() => onUpdateMyInfo()}
                            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '200pt',
                                backgroundColor: Cookies.get('dove-dark-mode') === 'true' ? '#b2c2bf' : '#1976d2' }}>
                        { loading ?
                            <CircularProgress />
                            :
                            <span style={{ fontFamily: 'sans-serif', fontWeight: 'bold', fontSize: '14pt',
                                color: Cookies.get('dove-dark-mode') === 'true' ? '#000' : '#FFF' }}>
                                수정
                            </span>
                        }
                    </Button>
                </div>
            </div>
        </React.Fragment>
    )
}

export default MyPage;