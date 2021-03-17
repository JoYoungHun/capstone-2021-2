import React from 'react';
import { Radio, RadioProps, withStyles } from "@material-ui/core";
import { green } from "@material-ui/core/colors";

const GreenRadio = withStyles({
    root: {
        color: green[400],
        '&$checked': {
            color: green[600],
        },
    },
    checked: {},
})((props: RadioProps) => <Radio color="default" {...props} />);

type Props = {
    selectedValue: number,
    onClickBtn: (clicked: number) => void
}

const RadioBtns: React.FunctionComponent<Props> = ({ selectedValue, onClickBtn }) => {
    return (
        <div>

            <GreenRadio
                checked={selectedValue === 0}
                onChange={() => onClickBtn(0)}
                value="c"
                name="radio-button-demo"
                inputProps={{ 'aria-label': 'C' }}
            />
            <Radio
                checked={selectedValue === 1}
                onChange={() => onClickBtn(1)}
                value="a"
                name="radio-button-demo"
                inputProps={{ 'aria-label': 'A' }}
            />
            <Radio
                checked={selectedValue === 2}
                onChange={() => onClickBtn(2)}
                value="b"
                name="radio-button-demo"
                inputProps={{ 'aria-label': 'B' }}
            />
        </div>
    )
}

export default RadioBtns;