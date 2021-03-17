const STORE_REPORT_ID = 'store/report' as const;

type ReportActions = ReturnType<typeof storeReport>;

type ReportState = {
    id?: number
}

const initialState: ReportState = {
    id: undefined
}

export const storeReport = (id: number) => ({
    type: STORE_REPORT_ID,
    payload: id,
})

const ReportReducer = (state: ReportState = initialState, { type, payload }: ReportActions) => {
    switch (type) {
        case STORE_REPORT_ID:
            return {
                ...state,
                id: payload
            };
        default:
            return {
                ...state
            };
    }
}

export default ReportReducer;