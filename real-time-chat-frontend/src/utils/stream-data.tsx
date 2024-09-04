
async function streamDataFromReader(reader: ReadableStreamDefaultReader<Uint8Array>, onData: (data: string) => void, onEror: ((e: any) => void) | null = null) {
    const decoder = new TextDecoder('utf-8');
    while(true) {
        const { done, value } = await reader?.read();
        if (done) break;
        try {
            onData(decoder.decode(value));
        }
        catch (e: any) {
            if (onEror !== null)
                onEror(e)
        }
    }
}

export { streamDataFromReader }