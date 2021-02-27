import React from 'react';
import { Divider } from "@material-ui/core";
import { SportsEsportsRounded, GroupRounded, Reddit, CategoryRounded, HomeRounded } from '@material-ui/icons';
import styled from 'styled-components'

const Menu = styled.div`
    width: 200pt;
    height: 100pt;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
`

const MenuShell = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`

const MenuTitle = styled.span`
    font-size: 18pt;
    font-weight: bold;
    font-family: sans-serif;
    padding-left: 16pt;
`

type Props = {
    modifyTab: ( selected: number ) => void
    goBack: () => void
}

const SudoNavigation: React.FunctionComponent<Props> = React.memo(({ modifyTab, goBack }) => {
    return (
        <div style={{ width: '220pt' }}>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Menu>
                    <Reddit color={'primary'} style={{ fontSize: '32pt'}} />
                    로고 들어갈 자리
                </Menu>
                <Menu onClick={() => modifyTab(0) }>
                    <MenuShell>
                        <SportsEsportsRounded color={'primary'} style={{ fontSize: '24pt' }} />
                        <MenuTitle>
                            컨텐츠 관리
                        </MenuTitle>
                    </MenuShell>
                </Menu>
                <Divider variant={'middle'} />
                <Menu onClick={() => modifyTab(1) }>
                    <MenuShell>
                        <GroupRounded color={'primary'} style={{ fontSize: '24pt' }} />
                        <MenuTitle>
                            사용자 관리
                        </MenuTitle>
                    </MenuShell>
                </Menu>
                <Divider variant={'middle'} />
                <Menu onClick={() => modifyTab(2) }>
                    <MenuShell>
                        <CategoryRounded color={'primary'} style={{ fontSize: '24pt' }} />
                        <MenuTitle>
                            카테고리 관리
                        </MenuTitle>
                    </MenuShell>
                </Menu>
                <Divider variant={'middle'} />
                <Menu onClick={() => goBack()}>
                    <MenuShell>
                        <HomeRounded color={'primary'} style={{ fontSize: '18pt' }} />
                    </MenuShell>
                </Menu>
            </div>
        </div>
    )
});

export default SudoNavigation;