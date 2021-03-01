export type User = {
    id: number
    email: string
    name: string
    profile?: string
    authority: string
    created?: string
}

export type City = {
    id: number
    name: string
    population: number
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
    kor: string
}

export type ContFrame = {
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