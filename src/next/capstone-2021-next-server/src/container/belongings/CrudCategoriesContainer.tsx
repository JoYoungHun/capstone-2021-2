import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Button } from '@material-ui/core'
import { RootState } from "../../modules";
import { Category } from "../../types";
import { CU_CategoryModal, D_CategoryModal } from "../../components/modals";
import { selectCategory } from "../../reducers/CategoryReducer";

type Props = {
    create: (s: string) => void
}

type BtnProps = {
    label: string,
    width?: string,
    height?: string,
    onClick?: () => void
    background?: string
}

type HiddenProps = {
    hideCreateModal: boolean,
    hideUpdateModal: boolean,
    hideDeleteModal: boolean,
}

const CrudCategoriesContainer = ({ create }: Props) => {
    const dispatch = useDispatch();
    const { categories } = useSelector((state: RootState) => state.CategoryReducer);
    const [ hidden, setHidden ] = React.useState<HiddenProps>({
        hideCreateModal: true,
        hideUpdateModal: true,
        hideDeleteModal: true,
    });
    let { hideCreateModal, hideUpdateModal, hideDeleteModal } = hidden;

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

    return (
        <React.Fragment>
            <div style={{ }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '8pt' }}>
                    { Btn({ label: '등록', width: '60pt', height: '30pt',
                        onClick: () => setHidden({ ...hidden, hideCreateModal: !hideCreateModal }) }) }
                </div>
                <Paper style={{ width: '100%' }}>
                    <Table style={{ minWidth: '700px'}}>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ fontWeight: 'bold' }}>카테고리명</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }} align="right">등록된 컨텐츠 개수</TableCell>
                                <TableCell align="right" />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            { categories && categories.map((row: Category) => (
                                <TableRow key={row.id}>
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="right">{30}</TableCell>
                                    <TableCell align="right" style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                                        { Btn({ label: '수정', background: '#FFE94A',
                                            onClick: () => { dispatch(selectCategory(row)); setHidden({ ...hidden, hideUpdateModal: false}); } }) }
                                        { Btn({ label: '삭제', background: 'gray',
                                            onClick: () => { dispatch(selectCategory(row)); setHidden({ ...hidden, hideDeleteModal: false }); }}) }
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </div>
            {
                !hideCreateModal &&
                    <CU_CategoryModal hidden={hideCreateModal} close={() => setHidden({ ...hidden, hideCreateModal: !hideCreateModal })} create={create} />
            }
            {
                !hideUpdateModal &&
                    <CU_CategoryModal hidden={hideUpdateModal} close={() => setHidden({ ...hidden, hideUpdateModal: !hideUpdateModal })} option={'카테고리 수정'} />
            }
            {
                !hideDeleteModal &&
                    <D_CategoryModal hidden={hideDeleteModal} close={() => setHidden({ ...hidden, hideDeleteModal: !hideDeleteModal })}
                                     context={{ title: '카테고리 삭제', message: '카테고리를 삭제하시겠습니까?'}} />
            }
        </React.Fragment>
    )
}

export default CrudCategoriesContainer;