declare function useBroadcastChannel<T>(channelName: string): (T | ((message: T) => void) | undefined)[];
export default useBroadcastChannel;
