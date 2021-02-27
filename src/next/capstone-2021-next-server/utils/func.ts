const regex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;

export const parseYoutube = (url: string) => {
    const match = url.match(regex);
    return (match && match[7].length === 11) ? match[7] : '';
}