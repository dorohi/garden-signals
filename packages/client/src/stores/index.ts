import { createContext, useContext } from 'react';
import rootStore, { RootStore } from './RootStore';

export const StoreContext = createContext<RootStore>(rootStore);
export const useStore = () => useContext(StoreContext);
export { rootStore };
