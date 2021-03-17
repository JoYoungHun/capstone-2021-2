export type User = {
    id: number
    email: string
    name: string
    profile?: {
        id: number,
        url: string,
    }
    authority: string
    created?: string
}

export type LoginType = {
    email: string
    password: string
}

export type SignUpType = {
    email: string,
    password: string,
    name: string,
    profile?: number,
}

export type Category = {
    id: number,
    name: string,
    content: {
        id: number,
        title: string,
        ref: string,
    }[]
}

export type Content = {
    id: number,
    category: Category[],
    title: string
}

export type Paragraph = {
    id?: number
    eng: string,
    kor: string,
    pos?: string,
}

export type ContFrame = {
    id?: number,
    ref: string,
    title: string,
    captions: string,
    categories: number[]
}

export type ContentDetails = {
    id: number,
    title: string,
    ref: string,
    words: Paragraph[],
    sentences: Paragraph[],
    registerer: User,
    category: Category[],
}

export type Paginate = {
    page: number,
    renderItem: number,
    sort?: string,
}

export type SummaryShell = {
    originalText: string,
    translatedKor: string,
    tokens: SummaryToken[]
}

export type SummaryToken = {
    eng: string,
    kor: string,
    pos: string,
    highlight: boolean
}

export type Solved = {
    id: number,
    eng: string,
    tried: number,
    passed: boolean
}

export type IndexProps = {
    currentIdx: number,
    tried: number,
}

export type PiePiece = {
    id: string,
    label: string,
    value: number,
    color: string,
}

export type BarPiece = {
    country: string,
    level1: number,
    level1Color: string,
    level2: number,
    level2Color: string,
    level3: number,
    level3Color: string,
    objective: number,
    objectiveColor: string,
    subjective: number,
    subjectiveColor: string,
}

export type RadarPiece = {
    taste: string,
    total: number,
    correct: number
}

export type ReportDetailsProps = {
    id: number,
    content: {
        id: number,
        title: string,
        ref: string
    },
    user: {
        id: number,
        name: string,
    },
    wordLen: number,
    sentenceLen: number,
    correctWordsLev1: number,
    correctWordsLev2: number,
    correctWordsLev3: number,
    correctSentencesLev1: number,
    correctSentencesLev2: number,
    passWordLev1: number,
    passWordLev2: number,
    passWordLev3: number,
    passSentenceLev1: number,
    passSentenceLev2: number
}

export type ReportHeaderProps = {
    id: number,
    content: {
        id: number,
        title: string,
    },
    created?: string,
    modified?: string,
}