'use client';

import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, type ComponentProps } from 'react';
import { startPageTransition } from '@/shared/navigation/page-transition';

type PageLinkProps = ComponentProps<typeof NextLink>;

export default function PageLink({ href, scroll, replace, onClick, onNavigate, ...props }: PageLinkProps) {
  const router = useRouter();
  const destinationRef = useRef<string | null>(null);

  return (
    <NextLink
      {...props}
      href={href}
      scroll={scroll}
      replace={replace}
      onClick={(event) => {
        destinationRef.current = event.currentTarget.href;
        onClick?.(event);
      }}
      onNavigate={(event) => {
        let canceled = false;
        onNavigate?.({ preventDefault: () => { canceled = true; event.preventDefault(); } });
        const destination = destinationRef.current;
        if (canceled || !destination) return;
        const navigate = () => {
          const { hash, search, pathname } = new URL(destination);
          const route = `${pathname}${search}${hash}`;
          const options = { scroll, transitionTypes: props.transitionTypes };
          if (replace) router.replace(route, options);
          else router.push(route, options);
        };
        if (startPageTransition(destination, navigate)) event.preventDefault();
      }}
    />
  );
}
