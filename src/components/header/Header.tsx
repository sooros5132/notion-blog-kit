import React from 'react';
import { styled } from '@mui/material/styles';
import { AiFillThunderbolt } from 'react-icons/ai';
import Link from 'next/link';
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
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
  padding: theme.size.px4 + ' 0'
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

const FlexAlignItemsCenterAnchor = styled('a')({
  display: 'flex',
  alignItems: 'center'
});

const Header: React.FC = (): JSX.Element => {
  // const { mode, useDarkTheme, useLightTheme } = useThemeStore(
  //   ({ mode, useDarkTheme, useLightTheme }) => ({ mode, useDarkTheme, useLightTheme }),
  //   shallow
  // );
  // const { data, error } = useSWR("/key", fetch);

  return (
    <HeaderContainer>
      <HeaderInner>
        <Link href='/'>
          <FlexAlignItemsCenterAnchor>
            <AiFillThunderbolt />
            &nbsp;SOOLOG
          </FlexAlignItemsCenterAnchor>
        </Link>
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
