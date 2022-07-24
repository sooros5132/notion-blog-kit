import { darkScrollbar, ThemeOptions } from '@mui/material';
import { tabsClasses } from '@mui/material/Tabs';

// default theme at https://material-ui.com/customization/default-theme/
const size = {
  px1: '0.071428571428571rem',
  px2: '0.142857142857143rem',
  px3: '0.214285714285714rem',
  px4: '0.285714285714286rem',
  px5: '0.357142857142857rem',
  px6: '0.428571428571429rem',
  px8: '0.571428571428571rem',
  px10: '0.714285714285714rem',
  px12: '0.857142857142857rem',
  px14: '1rem',
  px16: '1.142857142857143rem',
  px18: '1.285714285714286rem',
  px20: '1.428571428571429rem',
  px22: '1.571428571428571rem',
  px24: '1.714285714285714rem',
  px26: '1.857142857142857rem',
  px28: '2rem',
  px30: '2.142857142857143rem',
  px32: '2.285714285714286rem',
  px34: '2.428571428571429rem',
  px36: '2.571428571428571rem',
  px40: '2.857142857142857rem',
  px42: '3rem',
  px44: '3.142857142857143rem',
  px48: '3.428571428571429rem',
  px50: '3.571428571428571rem',
  px60: '4.285714285714286rem',
  px70: '5rem',
  px100: '7.142857142857143rem',
  px130: '9.285714285714286rem',
  maxWidth: 1980,
  desktopWidth: 980
};

export const CommonCustomTheme = {
  size: size,
  font: {
    normal: '-apple-system,BlinkMacSystemFont,helvetica,Apple SD Gothic Neo,sans-serif',
    code: 'SFMono-Regular,source-code-pro,Menlo,Monaco,Consolas,Liberation Mono,Menlo,Courier,monospace'
  },
  mediaQuery: {
    /* Extra small devices (phones, 600px and down) */
    mobile: '@media only screen and (max-width: 600px)',
    /* Small devices (portrait tablets and large phones, 600px and up) */
    tablet: '@media only screen and (min-width: 600px)',
    /* Medium devices (landscape tablets, 768px and up) */
    landscapeTablet: '@media only screen and (min-width: 768px)',
    /* Large devices (laptops/desktops, 992px and up) */
    laptop: '@media only screen and (min-width: 992px)',
    /* Extra large devices (large laptops and desktops, 1200px and up) */
    desktop: '@media only screen and (min-width: 1200px)',
    // landscape: 폭이 높이보다 넓을 경우 landscape라 부름
    landspace: '@media only screen and (orientation: landscape)'
  },
  color: {
    absolutlyWhite: '#FFFFFF',
    absolutlyBlack: '#000000',
    white: '#FFFFFF',
    black: '#000000',
    textDefaultBlack: '#080808',
    textDefaultWhite: '#FFFFFF',
    textBlueGray: '#A4B7BB',
    htmlBackground: '#f7f7f7',
    main: '#B157E0',
    mainLight: '#CD9EE6',
    mainDark: '#8844AD',
    mainDeepDark: '#4C2661',
    mainDrakBackground: '#1A0D21',
    mainDeepDrakBackground: '#110715',
    mainLightBackground: '#ECCFFF',
    mainLightText: '#ECCFFF',
    footerBackground: '#1a1a1a',
    secondaryMain: '#584524',
    redMain: '#E86D5F',
    redLight: '#F08C7D',
    redDark: '#70261B',
    redBackgroundDark: '#361915',
    redBackgroundLight: 'rgb(154 50 38 / 24%)',
    cardBackground: 'rgb(46 46 46 / 8%)',
    greenMain: '#30CF5D',
    greenLight: '#7BEC9B',
    greenDark: '#249C46',
    blueMain: '#3A49F0',
    blueLight: '#B2B7F0',
    blueDark: '#2732A3',
    blueBackgroundLight: '#BDBFF5',
    blueBackgroundDark: '#14173C',
    yellowMain: '#E6DC22',
    yellowLight: '#EAE696',
    yellowDark: '#B8AF1C',
    buttonGreen: '#1C8039',
    buttonRed: '#C2422F',
    askMain: '#e45c58',
    askLight: '#F29C99',
    askDark: '#702825',
    bidMain: '#2BA89E',
    bidLight: '#40F5E6',
    bidDark: '#1E756E',
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
    gray99: '#030303',
    tooltipBackground: 'rgba(11, 12, 11, 0.92)',
    tooltipArrow: 'rgba(11, 12, 11, 0.92)',
    notionColor_default: '#080808',
    notionColor_gray: 'rgba(120, 119, 116, 1)',
    notionColor_brown: 'rgba(159, 107, 83, 1)',
    notionColor_orange: 'rgba(217, 115, 13, 1)',
    notionColor_yellow: 'rgba(68, 131, 97, 1)',
    notionColor_green: 'rgba(68, 131, 97, 1)',
    notionColor_blue: 'rgba(51, 126, 169, 1)',
    notionColor_purple: 'rgba(144, 101, 176, 1)',
    notionColor_pink: 'rgba(212, 76, 71, 1)',
    notionColor_red: 'rgba(212, 76, 71, 1)',
    notionColor_gray_background: 'rgba(241, 241, 239, 1)',
    notionColor_brown_background: 'rgba(244, 238, 238, 1)',
    notionColor_orange_background: 'rgba(251, 236, 221, 1)',
    notionColor_yellow_background: 'rgba(251, 243, 219, 1)',
    notionColor_green_background: 'rgba(237, 243, 236, 1)',
    notionColor_blue_background: 'rgba(231, 243, 248, 1)',
    notionColor_purple_background: 'rgba(244, 240, 247, 0.8)',
    notionColor_pink_background: 'rgba(244, 240, 247, 0.8)',
    notionColor_red_background: 'rgba(253, 235, 236, 1)'
  }
};

