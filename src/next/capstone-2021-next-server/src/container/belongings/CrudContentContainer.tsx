import React from 'react';
import { useSelector } from 'react-redux';
import { ContentDetails } from "../../types";
import {RootState} from "../../modules";
import {Divider, TablePagination} from '@material-ui/core';
import ContCard from "../../components/ContCard";
import {D_ContentModal} from "../../components/modals";

type Props = {
    page: number
    renderItem: number
    onMovePage: ( move: number ) => void
    onModifyRenderItems: ( modified: number ) => void
    reRenderContentList: () => void
}

type ModalProps = {
    selected?: number,
    hidden: boolean
    context: {
        title: string,
    }
}

const CrudContentContainer: React.FunctionComponent<Props> = ({ page, renderItem, onMovePage, onModifyRenderItems, reRenderContentList }) => {
    const { items } = useSelector((state: RootState) => state.ContListReducer);
    const [ modalState, setModalState ] = React.useState<ModalProps>({
        selected: undefined,
        hidden: true,
        context: {
            title: '',
        }
    })

    const openDeleteModal = ( requestCardId: number, title: string ) => {
        if (items.map((item: ContentDetails) => item.id === requestCardId).length < 1) return;
        setModalState({ hidden: false, selected: requestCardId, context: { title } })
    }

    const refreshDeleteModal = () => {
        setModalState({ hidden: true, selected: undefined, context: { title: '' } })
    }

    return (
        <div style={{ width: '100%', marginBottom: '16pt' }}>
            <Divider variant={'fullWidth'} orientation={'horizontal'} />
            <div style={{ width: 'calc(100% - 16pt)', paddingLeft: '8pt', paddingRight: '8pt'}}>
                {
                    items.map((item: ContentDetails) => (
                        <ContCard key={item.id} details={item} openDeleteModal={openDeleteModal} />
                    ))
                }
            </div>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <TablePagination
                    style={{ width: '200pt' }}
                    component={"div"}
                    count={items.length}
                    page={page - 1}
                    onChangePage={(_, e) => onMovePage(e)}
                    rowsPerPage={renderItem}
                    onChangeRowsPerPage={(e) => onModifyRenderItems(parseInt(e.target.value))}
                />
            </div>
            {
                !modalState.hidden &&
                    <D_ContentModal hidden={modalState.hidden}
                                    context={{
                                        id: modalState.selected,
                                        title: modalState.context.title,
                                        message: `컨텐츠 ${modalState.context.title}를 정말로 삭제하시겠습니까?`
                                    }}
                                    reRenderContentList={reRenderContentList} close={refreshDeleteModal} />
            }
        </div>
    )
}

export default CrudContentContainer;