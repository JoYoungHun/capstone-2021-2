import React from 'react';
import {useLazyQuery} from "@apollo/client";
import {POST_LOGIN} from "../graphQL/quries";
import {Button, CircularProgress} from "@material-ui/core";
import Notiflix from 'notiflix'
import {NextRouter, useRouter} from "next/router";
import Cookies from 'js-cookie';

type Props = {
    id: string,
    password: string,
}

const LoginBtn: React.FunctionComponent<Props> = ({ id, password }) => {
    const [ login, { loading, data } ] = useLazyQuery(POST_LOGIN);
    const CALL_LOGIN_API = async ( ) => {
        if (id.length === 0 || password.length === 0) {
            Notiflix.Notify.Warning('Please Fill out the required fields')
            return;
        } else {
            login({ variables: { id, password } })
        }
    }

    const router: NextRouter = useRouter();
    React.useEffect(() => {
        if (!loading && data && data.login.status !== 200) {
            Notiflix.Report.Failure('로그인에 실패했습니다.');
        } else if (data && data.login.status === 200) {
            Cookies.set('dove-token', data.login.token);
            router.push('/home').then();
        }
    }, [ data ])

    return (
        <Button style={{ width: '100%', height: '40pt', background: '#FFE94A 0% 0% no-repeat padding-box', marginTop: '20pt',
            display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                onClick={() => CALL_LOGIN_API()}>
            { loading ?
                <CircularProgress />
                :
                <span style={{ fontFamily: 'sans-serif', fontWeight: 'bold', fontSize: '14pt' }}>
                    로그인
                </span>
            }
        </Button>
    )
}

export default LoginBtn;