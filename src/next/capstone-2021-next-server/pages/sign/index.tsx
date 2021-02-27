import React from 'react';
import { NextPage } from "next";
import { useMutation } from "@apollo/client";
import { NextRouter, useRouter } from "next/router";
import Notiflix from 'notiflix';
import { SignUpType } from "../../src/types";
import { POST_SIGN } from "../../src/graphQL/quries";
import { CircularProgress } from "@material-ui/core";
import TextInput from "../../src/components/TextInput";
import GradientBtn from "../../src/components/GradientBtn";

type Props = {

}

const Sign: NextPage<Props> = ({  }) => {
    const [ sign, setSign ] = React.useState<SignUpType>({
        email: '',
        password: '',
        name: ''
    })

    const [ register, { loading, data }] = useMutation(POST_SIGN);
    let { email, password, name } = sign;

    const CALL_SIGN_API = async () => {
        if (email.length === 0 && password.length >= 6 && name.length === 0) {
            Notiflix.Notify.Warning(password.length < 6 ? '비밀번호는 6자리 이상으로 구성해주세요.' : 'Please Fill out the required Fields.');
            return;
        } else {
            await register({ variables: { id: email, password, name }})
        }
    }

    const router: NextRouter = useRouter();
    React.useEffect(() => {
        if (data && data.sign !== 200) {
            Notiflix.Report.Failure('회원가입에 실패했습니다.');
            return;
        } else if (data && data.sign === 200) {
            router.push('/login').then();
            Notiflix.Notify.Success('Successfully signed up!')
        }
    }, [ data ])

    return (
        <div style={{ width: '100%', height: '100vh', overflow: 'scroll', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <div style={{ width: '323pt', border: 0, borderRadius: '30pt', height: '500pt',
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', margin: '12pt' }}>
                    <label style={{ fontFamily: 'sans-serif', fontWeight: 'bold', fontSize: '21pt', color: '#000', width: '150pt' }}>
                        Id
                    </label>
                    <TextInput value={email} onChangeValue={(val) => setSign({ ...sign, email: val })} width={'150pt'} height={'40pt'} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', margin: '12pt' }}>
                    <label style={{ fontFamily: 'sans-serif', fontWeight: 'bold', fontSize: '21pt', color: '#000', width: '150pt' }}>
                        Password
                    </label>
                    <TextInput type={'password'} value={password} onChangeValue={(val) => setSign({ ...sign, password: val })} width={'150pt'} height={'40pt'} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', margin: '12pt' }}>
                    <label style={{ fontFamily: 'sans-serif', fontWeight: 'bold', fontSize: '21pt', color: '#000', width: '150pt' }} placeholder={'이름을 입력해주세요.'}>
                        Name
                    </label>
                    <TextInput value={name} onChangeValue={(val) => setSign({ ...sign, name: val })} width={'150pt'} height={'40pt'} />
                </div>
                <GradientBtn props={{ fromColor: '#A4C639', toColor: '#e3eaa7', other: { width: '100%', height: '50pt' } }}
                             onClick={() => CALL_SIGN_API()}>
                    { loading ?
                        <CircularProgress />
                        :
                        <span style={{ fontFamily: 'sans-serif', fontWeight: 'bold', fontSize: '14pt' }}>
                            회원가입
                        </span>
                    }
                </GradientBtn>
            </div>
        </div>
    )
}

export default Sign;