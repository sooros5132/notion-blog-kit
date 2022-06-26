import { ThemeOptions } from '@mui/material/styles';
import { CommonCustomTheme } from './CommomTheme';
// import indigo from '@mui/material/colors/indigo';
// import red from '@mui/material/colors/red';
// import pink from '@mui/material/colors/pink';
// import green from '@mui/material/colors/green';
// import lightBlue from '@mui/material/colors/lightBlue';
// import amber from '@mui/material/colors/amber';

export const LightColor: typeof CommonCustomTheme['color'] = {
  ...CommonCustomTheme['color']
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
