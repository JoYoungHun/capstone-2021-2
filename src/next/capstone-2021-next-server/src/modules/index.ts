import { combineReducers } from 'redux';
import { ThemeReducer, CategoryReducer, AppNavReducer, ContReducer, ContListReducer } from "../reducers";

const reducer = combineReducers({
    ThemeReducer, CategoryReducer, AppNavReducer, ContReducer, ContListReducer
});
export default reducer;
export type RootState = ReturnType<typeof reducer>