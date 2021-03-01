import React from 'react';
import { ApolloQueryResult, useMutation } from "@apollo/client";
import { useSelector, useDispatch } from 'react-redux';
import { Button, Modal } from "@material-ui/core";
import { CloseOutlined } from "@material-ui/icons";
import { User } from "../../types";
import { RootState } from "../../modules";
import { DELETE_REMOVE_USER } from "../../graphQL/quries";
import { storeUserList } from "../../reducers/UserListReducer";
import Notiflix from 'notiflix';

type Props = {
    hidden: boolean
    details: User
    close: () => void
}

const D_UserModal: React.FunctionComponent<Props> = ({ hidden, details, close }) => {
    const dispatch = useDispatch();
    const listStates = useSelector((state: RootState) => state.UserListReducer);

    const onDeleteUserInfo = async () => {
        Notiflix.Loading.Hourglass('Deleting user...');
        await deleteUser({ variables: { id: details.id }})
            .then(() => { close(); Notiflix.Loading.Remove(1000); });
    }

    const [ deleteUser, { } ] = useMutation(DELETE_REMOVE_USER, { onCompleted: async (data) => {
        if (data.deleteUser.status === 200) {
            await listStates.refetch({ pr: { page: 1, renderItem: listStates.renderItem }, authority: listStates.selectedAuthority })
                .then((response: ApolloQueryResult<any>) => {
                    dispatch(storeUserList({ ...listStates, items: [ ...response.data.allUsers.users ], page: 1 }))
                })
        }
        }})

    return (
        <Modal open={!hidden} style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <div style={{ width: '400pt', background: '#FFF 0% 0% no-repeat padding-box', height: '200pt', padding: '8pt',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ color: '#000', fontSize: '11pt', fontWeight: 'bold' }}>
                        { `< 사용자 정보 삭제 >`}
                    </p>
                    <CloseOutlined style={{ cursor: 'pointer', color: '#d64161' }} fontSize={"large"} color={"primary"} onClick={() => close()} />
                </div>
                <div style={{ width: '100%' }}>
                    <span style={{ color: 'red', fontSize: '14pt', fontWeight: 600 }}>
                        {`사용자 ${details.name}을(를) 정말로 삭제하시겠습니까?`}
                    </span>
                </div>
                <div style={{ width: '100%', height: '80pt', display: 'flex' }}>
                    <Button style={{ width: '50%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'gray' }}
                            onClick={() => close()}>
                        <span style={{ color: '#F2F2F2', fontWeight: 'bold', fontSize: '15pt' }}>
                            취소
                        </span>
                    </Button>
                    <Button style={{ width: '50%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFE94A' }}
                            onClick={() => onDeleteUserInfo()}>
                        <span style={{ color: '#000', fontWeight: 'bold', fontSize: '15pt' }}>
                            삭제
                        </span>
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default D_UserModal;