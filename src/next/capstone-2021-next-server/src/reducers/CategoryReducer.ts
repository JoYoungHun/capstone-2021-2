import { Category } from "../types";

const MODIFY_CATEGORY = 'modify/category' as const
const SELECT_CATEGORY = 'select/category' as const
const STORE_REFETCH_API = 'store/refetch/category' as const

type CategoryState = {
    categories: Category[],
    selectedCategory: Category | undefined,
    refetch: Promise<any> | undefined,
}

type CategoryActions = ReturnType<typeof modifyCategories>
    | ReturnType<typeof selectCategory>
    | ReturnType<typeof storeRefetchApi>

const initialState: CategoryState = {
    categories: [],
    selectedCategory: undefined,
    refetch: undefined,
}

export const modifyCategories = (modified: Category[]) => ({
    type: MODIFY_CATEGORY,
    payload: modified
})

export const selectCategory = (selected: Category) => ({
    type: SELECT_CATEGORY,
    payload: selected
})

export const storeRefetchApi = (refetch: () => void) => ({
    type: STORE_REFETCH_API,
    payload: refetch
})

const CategoryReducer = (state: CategoryState = initialState, { type, payload }: CategoryActions) => {
    switch (type) {
        case MODIFY_CATEGORY:
            if (Array.isArray(payload))
                return {
                ...state,
                categories: [ ...payload ]
            }
            else return {
                ...state
            }
        case SELECT_CATEGORY:
            return {
                ...state,
                selectedCategory: payload
            }
        case STORE_REFETCH_API:
            return {
                ...state,
                refetch: payload
            }
        default:
            return {
                ...state
            }
    }
}

export default CategoryReducer;