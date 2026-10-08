import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export const useShopReady = () => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
