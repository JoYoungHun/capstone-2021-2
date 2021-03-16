import { gql } from "@apollo/client";

export const GET_USERS = gql`
    query allUsers($pr: PaginationInput!, $authority: String) {
        allUsers(pr: $pr, authority: $authority) {
            users {
                id
                name
                email
                authority
                created
            }
            totalElements
        }
    }  
`;

export const GET_MY_DETAIL = gql`
    query myInfo {
        myInfo{
            id
            email
            name
            authority
            created
            profile {
                id
                url
            }
        }
    }
`

export const GET_USER_DETAIL = gql`
    query user {
        user {
            id
            email
            name
            authority
        }
    }
`

export const GET_CATEGORY = gql`
    query category($id: Int!) {
        category(id: $id) {
            id
            name
            content {
                id
                title
                ref
            }
        }
    }
`

export const GET_CATEGORIES = gql`
    query categories {
        categories {
            id
            name
            content {
                id
                title
                ref
            }
        }
    }
`

export const GET_TRANSLATE = gql`
    query translate($q: String!, $idx: Int!) {
        translate(q: $q, idx: $idx) {
            translated
            idx
        }
    }
`

export const POST_LOGIN = gql`
    query login($id: String!, $password: String!) {
        login(id: $id, password: $password) {
            status
            token
        }
    }
`

export const POST_SIGN = gql`
    mutation sign($id: String!, $password: String!, $name: String!) {
        sign(id: $id, password: $password, name: $name)
    }
`

export const POST_CREATE_CATEGORY = gql`
    mutation createCategory($title: String!) {
        createCategory(title: $title)
    }
`

export const PUT_UPDATE_CATEGORY = gql`
    mutation updateCategory($id: Int!, $title: String!) {
        updateCategory(id: $id, title: $title)
    }   
`

export const DELETE_REMOVE_CATEGORY = gql`
    mutation deleteCategory($id: Int!) {
        deleteCategory(id: $id)
    }   
`

export const POST_CREATE_CONTENT = gql`
    mutation createContent($input: ContentInput!) {
        createContent(input: $input) {
            status
            message
        }
    }   
`

export const GET_PARSE = gql`
    query parse($captions: String!) {
        parse(captions: $captions) {
            sentences {
                eng
                kor
            }
            words {
                eng
                kor
                pos
            }
        }
    }
`

export const GET_CONTENTS = gql`
    query allContents($category: Int!, $pr: PaginationInput!, $option: Int) {
        allContents(category: $category, pr: $pr, option: $option) {
            contents {
                id
                title
                ref
                registerer {
                    id
                    name
                }
                category {
                    id
                    name
                }
                words {
                    id
                }
                sentences {
                    id
                }
            }
            totalElements
        }
    }
`

export const DELETE_REMOVE_CONTENT = gql`
    mutation deleteContent($id: Int!) {
        deleteContent(id: $id) {
            status
            message
        }
    }
`

export const PUT_UPDATE_CONTENTS_IN_CATEGORY = gql`
    mutation saveContentsToCategory($category: Int!, $id: [Int!]!) {
        saveContentsToCategory(category: $category, id: $id) {
            status
            message
        }
    }  
`

export const DELETE_REMOVE_CONTENT_IN_CATEGORY = gql`
    mutation deleteContentsInCategory($category: Int!, $id: Int!) {
        deleteContentsInCategory(category: $category, id: $id) {
            status
            message
        }
    }
`

export const PUT_UPDATE_USER_AUTHORITY = gql`
    mutation updateUserAuthority($id: Long!, $authority: String!) {
        updateUserAuthority(id: $id, authority: $authority) {
            status
            message
        }
    }
`

export const DELETE_REMOVE_USER = gql`
    mutation deleteUser($id: Long!) {
        deleteUser(id: $id) {
            status
            message
        }
    }   
`

export const PUT_UPDATE_USER_INFO = gql`
    mutation updateUserInfo($input: UpdateUserInput!) {
        updateUserInfo(input: $input) {
            status
            message
        }
    }   
`

export const GET_CONTENT_SUMMARY = gql`
    query summary($content: Long!, $level: Int!, $page: Int!) {
        summary(content: $content, level: $level, page: $page) {
            shells {
                originalText
                translatedKor
                tokens {
                    eng
                    kor
                    pos
                    highlight
                }
            }
            totalPages
        }
    }
`

export const GET_CONTENT = gql`
    query content($id: Long!) {
        content(id: $id) {
            id
            title
            ref
        }
    }
`

export const GET_WORDS = gql`
    query allWords($id: Long!) {
        allWords(id: $id) {
            status
            problems {
                id
                eng
                kor
            }
        }
    }
`

export const GET_SENTENCES = gql`
    query allSentences($id: Long!) {
        allSentences(id: $id) {
            status
            problems {
                id
                eng
                kor
            }
        }
    }
`

export const GET_CHOICES = gql`
    query choices($option: Int!, $except: Long!) {
        choices(option: $option, except: $except) {
            status
            problems {
                id
                eng
                kor
            }
        }
    }
`

export const POST_REWRITE_REPORT = gql`
    mutation rewrite($input: ReportInput!) {
        rewrite(input: $input) {
            status
            message
        }
    }
`