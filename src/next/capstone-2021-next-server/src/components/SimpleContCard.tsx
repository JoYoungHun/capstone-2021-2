import React from 'react';
import { Category, ContentDetails } from "../types";
import { parseYoutube } from "../../utils/func";
import { HoverEvtDiv } from "./commonStyled";
import Cookies from 'js-cookie';
import ellipsis from 'text-ellipsis';

type Props = {
    details: ContentDetails
    onClick?: () => Promise<any>
}

const SimpleContCard: React.FunctionComponent<Props> = ({ details, onClick }) => {
    return (
        <HoverEvtDiv style={{ paddingLeft: '2pt', display: 'flex', alignItems: 'center', width: '320pt', height: '140pt', borderRadius: '12pt', marginRight: '18pt' }}
                     borderColor={Cookies.get('dove-dark-mode') ? '#FFF' : '#000'}
                     onClick={() => onClick && onClick()}>
            <img src={`http://img.youtube.com/vi/${parseYoutube(details.ref)}/0.jpg`}
                 style={{ objectFit: 'cover' }}
                 width={'260pt'} height={'147pt'} alt={details.title} />
            <div style={{ width: '107.5pt', height: '120pt', display: 'flex', flexDirection: 'column',
                paddingLeft: '8pt', justifyContent: 'space-around' }}>
                    <span style={{ fontSize: '14.5pt', fontWeight: 'bold', width: '100%', wordBreak: 'break-all', whiteSpace: 'nowrap' }}>
                        {ellipsis(details.title, 14)}
                    </span>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <span style={{ fontSize: '10pt', fontWeight: 'normal' }}>
                            등록자:
                        </span>
                    <span style={{ fontSize: '12pt', fontWeight: 'bold', paddingLeft: '4pt' }}>
                            {ellipsis(details.registerer.name, 12)}
                        </span>
                </div>
                <span style={{ fontSize: '10pt', fontWeight: 'lighter', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                        {(details.category && details.category.length > 0) ?
                            ellipsis(details.category.map((ctg: Category) => ctg.name.concat(', ')), 10)
                            : '-'}
                    </span>
                <span style={{ display: 'block', fontSize: '10pt', fontWeight: 'lighter', textDecoration: 'none', textOverflow: 'ellipsis', cursor: 'pointer',
                    color: Cookies.get('dove-dark-mode') === 'true' ? '#b2c2bf' : '#1976d2', whiteSpace: 'nowrap', overflow: 'hidden' }}
                    onClick={() => window.open(`${details.ref}`)}
                >
                    {`ref: ${details.ref}`}
                </span>
            </div>
        </HoverEvtDiv>
    )
};

export default SimpleContCard;