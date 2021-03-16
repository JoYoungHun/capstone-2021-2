import React from 'react';
import { NextRouter, useRouter } from "next/router";

const Report = () => {
    const router: NextRouter = useRouter();

    React.useEffect(() => {
        // check if query string contains report key
        if (!router.query?.ri)
            router.back();
    }, [])

    return (
        <div style={{ width: '100%', height: '100%' }}>

        </div>
    )
}

export default Report;