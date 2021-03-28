import React, { BaseSyntheticEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Button,
    createStyles,
    Divider,
    FormControl,
    InputLabel,
    makeStyles,
    MenuItem,
    Modal,
    Select,
    Theme
} from "@material-ui/core";
import {ApolloQueryResult, useMutation} from "@apollo/client";
import { CloseOutlined } from "@material-ui/icons";
import { User } from "../../types";
import { PUT_UPDATE_USER_AUTHORITY } from "../../graphQL/quries";
import Notiflix from 'notiflix';
import {storeUserList} from "../../reducers/UserListReducer";
import {RootState} from "../../modules";

type Props = {
    hidden: boolean
    details: User
    close: () => void
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
            width: 'calc(100% - 100pt)',
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
    }),
);


const U_UserModal: React.FunctionComponent<Props> = ({ hidden, details, close }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const listStates = useSelector((state: RootState) => state.UserListReducer)
    const [ modifiedAuth, setModifiedAuth ] = React.useState<string>(details.authority);

    React.useEffect(() => {
        setModifiedAuth(details.authority);
    }, [ details.id ])

    const onModifyUserAuthority = async () => {
        if (details.authority !== modifiedAuth) {
            Notiflix.Loading.Hourglass('Updating user...');
            await updateUserAuthority({ variables: { id: details.id, authority: modifiedAuth }})
                .then(() => { close(); Notiflix.Loading.Remove(1000); });
        } else close();
    }

    const [ updateUserAuthority, { } ] = useMutation(PUT_UPDATE_USER_AUTHORITY, { onCompleted: async (data) => {
        if (data.updateUserAuthority.status === 200) {
            await listStates.refetch({ pr: { page: listStates.page, renderItem: listStates.renderItem }, authority: listStates.selectedAuthority })
                .then((response: ApolloQueryResult<any>) => {
                    dispatch(storeUserList({ ...listStates, items: [ ...response.data.allUsers.users ]}))
                })
        }
    }})

    return (
        <Modal open={!hidden} style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '400pt', background: '#FFF 0% 0% no-repeat padding-box', height: '400pt', padding: '8pt',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '20pt' }}>
                    <p style={{ color: '#000', fontSize: '11pt', fontWeight: 'bold' }}>
                        {'< 사용자 정보 수정>'}
                    </p>
                    <CloseOutlined style={{ cursor: 'pointer', color: '#d64161' }} fontSize={"large"} color={"primary"} onClick={() => close()} />
                </div>
                <div style={{ width: '100%', height: '360pt', paddingLeft: '8pt', paddingRight: '8pt', color: '#000', fontFamily: 'sans-serif', marginTop: '24pt' }}>
                    <div style={{ width: '100%', display: 'flex', alignItems: 'center', height: '25pt', marginBottom: '8pt' }}>
                        <span style={{ fontSize: '17pt', fontWeight: 'bold', width: '60pt' }}>
                            Id
                        </span>
                        <div style={{ marginLeft: '40pt', border: '0.25px solid #00000029', boxShadow: '0px 3px 6px #00000029',
                            borderRadius: '12pt', width: 'calc(100% - 100pt)', height: '100%', overflow: 'auto',
                            display: 'flex', justifyContent: 'flex-start', alignItems: 'center', paddingLeft: '8pt' }}>
                            <span>{details.email}</span>
                        </div>
                    </div>
                    <Divider variant={'fullWidth'} orientation={'horizontal'} />
                    <div style={{ width: '100%', display: 'flex', alignItems: 'center', height: '25pt', marginTop: '8pt', marginBottom: '8pt' }}>
                        <span style={{ fontSize: '17pt', fontWeight: 'bold', width: '60pt' }}>
                            Name
                        </span>
                        <div style={{ marginLeft: '40pt', border: '0.25px solid #00000029', boxShadow: '0px 3px 6px #00000029',
                            borderRadius: '12pt', width: 'calc(100% - 100pt)', height: '100%', overflow: 'auto',
                            display: 'flex', justifyContent: 'flex-start', alignItems: 'center', paddingLeft: '8pt' }}>
                            <span>{details.name}</span>
                        </div>
                    </div>
                    <Divider variant={'fullWidth'} orientation={'horizontal'} />
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        height: '50pt', marginTop: '8pt', marginBottom: '8pt', cursor: 'pointer' }}>
                        <span style={{ fontSize: '17pt', fontWeight: 'bold', width: '60pt' }}>
                            Authority
                        </span>
                        <FormControl className={classes.formControl}>
                            <InputLabel id="demo-simple-select-label">Authority</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={modifiedAuth}
                                onChange={(e: BaseSyntheticEvent) => setModifiedAuth(e.target.value)}
                            >
                                {
                                    ['ROLE_USER', 'ROLE_READONLY', 'ROLE_ADMIN'].map((auth: string) => (
                                        <MenuItem value={auth} key={auth} onClick={() => {}}>
                                            {auth}
                                        </MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                    </div>
                    <Divider variant={'fullWidth'} orientation={'horizontal'} />
                    <div style={{ width: '100%', display: 'flex', alignItems: 'center', height: '25pt', marginTop: '8pt', marginBottom: '8pt' }}>
                        <span style={{ fontSize: '17pt', fontWeight: 'bold', width: '60pt' }}>
                            Created
                        </span>
                        <div style={{ marginLeft: '40pt', border: '0.25px solid #00000029', boxShadow: '0px 3px 6px #00000029',
                            borderRadius: '12pt', width: 'calc(100% - 100pt)', height: '100%', overflow: 'auto',
                            display: 'flex', justifyContent: 'flex-start', alignItems: 'center', paddingLeft: '8pt' }}>
                            <span>{details.created}</span>
                        </div>
                    </div>
                    <Divider variant={'fullWidth'} orientation={'horizontal'} />
                </div>
                <div style={{ width: '100%', height: '100pt', display: 'flex' }}>
                    <Button style={{ width: '50%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'gray' }}
                            onClick={() => close()}>
                        <span style={{ color: '#F2F2F2', fontWeight: 'bold', fontSize: '15pt' }}>
                            취소
                        </span>
                    </Button>
                    <Button style={{ width: '50%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFE94A' }}
                            onClick={() => onModifyUserAuthority()}>
                        <span style={{ color: '#000', fontWeight: 'bold', fontSize: '15pt' }}>
                            수정
                        </span>
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default U_UserModal;