import React from 'react';
import {Category, ContentDetails} from "../types";
import {parseYoutube} from "../../utils/func";
import Cookies from 'js-cookie';
import {HoverEvtDiv} from "./commonStyled";

type Props = {
    details: ContentDetails
}

const SimpleContCard: React.FunctionComponent<Props> = ({ details }) => {
    return (
        <HoverEvtDiv style={{ display: 'flex', alignItems: 'center', width: '320pt', height: '180pt', paddingLeft: '4pt', borderRadius: '12pt' }}>
            <img src={`http://img.youtube.com/vi/${parseYoutube(details.ref)}/0.jpg`}
                 style={{ objectFit: 'cover' }}
                 width={'230pt'} alt={details.title} />
            <div style={{ width: '107.5pt', height: '120pt', display: 'flex', flexDirection: 'column',
                color: '#000', paddingLeft: '8pt', justifyContent: 'space-around' }}>
                    <span style={{ fontSize: '15pt', fontWeight: 'bold', width: '100%', wordBreak: 'break-all', whiteSpace: 'nowrap' }}>
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
                <span style={{ fontSize: '10pt', fontWeight: 'lighter', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                        {(details.category && details.category.length > 0) ?
                            details.category.map((ctg: Category) => ctg.name.concat(', '))
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