import React from 'react';
import { NextPage } from "next";
import { NextRouter, useRouter } from "next/router";
import { Button, TextField } from '@material-ui/core'
import { LoginType } from "../../src/types";
import LoginBtn from "../../src/components/LoginBtn";
import Image from 'next/image';

const Login: NextPage = ({ }) => {
    const [ userInfo, setUserInfo ] = React.useState<LoginType>({
        email: '',
        password: ''
    });

    const router: NextRouter = useRouter();
    return (
        <div className={"ovf"}
             style={{ width: '100%', height: '100vh', overflow: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <div style={{ width: '200pt', display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
                <Image
                    src={"/hiing.png"}
                    alt="Picture of the author"
                    width={800}
                    height={500}
                />
                <TextField label={'Email'} value={userInfo.email} style={{ width: '100%' }}
                           onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}/>
                <TextField label={'password'} type={'password'} value={userInfo.password} style={{ width: '100%', marginTop: '8pt' }}
                           onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })}/>
                <LoginBtn id={userInfo.email} password={userInfo.password} />
                <Button style={{ width: '100%', height: '40pt', background: '#82b74b 0% 0% no-repeat padding-box', marginTop: '20pt',
                    display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={() => router.push('/sign').then()}>
                    <span style={{ fontFamily: 'sans-serif', fontWeight: 'bold', fontSize: '14pt' }}>
                        회원가입
                    </span>
                </Button>
            </div>
        </div>
    )
}

export default Login;