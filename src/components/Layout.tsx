import React from 'react';
import { useRouter } from 'next/router';
import { Theme as MuiTheme, CssBaseline } from '@mui/material';
import {
  createTheme,
  styled,
  ThemeOptions,
  ThemeProvider as MuiThemeProvider
} from '@mui/material/styles';
import _ from 'lodash';
import { useThemeStore } from 'src/store/theme';
import CommonTheme from 'src/styles/CommomTheme';
import LightTheme from 'src/styles/LightTheme';
import DarkTheme from 'src/styles/DarkTheme';
import Header from './header/Header';
import Footer from './footer/Footer';
import { FlexColumnBox } from './modules/Box';

const Layout = styled(FlexColumnBox)(({ theme }) => ({
  minHeight: '100vh'
}));

const MainContent = styled('main')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: 'auto',
  padding: '0 ' + theme.size.px8
}));

export const introductionPathnameList = [
  '/'
  // '/introduction/jobseeker',
  // '/introduction/interviewer',
  // '/introduction/mou'
];

function SoologLayout({ children }: any) {
  const router = useRouter();
  const themeStore = useThemeStore();

  // React.useEffect(() => {
  //   const handleRouteChangeStart = (url: string) => {

  //   };
  //   router.events.on('routeChangeStart', handleRouteChangeStart);
  //   return () => router.events.off('routeChangeStart', handleRouteChangeStart);
  // }, [router.events, router]);

  const theme = React.useMemo(() => {
    let theme: MuiTheme;
    const fontSize: ThemeOptions = {
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            html: {
              fontSize: themeStore.fontSize
            },
            body: {
              fontSize: themeStore.fontSize
            }
          }
        }
      }
    };
    switch (themeStore.mode) {
      case 'light': {
        theme = createTheme(_.merge(fontSize, CommonTheme, LightTheme));
        break;
      }
      case 'dark': {
        theme = createTheme(_.merge(fontSize, CommonTheme, DarkTheme));
        break;
      }
    }
    return theme;
  }, [themeStore]);

  return (
    <MuiThemeProvider<MuiTheme> theme={theme}>
      <CssBaseline />
      <Layout>
        <Header />
        <MainContent>{children}</MainContent>
        <Footer />
      </Layout>
    </MuiThemeProvider>
  );
}

export default SoologLayout;
