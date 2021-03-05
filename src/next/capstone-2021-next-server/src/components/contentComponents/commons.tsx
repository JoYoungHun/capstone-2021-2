import React from "react";
import { Button } from "@material-ui/core";

type BtnProps = {
    children: React.ReactNode,
    onClick: (e: React.MouseEvent<HTMLElement>) => void,
    width?: string,
    height?: string
    marginLeft?: string
}

export const YellowBtn = ({ children, onClick, width, height, marginLeft }: BtnProps) => (
    <Button style={{ background: '#FFE94A 0% 0% no-repeat padding-box', border: 0, borderRadius: '24pt',
        width: width ? width : '64pt', height: height ? height : '32pt', boxShadow: '0px 3px 6px #00000029', marginLeft: marginLeft ? marginLeft : '0px' }}
            onClick={onClick}>
        {children}
    </Button>
)