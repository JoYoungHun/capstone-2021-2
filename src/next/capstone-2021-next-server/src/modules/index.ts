import { combineReducers } from 'redux';
import {
    ThemeReducer,
    CategoryReducer,
    AppNavReducer,
    ContReducer,
    ContListReducer,
    UserListReducer,
    ProbReducer,
    ReportReducer } from "../reducers";

const reducer = combineReducers({
    ThemeReducer, CategoryReducer, AppNavReducer, ContReducer, ContListReducer, UserListReducer, ProbReducer, ReportReducer
});
export default reducer;
export type RootState = ReturnType<typeof reducer>