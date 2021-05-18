import React from 'react';
import { useDispatch } from 'react-redux';
import useIntersectionObserver from "../../src/hooks/useIntersectionObserver";
import {useLazyQuery, useMutation} from "@apollo/client";
import { Bubble, Ecosystem } from "../../src/types";
import Notiflix from 'notiflix'
import {GET_BUBBLES, POST_REMEMBER} from "../../src/graphQL/quries";
import PerfectScrollbar from "react-perfect-scrollbar";
import {BubbleEffect, Loading, SimpleContCard, TopDrawer} from "../../src/components";
import { storeFrame } from "../../src/reducers/ContReducer";
import { NextRouter, useRouter } from "next/dist/client/router";

type DrawerEvtProps = {
    keyword: string,
    triggered: boolean
}

const DeepSea = ({ search }) => {
    const dispatch = useDispatch();
    const router: NextRouter = useRouter();
    const [ dived, setDived ] = React.useState<number>(0);
    const [ ecosystem, setEcosystem ] = React.useState<Ecosystem>({
        bubbles: [],
        isFetching: false,
        hasMore: false,
    })
    const [ drawerEvt, setDrawerEvt ] = React.useState<DrawerEvtProps>({
        triggered: false,
        keyword: ''
    });

    const diveDeeply = (e) => {
        console.log(e.pageYOffset)
    }

    // instance variable
    const renderItem: number = 20;
    const page: React.MutableRefObject<number> = React.useRef(1);
    const totalPage: React.MutableRefObject<number> = React.useRef(0);
    const rootRef = React.useRef<HTMLDivElement | undefined>(undefined);
    const targetRef = React.useRef<HTMLDivElement | undefined>(undefined);

    useIntersectionObserver({
        root: rootRef.current,
        target: targetRef.current,
        threshold: 0.8,
        onIntersect: async ([{ isIntersecting }]) => {
            if (isIntersecting && !ecosystem.isFetching && ecosystem.hasMore && page.current + 1 <= totalPage.current) {
                Notiflix.Loading.Dots('Diving deeper...');
                setEcosystem({ ...ecosystem, isFetching: true })
                await refetch({ pr: { page: page.current, renderItem: renderItem }, keyword: search ? search : '', dFilter: undefined }).then(() => { })
                page.current++;
            }
        }
    });

    React.useEffect(() => {
        Notiflix.Loading.Hourglass('Preparing to dive...');
        page.current = 1;
        setDived(0)
        bubbles({ variables: { pr: { page: page.current, renderItem: renderItem }, keyword: search ? search : '', dFilter: undefined }})
    }, [ drawerEvt.triggered ])

    const [ bubbles, { refetch }] = useLazyQuery(GET_BUBBLES, { fetchPolicy: 'cache-and-network', onCompleted: data => {
        if (data && data.ocean) {
            let added: Bubble[] = page.current === 1 ? [ ...data.ocean.bubbles ] : [ ...ecosystem.bubbles, ...data.ocean.bubbles ]
            setEcosystem({ isFetching: false, bubbles: [ ...added ], hasMore: page.current < data.ocean.totalPages })
            totalPage.current = data.ocean.totalPages;
            setDived(dived + 1)
            Notiflix.Loading.Remove(1000);
        }
    }})
    const [ remember ] = useMutation(POST_REMEMBER)

    const onRouteToCreateNewContent = (bubble: Bubble) => {
        Notiflix.Loading.Pulse('Pop Bubble...')
        dispatch(storeFrame({ title: bubble.title, ref: bubble.ref, captions: bubble.captions ? bubble.captions : '', categories: [], id: undefined }))
        return router.push('/?tb=2')
    }

    const onChangeKeyword = (s: string) => {
        setDrawerEvt({ ...drawerEvt, keyword: s })
    }

    const forceReRendering = () => {
        remember({ fetchPolicy: 'no-cache', variables: { keyword: drawerEvt.keyword } })
            .then(() => {
                setDrawerEvt({ keyword: '', triggered: !drawerEvt.triggered })
            })
    }

    return (
        <PerfectScrollbar style={{ }}>
            <div style={{ minWidth: '100%', background: 'rgb(0,143,240) linear-gradient(180deg, rgba(0,143,240,1) 0%, rgba(24,98,148,1) 50%, rgba(24,35,43,1) 100%)' }}
                 onMouseOver={(e) => diveDeeply(e)}>
                <TopDrawer keyword={drawerEvt.keyword} onChangeKeyword={onChangeKeyword} forceReRendering={forceReRendering} />
                <div className={"ovf"} ref={rootRef}
                     style={{ width: '100%', height: '100vh', paddingLeft: '16pt', border: 0, boxShadow: '0px 3px 6px #00000029', borderRadius: '12pt',
                         display: 'flex', flexWrap: 'wrap', overflow: 'auto', marginTop: '5vh', background: 'transparent' }}>
                    {
                        ecosystem.bubbles.map((bubble: Bubble) => (
                            <SimpleContCard key={bubble.id + Math.random()} details={bubble}
                                            onClick={() => onRouteToCreateNewContent(bubble).then(() => { Notiflix.Loading.Remove(800) })}
                                            width={'15rem'} height={'15rem'} denominator={25} />
                        ))
                    }
                    {
                        ecosystem.isFetching && <Loading />
                    }
                    <div ref={targetRef} />
                </div>
            </div>
        </PerfectScrollbar>
    )
}

DeepSea.getInitialProps = ({ query }) => {
    let { search } = query;
    return { search };
}

export default DeepSea;