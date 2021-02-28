import { Paragraph, ContFrame } from "../types";

const STORE_FRAME = 'store/frame' as const
const STORE_WORD = 'store/word' as const
const STORE_SENTENCE = 'store/sentence' as const
const INITIALIZE_CONTENT = 'initialize/content' as const
const STORE_CONTENT = 'store/content' as const

type ContActions = ReturnType<typeof storeFrame>
    | ReturnType<typeof storeWord>
    | ReturnType<typeof storeSentence>
    | ReturnType<typeof initializeContent>
    | ReturnType<typeof storeContent>;

type ContentState = {
    frame: ContFrame
    words: Paragraph[],
    sentences: Paragraph[]
}

const initialState: ContentState = {
    frame: {
        ref: '',
        title: '',
        captions: '',
        categories: []
    },
    words: [],
    sentences: []
}

export const storeFrame = ({ title, ref, captions, categories }: ContFrame) => ({
    type: STORE_FRAME,
    payload: { frame: { title, ref, captions, categories} }
});

export const storeWord = ( words: Paragraph[] ) => ({
    type: STORE_WORD,
    payload: words
})

export const storeSentence = ( sentences: Paragraph[] ) => ({
    type: STORE_SENTENCE,
    payload: sentences
})

export const initializeContent = () => ({
    type: INITIALIZE_CONTENT,
    payload: undefined
})

export const storeContent = ( content: ContentState ) => ({
    type: STORE_CONTENT,
    payload: content
})

const ContReducer = (state: ContentState = initialState, { type, payload }: ContActions) => {
    switch (type) {
        case STORE_FRAME:
            return {
                ...state,
                ...payload
            }
        case STORE_WORD:
            return {
                ...state,
                words: payload
            }
        case STORE_SENTENCE:
            return {
                ...state,
                sentences: payload
            }
        case INITIALIZE_CONTENT:
            return {
                frame: {
                    ref: '',
                    title: '',
                    captions: '',
                    categories: []
                },
                words: [],
                sentences: []
            }
        case STORE_CONTENT:
            return {
                ...state,
                ...payload
            }
        default:
            return {
                ...state
            }
    }
}

export default ContReducer;