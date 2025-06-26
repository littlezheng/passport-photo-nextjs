import Link from "next/link";
import { ReactNode } from "react";

type NavItemProps = {
  href: string;
  className?: string;
  children: ReactNode;
};

export default function NavItem({ href, children, className }: NavItemProps) {
  return (
    <Link
      href={href}
      className={className ?? "text-gray-500 hover:text-gray-700"}
    >
      {children}
    </Link>
  );
}
