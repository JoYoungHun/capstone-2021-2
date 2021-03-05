import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CategoryTabs, Error, Loading } from "../components";
import { modifyCategories } from "../reducers/CategoryReducer";
import { RootState } from "../modules";
import { useLazyQuery, useQuery} from "@apollo/client";
import { GET_CATEGORIES, GET_CONTENTS } from "../graphQL/quries";
import Notiflix from 'notiflix';
import { storeContentList } from "../reducers/ContListReducer";
import { Paginate } from "../types";
import { CrudContentContainer } from "./belongings";

type Props = {
    preventSSR: boolean
}

const ContentManagementContainer: React.FunctionComponent<Props> = ({ preventSSR }) => {
    const dispatch = useDispatch();
    const { categories } = useSelector((state: RootState) => state.CategoryReducer);
    const listStates = useSelector((state: RootState) => state.ContListReducer);
    const [ paginate, setPaginate ] = React.useState<Paginate>({
        page: 1,
        renderItem: 10,
    })

    const onMovePage = (move: number) => {
        if (move === paginate.page || (move < 1 || move > Math.ceil(listStates.items.length))) return;
        else setPaginate({ ...paginate, page: move });
    }

    const onModifyRenderItems = (modified: number) => {
        setPaginate({ ...paginate, renderItem: modified })
    }

    const [ currentIdx, setCurrentIdx ] = React.useState<number>(0);

    const modifyTab = (modify: number) => {
        if (modify >= 0 && modify <= categories.length && currentIdx !== modify) {
            setCurrentIdx(modify);
            setPaginate({ ...paginate, page: 1 })
        };
    }

    React.useEffect(() => {
        if (categories && !preventSSR) {
            Notiflix.Loading.Hourglass('Fetching contents...');
            allContents({ variables: { category: currentIdx === 0 ? -1 : categories[currentIdx - 1].id, pr: { ...paginate } } })
        }
    }, [ currentIdx, paginate ])

    const [ allContents, { refetch }] = useLazyQuery(GET_CONTENTS, { onCompleted: async (data) => {
        if (data.allContents) {
            await new Promise((resolve) => {
                dispatch(storeContentList({ ...listStates, items: data.allContents.contents, totalElements: data.allContents.totalElements }))
                resolve(true);
            }).then(() => Notiflix.Loading.Remove(500));
        }}, fetchPolicy: 'network-only' })

    const reRenderContentList = async () => {
        Notiflix.Loading.Hourglass('Fetching contents...');
        await refetch({ variables: { category: currentIdx === 0 ? -1 : categories[currentIdx - 1].id, pr: { ...paginate, page: 1 } }})
            .then(async (response) => {
                if (response.data.allContents) {
                    await new Promise((resolve) => {
                        dispatch(storeContentList({
                            ...listStates,
                            items: response.data.allContents.contents,
                            totalElements: response.data.allContents.totalElements }))
                        resolve(true);
                    }).then(() => Notiflix.Loading.Remove(500));
                }})
    }

    const { loading, error } = useQuery(GET_CATEGORIES,
        { onCompleted: response => dispatch(modifyCategories(response.categories)), fetchPolicy: 'network-only' });
    if (loading) return <Loading />
    else if (error) return <Error msg={error.message} />

    return (
        <React.Fragment>
            <CategoryTabs categories={categories} currentIdx={currentIdx} modifyTab={modifyTab} />
            <CrudContentContainer page={paginate.page} renderItem={paginate.renderItem}
                                  onMovePage={onMovePage} onModifyRenderItems={onModifyRenderItems}
                                  reRenderContentList={reRenderContentList} />
        </React.Fragment>
    )
}

export default ContentManagementContainer;