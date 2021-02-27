import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useMutation } from "@apollo/client";
import { RootState } from "../../modules";
import { CloseOutlined } from "@material-ui/icons";
import { Button, Modal } from "@material-ui/core";
import { Error } from "../index";
import { DELETE_REMOVE_CATEGORY } from "../../graphQL/quries";
import { modifyCategories } from "../../reducers/CategoryReducer";
import Notiflix from 'notiflix';

type Props = {
    hidden: boolean
    context: {
        title: string
        message: string
    }
    close: () => void
}

const D_CategoryModal: React.FunctionComponent<Props> = ({ hidden, context, close }: Props) => {
    const dispatch = useDispatch();
    const { selectedCategory, refetch } = useSelector((state: RootState) => state.CategoryReducer)
    const [ deleteCategory, { error }] = useMutation(DELETE_REMOVE_CATEGORY, { variables: { id: selectedCategory.id }, awaitRefetchQueries: true })
    if (error) return <Error msg={error.message} />
    
    const CALL_DELETE_CATEGORY_API = async () => {
        if (selectedCategory) {
            Notiflix.Loading.Hourglass('카테고리 삭제중...');
            await deleteCategory()
                .then((res) => {
                    if (res && res.data && res.data.deleteCategory === 200) {
                        refetch && refetch()
                            .then(refetchResponse => {
                                if (refetchResponse.data)
                                    dispatch(modifyCategories(refetchResponse.data.categories));
                            });
                    }
                })
            close();
        }
    }
    
    return (
        <Modal open={!hidden} style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <div style={{ width: '400pt', background: '#FFF 0% 0% no-repeat padding-box', height: '120pt', padding: '8pt' }}>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ color: '#000', fontSize: '11pt', fontWeight: 'bold' }}>
                        { `< ${context.title} >`}
                    </p>
                    <CloseOutlined style={{ cursor: 'pointer', color: '#d64161' }} fontSize={"large"} color={"primary"} onClick={() => close()} />
                </div>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', paddingLeft: '8pt', paddingRight: '8pt' }}>
                    <span style={{ color: 'red', fontSize: '14pt', fontWeight: 600 }}>
                        {context.message}
                    </span>
                    <Button style={{ width: '100%', height: '30pt', backgroundColor: 'red', marginTop: '12pt' }}
                            onClick={() => CALL_DELETE_CATEGORY_API().then(() => Notiflix.Loading.Remove(300))}>
                        <span style={{ color: '#FFF', fontSize: '11pt', fontWeight: 'bold' }}>
                            삭제하기
                        </span>
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default D_CategoryModal;