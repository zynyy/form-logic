import { createContext, Dispatch, SetStateAction, useContext } from 'react';

export interface ListLayoutValueContent {
  loading: boolean;
  cb: () => void;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

export const ListLayoutContent = createContext<ListLayoutValueContent>({
  cb(): void {},
  loading: false,
  setLoading(value: ((prevState: boolean) => boolean) | boolean): void {},
});

export const useListLayoutContext = () => {
  return useContext(ListLayoutContent);
};
