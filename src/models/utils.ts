import { useState, useCallback, useMemo, useEffect } from 'react';
import { createContainer } from 'unstated-next';
import { localStorage } from '@/utils';

type themeColor = 'light' | 'dark';
interface defaultStatesType {
  theme: themeColor;
}

const defaultStates: defaultStatesType = {
  theme: localStorage('theme') !== 'dark' ? 'light' : 'dark',
};

interface utilsType {
  darkMode: boolean;
  theme: string;
  setTheme: () => any;
}

function useAppUtils(customInitialStates = {}): utilsType {
  const initialStates = {
    ...defaultStates,
    ...customInitialStates,
  };
  const [theme, setThemeProp] = useState<string>(initialStates.theme ?? '');

  // Init
  const setTheme = useCallback(
    (type?: themeColor) => {
      const t: string = type ?? (theme === 'light' ? 'dark' : 'light');
      window.document.documentElement.setAttribute('theme-color', t);
      localStorage('theme', t);
      setThemeProp(t);
    },
    [theme],
  );

  useEffect(() => {
    window.document.documentElement.setAttribute('theme-color', theme);

    const themeMedia = window.matchMedia('(prefers-color-scheme: light)');
    themeMedia.addListener((e) => {
      if (e.matches) {
        // light
        setTheme('light');
      } else {
        // dark
        setTheme('dark');
      }
    });
  }, []);

  return useMemo(() => {
    return {
      darkMode: theme === 'dark',
      theme,
      setTheme,
    };
  }, [theme]);
}

const Utils = createContainer(useAppUtils);
export const useUtils = Utils.useContainer;

export default Utils;
