import React from 'react';
import { useDispatch } from 'react-redux';
import { CategoryTabs } from "../components";
import { UserInfoContainer } from "./index";
import {storeAuthority} from "../reducers/UserListReducer";

type Props = {

}

const UserManagementContainer: React.FunctionComponent<Props> = ({ }) => {
    const dispatch = useDispatch();
    const [ currentIdx, setCurrentIdx ] = React.useState<number>(0);
    const modifyTab = async (modify: number) => {
        if (modify >= 0 && modify <= 2 && currentIdx !== modify) {
            await new Promise((resolve => {
                dispatch(storeAuthority(modify === 0 ? null : modify === 1 ? 'ROLE_USER' : 'ROLE_ADMIN'))
                resolve(true);
            })).then(() => {
                setCurrentIdx(modify);
            })
        }
    }

    return (
        <React.Fragment>
            <CategoryTabs tabs={['사용자', '관리자']} currentIdx={currentIdx} modifyTab={modifyTab} />
            <br />
            <UserInfoContainer />
        </React.Fragment>
    )
};

export default UserManagementContainer;