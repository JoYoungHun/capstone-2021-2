import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Modal } from "@material-ui/core";
import { CloseOutlined } from '@material-ui/icons';
import TextInput from "../TextInput";
import { RootState } from "../../modules";
import { useMutation } from "@apollo/client";
import { PUT_UPDATE_CATEGORY } from "../../graphQL/quries";
import { Error } from "../index";
import { modifyCategories } from "../../reducers/CategoryReducer";
import Notiflix from 'notiflix';
import { NextRouter, useRouter } from "next/router";
import {routeHttpStatus} from "../../../utils/func";

type Props = {
    hidden: boolean
    close: () => void
    create?: (s: string) => void
    option?: string
}

const CU_CategoryModal = ({ hidden, close, create, option }: Props) => {
    const dispatch = useDispatch();
    const router: NextRouter = useRouter();
    const { selectedCategory, refetch } = useSelector((state: RootState) => state.CategoryReducer);
    const [ title, setTitle ] = React.useState<string>(selectedCategory ? selectedCategory.name : '');

    const [ updateCategory, { error }] = useMutation(PUT_UPDATE_CATEGORY, { awaitRefetchQueries: true })
    if (error) return <Error msg={error.message} />

    const CALL_UPDATE_CATEGORY_API = async () => {
        if (selectedCategory && option === '카테고리 수정') {
            Notiflix.Loading.Hourglass('카테고리 수정중...');
            await updateCategory({ variables: { id: selectedCategory.id, title: title }})
                .then((res) => {
                    if (res && res.data && res.data.updateCategory.status === 200) {
                        refetch && refetch()
                            .then(refetchResponse => {
                                if (refetchResponse.data) {
                                    dispatch(modifyCategories(refetchResponse.data.categories));
                                    setTitle('');
                                }
                            });
                    } else routeHttpStatus(router, res.data.updateCategory.status, res.data.updateCategory.message);
                })
        }
    }

    const CALLBACK_CATEGORY_API = async () => {
        if (create) { create(title); setTitle(''); }
        else await CALL_UPDATE_CATEGORY_API().then(() => Notiflix.Loading.Remove(300));
        close();
    }

    return (
        <Modal open={!hidden} style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <div style={{ width: '400pt', background: '#FFF 0% 0% no-repeat padding-box', height: '230pt', padding: '8pt' }}>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ color: '#000', fontSize: '11pt', fontWeight: 'bold' }}>
                        { `< ${option ? option : '카테고리 등록'} >`}
                    </p>
                    <CloseOutlined style={{ cursor: 'pointer', color: '#d64161' }} fontSize={"large"} color={"primary"} onClick={() => close()} />
                </div>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', paddingLeft: '8pt', paddingRight: '8pt' }}>
                    <p style={{ color: '#000', fontSize: '17pt', fontWeight: 'bold' }}>
                        카테고리명
                    </p>
                    <TextInput width={'100%'} height={'40pt'} value={title} onChangeValue={(e) => setTitle(e)} />
                    <Button style={{ width: '100%', height: '30pt', backgroundColor: '#FFE94A', marginTop: '12pt' }}
                            onClick={() => CALLBACK_CATEGORY_API()}>
                        <span style={{ color: '#000', fontWeight: 'bold', fontSize: '14pt' }}>
                            {option === '카테고리 수정' ? '수정하기' : '등록하기'}
                        </span>
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default CU_CategoryModal;