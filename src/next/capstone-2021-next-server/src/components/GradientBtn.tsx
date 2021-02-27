import React from 'react';
import {Button, makeStyles} from "@material-ui/core";

const useStyles = makeStyles({
    root: {
        background: (props: { fromColor?: string, toColor?: string }) =>
            `linear-gradient(30deg, ${props.fromColor ? props.fromColor : '#2196F3'} 20%, ${props.toColor ? props.toColor : '#21CBF3'} 100%)`,
        boxShadow: () => '0 3px 5px 2px rgba(33, 203, 243, .3)',
        border: 0,
        borderRadius: 3,
        color: 'white',
        padding: '0 30px',
        margin: 8,
    },
});

type Props = {
    props: {
        fromColor: string,
        toColor: string,
        other: any
    },
    children: any
    onClick: () => void
}

const GradientBtn: React.FunctionComponent<Props> = React.memo(({ props, children, onClick }) => {
    const classes = useStyles(props);
    return (
        <Button className={classes.root} style={{ ...props.other }} onClick={onClick}>
            {children}
        </Button>
    );
});


export default GradientBtn;