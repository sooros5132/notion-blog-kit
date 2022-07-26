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
  textDefaultBlack: '#FFFFFF',
  textDefaultWhite: '#080808',
  htmlBackground: '#151a19',
  footerBackground: '#232b2a',
  gray99: '#fcfcfc',
  gray97: '#f7f7f7',
  gray95: '#f2f2f2',
  gray90: '#e6e6e6',
  gray85: '#d9d9d9',
  gray80: '#cccccc',
  gray75: '#bfbfbf',
  gray70: '#b3b3b3',
  gray65: '#a6a6a6',
  gray60: '#999999',
  gray55: '#8c8c8c',
  gray50: '#808080',
  gray45: '#737373',
  gray40: '#666666',
  gray35: '#595959',
  gray30: '#4d4d4d',
  gray25: '#404040',
  gray20: '#333333',
  gray15: '#262626',
  gray10: '#1a1a1a',
  gray05: '#0d0d0d',
  gray03: '#080808',
  gray01: '#030303',
  redBackgroundLight: 'rgb(154 50 38 / 63%)',
  cardBackground: 'rgba(255, 255, 255, 0.05)',
  notionColor_default: '#ffffff',
  notionColor_gray: 'rgba(155, 155, 155, 1)',
  notionColor_brown: 'rgba(186, 133, 111, 1)',
  notionColor_orange: 'rgba(199, 125, 72, 1)',
  notionColor_yellow: 'rgba(202, 152, 73, 1)',
  notionColor_green: 'rgba(82, 158, 114, 1)',
  notionColor_blue: 'rgba(94, 135, 201, 1)',
  notionColor_purple: 'rgba(157, 104, 211, 1)',
  notionColor_pink: 'rgba(209, 87, 150, 1)',
  notionColor_red: 'rgba(223, 84, 82, 1)',
  notionColor_gray_background: 'rgba(47, 47, 47, 1)',
  notionColor_brown_background: 'rgba(74, 50, 40, 1)',
  notionColor_orange_background: 'rgba(92, 59, 35, 1)',
  notionColor_yellow_background: 'rgba(86, 67, 40, 1)',
  notionColor_green_background: 'rgba(36, 61, 48, 1)',
  notionColor_blue_background: 'rgba(20, 58, 78, 1)',
  notionColor_purple_background: 'rgba(60, 45, 73, 1)',
  notionColor_pink_background: 'rgba(78, 44, 60, 1)',
  notionColor_red_background: 'rgba(82, 46, 42, 1)'
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
          // '& *::selection': { backgroundColor: CommonStyles.LTMainTransparency30 },
          // '& *::-moz-selection': { backgroundColor: CommonStyles.LTMainTransparency30 }
          fontFamily: CommonCustomTheme.font.normal,
          // WebkitFontSmoothing: 'antialiased',
          // MozOsxFontSmoothing: 'grayscale',
          backgroundColor: DarkColor.htmlBackground,
          color: DarkColor.textDefaultBlack,
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
          props: { variant: 'outlined', color: 'info' },
          style: {
            borderColor: DarkColor.blueMain,
            backgroundColor: DarkColor.blueDark
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
