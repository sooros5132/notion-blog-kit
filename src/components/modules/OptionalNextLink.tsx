import type React from 'react';
import Link, { LinkProps } from 'next/link';

export const OptionalNextLink: React.FC<
  LinkProps &
    React.AnchorHTMLAttributes<HTMLAnchorElement> & {
      wrappingAnchor: boolean;
      children: JSX.Element;
    }
> = ({ wrappingAnchor, children, ...props }) => {
  if (wrappingAnchor) {
    return <Link {...props}>{children}</Link>;
  }
  const { scroll, shallow, prefetch, as, replace, passHref, ...spanProps } = props;
  return <span {...spanProps}>{children}</span>;
};
