import React from 'react';
import Cookies from 'js-cookie';
import { Divider, Popover } from "@material-ui/core";
import { SettingsRounded } from "@material-ui/icons";
import { Category, ContentDetails } from "../types";
import { parseYoutube } from "../../utils/func";
import { HoverEvtDiv, SignatureBtn } from "./commonStyled";

type Props = {
    details: ContentDetails
    openDeleteModal: ( requestCardId: number, title: string ) => void
}

const ContCard: React.FunctionComponent<Props> = ({ details, openDeleteModal }) => {
    const [ anchorEl, setAnchorEl ] = React.useState<SVGSVGElement | null>(null);

    const togglePopover = (e: React.MouseEvent<SVGSVGElement>) => {
        if (Boolean(anchorEl)) {
            setAnchorEl(null)
        } else if (e?.currentTarget) {
            setAnchorEl(e.currentTarget)
        }
    }

    return (
        <React.Fragment>
            <div style={{ display: 'flex', alignItems: 'center', height: '160pt' }}>
                <img src={`http://img.youtube.com/vi/${parseYoutube(details.ref)}/0.jpg`}
                     style={{ objectFit: 'cover' }}
                     width={'330pt'} height={'177pt'} alt={details.title} />
                <div style={{ width: '480pt', height: 'calc(100% - 32pt)', display: 'flex', flexDirection: 'column',
                    justifyContent: 'space-between', marginLeft: '12pt', fontFamily: 'sans-serif' }}>
                    <span style={{ fontSize: '15pt', fontWeight: 'bold' }}>
                        {details.title}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <span style={{ fontSize: '10pt', fontWeight: 'normal' }}>
                            등록자:
                        </span>
                        <span style={{ fontSize: '12pt', fontWeight: 'bold', paddingLeft: '4pt' }}>
                            {details.registerer.name}
                        </span>
                    </div>
                    <span style={{ fontSize: '10pt', fontWeight: 'lighter' }}>
                        {(details.category && details.category.length > 0) ? details.category.map((ctg: Category) => ctg.name.concat(', ')) : '-'}
                    </span>
                    <a href={details.ref} style={{ fontSize: '10pt', fontWeight: 'lighter', textDecoration: 'none',
                        color: Cookies.get('dove-dark-mode') === 'true' ? '#b2c2bf' : '#1976d2'
                    }}>
                        {`ref: ${details.ref}`}
                    </a>
                    <div style={{ display: 'flex', justifyContent: 'space-between',
                        width: `${130 + 5 * (Math.ceil(details.words.length / 10) + Math.ceil(details.sentences.length / 10))}pt`
                    }}>
                        <SignatureBtn width={`${60 + 5 * (Math.ceil(details.words.length / 10))}pt`} height={'20pt'}>
                            <span style={{ color: '#000', fontSize: '9pt', fontWeight: 'bold' }}>
                                {`words: ${details.words.length}`}
                            </span>
                        </SignatureBtn>
                        <SignatureBtn width={`${60 + 5 * (Math.ceil(details.sentences.length / 10))}pt`} height={'20pt'}>
                            <span style={{ color: '#000', fontSize: '9pt', fontWeight: 'bold' }}>
                                {`sentences: ${details.sentences.length}`}
                            </span>
                        </SignatureBtn>
                    </div>
                </div>
                <div style={{ width: 'calc(100% - 700pt)', height: '100%', display: 'flex', justifyContent: 'flex-end', paddingRight: '100pt', paddingTop: '20pt' }}>
                    <SettingsRounded fontSize={'large'} onClick={(e) => togglePopover(e)}
                                     style={{ cursor: 'pointer' }} />
                    <Popover
                        id={Boolean(anchorEl) ? 'simple-popover' : undefined}
                        open={Boolean(anchorEl)}
                        anchorEl={anchorEl}
                        onClose={() => setAnchorEl(null)}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                    >
                        <div style={{ width: '100pt', height: '100pt', display: 'flex', flexDirection: 'column',
                            justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' }}>
                            <HoverEvtDiv style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '30pt' }}
                                         onClick={() => openDeleteModal(details.id, details.title)}>
                                <span style={{ fontWeight: 'bold' }}>
                                    컨텐츠 삭제하기
                                </span>
                            </HoverEvtDiv>
                            <br />
                            <HoverEvtDiv style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '30pt' }}>
                                <span style={{ fontWeight: 'bold' }}>
                                    컨텐츠로 이동
                                </span>
                            </HoverEvtDiv>
                        </div>
                    </Popover>
                </div>
            </div>
            <Divider variant={'middle'} orientation={'horizontal'} />
        </React.Fragment>
    )
}

export default ContCard;