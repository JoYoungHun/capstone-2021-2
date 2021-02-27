export type User = {
    id: number
    email: string
    name: string
    profile?: string
    authority: string
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
}

export type CategoryWithCont = {
    id: number,
    name: string,
    contents: Content[]
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
}