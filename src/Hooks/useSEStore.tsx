import { useSyncExternalStore } from 'react';

const getDataSEStoreFromLocalStorage = (key: string): string => {
  return window.localStorage.getItem(key) || '';
};

const subscribe = (key: string, callback: () => void): (() => void) => {
  window.addEventListener(key, callback);

  return () => {
    window.removeEventListener(key, callback);
  };
};

const useSEStore = (key: string) => {
  const dataSEStore = useSyncExternalStore(
    (callback: () => void) => subscribe(key, callback),
    () => getDataSEStoreFromLocalStorage(key),
  );

  const setDataSEStore = (key: string, value: string) => {
    window.localStorage.setItem(key, value);
    window.dispatchEvent(new Event(key));
  };

  return { dataSEStore, setDataSEStore };
};

export default useSEStore;
