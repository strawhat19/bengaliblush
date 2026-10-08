import Link from 'next/link';
import { Check, ChevronRight } from 'lucide-react';
import { siteRoutes } from '@/shared/navigation/routes';

type CheckoutStepsProps = {
  id: string;
  current: 1 | 2 | 3;
  onDetails?: () => void;
};

export default function CheckoutSteps({ id, current, onDetails }: CheckoutStepsProps) {
  const steps = [
    { number: 1, name: `Your Bag`, href: siteRoutes.cart.href },
    { number: 2, name: `Your Details`, href: siteRoutes.checkout.href },
    { number: 3, name: `Review`, href: undefined },
  ];

  return (
    <nav id={id} className={`bb-checkout-steps`} aria-label={`Checkout progress`}>
      <ol id={`${id}-list`} className={`bb-checkout-steps-list`}>
        {steps.map(({ number, name, href }) => (
          <li
            key={number}
            id={`${id}-step-${number}`}
            aria-current={number === current ? `step` : undefined}
            className={`bb-checkout-step${number === current ? ` is-current` : ``}${number < current ? ` is-complete` : ``}`}
          >
            {number === 2 && current === 3 && onDetails ? (
              <button type={`button`} id={`${id}-edit-details`} className={`bb-checkout-step-link`} onClick={onDetails}>
                <span id={`${id}-number-${number}`} className={`bb-checkout-step-number`} aria-hidden={`true`}><Check size={12} /></span>
                <span id={`${id}-label-${number}`} className={`bb-checkout-step-label`}>{name}</span>
              </button>
            ) : href && number < current ? (
              <Link id={`${id}-link-${number}`} className={`bb-checkout-step-link`} href={href}>
                <span id={`${id}-number-${number}`} className={`bb-checkout-step-number`} aria-hidden={`true`}><Check size={12} /></span>
                <span id={`${id}-label-${number}`} className={`bb-checkout-step-label`}>{name}</span>
              </Link>
            ) : (
              <span id={`${id}-content-${number}`} className={`bb-checkout-step-content`}>
                <span id={`${id}-number-${number}`} className={`bb-checkout-step-number`} aria-hidden={`true`}>{String(number).padStart(2, `0`)}</span>
                <span id={`${id}-label-${number}`} className={`bb-checkout-step-label`}>{name}</span>
              </span>
            )}
            {number !== 3 && <ChevronRight className={`bb-checkout-step-separator`} size={13} aria-hidden={`true`} />}
          </li>
        ))}
      </ol>
    </nav>
  );
}
