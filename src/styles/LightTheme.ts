import { ThemeOptions } from '@mui/material/styles';
import { CommonCustomTheme } from './CommomTheme';
// import indigo from '@mui/material/colors/indigo';
// import red from '@mui/material/colors/red';
// import pink from '@mui/material/colors/pink';
// import green from '@mui/material/colors/green';
// import lightBlue from '@mui/material/colors/lightBlue';
// import amber from '@mui/material/colors/amber';

export const LightColor: typeof CommonCustomTheme['color'] = {
  ...CommonCustomTheme['color'],
  footerBackground: '#d4d4d4',
  textDefaultBlack: '#000000',
  textDefaultWhite: '#ffffff',
  htmlBackground: '#f7f7f7',
  gray01: '#fcfcfc',
  gray03: '#f7f7f7',
  gray05: '#f2f2f2',
  gray10: '#e6e6e6',
  gray15: '#d9d9d9',
  gray20: '#cccccc',
  gray25: '#bfbfbf',
  gray30: '#b3b3b3',
  gray35: '#a6a6a6',
  gray40: '#999999',
  gray45: '#8c8c8c',
  gray50: '#808080',
  gray55: '#737373',
  gray60: '#666666',
  gray65: '#595959',
  gray70: '#4d4d4d',
  gray75: '#404040',
  gray80: '#333333',
  gray85: '#262626',
  gray90: '#1a1a1a',
  gray95: '#0d0d0d',
  gray97: '#080808',
  gray99: '#030303'
  //   backgroundLrightingMain: '#000000'
};

const LightTheme: ThemeOptions = {
  color: LightColor,
  palette: {
    mode: 'light'
    // success: {
    //     main: green[500],
    //     dark: green[300],
    //     light: green[500],
    // },
    // primary: {
    //     main: pink[500],
    //     dark: pink[300],
    //     light: pink[500],
    // },
    // secondary: {
    //     main: lightBlue[500],
    //     dark: lightBlue[300],
    //     light: lightBlue[500],
    // },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          // fontSize: "2rem",
        },
        contained: {
          // background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
        }
      }
    }
  }
};

export default LightTheme;
