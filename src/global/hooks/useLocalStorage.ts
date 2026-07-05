import { useState, useCallback } from "react";

// ----------------------------------------------------------------------

export function useLocalStorage<T extends Record<string, unknown>>(
  key: string,
  initialState: T
) {
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialState;
    }

    const restored = getStorage<T>(key);
    if (restored) {
      return {
        ...initialState,
        ...restored,
      };
    }

    return initialState;
  });

  const updateState = useCallback(
    (updateValue: Partial<T>) => {
      setState((prevValue) => {
        const nextValue = {
          ...prevValue,
          ...updateValue,
        };
        setStorage(key, nextValue);
        return nextValue;
      });
    },
    [key]
  );

  const update = useCallback(
    (name: string, updateValue: unknown) => {
      updateState({
        [name]: updateValue,
      } as Partial<T>);
    },
    [updateState]
  );

  const reset = useCallback(() => {
    removeStorage(key);
    setState(initialState);
  }, [initialState, key]);

  return {
    state,
    update,
    reset,
  };
}

// ----------------------------------------------------------------------

export const getStorage = <T>(key: string): T | null => {
  let value: T | null = null;

  try {
    const result = window.localStorage.getItem(key);

    if (result) {
      value = JSON.parse(result) as T;
    }
  } catch (error) {
    console.error(error);
  }

  return value;
};

export const setStorage = <T>(key: string, value: T) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(error);
  }
};

export const removeStorage = (key: string) => {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(error);
  }
};
