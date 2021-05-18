import React from 'react';
import {Bubble, ContentDetails} from "../types";
import { parseYoutube } from "../../utils/func";
import { Card } from "./commonStyled";
import Cookies from 'js-cookie';

type Props = {
    details: ContentDetails | Bubble
    onClick?: () => Promise<any>
    width?: string,
    height?: string,
    denominator?: number,
}

const SimpleContCard: React.FunctionComponent<Props> = ({ details, onClick, width, height, denominator }) => {
    const card: React.MutableRefObject<HTMLDivElement | null> = React.useRef(null);
    const img: React.MutableRefObject<HTMLImageElement | null> = React.useRef(null);

    // Moving Animation Event
    const onMouseMoveEventListener = (e) => {
        let xAxis = (window.innerWidth / 2 - e.pageX) / (denominator ? denominator : 20);
        let yAxis = (window.innerHeight / 2 - e.pageY) / (denominator ? denominator : 20);

        if (yAxis < -7) yAxis = -yAxis;
        card.current.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`
    }

    const onMouseEnterEventListener = () => {
        card.current.style.transition = 'none';
        // pop out
        img.current.style.transform = 'translateZ(30pt)';
        img.current.style.transition = 'all 0.75s ease';
        img.current.style.maxWidth = '100%';
    }

    const onMouseLeaveEventListener = () => {
        card.current.style.transition = 'all 0.5s ease';
        card.current.style.transform = `rotateY(0deg) rotateX(0deg)`
        // pop back
        img.current.style.transform = 'translateZ(0px)';
        img.current.style.maxWidth = '80%';
        img.current.style.transition = 'all 0.75s ease';
    }

    return (
        <Card ref={card} onClick={() => onClick && onClick()}
              to={Cookies.get('dove-dark-mode') === 'true' ? 'rgba(62, 68, 68, 0.75)' : undefined}
              right={Cookies.get('dove-dark-mode') === 'true' ? 'rgba(218, 194, 146, 0.75)' : undefined}
              width={width} height={height}
              onMouseMove={(e) => onMouseMoveEventListener(e)}
              onMouseLeave={() => onMouseLeaveEventListener()}
              onMouseEnter={() => onMouseEnterEventListener()}>
            <img ref={img} src={`http://img.youtube.com/vi/${parseYoutube(details.ref)}/0.jpg`}
                     style={{ objectFit: 'cover', maxWidth: '80%', minHeight: '80%', borderRadius: 'inherit' }}
                 alt={details.title} />
        </Card>
    )
};

export default SimpleContCard;