import React from 'react';
import { useDispatch } from 'react-redux';
import { NextRouter, useRouter } from "next/router";
import { PreviewHeader } from "../../src/components";
import { PreviewContainer } from "../../src/container";
import { useLazyQuery } from "@apollo/client";
import { GET_CONTENT } from "../../src/graphQL/quries";
import { storeFrame } from "../../src/reducers/ContReducer";

const Preview = ({ ct }) => {
    const router: NextRouter = useRouter();
    const dispatch = useDispatch();

    const [ content ] = useLazyQuery(GET_CONTENT, { onCompleted: response => {
            if (response.content) {
                dispatch(storeFrame({ ...response.content, captions: '', categories: [] }))
            }
        }});

    React.useEffect(() => {
        const contentKey: string | string[] | undefined = router.query?.ct;
        if (contentKey && typeof(contentKey) === 'string') {
            content({ variables: { id: parseInt(contentKey) }})
        }
    }, [ router.query ])
    return (
        <div style={{ width: '100%', height: '100%' }}>
            <PreviewHeader goBack={() => router.push('/home?tb=0')}/>
            <PreviewContainer ct={ct} />
        </div>
    )
}

Preview.getInitialProps = ({ query }) => {
    let { ct } = query;
    if (typeof ct === 'string')
        ct = parseInt(ct);

    return { ct };
}

export default Preview;