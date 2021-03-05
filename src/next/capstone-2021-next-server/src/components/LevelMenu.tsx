import React from 'react';
import {ListItemText, MenuItem, MenuProps, withStyles, Button, Menu} from "@material-ui/core";
import {
    InsertEmoticonRounded,
    MoodBadRounded,
    SentimentDissatisfiedRounded
} from "@material-ui/icons";

const StyledMenu = withStyles({
    paper: {
        border: '1px solid #d3d4d5',
    },
})((props: MenuProps) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
        {...props}
    />
));

const StyledMenuItem = withStyles((theme) => ({
    root: {
        '&:focus': {
            backgroundColor: theme.palette.primary.main,
            '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                color: theme.palette.common.white,
            },
        },
    },
}))(MenuItem);

type Props = {
    selected: number,
    modifyLevel: (modified: number) => void
}

const LevelMenu: React.FunctionComponent<Props> = ({ selected, modifyLevel }) => {
    const [ anchorEl, setAnchorEl ] = React.useState<null | HTMLElement>(null);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const onClickLevelItem = (clicked: number) => {
        modifyLevel(clicked);
        handleClose();
    }

    return (
        <div style={{ paddingLeft: '8pt' }}>
            <Button
                aria-controls="customized-menu"
                aria-haspopup="true"
                variant="contained"
                style={{ backgroundColor: '#000', color: '#FFF', fontWeight: 'bold', fontSize: '12pt', width: '85pt', height: '40pt', fontFamily: 'sans-serif' }}
                onClick={handleClick}
            >
                {`Level ${selected + 1}`}
            </Button>
            <StyledMenu
                id="customized-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <StyledMenuItem onClick={() => onClickLevelItem(0)}>
                    <InsertEmoticonRounded style={{ marginRight: '6pt' }} fontSize="small" />
                    <ListItemText primary="Level 1" />
                </StyledMenuItem>
                <StyledMenuItem onClick={() => onClickLevelItem(1)}>
                    <SentimentDissatisfiedRounded style={{ marginRight: '6pt' }} fontSize="small" />
                    <ListItemText primary="Level 2" />
                </StyledMenuItem>
                <StyledMenuItem onClick={() => onClickLevelItem(2)}>
                    <MoodBadRounded style={{ marginRight: '6pt' }} fontSize="small" />
                    <ListItemText primary="Level 3" />
                </StyledMenuItem>
            </StyledMenu>
        </div>
    )
}

export default LevelMenu;