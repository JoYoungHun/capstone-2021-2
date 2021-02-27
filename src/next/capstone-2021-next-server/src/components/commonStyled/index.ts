import styled from 'styled-components';

export const Tab = styled.div`
    display: inline-block;
    cursor: pointer;
    width: ${props => props.width ? props.width : "120pt"};
    height: ${props => props.height ? props.height : "40pt"};
    borderRadius: 20pt;
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