import React from 'react';
import { Input, SwipeableDrawer } from "@material-ui/core";
import { ArrowBackRounded, SearchRounded } from "@material-ui/icons";
import Cookies from 'js-cookie';
import { NextRouter, useRouter } from "next/dist/client/router";
import Notiflix from 'notiflix';

type Props = {
    keyword: string,
    onChangeKeyword: (s: string) => void
    forceReRendering: () => void
}

const TopDrawer: React.FunctionComponent<Props> = ({ keyword, onChangeKeyword, forceReRendering }) => {
    const [ open, setOpen ] = React.useState<boolean>(false);
    const router: NextRouter = useRouter();

    const toggleOpen = () => {
        setOpen(!open)
    }

    const diveIntoOcean = () => {
        if (keyword !== '') {
            setOpen(!open)
            return router.push(`/deepsea?search=${keyword}`)
        } else Notiflix.Notify.Failure('검색어를 입력해주세요.')
    }

    return (
        <React.Fragment>
            <div style={{ zIndex: 1, position: 'fixed', top: 0, left: 0, width: '100%', display: 'flex', justifyContent: 'space-between', transition: 'all ease-out 0.3s',
                alignItems: 'center', height: '5vh', backgroundColor: Cookies.get('dove-dark-mode') === 'true' ? '#000' : '#fff', paddingLeft: '20pt', paddingRight: '20pt' }}>
                <div />
                <div style={{ cursor: 'pointer', width: '70%', height: '100%', background: 'transparent', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                     onClick={() => toggleOpen()}>
                    <SearchRounded />
                </div>
                <ArrowBackRounded style={{ cursor: 'pointer' }} onClick={() => router.push('/')} />
            </div>
            <SwipeableDrawer anchor={'top'} open={open} onClose={toggleOpen} onOpen={toggleOpen}>
                <div style={{ height: '15vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ height: '80%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around' }}>
                        <span style={{ fontFamily: 'sans-serif', fontWeight: 'bold', fontSize: '12pt', color: '#000' }}>
                            검색어를 입력해주세요.
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <SearchRounded style={{ marginRight: '9pt'}} onClick={() => diveIntoOcean().then(() => forceReRendering() )} />
                            <Input style={{ height: '4vh', width: '20rem', fontSize: '17pt' }}
                                   onKeyDown={(e) => { if (e.key === 'Enter') diveIntoOcean().then(() => forceReRendering())}}
                                value={keyword} onChange={(e) => onChangeKeyword(e.target.value)} />
                        </div>
                    </div>
                </div>
            </SwipeableDrawer>
        </React.Fragment>
    )
}

export default TopDrawer