const CommonTheme: ThemeOptions = {
  size: CommonCustomTheme.size,
  mediaQuery: CommonCustomTheme.mediaQuery,
  color: CommonCustomTheme.color,
  font: CommonCustomTheme.font,
  palette: {
    primary: {
      main: CommonCustomTheme.color.main
      // dark: CommonStyles.LTMain02,
      // light: CommonStyles.LTMain04
    },
    secondary: {
      main: CommonCustomTheme.color.secondaryMain
      // dark: CommonStyles.LTSecondary,
      // light: CommonStyles.LTSecondary
    },
    success: {
      main: CommonCustomTheme.color.greenMain
      // dark: '',
      // light: ''
    },
    error: {
      main: CommonCustomTheme.color.redMain
      // dark: '',
      // light: ''
    },
    info: {
      main: CommonCustomTheme.color.blueMain
      // dark: CommonStyles.LTInfo01,
      // light: CommonStyles.LTInfo03
    }
    // black: CommonStyles.textDefaultBlack,
    // gray: CommonStyles.gray30
    // warning: {
    //   main: '',
    //   dark: '',
    //   light: ''
    // },
  },
  typography: {
    fontFamily: CommonCustomTheme.font.normal
    // app: LTSize
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
          backgroundColor: CommonCustomTheme.color.htmlBackground,
          color: CommonCustomTheme.color.textDefaultBlack,
          whiteSpace: 'break-spaces'
        },
        code: {
          fontFamily: "source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace"
        },
        a: {
          color: 'inherit',
          textDecoration: 'none'
        },
        'html.nprogress-busy > body > #nprogress > .spinner': {
          display: 'none'
        }
      }
    },
    MuiFilledInput: {
      defaultProps: {},
      styleOverrides: {
        root: {
          backgroundColor: 'initial',
          '&.Mui-disabled': {
            backgroundColor: 'rgba(0, 0, 0, 0.05)'
          },
          '&:hover': {
            backgroundColor: 'initial'
          },
          '&.Mui-focused': {
            backgroundColor: 'initial'
          }
        }
      }
    },
    MuiTypography: {
      defaultProps: {
        fontSize: 'inherit',
        fontWeight: 'inherit',
        color: 'inherit',
        fontFamily: 'inherit'
        // color: CommonCustomTheme.color.textDefaultBlack
      },
      styleOverrides: {
        h1: {},
        h2: {
          fontSize: CommonCustomTheme.size.px30,
          fontWeight: 'bold'
        },
        h3: {
          fontSize: CommonCustomTheme.size.px24,
          fontWeight: 'bold'
        },
        h4: {
          fontSize: CommonCustomTheme.size.px20,
          fontWeight: 'bold'
        },
        h5: {
          fontSize: CommonCustomTheme.size.px16,
          fontWeight: 'bold'
        },
        h6: {
          fontSize: CommonCustomTheme.size.px14
        },
        overline: {
          fontSize: CommonCustomTheme.size.px10
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            paddingLeft: 7
          },
          '& .MuiInputAdornment-root ': {
            marginRight: 0
          },
          '& .MuiInputBase-input': {
            padding: '0.4em 0.4em'
          }
        }
      }
    },
    MuiIconButton: {
      defaultProps: {
        disableRipple: true,
        disableFocusRipple: true,
        disableTouchRipple: true
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
          backgroundColor: CommonCustomTheme.color.main,
          color: CommonCustomTheme.color.textDefaultWhite
        },
        containedSecondary: {
          backgroundColor: CommonCustomTheme.color.secondaryMain,
          color: CommonCustomTheme.color.textDefaultWhite
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
            color: CommonCustomTheme.color.gray30,
            backgroundColor: CommonCustomTheme.color.gray10,
            '&:hover': {
              color: CommonCustomTheme.color.gray40,
              backgroundColor: CommonCustomTheme.color.gray15
            }
          }
        },
        {
          props: { variant: 'contained', color: 'success' },
          style: {
            color: CommonCustomTheme.color.textDefaultWhite
          }
        },
        {
          props: { variant: 'contained', color: 'info' },
          style: {
            color: CommonCustomTheme.color.textDefaultWhite
          }
        },
        {
          props: { variant: 'outlined', color: 'error' },
          style: {}
        },
        {
          props: { variant: 'outlined', color: 'info' },
          style: {
            borderColor: CommonCustomTheme.color.blueLight,
            backgroundColor: CommonCustomTheme.color.blueMain
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
            color: CommonCustomTheme.color.gray30,
            backgroundColor: CommonCustomTheme.color.gray10,
            '&:hover': {
              color: CommonCustomTheme.color.gray40,
              backgroundColor: CommonCustomTheme.color.gray15
            }
          }
        },
        {
          props: { variant: 'outlinedDisable' },
          style: {
            color: CommonCustomTheme.color.gray30,
            borderStyle: 'solid',
            borderColor: CommonCustomTheme.color.gray15,
            borderWidth: 1,
            borderRadius: 4,
            '&:hover': {
              borderColor: CommonCustomTheme.color.gray20,
              backgroundColor: CommonCustomTheme.color.gray05
            }
          }
        },
        {
          props: { variant: 'textDisable' },
          style: {
            color: CommonCustomTheme.color.gray30,
            '&:hover': {
              color: CommonCustomTheme.color.gray40,
              backgroundColor: CommonCustomTheme.color.gray05
            }
          }
        },
        {
          props: { variant: 'containedGray' },
          style: {
            color: CommonCustomTheme.color.gray50,
            backgroundColor: CommonCustomTheme.color.gray15,
            '&:hover': {
              color: CommonCustomTheme.color.gray65,
              backgroundColor: CommonCustomTheme.color.gray20
            }
          }
        },
        {
          props: { variant: 'outlinedGray' },
          style: {
            color: CommonCustomTheme.color.gray50,
            borderStyle: 'solid',
            borderColor: CommonCustomTheme.color.gray20,
            borderWidth: 1,
            borderRadius: 4,
            '&:hover': {
              borderColor: CommonCustomTheme.color.gray30,
              backgroundColor: CommonCustomTheme.color.gray10
            }
          }
        },
        {
          props: { variant: 'textGray' },
          style: {
            color: CommonCustomTheme.color.gray50,
            '&:hover': {
              color: CommonCustomTheme.color.gray50,
              backgroundColor: CommonCustomTheme.color.gray10
            }
          }
        }
        // {
        //   props: { variant: 'outlined', color: 'black' },
        //   style: {
        //     borderColor: CommonStyles.textDefaultBlack,
        //     backgroundColor: CommonStyles.textDefaultBlack,
        //     '&:hover': {
        //       backgroundColor: CommonStyles.gray10
        //     }
        //   }
        // },
        // {
        //   props: { variant: 'outlined', color: 'gray' },
        //   style: {
        //     borderColor: CommonStyles.gray30,
        //     backgroundColor: CommonStyles.gray10
        //   }
        // }
      ]
    },
    MuiListItemButton: {
      defaultProps: {
        disableRipple: true
      },
      styleOverrides: {
        root: {
          padding: 0
        }
      }
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          justifyContent: 'center'
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {},
        label: {
          paddingLeft: 10,
          paddingRight: 10,
          whiteSpace: 'pre-wrap'
        }
      },

      variants: [
        {
          props: { size: 'small' },
          style: {}
        }
      ]
    },
    MuiModal: {
      styleOverrides: {
        root: {
          '& > *': {
            outline: 'none'
          }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          paddingLeft: '7px',
          '& > .MuiSelect-select': {}
        },
        input: {
          padding: '0.4em',
          paddingLeft: '7px'
        }
      }
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          [`& .${tabsClasses.scrollButtons}`]: {
            '&.Mui-disabled': { opacity: 0.2 }
          },
          [`& .${tabsClasses.scroller}`]: {
            borderBottomWidth: 1,
            borderBottomStyle: 'solid',
            borderBottomColor: CommonCustomTheme.color.textBlueGray
          },
          '& .MuiButtonBase-root': {
            fontWeight: 'bold'
          }
          // '& .MuiTabs-flexContainer': {
          //   borderBottomWidth: 1,
          //   borderBottomStyle: 'solid',
          //   borderBottomColor: CommonCustomTheme.color.textBlueGray
          // }
        }
      },
      variants: [
        {
          props: { variant: 'standard' },
          style: {}
        }
      ]
    },
    MuiTab: {
      defaultProps: {
        disableFocusRipple: true,
        disableRipple: true,
        disableTouchRipple: true
      },
      styleOverrides: {
        root: {
          color: CommonCustomTheme.color.textBlueGray
        }
      }
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          // backdropFilter: 'blur(12px)'
        }
      }
    },
    MuiLink: {
      styleOverrides: {
        root: {
          fontSize: 'inherit',
          color: 'inherit',
          textDecorationColor: 'initial'
        }
      }
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          width: '1.2em',
          height: '1.2em',
          fontSize: 'inherit'
        }
      }
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: CommonCustomTheme.color.tooltipArrow
        },
        arrow: {
          color: CommonCustomTheme.color.tooltipArrow
        }
      }
    }
  }
};

export default CommonTheme;
