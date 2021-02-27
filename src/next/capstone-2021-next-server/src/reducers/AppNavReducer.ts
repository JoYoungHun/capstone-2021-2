const MODIFY_NAV_TAB = 'modify/app/tab' as const

type AppNavState = {
    value: number
}

type AppNavActions = ReturnType<typeof modifyAppTabs>;

const initialState = {
    value: 0,
}

export const modifyAppTabs = (modifiedAppTab: number) => ({
    type: MODIFY_NAV_TAB,
    payload: modifiedAppTab
})

const AppNavReducer = (state: AppNavState = initialState, { type, payload }: AppNavActions) => {
    switch (type) {
        case MODIFY_NAV_TAB:
            return {
                value: payload
            }
        default:
            return {
                ...state
            }
    }
}

export default AppNavReducer;