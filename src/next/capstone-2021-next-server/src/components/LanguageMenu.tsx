import React from 'react';
import {Button, ListItemText, Menu, MenuItem, MenuProps, withStyles} from "@material-ui/core";
import {InsertEmoticonRounded, MaximizeRounded, MoodBadRounded, SentimentDissatisfiedRounded} from "@material-ui/icons";

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
    selected: string,
    modifyLanguage: (modified: string) => void
}

const LanguageMenu: React.FunctionComponent<Props> = ({ selected, modifyLanguage }) => {
    const [ anchorEl, setAnchorEl ] = React.useState<null | HTMLElement>(null);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const onClickLevelItem = (clicked: string) => {
        modifyLanguage(clicked);
        handleClose();
    }
    return (
        <div style={{ paddingLeft: '8pt' }}>
            <Button
                aria-controls="customized-menu"
                aria-haspopup="true"
                variant="contained"
                style={{ backgroundColor: '#000', color: '#FFF', fontWeight: 'bold', fontSize: '9pt', width: '85pt', height: '40pt', fontFamily: 'sans-serif' }}
                onClick={handleClick}
            >
                {selected}
            </Button>
            <StyledMenu
                id="customized-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <StyledMenuItem onClick={() => onClickLevelItem("KOR")}>
                    <MaximizeRounded style={{ marginRight: '6pt' }} fontSize="small" />
                    <ListItemText primary="KOR" />
                </StyledMenuItem>
                <StyledMenuItem onClick={() => onClickLevelItem("ENG")}>
                    <MaximizeRounded style={{ marginRight: '6pt' }} fontSize="small" />
                    <ListItemText primary="ENG" />
                </StyledMenuItem>
                <StyledMenuItem onClick={() => onClickLevelItem("KOR & ENG")}>
                    <MaximizeRounded style={{ marginRight: '6pt' }} fontSize="small" />
                    <ListItemText primary="KOR & ENG" />
                </StyledMenuItem>
            </StyledMenu>
        </div>
    )
}

export default LanguageMenu;