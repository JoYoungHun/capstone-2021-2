import styled from 'styled-components';

export const Tab = styled.div`
    display: inline-block;
    cursor: pointer;
    width: ${props => props.width ? props.width : "120pt"};
    height: ${props => props.height ? props.height : "40pt"};
    borderRadius: 40rem;
    &: hover {
        background-color: ${props => props.background ? props.background : "#87bdd8"};
        color: #FFF;
    }
    border-bottom: ${props => props.selected ? "4pt solid #FFE94A" : "0px solid #000"}
`

export const TabTitleShell = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
`

export const TabTitle = styled.span`
    font-weight: bold;
    font-size: ${props => props.fontSize ? props.fontSize : "12pt"};
    font-family: sans-serif;
`

export const SignatureBtn = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background: #FFE94A 0% 0% no-repeat padding-box;
    boxShadow: 0px 0px 3px solid #000;
    width: ${props => props.width};
    height: ${props => props.height};
    border: 0;
    border-radius: 4pt;
`

export const HoverEvtDiv = styled.div`
    cursor: pointer;
    &: hover {
        border: 2px solid ${props => props.borderColor ? props.borderColor : "#00000029"};
    }   
`

export const Card = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center; 
    justify-content: center; 
    width: 20rem; 
    height: 20rem;
    margin: 16pt auto;
    background: linear-gradient(
        to right,
        ${props => props.to ? props.to : 'rgba(69, 65, 64, 0.3)'},
        ${props => props.right ? props.right : 'rgba(8, 83, 156, 0.75)'}
    ); 
    border-radius: 50%;
    transform-style: preserve-3d;
`