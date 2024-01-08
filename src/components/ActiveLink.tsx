import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { cloneElement, ReactNode } from "react";

export interface ActiveLinkProps extends LinkProps {
  children: ReactNode;
  activeClass: string;
  nonActiveClass?: string;
}

export default function ActiveLink({
  children,
  href,
  activeClass,
  nonActiveClass = "",
  ...props
}: ActiveLinkProps) {
  const router = useRouter();

  const childClassName = (children as React.ReactElement)?.props?.className || '';

  const combinedClassName =
    router.pathname === href
      ? `${childClassName} ${activeClass}`
      : `${childClassName} ${nonActiveClass}`;

  return (
    <Link href={href} {...props}>
      {cloneElement(children as React.ReactElement, { className: combinedClassName })}
    </Link>
  );
}
