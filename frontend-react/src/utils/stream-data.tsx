
async function streamDataFromReader({reader, onData, onComplate, onEror}:{reader: ReadableStreamDefaultReader<Uint8Array>, onData: (data: string) => void, onComplate?: (() => void), onEror?: ((e: any) => void)}) {
    const decoder = new TextDecoder('utf-8');
    while (true) {
        const { done, value } = await reader?.read();
        if (done) break;
        try {
            onData(decoder.decode(value));
        }
        catch (e: any) {
            if (onEror)
                onEror(e)
        }
    }

    if (onComplate) {
        onComplate();
    }
}

export { streamDataFromReader }