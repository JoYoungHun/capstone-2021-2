import React from 'react';
import { useQuery, ApolloQueryResult } from "@apollo/client";
import { useDispatch, useSelector } from 'react-redux';
import {Button, Paper, Table, TableBody, TableCell, TableHead, TablePagination, TableRow} from "@material-ui/core";
import { GET_USERS } from "../graphQL/quries";
import { RootState } from "../modules";
import { storeUserList } from "../reducers/UserListReducer";
import { Error, Loading } from "../components";
import { User } from "../types";
import {D_UserModal, U_UserModal} from "../components/modals";

type Props = {

}

type BtnProps = {
    label: string,
    width?: string,
    height?: string,
    onClick?: () => void
    background?: string
}

type ModalProps = {
    hiddenUpdateModal: boolean,
    hiddenDeleteModal: boolean,
    selectedUserInfo: User | undefined
}

const UserInfoContainer: React.FunctionComponent<Props> = ({ }) => {
    const dispatch = useDispatch();
    const listStates = useSelector((state: RootState) => state.UserListReducer);
    let { page, renderItem } = listStates;
    const [ modalState, setModalState ] = React.useState<ModalProps>({
        hiddenUpdateModal: true,
        hiddenDeleteModal: true,
        selectedUserInfo: undefined
    })

    const Btn = React.useCallback(({ label, width, height, onClick, background }: BtnProps) => (
        <Button style={{ cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '4pt',
            width: width ? width : '40pt', height: height ? height : '30pt',
            background: `${background ? background : 'gray'} 0% 0% padding-box no-repeat`, borderRadius: '10pt', border: 0 }}
                onClick={onClick && onClick}>
            <span style={{ fontSize: '9pt', fontWeight: 'bold', color: background ? '#000' : '#FFF' }}>
                {label}
            </span>
        </Button>
    ), [])

    React.useEffect(() => {
        dispatch(storeUserList({ ...listStates, refetch: refetch }))
    }, [])

    React.useEffect(() => {
        refreshUserList()
            .then((response: ApolloQueryResult<any>) => {
                if (response && response.data) {
                    dispatch(storeUserList({ ...listStates, items: response.data.allUsers.users,
                        totalElements: response.data.allUsers.totalElements, page: 1, renderItem: 10 }))
                }
            })
    }, [ listStates.selectedAuthority, page, renderItem ])

    const refreshUserList = async () => {
        return new Promise((resolve) => {
            resolve(true);
            return refetch({ authority: listStates.selectedAuthority, pr: { page, renderItem }})
        })
    }

    const { loading, error, refetch } = useQuery(GET_USERS,
        { variables: { authority: listStates.selectedAuthority, pr: { page, renderItem } }, fetchPolicy: 'network-only',
        onCompleted: response => {
            if (response.allUsers) {
                dispatch(storeUserList({ ...listStates, items: response.allUsers.users, totalElements: response.allUsers.totalElements }))
            }

        }})
    if (loading) return <Loading />
    else if (error) return <Error msg={error.message} />

    return (
        <div>
            <Paper style={{ width: '100%' }}>
                <Table style={{ minWidth: '700px'}}>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ fontWeight: 'bold' }}>#</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }} align="right">id</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }} align="right">이름</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }} align="right">권한</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }} align="right">가입일</TableCell>
                            <TableCell align="right" />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { listStates && listStates.items && listStates.items.map((row: User, index: number) => (
                            <TableRow key={row.id}>
                                <TableCell component="th" scope="row">
                                    {`${index + 1 + ((page - 1) * renderItem)}`}
                                </TableCell>
                                <TableCell align="right">{row.email}</TableCell>
                                <TableCell align="right">{row.name}</TableCell>
                                <TableCell align="right">{row.authority}</TableCell>
                                <TableCell align="right">{row.created}</TableCell>
                                <TableCell align="right" style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                                    { Btn({ label: '수정', background: '#FFE94A',
                                        onClick: () => setModalState({ ...modalState, hiddenUpdateModal: false, selectedUserInfo: row })}) }
                                    { Btn({ label: '삭제', background: 'gray',
                                        onClick: () => setModalState({ ...modalState, hiddenDeleteModal: false, selectedUserInfo: row }) }) }
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <TablePagination
                        style={{ width: '100%' }}
                        component={"div"}
                        count={listStates.totalElements}
                        page={page - 1}
                        onChangePage={(_, e) => { dispatch(storeUserList({ ...listStates, page: e + 1 })) }}
                        rowsPerPage={renderItem}
                        onChangeRowsPerPage={(e) => {
                            dispatch(storeUserList({ ...listStates, renderItem: parseInt(e.target.value)}))}}
                    />
                </div>
            </Paper>
            {
                !modalState.hiddenUpdateModal &&
                    <U_UserModal hidden={modalState.hiddenUpdateModal} details={modalState.selectedUserInfo}
                                 close={() => setModalState({ ...modalState, hiddenUpdateModal: true, selectedUserInfo: undefined})} />
            }
            {
                !modalState.hiddenDeleteModal &&
                    <D_UserModal hidden={modalState.hiddenDeleteModal} details={modalState.selectedUserInfo}
                                 close={() => setModalState({ ...modalState, hiddenDeleteModal: true, selectedUserInfo: undefined})} />
            }
        </div>
    )
}

export default UserInfoContainer;