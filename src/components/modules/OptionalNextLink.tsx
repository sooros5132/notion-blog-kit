import Link, { LinkProps } from 'next/link';
import { PropsWithChildren } from 'react';

export const OptionalNextLink: React.FC<
  LinkProps &
    React.AnchorHTMLAttributes<HTMLAnchorElement> &
    PropsWithChildren & {
      wrappingAnchor: boolean;
    }
> = ({ wrappingAnchor, children, ...props }) => {
  if (wrappingAnchor) {
    return <Link {...props}>{children}</Link>;
  }
  const { scroll, shallow, prefetch, as, replace, passHref, ...spanProps } = props;
  return <span {...spanProps}>{children}</span>;
};
