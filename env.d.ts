/// <reference types="vite/client" />

declare module '*.vue' {
    import type { DefineComponent } from 'vue';
    type Props = Record<string, unknown>
    type RawBindings = Record<string, unknown>
    const component: DefineComponent<Props, RawBindings, unknown>;
    export default component;
  }
