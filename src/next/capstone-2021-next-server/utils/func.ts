import { SERVER_ADDRESS } from "../src/env";

const regex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;

export const parseYoutube = (url: string) => {
    const match = url.match(regex);
    return (match && match[7].length === 11) ? match[7] : '';
}

export const getWordUploadExcelFormat = (key?: number) => {
    window.open(`${SERVER_ADDRESS}/file/excel/format${key !== undefined ? `?contents=${key}` : ``}`)
}