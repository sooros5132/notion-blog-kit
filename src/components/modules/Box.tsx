import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const FullWidthBox = styled('div')`
  width: 100%;
`;

export const PositionRelativeBox = styled('div')`
  position: relative;
`;

export const PositionRelativeFullScreenBox = styled('div')`
  position: relative;
  width: 100%;
  height: 100%;
`;

export const PositionAbsoluteBox = styled('div')`
  position: absolute;
  top: 0;
  left: 0;
`;

export const PositionAbsoluteCenterBox = styled('div')`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const PositionAbsoluteXCenterBox = styled('div')`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
`;

export const PositionAbsoluteYCenterBox = styled('div')`
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
`;

export const PositionTopStickyBox = styled('div')`
  position: sticky;
  top: 0;
`;

export const FlexColumnBox = styled('div')`
  display: flex;
  flex-direction: column;
`;

export const FlexColumnHeight100Box = styled('div')`
  display: flex;
  height: 100%;
  flex-direction: column;
`;

export const FlexColumnAlignItemsCenterBox = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const FlexColumnJustifyContentCenterBox = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const FlexColumnAlignItemsFlexEndBox = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

export const FlexColumnJustifyContentFlexEndBox = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

export const FlexColumnBottomBox = styled('div')`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: flex-end;
`;

export const FlexBox = styled('div')`
  display: flex;
`;

export const FlexFullBox = styled('div')`
  display: flex;
  width: 100%;
  height: 100%;
`;

export const FlexNoWrapBox = styled('div')`
  display: flex;
  flex-wrap: nowrap;
`;

export const FlexWrapBox = styled('div')`
  display: flex;
  flex-wrap: wrap;
`;

export const FlexJustifyContentCenterBox = styled('div')`
  display: flex;
  justify-content: center;
`;

export const FlexJustifyContentFlexEndBox = styled('div')`
  display: flex;
  justify-content: flex-end;
`;

export const FlexAlignItemsCenterHeight100Box = styled('div')`
  display: flex;
  height: 100%;
  align-items: center;
`;

export const FlexAlignItemsCenterBox = styled('div')`
  display: flex;
  align-items: center;
`;

export const FlexAlignItemsFlexEndBox = styled('div')`
  display: flex;
  align-items: flex-end;
`;

export const FlexEndEndBox = styled('div')`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
`;

export const FlexCenterCenterBox = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const FlexCenterCenterFullBox = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

export const FlexSpaceAroundBox = styled('div')`
  display: flex;
  justify-content: space-around;
`;

export const FlexSpaceBetweenBox = styled('div')`
  display: flex;
  justify-content: space-between;
`;

export const FlexSpaceBetweenCenterBox = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const FlexSpaceBetweenEndBox = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

const BackgroundBox = styled('div')`
  background-color: white;
`;

export const GridBox = styled('div')`
  display: grid;
`;
export const Width100Box = styled('div')`
  width: 100%;
`;
export const Height100Box = styled('div')`
  height: 100%;
`;

export const Flex11AutoBox = styled('div')`
  flex: auto;
`;

export const Flex0025Box = styled('div')`
  flex: 0 0 25%;
`;

export const Flex0033Box = styled('div')`
  flex: 0 0 33.333333%;
`;

export const Flex0050Box = styled('div')`
  flex: 0 0 50%;
`;

export const Flex0066Box = styled('div')`
  flex: 0 0 66.666666%;
`;

export const Flex0075Box = styled('div')`
  flex: 0 0 75%;
`;

export const TextAlignCenterBox = styled('div')`
  text-align: center;
`;

export const TextAlignRightBox = styled('div')`
  text-align: right;
`;

export const TextAlignLeftBox = styled('div')`
  text-align: left;
`;

export const MonoFontBox = styled('div')`
  font-family: 'Roboto Mono', monospace; ;
`;

export const CursorPointerBox = styled('div')`
  cursor: pointer;
`;

export const FlexCursorPointerBox = styled('div')`
  display: flex;
  cursor: pointer;
`;

export const BackgroundRedBox = styled('div')(({ theme }) => ({
  borderRadius: 5,
  padding: `${theme.spacing(0.625)} ${theme.spacing(4)}`,
  backgroundColor: theme.color.redBackgroundDark,
  color: theme.color.redLight,
  marginBottom: theme.spacing(1)
}));

export const BackgroundGreenBox = styled('div')(({ theme }) => ({
  borderRadius: 5,
  padding: `${theme.spacing(0.625)} ${theme.spacing(4)}`,
  backgroundColor: theme.color.redBackgroundDark,
  color: theme.color.redLight
}));

export const BackgroundBlueBox = styled('div')(({ theme }) => ({
  borderRadius: 5,
  padding: `${theme.spacing(0.625)} ${theme.spacing(4)}`,
  backgroundColor: theme.color.blueBackgroundDark,
  color: theme.color.blueLight
}));

export const NoWrapBox = styled('div')`
  white-space: nowrap;
`;

export const HoverUnderlineBox = styled('div')`
  &:hover {
    text-decoration: underline;
  }
`;
export const FlexHoverUnderlineBox = styled('div')`
  display: flex;

  &:hover {
    text-decoration: underline;
  }
`;
