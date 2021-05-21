import { SERVER_ADDRESS } from "../src/env";
import { NextRouter } from "next/dist/client/router";
import Notiflix from 'notiflix';

const regex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;

export const parseYoutube = (url: string) => {
    const match = url.match(regex);
    return (match && match[7].length === 11) ? match[7] : '';
}

export const getWordUploadExcelFormat = (key?: number) => {
    window.open(`${SERVER_ADDRESS}/file/excel/format${key !== undefined ? `?contents=${key}` : ``}`)
}

export const routeHttpStatus = (router: NextRouter, code: number | undefined, message: string | undefined) => {
    try {
        if (code && code === 401) {
            router.push('/login').then(() => Notiflix.Report.Failure('Session Timeout!', '세션이 만료됐거나, 로그인 된 상태가 아닙니다.', 'OK! I will check.'));
        } else if (code && code === 406) {
            router.push('/home').then(() => Notiflix.Notify.Failure('접근 권한이 없습니다.'));
        } else Notiflix.Notify.Failure(message);
    } finally {
        Notiflix.Loading.Remove(500);
    }
}