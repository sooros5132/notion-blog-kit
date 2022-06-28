import React from 'react';
import { useTheme, styled } from '@mui/material/styles';
import { RiCloseFill } from 'react-icons/ri';
import { FlexAlignItemsCenterBox, FlexBox } from '../modules/Box';
import { SiNotion, SiNextdotjs, SiGithub } from 'react-icons/si';

interface FooterProps {}

const FooterContainer = styled('footer')(({ theme }) => ({
  backgroundColor: theme.color.footerBackground,
  padding: theme.size.px8 + ' 0'
}));
const FooterInner = styled(FlexAlignItemsCenterBox)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  maxWidth: theme.size.maxWidth,
  margin: '0 auto',
  padding: '0 ' + theme.size.px16,
  color: theme.color.textDefaultBlack,
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
          <a href='https://github.com/sooros5132' rel='noreferrer' target='_blank'>
            SOOROS
          </a>
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
          <RiCloseFill />
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
