export const speakProps = {
    dispatchEvent(event: Event): boolean {
        return false;
    },
    lang: "",
    onboundary: undefined,
    onend: undefined,
    onerror: undefined,
    onmark: undefined,
    onpause: undefined,
    onresume: undefined,
    onstart: undefined,
    pitch: 0,
    rate: 0,
    voice: undefined,
    volume: 0,
    addEventListener(type, listener, options?: boolean | AddEventListenerOptions): void {
    },
    removeEventListener(type, callback, options?: EventListenerOptions | boolean): void {
    },
    queue: false,
    listeners: {
        onstart: () => {},
        onend: () => {},
        onresume: () => {},
        onboundary: () => {},
    }
}