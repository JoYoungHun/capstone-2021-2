import React from "react";
import { Button } from "@material-ui/core";

export const YellowBtn = ({ children, onClick }) => (
    <Button style={{ background: '#FFE94A 0% 0% no-repeat padding-box', border: 0, borderRadius: '24pt', width: '64pt', height: '32pt' }} onClick={onClick}>
        {children}
    </Button>
)