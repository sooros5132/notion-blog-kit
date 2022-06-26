import React from 'react';
import { useTheme, styled } from '@mui/material/styles';
import { AiFillThunderbolt, AiOutlineClose } from 'react-icons/ai';
import Link from 'next/link';
import { FlexAlignItemsCenterBox } from '../modules/Box';
import { SiNotion, SiNextdotjs } from 'react-icons/si';

interface HeaderProps {}

const HeaderContainer = styled('nav')(({ theme }) => ({
  backgroundColor: theme.color.footerBackground
}));
const HeaderInner = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  maxWidth: theme.size.maxWidth,
  margin: '0 auto',
  padding: '0 ' + theme.size.px8,
  color: theme.color.white,
  fontSize: theme.size.px20
}));

const Header: React.FC = (): JSX.Element => {
  const theme = useTheme();
  const [isMounted, setMounted] = React.useState(false);
  // const { data, error } = useSWR("/key", fetch);

  return (
    <HeaderContainer>
      <HeaderInner>
        <Link href='/'>
          <a>
            <FlexAlignItemsCenterBox>
              <AiFillThunderbolt />
              &nbsp;SOOLOG
            </FlexAlignItemsCenterBox>
          </a>
        </Link>
      </HeaderInner>
    </HeaderContainer>
  );
};
Header.displayName = 'Header';

export default Header;
