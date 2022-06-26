import { darkScrollbar } from '@mui/material';
import { ThemeOptions } from '@mui/material/styles';
import { tabsClasses } from '@mui/material/Tabs';
import { CommonCustomTheme } from './CommomTheme';
// import indigo from '@mui/material/colors/indigo';
// import red from '@mui/material/colors/red';
// import pink from '@mui/material/colors/pink';
// import green from '@mui/material/colors/green';
// import lightBlue from '@mui/material/colors/lightBlue';
// import amber from '@mui/material/colors/amber';
// import { purple } from '@mui/material/colors';

export const DarkColor: typeof CommonCustomTheme['color'] = {
  ...CommonCustomTheme['color'],
  white: '#000000',
  black: '#ffffff',
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
  // gray99: '#fcfcfc',
  // gray97: '#f7f7f7',
  // gray95: '#f2f2f2',
  // gray90: '#e6e6e6',
  // gray85: '#d9d9d9',
  // gray80: '#cccccc',
  // gray75: '#bfbfbf',
  // gray70: '#b3b3b3',
  // gray65: '#a6a6a6',
  // gray60: '#999999',
  // gray55: '#8c8c8c',
  // gray50: '#808080',
  // gray45: '#737373',
  // gray40: '#666666',
  // gray35: '#595959',
  // gray30: '#4d4d4d',
  // gray25: '#404040',
  // gray20: '#333333',
  // gray15: '#262626',
  // gray10: '#1a1a1a',
  // gray05: '#0d0d0d',
  // gray03: '#080808',
  // gray01: '#030303',
};

const DarkTheme: ThemeOptions = {
  color: DarkColor,
  palette: {
    mode: 'dark'
    // success: {
    //     main: green[500],
    //     dark: green[300],
    //     light: green[500],
    // },
    // primary: {
    //   main: purple[300],
    //   dark: purple[600],
    //   light: purple[200]
    // }
    // secondary: {
    //     main: lightBlue[500],
    //     dark: lightBlue[300],
    //     light: lightBlue[500],
    // },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          ...darkScrollbar()
        }
      }
    },
    MuiTypography: {
      defaultProps: {
        // color: DarkColor.textDefaultBlack
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))'
        }
      }
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        disableRipple: true,
        disableFocusRipple: true,
        disableTouchRipple: true
      },
      styleOverrides: {
        root: {
          minWidth: 'initial',
          // padding: "initial",
          textTransform: 'none'
        },
        contained: {
          // background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
        },
        containedPrimary: {
          backgroundColor: DarkColor.main,
          color: DarkColor.gray10
        },
        containedSecondary: {
          backgroundColor: DarkColor.secondaryMain,
          color: DarkColor.gray10
        },
        outlined: {}
      },
      variants: [
        {
          props: { size: 'small' },
          style: {
            paddingLeft: 9,
            paddingRight: 9,
            paddingTop: 3,
            paddingBottom: 3
          }
        },
        {
          props: { variant: 'contained', disabled: true },
          style: {
            color: DarkColor.gray30,
            backgroundColor: DarkColor.gray10,
            '&:hover': {
              color: DarkColor.gray40,
              backgroundColor: DarkColor.gray15
            }
          }
        },
        {
          props: { variant: 'outlined', disabled: true },
          style: {
            color: DarkColor.gray30,
            backgroundColor: DarkColor.gray10,
            '&:hover': {
              color: DarkColor.gray40,
              backgroundColor: DarkColor.gray20
            }
          }
        },
        {
          props: { variant: 'contained', color: 'success' },
          style: {
            backgroundColor: DarkColor.greenMain,
            color: DarkColor.textDefaultWhite
          }
        },
        {
          props: { variant: 'contained', color: 'error' },
          style: {
            backgroundColor: DarkColor.redMain,
            color: DarkColor.textDefaultWhite
          }
        },
        {
          props: { variant: 'outlined', color: 'error' },
          style: {}
        },
        {
          props: { variant: 'outlined', color: 'info' },
          style: {
            borderColor: DarkColor.blueMain,
            backgroundColor: DarkColor.blueDark
          }
        },
        {
          props: { variant: 'outlined', color: 'primary' },
          style: {}
        },
        {
          props: { variant: 'outlined', color: 'secondary' },
          style: {}
        },
        {
          props: { variant: 'outlined', color: 'success' },
          style: {}
        },
        {
          props: { variant: 'outlined', color: 'warning' },
          style: {}
        },
        {
          props: { variant: 'containedDisable' },
          style: {
            color: DarkColor.gray40,
            backgroundColor: DarkColor.gray20,
            '&:hover': {
              color: DarkColor.gray50,
              backgroundColor: DarkColor.gray30
            }
          }
        },
        {
          props: { variant: 'outlinedDisable' },
          style: {
            color: DarkColor.gray30,
            borderStyle: 'solid',
            borderColor: DarkColor.gray15,
            borderWidth: 1,
            borderRadius: 4,
            '&:hover': {
              borderColor: DarkColor.gray20,
              backgroundColor: DarkColor.gray05
            }
          }
        },
        {
          props: { variant: 'textDisable' },
          style: {
            border: 0,
            color: DarkColor.gray40,
            '&:hover': {
              color: DarkColor.gray50,
              backgroundColor: DarkColor.gray20
            }
          }
        },
        {
          props: { variant: 'containedGray' },
          style: {
            color: DarkColor.gray50,
            borderColor: CommonCustomTheme.color.gray70,
            backgroundColor: DarkColor.gray85,
            '&:hover': {
              color: DarkColor.gray65,
              borderColor: CommonCustomTheme.color.gray65,
              backgroundColor: DarkColor.gray80
            }
          }
        },
        {
          props: { variant: 'outlinedGray' },
          style: {
            color: DarkColor.gray50,
            borderStyle: 'solid',
            borderColor: DarkColor.gray20,
            borderWidth: 1,
            borderRadius: 4,
            '&:hover': {
              borderColor: DarkColor.gray30,
              backgroundColor: DarkColor.gray10
            }
          }
        },
        {
          props: { variant: 'textGray' },
          style: {
            color: DarkColor.gray50,
            '&:hover': {
              color: DarkColor.gray50,
              backgroundColor: DarkColor.gray10
            }
          }
        }
      ]
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          [`& .${tabsClasses.scroller}`]: {
            borderBottomWidth: 1,
            borderBottomStyle: 'solid',
            borderBottomColor: DarkColor.textBlueGray
          }
        }
      }
    }
  }
};

export default DarkTheme;
