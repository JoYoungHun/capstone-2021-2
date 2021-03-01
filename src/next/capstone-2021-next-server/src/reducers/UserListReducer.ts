import { User } from "../types";

const STORE_USER_LIST = 'store/user/list' as const
const STORE_USER_AUTHORITY = 'store/user/authority' as const

type UserListActions = ReturnType<typeof storeUserList>
    | ReturnType<typeof storeAuthority>;

type UserListProps = {
    refetch?: Promise<any> | undefined
    page: number,
    renderItem: number,
    sort?: string,
    items: User[]
    totalElements: number,
    selectedAuthority: string | null,
}

const initialState = {
    refetch: undefined,
    page: 1,
    renderItem: 10,
    items: [],
    totalElements: 0,
    selectedAuthority: null
}

export const storeUserList = ( payload: UserListProps ) => ({
    type: STORE_USER_LIST,
    payload: payload
})

export const storeAuthority = ( authority: string ) => ({
    type: STORE_USER_AUTHORITY,
    payload: authority
})

export const UserListReducer = (state: UserListProps = initialState, { type, payload }: UserListActions) => {
    switch (type) {
        case STORE_USER_LIST:
            if (payload instanceof Object) {
                return {
                    ...state,
                    ...payload
                }
            } else return {
                ...state
            }
        case STORE_USER_AUTHORITY:
            return {
                ...state,
                selectedAuthority: payload
            }
        default:
            return {
                ...state
            }
    }
}

export default UserListReducer;