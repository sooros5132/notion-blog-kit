import { Typography, TypographyProps } from '@mui/material';
import { styled } from '@mui/material/styles';

export const SpanTypography = styled((props: TypographyProps) => (
  <Typography component="span">{props.children}</Typography>
))();

export const MonoFontTypography = styled(Typography)(() => ({
  fontFamily: 'Roboto Mono,Trebuchet MS,roboto,ubuntu,sans-serif,monospace'
}));
export const MonoFontSpanTypography = styled((props: TypographyProps) => (
  <Typography component="span" {...props}>
    {props.children}
  </Typography>
))(() => ({
  fontFamily: 'Roboto Mono,Trebuchet MS,roboto,ubuntu,sans-serif,monospace'
}));

export const ColorInheritTypography = styled(Typography)(() => ({
  color: 'inherit'
}));

export const FontSizeInheritTypography = styled(Typography)(() => ({
  fontSize: 'inherit'
}));

export const InheritTypography = styled(Typography)(() => ({
  fontSize: 'inherit',
  color: 'inherit'
}));

// 부모의 고정된 크기가 있어야 하고 overflow: hidden이 있어야 한다.
export const EllipsisTypography = styled(Typography)(({ theme }) => ({
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis'
}));

export const BreakSpacesTypography = styled(Typography)(({ theme }) => ({
  wordBreak: 'keep-all',
  overflowWrap: 'anywhere'
}));

export const BreakAllTypography = styled(Typography)(({ theme }) => ({
  wordBreak: 'break-all',
  overflowWrap: 'break-word'
}));

export const PreWrapTypography = styled(Typography)(({ theme }) => ({
  whiteSpace: 'pre-wrap'
}));

export const PreLineTypography = styled(Typography)(({ theme }) => ({
  whiteSpace: 'pre-line'
}));

export const HoverUnderLineSpan = styled((props: TypographyProps) => (
  <Typography component="span" {...props}>
    {props.children}
  </Typography>
))(({ theme }) => ({
  cursor: 'pointer',
  '&:hover': {
    textDecoration: 'underline'
  }
}));

export const UnderLineSpan = styled((props: TypographyProps) => (
  <Typography component="span" {...props}>
    {props.children}
  </Typography>
))(({ theme }) => ({
  cursor: 'pointer',
  textDecoration: 'underline'
}));

export const AskBidTypography = styled(MonoFontTypography)<{
  state?: number;
  opacity?: number;
}>(({ theme, state, opacity }) => ({
  color:
    !state || state === 0
      ? theme.color.gray30
      : state > 0
      ? theme.color.bidMain
      : theme.color.askMain,
  opacity
}));

export const AskBidSpanTypography = styled(MonoFontSpanTypography)<{
  state?: number;
  opacity?: number;
}>(({ theme, state, opacity }) => ({
  color:
    !state || state === 0
      ? theme.color.gray30
      : state > 0
      ? theme.color.bidMain
      : theme.color.askMain,
  opacity
}));
