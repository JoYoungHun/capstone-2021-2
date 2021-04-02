import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    makeStyles,
    Paper,
    Table,
    TableContainer,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
    Button, TablePagination, Checkbox, FormControlLabel
} from "@material-ui/core";
import { ArrowDropDownCircleRounded, ListRounded, RemoveCircleRounded, DeleteRounded } from "@material-ui/icons";
import { useLazyQuery, useMutation } from "@apollo/client";
import { RootState } from "../modules";
import {
    DELETE_REMOVE_CONTENT_IN_CATEGORY,
    GET_CATEGORY,
    GET_CONTENTS,
    PUT_UPDATE_CONTENTS_IN_CATEGORY
} from "../graphQL/quries";
import { ContentDetails, Paginate } from "../types";
import { Loading, SimpleContCard } from "../components";
import { selectCategory } from "../reducers/CategoryReducer";
import Notiflix from 'notiflix';
import {routeHttpStatus} from "../../utils/func";
import {NextRouter} from "next/dist/client/router";
import {useRouter} from "next/router";

type Props = {

}

type PaginateProps = {
    pageProps: Paginate
    hidden: boolean,
    selected: number[]
}

const useStyles = makeStyles({
    table: {
        minWidth: '700pt',
    },
});

const PutContIntoCtgContainer: React.FunctionComponent<Props> = ({ }) => {
    const classes = useStyles();
    const router: NextRouter = useRouter();
    const dispatch = useDispatch();
    const { selectedCategory } = useSelector((state: RootState) => state.CategoryReducer);
    const [ hiddenViewState, setHiddenViewState ] = React.useState<PaginateProps>({
        pageProps: {
            page: 1,
            renderItem: 10,
        },
        hidden: true,
        selected: []
    })
    let { pageProps, hidden, selected } = hiddenViewState;

    React.useEffect(() => {
        allContents({ variables: { pr: { ...pageProps }, option: 1, category: selectedCategory.id }})
    }, [ pageProps ])

    React.useEffect(() => {
        setHiddenViewState({ pageProps: { ...pageProps, page: 1 }, hidden: true, selected: [] })
    }, [ selectedCategory ])

    const [ allContents, { data, loading }] = useLazyQuery(GET_CONTENTS, { fetchPolicy: 'network-only' })

    const toggleHiddenDiv = async () => {
        if (hidden) {
            await allContents( { variables: { category: selectedCategory.id, pr: { ...pageProps }, option: 1 }});
        }
        setHiddenViewState({ ...hiddenViewState, hidden: !hidden });
    }

    const toggleCheckBox = (selectedId: number) => {
        let temporary: number[] = selected;
        if (selected.includes(selectedId)) {
            const located = selected.indexOf(selectedId)
            temporary = [ ...temporary.slice(0, located), ...temporary.slice(located + 1, temporary.length) ];
        } else {
            temporary.push(selectedId);
        }
        setHiddenViewState({ ...hiddenViewState, selected: [ ...temporary ]});
    }

    const onUpdateContentsInCtg = async () => {
        const ids: number[] = [ ...selectedCategory.content.map((ct: { id: number, title: string, ref: string }) => ct.id), ...selected ]
        Notiflix.Loading.Hourglass('Saving changes...');
        await saveContentsToCategory({ variables: { category: selectedCategory.id, id: ids }})
    }

    const onDeleteContentInCtg = async (delId: number) => {
        Notiflix.Loading.Hourglass('Saving changes...');
        await deleteContentsInCategory({ variables: { category: selectedCategory.id, id: delId }})
    }

    const [ saveContentsToCategory, { } ] = useMutation(PUT_UPDATE_CONTENTS_IN_CATEGORY, { onCompleted: async (response) => {
            if (response.saveContentsToCategory && response.saveContentsToCategory.status === 200) {
                await new Promise((resolve) => {
                    category({ variables: { id: selectedCategory.id }})
                    resolve(true);
                }).then(() => setHiddenViewState({ pageProps: { ...pageProps, page: 1 }, hidden: true, selected: [] }))
            } else routeHttpStatus(router, response.saveContentsToCategory.status, response.saveContentsToCategory.message);
        }});

    const [ deleteContentsInCategory, { } ] = useMutation(DELETE_REMOVE_CONTENT_IN_CATEGORY, { onCompleted: async (response) => {
            if (response.deleteContentsInCategory && response.deleteContentsInCategory.status === 200) {
                category({ variables: { id: selectedCategory.id }})
            } else routeHttpStatus(router, response.deleteContentsInCategory.status, response.deleteContentsInCategory.message);
        }})

    const [ category, { } ] = useLazyQuery(GET_CATEGORY, { onCompleted: response => {
            if (response.category) {
                dispatch(selectCategory(response.category))
            }
            // disable caching
        }, fetchPolicy: 'network-only' });

    return (
        <React.Fragment>
            <div style={{ width: '100%', fontFamily: 'sans-serif', marginBottom: '16pt' }}>
                <div style={{ width: '100%' }}>
                    <div style={{ width: '300pt', display: 'flex', alignItems: 'center' }}>
                        <ListRounded fontSize={'large'} />
                        <span style={{ fontSize: '11pt', fontWeight: 'bold', marginTop: '2pt', marginLeft: '8pt' }}>
                            등록된 컨텐츠
                        </span>
                    </div>
                    <div className={"ovf"} style={{ border: 0, boxShadow: '0px 3px 6px #0000029', width: '700pt', height: '200pt', overflow: 'auto', marginTop: '8pt' }}>
                        <TableContainer component={Paper}>
                            <Table className={classes.table} size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Title</TableCell>
                                        <TableCell align="right">ref</TableCell>
                                        <TableCell align="right" />
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        selectedCategory && selectedCategory.content.length > 0 && selectedCategory.content.map(
                                            (ct: { id: number, title: string, ref: string }) => (
                                            <TableRow key={ct.id}>
                                                <TableCell component="th" scope="row">
                                                    {ct.title}
                                                </TableCell>
                                                <TableCell align="right"><a href={ct.ref}>{ct.ref}</a></TableCell>
                                                <TableCell align="center">
                                                    <DeleteRounded onClick={() => onDeleteContentInCtg(ct.id).then(() => Notiflix.Loading.Remove(1000))}
                                                                   style={{ cursor: 'pointer' }} />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '16pt' }}>
                    {
                        !hidden ?
                            <RemoveCircleRounded fontSize={'large'} style={{ cursor: 'pointer'}} onClick={() => toggleHiddenDiv()} />
                            :
                            <ArrowDropDownCircleRounded fontSize={'large'} style={{ cursor: 'pointer'}} onClick={() => toggleHiddenDiv()} />
                    }
                    <span style={{ fontSize: '14pt', fontWeight: 'bold', marginLeft: '8pt' }}>
                        컨텐츠 추가하기
                    </span>
                </div>
                {
                    !hidden &&
                        <React.Fragment>
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <Button style={{ background: '#FFE94A 0% 0% no-repeat padding-box', boxShadow: '0px 3px 6px #00000029', border: 0 }}
                                        onClick={() => onUpdateContentsInCtg().then(() => Notiflix.Loading.Remove(1000))}>
                                    <span style={{ fontFamily: 'sans-serif', fontWeight: 'bold' }}>
                                        저장하기
                                    </span>
                                </Button>
                            </div>
                            <div className={"ovf"} style={{ width: '100%', height: '500pt', overflowY: 'auto', boxShadow: '0p 3px 6px #00000029',
                                border: '0.25px solid #00000029', borderRadius: '6pt', marginTop: '8pt' }}>
                                {
                                    loading &&
                                        <Loading />
                                }
                                {
                                    data && data.allContents && data.allContents.contents.length > 0 &&
                                        <div style={{ width: '100%', padding: '8pt' }}>
                                            <span style={{ fontSize: '9pt', fontWeight: 'lighter' }}>
                                                새로운 컨텐츠를 카테고리에 추가해보세요.
                                            </span>
                                            <div style={{ paddingLeft: '8pt' }}>
                                                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                                    {
                                                        data.allContents.contents && data.allContents.contents.map((cont: ContentDetails, index: number) => (
                                                            <div style={{ display: 'flex', alignItems: 'center' }} onClick={()=> toggleCheckBox(cont.id)}>
                                                                <FormControlLabel
                                                                    style={{ width: '20pt', height: '20pt'}}
                                                                    control={
                                                                        <Checkbox
                                                                            checked={selected.includes(cont.id)}
                                                                            name="checkedB"
                                                                            color="primary"
                                                                        />
                                                                    }
                                                                    label=""
                                                                />
                                                                <SimpleContCard details={cont} />
                                                                { index > 0 && index % 3 === 0 && <br />}
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                    <TablePagination
                                                        style={{ width: '400pt' }}
                                                        component={"div"}
                                                        count={data.allContents.totalElements ? data.allContents.totalElements : 0}
                                                        page={pageProps.page - 1}
                                                        onChangePage={(_, e) => {
                                                            setHiddenViewState({ ...hiddenViewState, pageProps: { ...pageProps, page: e + 1 }})}}
                                                        rowsPerPage={pageProps.renderItem}
                                                        onChangeRowsPerPage={(e) => {
                                                            setHiddenViewState({ ...hiddenViewState,
                                                                pageProps: { ...pageProps, renderItem: parseInt(e.target.value)}})}}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                }
                            </div>
                        </React.Fragment>
                }
            </div>
        </React.Fragment>
    )
}

export default PutContIntoCtgContainer;