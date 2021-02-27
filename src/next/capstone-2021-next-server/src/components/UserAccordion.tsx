import React from 'react';
import { NextRouter, useRouter } from "next/router";
import { ListItemIcon, ListItemText, Menu, MenuItem, withStyles } from "@material-ui/core";
import { AccountCircleRounded, FaceRounded, GitHub, MeetingRoomRounded, SupervisorAccountRounded } from "@material-ui/icons";
import Cookies from 'js-cookie';

type Props = {
    authority?: string
}

const UserAccordion = React.memo(({ authority }: Props) => {
    const router: NextRouter = useRouter();
    const [ anchorEl, setAnchorEl ] = React.useState<null | Element>(null);
    const logout = () => {
        Cookies.remove('dove-token');
        window.location.reload();
    }

    return (
        <div>
            <AccountCircleRounded style={{ cursor: 'pointer', fontSize: '50pt' }} color={Cookies.get('dove-dark-mode') === 'true' ? 'primary' : 'disabled'}
                                  onClick={(e) => setAnchorEl(e.currentTarget)} />
            <StyledMenu
                id="customized-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
            >
                <StyledMenuItem>
                    <ListItemIcon>
                        <FaceRounded fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="My page" />
                </StyledMenuItem>
                <StyledMenuItem onClick={() => { window.open('https://github.com/rhyme884/capstone2021-front'); setAnchorEl(null); }}>
                    <ListItemIcon>
                        <GitHub fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Contact us" />
                </StyledMenuItem>
                <StyledMenuItem onClick={() => logout()}>
                    <ListItemIcon>
                        <MeetingRoomRounded fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                </StyledMenuItem>
                {
                    (authority && authority === 'ROLE_ADMIN') &&
                        <StyledMenuItem onClick={() => router.push('/sudo').then()}>
                            <ListItemIcon>
                                <SupervisorAccountRounded fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Sudo" />
                        </StyledMenuItem>
                }
            </StyledMenu>
        </div>
    )
});

type MenuProps = {
    id?: string
    anchorEl: Element,
    keepMounted: boolean,
    open: boolean,
    onClose: () => void
    classes: {
        paper: string,
    }
    children: any[]
}

const StyledMenu = withStyles({
    paper: {
        border: '1px solid #d3d4d5',
    },
})((props: MenuProps) => {
    return (
        <Menu
            elevation={0}
            getContentAnchorEl={null}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            {...props}
        />
    )
});

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

export default UserAccordion;