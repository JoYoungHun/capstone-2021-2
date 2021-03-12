import { Paragraph, Solved } from "../types";

const STORE_LEVEL = 'store/level' as const;
const STORE_PASSED = 'store/passed' as const;
const INITIALIZE_PROBLEMS = 'initialize/problems' as const;
const INITIALIZE_PROPS = 'initialize/props' as const;

type WordProbActions = ReturnType<typeof storeLevel>
    | ReturnType<typeof storePassedProblem>
    | ReturnType<typeof initializeProblems>
    | ReturnType<typeof initializeProps>;

type WordProblemProps = {
    level: number,
    problems: Paragraph[],
    choices: Paragraph[],
    passed: Solved[]
}

const initialState: WordProblemProps = {
    level: 0,
    problems: [],
    choices: [],
    passed: []
}

export const initializeProps = () => ({
    type: INITIALIZE_PROPS,
    payload: undefined
})

export const storeLevel = ( level: number ) => ({
    type: STORE_LEVEL,
    payload: level,
})

export const initializeProblems = ( problems: Paragraph[] ) => ({
    type: INITIALIZE_PROBLEMS,
    payload: problems,
})

export const storePassedProblem = ( passed: Solved[] ) => ({
    type: STORE_PASSED,
    payload: passed,
})

const ProbReducer = (state: WordProblemProps = initialState, { type, payload }: WordProbActions) => {
    switch (type) {
        case INITIALIZE_PROPS:
            return {
                level: 0,
                problems: [],
                choices: [],
                passed: []
            };
        case STORE_LEVEL:
            return {
                ...state,
                level: payload,
                passed: [],
            };
        case STORE_PASSED:
            if (Array.isArray(payload)) {
                return {
                    ...state,
                    passed: [ ...payload ]
                };
            } else return { ...state };
        case INITIALIZE_PROBLEMS:
            if (Array.isArray(payload)) {
                return {
                    ...state,
                    problems: [ ...payload ]
                };
            } else return { ...state };
        default:
            return {
                ...state
            }
    }
}

export default ProbReducer;