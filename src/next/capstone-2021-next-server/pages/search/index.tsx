import React from 'react';
import { useRouter, NextRouter } from "next/router";
import dynamic from "next/dynamic";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_SYNAPSES, POST_REMEMBER } from "../../src/graphQL/quries";
import { GraphDataType } from "../../src/types";
import Image from 'next/image';
import Notiflix from 'notiflix';
import TextInput from "../../src/components/TextInput";
import { BubbleEffect } from "../../src/components";
const ThreeDimension = dynamic(() => import('../../src/components/ThreeDimension'), { ssr: false })

type Window = {
    width: number,
    height: number
}

const Search = () => {
    const router: NextRouter = useRouter();
    const search: React.MutableRefObject<string> = React.useRef<string>('')
    const [ windowSize, setWindowSize ] = React.useState<Window>({
        width: 0,
        height: 0,
    })
    const [ graphData, setGraphData ] = React.useState<GraphDataType>({
        nodes: [],
        links: []
    })

    React.useEffect(() => {
        Notiflix.Loading.Hourglass('Rendering 3D View...');
        if (window !== undefined) {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight })
        }
        Notiflix.Loading.Remove(1000);
    }, [ ])

    const rememberRelatedWords = async (keyword: string) => {
        if (keyword && keyword !== '') {
            synapses({ variables: { keyword: keyword, renderItem: 20 }})
            search.current = keyword
        } else {
            Notiflix.Notify.Failure('검색어를 입력해주세요.')
        }

    }

    const [ synapses ] = useLazyQuery(GET_SYNAPSES, { onCompleted: data => {
        if (data && data.synapses) {
            setGraphData({ ...graphData, nodes: data.synapses.points, links: data.synapses.links })
        }
    }});

    const onRouteToDeepSea = (node?: any, evt?: MouseEvent) => {
        console.log(node, evt, node?.name)
        const query: string | undefined = node ? node?.name : search.current
        if (query && query !== '') {
            remember({ fetchPolicy: 'no-cache', variables: { keyword: query }}).then(async () => {
                router.push(`/deepsea?search=${query}`).then()
            })
        }
        else Notiflix.Notify.Failure('검색어를 입력해주세요.')
    }

    const [ remember ] = useMutation(POST_REMEMBER);

    return (
        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', height: '100vh' }}>
            <div style={{ width: '100%', height: windowSize.height / 1.2, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1 }}>
                <ThreeDimension width={windowSize.width} height={windowSize.height / 1.5} graphData={graphData} onNodeClick={onRouteToDeepSea} />
            </div>
            <div style={{ zIndex: 1, width: '100%', height: '100%' }}>
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'center' }}>
                    <TextInput width={'40rem'} height={'6rem'} onChangeValue={(e) => rememberRelatedWords(e)}
                               onEnter={() => onRouteToDeepSea()}/>
                    <div style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', marginLeft: '8pt' }} onClick={() => onRouteToDeepSea()}>
                        <Image
                            src={"/scuba-diving-recreation.png"}
                            alt="search"
                            width={'80%'}
                            height={'80%'}
                        />
                        <span style={{ fontSize: '6pt', color: '#fff', fontWeight: 'bold' }}>I'm ready to dive!</span>
                    </div>
                </div>
            </div>
            <BubbleEffect />
        </div>
    )
}

export default Search;
