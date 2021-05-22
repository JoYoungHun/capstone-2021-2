import React from 'react';
import styled from 'styled-components';
import PerfectScrollbar from "react-perfect-scrollbar";
import { Bubble, CardContProps } from "../types";
import {SimpleContCard} from "./index";
import {Divider} from "@material-ui/core";

type Props = {
    title: string
    cards?: CardContProps[]
    bubbles?: Bubble[]
}

const SliderTitle = styled.span`
    font-family: sans-serif;
    font-size: 14pt;
    font-weight: bold;
`

const DashboardSlider: React.FunctionComponent<Props> = ({ title, cards, bubbles }) => {
    return (
        <div style={{ height: '25vh', marginBottom: '5vh', display: 'flex', flexDirection: 'column' }}>
            <SliderTitle>{title}</SliderTitle>
            <div style={{ display: 'inline', width: '100%', height: '100%', overflow: 'hidden', whiteSpace: 'nowrap', marginBottom: '2vh' }}>
                {
                    cards?.map((component, index) => (
                        <div key={index} style={{ display: 'inline-block', marginRight: '12pt' }}>
                            <SimpleContCard details={component} width={'8rem'} height={'8rem'} denominator={100} />
                        </div>
                    ))
                }
                {
                    bubbles?.map((component, index) => (
                        <div key={index} style={{ display: 'inline-block', marginRight: '12pt' }}>
                            <SimpleContCard details={component} width={'8rem'} height={'8rem'} denominator={100} />
                        </div>
                    ))
                }
                {
                    ((cards === undefined && bubbles === undefined) ||
                    cards?.length === 0 && bubbles?.length === 0) &&
                        <p>

                        </p>
                }
            </div>
            <Divider orientation={'horizontal'} variant={'middle'} />
        </div>
    )
}

export default DashboardSlider;