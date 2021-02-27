import { ContentDetails } from "../types";

const STORE_CONTENT_LIST = 'store/content/list' as const;

type ContListActions = ReturnType<typeof storeContentList>;

type ContentListProps = {
    page: number,
    renderItems: number,
    sort?: string,
    items: ContentDetails[]
}

const initialState : ContentListProps = {
    page: 1,
    renderItems: 10,
    items: []
}

export const storeContentList = ( payload: ContentListProps ) => ({
    type: STORE_CONTENT_LIST,
    payload: payload
});

const ContListReducer = (state: ContentListProps = initialState, { type, payload }: ContListActions) => {
    switch (type) {
        case STORE_CONTENT_LIST:
            return {
                ...state,
                ...payload
            }
        default:
            return {
                ...state
            };
    }
}

export default ContListReducer;