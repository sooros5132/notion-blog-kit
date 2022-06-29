import React from 'react';
import { styled } from '@mui/material/styles';
import { AiFillThunderbolt } from 'react-icons/ai';
import Link from 'next/link';
import { FlexAlignItemsCenterBox } from '../modules/Box';
// import { FlexAlignItemsCenterBox } from '../modules/Box';
// import { useThemeStore } from 'src/store/theme';
// import shallow from 'zustand/shallow';
// import { IconButton } from '@mui/material';
// import { MdDarkMode, MdLightMode } from 'react-icons/md';
// import { Box } from '@mui/system';

interface HeaderProps {}

const HeaderContainer = styled('nav')(({ theme }) => ({
  position: 'sticky',
  top: 0,
  left: 0,
  backdropFilter: 'blur(21px) brightness(0.9)',
  backgroundColor: 'rgba(33, 33, 33, 0.68)', //'rgba(255, 255, 255, 0.05)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
  zIndex: 1
}));

const HeaderInner = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  maxWidth: theme.size.maxWidth,
  margin: '0 auto',
  padding: '0 ' + theme.size.px8,
  color: theme.color.textDefaultBlack,
  fontSize: theme.size.px20
}));

const HeaderLogo = styled('div')(({ theme }) => ({
  padding: theme.size.px6 + ' 0'
}));

const HeaderLogoInner = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  padding: `${theme.size.px2} ${theme.size.px6}`
}));

const Header: React.FC = (): JSX.Element => {
  // const { mode, useDarkTheme, useLightTheme } = useThemeStore(
  //   ({ mode, useDarkTheme, useLightTheme }) => ({ mode, useDarkTheme, useLightTheme }),
  //   shallow
  // );
  // const { data, error } = useSWR("/key", fetch);

  return (
    <HeaderContainer>
      <HeaderInner>
        <HeaderLogo>
          <Link href='/'>
            <a>
              <HeaderLogoInner>
                <AiFillThunderbolt />
                &nbsp;soolog
              </HeaderLogoInner>
            </a>
          </Link>
        </HeaderLogo>
        {/* <FlexAlignItemsCenterBox>
          <Box
            sx={
              mode === 'dark'
                ? {
                    color: theme.color.textDefaultWhite
                  }
                : {
                    color: theme.color.textDefaultBlack
                  }
            }
          >
            {mode === 'dark' ? (
              <IconButton color='inherit' onClick={() => useLightTheme()}>
                <MdDarkMode />
              </IconButton>
            ) : (
              <IconButton color='inherit' onClick={() => useDarkTheme()}>
                <MdLightMode />
              </IconButton>
            )}
          </Box>
        </FlexAlignItemsCenterBox> */}
      </HeaderInner>
    </HeaderContainer>
  );
};
Header.displayName = 'Header';

export default Header;
