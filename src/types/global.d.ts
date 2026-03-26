declare namespace JSX {
  interface Element {}
  interface ElementClass {}
  interface IntrinsicAttributes {
    key?: string | number;
  }
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

declare module 'react' {
  export type ReactNode = any;
  export function useEffect(effect: () => void | (() => void), deps?: unknown[]): void;
  export function useMemo<T>(factory: () => T, deps: unknown[]): T;
  export function useState<T>(initialState: T): [T, (value: T | ((current: T) => T)) => void];
}

declare module 'react-native' {
  export const Pressable: any;
  export const SafeAreaView: any;
  export const ScrollView: any;
  export const StatusBar: any;
  export const StyleSheet: { create: <T>(styles: T) => T };
  export const Text: any;
  export const TextInput: any;
  export const View: any;
}

declare module 'expo-linear-gradient' {
  export const LinearGradient: any;
}

declare const process: {
  env: Record<string, string | undefined>;
};

declare function fetch(input: string): Promise<{
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
}>;

declare function setInterval(handler: () => void, timeout?: number): number;
declare function clearInterval(handle?: number): void;
