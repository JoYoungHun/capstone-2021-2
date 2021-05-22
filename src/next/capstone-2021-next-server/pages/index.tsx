import React from 'react';
import Image from 'next/image';
import { Button, Divider } from "@material-ui/core";
import { useRouter, NextRouter } from "next/dist/client/router";
import useIntersectionObserver from "../src/hooks/useIntersectionObserver";

type Cards = {
    card1: boolean,
    card2: boolean,
    card3: boolean,
    card4: boolean,
    card5: boolean,
}

const Manual = () => {
    const router: NextRouter = useRouter();
    const routeToMain = () => {
        router.push('/home?tb=0').then()
    }

    return (
        <div style={{ display: 'block' }}>
            <div style={{ position: 'fixed', bottom: 0, left: 0, zIndex: 1, cursor: 'pointer' }} onClick={() => routeToMain()}>
                <Image src={"/hiing.png"}
                        width={300}
                       height={170}
                       priority={true}
                />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', height: '100vh', justifyContent: 'space-between', paddingLeft: '20rem', paddingRight: '10rem',
                background: 'rgb(234,246,255) linear-gradient(180deg, rgba(234,246,255,1) 0%, rgba(200,233,255,1) 50%, rgba(126,201,255,1) 100%)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
                    <p style={{ fontWeight: 'bold', fontSize: '28pt', fontFamily: 'sans-serif', textAlign: 'left' }}>
                        원하는 컨텐츠로 학습
                    </p>
                    <span style={{ fontFamily: 'fantasy', textAlign: 'left', color: '#000011' }}>
                        다른 사용자가 등록한 컨텐츠 또는
                        <br />
                        내가 직접 만든 컨텐츠를 통해 학습할 수 있습니다.
                        <br />
                        원하는 유튜브 영상과 나만의 학습법으로 영어 공부를 시작해보세요.
                    </span>
                </div>
                <Image
                    src={"/preview-demo.png"}
                    alt="page of preview"
                    width={800}
                    height={600}
                    objectFit={'cover'}
                    priority={true}
                    className={"rounded-images"}
                />
            </div>
            <Divider variant={"fullWidth"} orientation={"horizontal"} />
            <div style={{ display: 'flex', alignItems: 'center', height: '100vh', justifyContent: 'space-between', paddingLeft: '10rem', paddingRight: '20rem',
                background: 'rgb(168,220,255) linear-gradient(180deg, rgba(168,220,255,1) 0%, rgba(103,194,255,1) 50%, rgba(0,148,255,1) 100%)' }}>
                <div style={{ height: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', transition: 'all ease-out 1s' }}>
                     <Image
                            src={"/cont-demo.png"}
                            alt="page of preview"
                            width={700}
                            height={300}
                            objectFit={'cover'}
                            priority={true}
                            className={"rounded-images-smaller"}
                        />
                        <Image
                            src={"/cont-demo2.png"}
                            alt="page of preview"
                            width={700}
                            height={300}
                            objectFit={'cover'}
                            priority={true}
                            className={"rounded-images-smaller"}
                        />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end' }}>
                    <p style={{ fontWeight: 'bold', fontSize: '28pt', fontFamily: 'sans-serif' }}>
                        나만의 컨텐츠 제작
                    </p>
                    <span style={{ fontFamily: 'fantasy', textAlign: 'right', color: '#000011' }}>
                        내가 좋아하는 유튜브 영상의 자막에 대해
                        <br />
                        단어와 문장의 형태로 컨텐츠를 만들 수 있습니다.
                    </span>
                    <span style={{ fontFamily: 'fantasy', textAlign: 'right', color: '#000011' }}>
                        하잉에서 제공하는 서비스를 활용해
                        <br />
                        간단하게 나만의 영어 학습지를 만들어보세요.
                    </span>
                </div>
            </div>
            <Divider variant={"fullWidth"} orientation={"horizontal"} />
            <div style={{ display: 'flex', alignItems: 'center', height: '100vh', justifyContent: 'space-between', paddingLeft: '20rem', paddingRight: '10rem',
                background: 'rgb(0,148,255) linear-gradient(180deg, rgba(0,148,255,1) 0%, rgba(0,131,218,1) 50%, rgba(0,111,191,1) 100%)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
                    <p style={{ fontWeight: 'bold', fontSize: '28pt', fontFamily: 'sans-serif' }}>
                        단순하고 빠른 학습
                    </p>
                    <span style={{ fontFamily: 'fantasy', textAlign: 'left', color: '#FAF9F9' }}>
                        만들어진 컨텐츠들에 대해
                        <br />
                        단어와 문장을 문제의 형태로 제공합니다.
                        <br />
                        총 5가지의 난이도로 구성되며,
                        <br />
                        문제 풀이에 흥미를 더해주는 요소를 더해 학습 집중력을 향상시켜줍니다.
                    </span>
                </div>
                <Image
                    src={"/question-demo.png"}
                    alt="page of preview"
                    width={700}
                    height={300}
                    objectFit={'cover'}
                    priority={true}
                    className={"rounded-images-smaller"}
                />
            </div>
            <Divider variant={"fullWidth"} orientation={"horizontal"} />
            <div style={{ display: 'flex', alignItems: 'center', height: '100vh', justifyContent: 'space-between', paddingLeft: '10rem', paddingRight: '20rem',
                background: 'rgb(0,111,191) linear-gradient(180deg, rgba(0,111,191,1) 0%, rgba(9,102,168,1) 50%, rgba(12,80,129,1) 100%)' }}>
                <Image
                    src={"/ocean-demo.png"}
                    alt="page of preview"
                    width={800}
                    height={600}
                    objectFit={'cover'}
                    priority={true}
                    className={"rounded-images"}
                />
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end' }}>
                    <p style={{ fontWeight: 'bold', fontSize: '28pt', fontFamily: 'sans-serif', textAlign: 'right', color: '#fff' }}>
                        유튜브 트렌드 영상
                    </p>
                    <span style={{ fontFamily: 'fantasy', textAlign: 'right', color: '#FAF9F9' }}>
                        80여개의 유튜브 트렌드 영상들이
                        <br />
                        매일매일 서비스되고 있습니다.
                        <br />
                        빠르게 컨텐츠를 만들어 학습을 하고 싶다면,
                        <br />
                        해당 서비스를 이용해보세요.
                    </span>
                </div>
            </div>
            <Divider variant={"fullWidth"} orientation={"horizontal"} />
            <div style={{ display: 'flex', alignItems: 'center', height: '100vh', justifyContent: 'space-between', paddingLeft: '20rem', paddingRight: '10rem',
                background: 'rgb(12,80,129) linear-gradient(180deg, rgba(12,80,129,1) 0%, rgba(4,48,80,1) 50%, rgba(2,28,47,1) 100%)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
                    <p style={{ fontWeight: 'bold', fontSize: '28pt', fontFamily: 'sans-serif', textAlign: 'left', color: '#fff' }}>
                        학습에 대한 통계 자료
                    </p>
                    <span style={{ fontFamily: 'fantasy', textAlign: 'left', color: '#FAF9F9' }}>
                        내가 풀었던 문제들은 기록으로 남아
                        <br />
                        그래프의 형태의 다양한 통계 자료로 제공됩니다.
                        <br />
                        다른 사용자들의 통계를 확인해보며 학습 의욕을 끌어올릴 수 있습니다.
                    </span>
                </div>
                <Image
                    src={"/report-demo.png"}
                    alt="page of preview"
                    width={700}
                    height={550}
                    objectFit={'cover'}
                    priority={true}
                    className={"rounded-images-smaller"}
                />
            </div>
            <Divider variant={"fullWidth"} orientation={"horizontal"} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', justifyContent: 'center', backgroundColor: '#011524' }}>
                <Button style={{ width: '30rem', height: '30vh', backgroundColor: '#FFE94A', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: 0, boxShadow: '0px 3px 6px #FAF9F9', borderRadius: '4rem' }}
                        onClick={() => routeToMain()}>
                    <span style={{ fontWeight: 'bold', fontSize: '21pt', fontFamily: 'sans-serif' }}>
                        준비됐습니다!
                    </span>
                </Button>
            </div>
        </div>
    )
}

export default Manual;