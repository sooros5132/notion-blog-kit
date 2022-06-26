import React from 'react';
import { useTheme, styled } from '@mui/material/styles';
import { AiFillThunderbolt, AiOutlineClose } from 'react-icons/ai';
import Link from 'next/link';
import { FlexAlignItemsCenterBox, FlexBox } from '../modules/Box';
import { SiNotion, SiNextdotjs, SiGithub } from 'react-icons/si';

interface FooterProps {}

const FooterContainer = styled('footer')(({ theme }) => ({
  backgroundColor: theme.color.footerBackground
}));
const FooterInner = styled(FlexAlignItemsCenterBox)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  maxWidth: theme.size.maxWidth,
  margin: '0 auto',
  padding: '0 ' + theme.size.px8,
  color: theme.color.white,
  fontSize: theme.size.px20
}));

const Footer: React.FC = (): JSX.Element => {
  const theme = useTheme();
  const [isMounted, setMounted] = React.useState(false);
  // const { data, error } = useSWR("/key", fetch);

  return (
    <FooterContainer>
      <FooterInner>
        <FlexAlignItemsCenterBox>
          <Link href='/'>
            <a>SOOLOG</a>
          </Link>
          &nbsp;
          <a href='https://github.com/sooros5132/soolog' rel='noreferrer' target='_blank'>
            <FlexAlignItemsCenterBox>
              <SiGithub />
            </FlexAlignItemsCenterBox>
          </a>
        </FlexAlignItemsCenterBox>
        <FlexAlignItemsCenterBox>
          <a href='https://nextjs.org/' rel='noreferrer' target='_blank'>
            <FlexAlignItemsCenterBox>
              <SiNextdotjs />
            </FlexAlignItemsCenterBox>
          </a>
          &nbsp;
          <AiOutlineClose />
          &nbsp;
          <a href='https://notion.so/' rel='noreferrer' target='_blank'>
            <FlexAlignItemsCenterBox>
              <SiNotion />
            </FlexAlignItemsCenterBox>
          </a>
        </FlexAlignItemsCenterBox>
      </FooterInner>
    </FooterContainer>
  );
};
Footer.displayName = 'Footer';

export default Footer;
