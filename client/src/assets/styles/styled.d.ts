// src/assets/styles/styled.d.ts
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    basicWidth: string;

    color: {
      main: string;
      sub: {
        [index: string]: string;
        white: string;
        brown: string;
        red: string;
        pink: string;
        orange: string;
        yellow: string;
        title: string;
      };
      gray: string;
      font: string;
      subFont: string;
    };

    font: {
      main: string;
      sub: string;
      third: string;
    };
  }
}
