const MODIFY_THEME = 'modify/theme' as const

type ThemeState = {
    isDarkTheme: boolean
}

type ThemeActions = ReturnType<typeof modifyThemeColor>;

const initialState = {
    isDarkTheme: false
}

export const modifyThemeColor = () => ({
    type: MODIFY_THEME,
    payload: initialState
})

const ThemeReducer = (state: ThemeState = initialState, { type, payload }: ThemeActions) => {
    switch (type) {
        case MODIFY_THEME:
            return {
                isDarkTheme: !payload.isDarkTheme
            }
        default:
            return {
                ...state
            }
    }
}

export default ThemeReducer;