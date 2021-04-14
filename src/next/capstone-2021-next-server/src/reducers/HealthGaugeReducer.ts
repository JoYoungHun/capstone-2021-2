const GAIN_HP = 'health/hp/gain' as const;
const LOSE_HP = 'health/hp/loss' as const;
const SET_OFFSET = 'health/set/offset' as const;

type HealthGaugeActions = ReturnType<typeof gainHealthPower>
    | ReturnType<typeof loseHealthPower>
    | ReturnType<typeof settingOffset>;

type HealthState = {
    hp: number,
    offset: number,
}

const initialState: HealthState = {
    hp: 100,
    offset: 5,
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

const HealthGaugeReducer = (state: HealthState = initialState, { type, payload }: HealthGaugeActions) => {
    switch (type) {
        case GAIN_HP:
            let cured: number = state.hp + state.offset > 100 ? 100 : state.hp + state.offset;
            return {
                ...state,
                hp: cured
            }
        case LOSE_HP:
            let damaged: number = state.hp - state.offset < 0 ? 0 : state.hp - state.offset;
            return {
                ...state,
                hp: damaged
            }
        case SET_OFFSET:
            return {
                hp: 70,
                offset: payload > 0 ? payload : 8,
            }
        default:
            return {
                ...state
            }
    }
}

export default HealthGaugeReducer;