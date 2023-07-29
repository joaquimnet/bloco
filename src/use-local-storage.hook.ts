import { useState } from 'react';

export const useLocalStorage = (key: string) => {
  const save = (obj: object) => {
    const str = JSON.stringify(obj);
    localStorage.setItem(key, str);
  };

  const load = () => {
    const existing = localStorage.getItem(key);
    if (existing) {
      try {
        return JSON.parse(existing);
      } catch (err) {
        console.error('Error trying to load from local storage');
        console.error({
          error: err,
          key,
        });
      }
    }
    return {};
  };

  return { save, load };
};
