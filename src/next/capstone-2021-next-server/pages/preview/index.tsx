import React from 'react';
import { NextRouter, useRouter } from "next/router";
import { PreviewHeader } from "../../src/components";
import { PreviewContainer } from "../../src/container";
import {useLazyQuery} from "@apollo/client";
import {GET_CONTENT} from "../../src/graphQL/quries";

type DetailProps = {
    id?: number,
    title?: string,
    ref?: string
}

const Preview = () => {
    const router: NextRouter = useRouter();
    const [ details, setDetails ] = React.useState<DetailProps>({ });

    const [ content ] = useLazyQuery(GET_CONTENT, { onCompleted: response => {
            if (response.content) {
                setDetails(response.content)
            }
        }});
    return (
        <div style={{ width: '100%', height: '100%' }}>
            <PreviewHeader title={details.title} goBack={() => router.back()}/>
            <PreviewContainer />
        </div>
    )
}

export default Preview;