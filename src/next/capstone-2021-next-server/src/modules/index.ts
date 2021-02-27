import { combineReducers } from 'redux';
import { ThemeReducer, CategoryReducer, AppNavReducer, ContReducer } from "../reducers";

const reducer = combineReducers({
    ThemeReducer, CategoryReducer, AppNavReducer, ContReducer
});
export default reducer;
export type RootState = ReturnType<typeof reducer>