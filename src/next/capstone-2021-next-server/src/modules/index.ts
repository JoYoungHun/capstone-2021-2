import { combineReducers } from 'redux';
import {
    ThemeReducer,
    CategoryReducer,
    AppNavReducer,
    ContReducer,
    ContListReducer,
    UserListReducer,
    ProbReducer,
    ReportReducer,
    HealthGaugeReducer
} from "../reducers";

const reducer = combineReducers({
    ThemeReducer, CategoryReducer, AppNavReducer, ContReducer, ContListReducer, UserListReducer, ProbReducer, ReportReducer, HealthGaugeReducer
});
export default reducer;
export type RootState = ReturnType<typeof reducer>