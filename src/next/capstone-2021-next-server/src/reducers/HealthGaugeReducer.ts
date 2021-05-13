const GAIN_HP = 'health/hp/gain' as const;
const LOSE_HP = 'health/hp/loss' as const;
const SET_OFFSET = 'health/set/offset' as const;
const SET_TOTAL = 'health/set/total' as const;
const SET_CURRENT = 'health/set/current' as const;

type HealthGaugeActions = ReturnType<typeof gainHealthPower>
    | ReturnType<typeof loseHealthPower>
    | ReturnType<typeof settingOffset>
    | ReturnType<typeof settingTotal>
    | ReturnType<typeof settingCurrent>;

type HealthState = {
    hp: number,
    offset: number,
    total: number,
    current: number,
    score: number
}

const initialState: HealthState = {
    hp: 100,
    offset: 5,
    total: 0,
    current: 0,
    score: 0,
}

export const gainHealthPower = () => ({
    type: GAIN_HP,
    payload : { }
})

export const loseHealthPower = () => ({
    type: LOSE_HP,
    payload: { },
})

export const settingOffset = (offset: number) => ({
    type: SET_OFFSET,
    payload: offset,
})

export const settingTotal = (total: number) => ({
    type: SET_TOTAL,
    payload: total,
})

export const settingCurrent = (current: number) => ({
    type: SET_CURRENT,
    payload: current,
})

const HealthGaugeReducer = (state: HealthState = initialState, { type, payload }: HealthGaugeActions) => {
    switch (type) {
        case GAIN_HP:
            let cured: number = state.hp + state.offset > 100 ? 100 : state.hp + state.offset;
            return {
                ...state,
                score: state.score + 10,
                hp: cured,
            }
        case LOSE_HP:
            let damaged: number = state.hp - state.offset < 0 ? 0 : state.hp - state.offset;
            return {
                ...state,
                score: state.score - 5 > 0 ? state.score - 5 : 0,
                hp: damaged,
            }
        case SET_OFFSET:
            return {
                hp: 70,
                offset: payload > 0 ? payload : 8,
                total: 0,
                current: 0,
                score: 0,
            }
        case SET_TOTAL:
            return {
                ...state,
                total: payload,
            }
        case SET_CURRENT:
            return {
                ...state,
                current: payload
            }
        default:
            return {
                ...state
            }
    }
}

export default HealthGaugeReducer;