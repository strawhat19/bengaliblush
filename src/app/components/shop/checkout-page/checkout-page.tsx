'use client';

import { useShop } from '@/shared/shop/shop-context';
import { useCheckoutPage } from './use-checkout-page';
import { siteRoutes } from '@/shared/navigation/routes';
import OrderSummary from '../order-summary/order-summary';
import CheckoutSteps from '../checkout-steps/checkout-steps';
import type { CheckoutAddress } from '@/shared/types/checkout';
import Link from '@/app/components/navigation/page-link/page-link';
import { Mail, Check, Pencil, MapPin, LogIn, ArrowLeft, Sparkles, CreditCard, ChevronRight, ShoppingBag, ArrowUpRight } from 'lucide-react';

const shippingFields: {
  label: string;
  full?: boolean;
  required?: boolean;
  autoComplete: string;
  maxLength?: number;
  name: keyof CheckoutAddress;
}[] = [
  { name: `firstName`, label: `First Name`, maxLength: 59, required: true, autoComplete: `shipping given-name` },
  { name: `lastName`, label: `Last Name`, maxLength: 60, required: true, autoComplete: `shipping family-name` },
  { name: `addressLine1`, label: `Street Address`, maxLength: 220, full: true, required: true, autoComplete: `shipping address-line1` },
  { name: `addressLine2`, label: `Apartment, Suite, Etc. (Optional)`, maxLength: 78, full: true, autoComplete: `shipping address-line2` },
  { name: `city`, label: `City`, required: true, autoComplete: `shipping address-level2` },
  { name: `region`, label: `State / Province / Region`, required: true, autoComplete: `shipping address-level1` },
  { name: `postalCode`, label: `ZIP / Postal Code`, maxLength: 40, required: true, autoComplete: `shipping postal-code` },
  { name: `country`, label: `Country`, required: true, autoComplete: `shipping country-name` },
];

export default function CheckoutPage() {
  const { lines } = useShop();
  const { draft, notes, error, isReady, isReview, savedOrder, submitting, editDetails, setNotes, placeOrder, handleInput, handleSubmit, canPlaceOrder, paymentMethods, catalogError, paymentMethodId, setPaymentMethodId, unavailableProductIds, quantityLimitExceeded } = useCheckoutPage();

  return (
    <section id={`top`} className={`bb-section bb-checkout-page`} aria-labelledby={`bb-checkout-title`}>
      <div id={`bb-checkout-container`} className={`bb-container bb-checkout-container`}>
        <CheckoutSteps id={`bb-checkout-progress`} current={isReview && lines.length ? 3 : 2} onDetails={editDetails} />
        <div id={`bb-checkout-heading`} className={`bb-checkout-heading`}>
          <span id={`bb-checkout-eyebrow`} className={`bb-eyebrow`}>Made For Your Everyday Ritual</span>
          <h1 id={`bb-checkout-title`} className={`bb-checkout-title`}>A few<br /><em>finishing touches.</em></h1>
          <p id={`bb-checkout-description`} className={`bb-checkout-description`}>A thoughtful little selection deserves a thoughtful last step.</p>
        </div>
        {savedOrder ? (
          <div id={`bb-checkout-saved-${savedOrder.id}`} className={`bb-checkout-empty`} role={`status`}>
            <Check size={34} aria-hidden={`true`} />
            <h2 id={`bb-checkout-saved-title`} className={`bb-checkout-empty-title`}>Order Request #{savedOrder.number} Saved</h2>
            <p id={`bb-checkout-saved-copy`} className={`bb-checkout-empty-copy`}>The studio will review your selection and confirm availability, delivery, and final pricing. No payment has been taken, and this is not a paid or confirmed order.</p>
            <Link id={`bb-checkout-saved-shop`} className={`bb-button bb-checkout-review-button`} href={siteRoutes.shop.href}>Explore the shop <ArrowUpRight size={15} aria-hidden={`true`} /></Link>
          </div>
        ) : !isReady ? (
          <div id={`bb-checkout-loading`} className={`bb-checkout-loading`} role={`status`}>
            <ShoppingBag size={25} strokeWidth={1.3} aria-hidden={`true`} />
            <p id={`bb-checkout-loading-copy`} className={`bb-checkout-loading-copy`}>Preparing your selection…</p>
          </div>
        ) : lines.length ? (
          <>
            <div id={`bb-checkout-preview`} className={`bb-checkout-preview`}>
              <Sparkles size={18} aria-hidden={`true`} />
              <div id={`bb-checkout-preview-copy`} className={`bb-checkout-preview-copy`}>
                <strong id={`bb-checkout-preview-title`} className={`bb-checkout-preview-title`}>Your order request</strong>
                <p id={`bb-checkout-preview-note`} className={`bb-checkout-preview-note`}>Review your selection and save a request for the studio. Availability, delivery, and final pricing will be confirmed separately. No payment is collected.</p>
              </div>
            </div>
            {(catalogError || paymentMethods.error) && <p id={`bb-checkout-catalog-error`} className={`bb-submission-error`} role={`alert`}>{catalogError || paymentMethods.error}</p>}
            {Boolean(unavailableProductIds.length) && <p id={`bb-checkout-unavailable`} className={`bb-submission-error`} role={`alert`}>Some products in your bag are no longer available. Remove them before continuing.</p>}
            {lines.length > 5 && <p id={`bb-checkout-line-limit`} className={`bb-submission-error`} role={`alert`}>Choose up to 5 different products per request.</p>}
            {quantityLimitExceeded && <p id={`bb-checkout-quantity-limit`} className={`bb-submission-error`} role={`alert`}>Reduce each product quantity to 99 or fewer before continuing.</p>}
            <div id={`bb-checkout-layout`} className={`bb-checkout-layout`}>
              <div id={`bb-checkout-main`} className={`bb-checkout-main`}>
                {isReview && draft ? (
                  <div id={`bb-checkout-review`} className={`bb-checkout-review`}>
                    <div id={`bb-checkout-review-heading`} className={`bb-checkout-review-heading`}>
                      <h2 id={`bb-checkout-review-title`} className={`bb-checkout-section-title`}>Your details, beautifully in place.</h2>
                      <p id={`bb-checkout-review-status`} className={`bb-checkout-review-status`} role={`status`}>Ready for you to review. Nothing has been sent.</p>
                    </div>
                    <div id={`bb-checkout-review-contact`} className={`bb-checkout-review-block`}>
                      <h3 id={`bb-checkout-review-contact-title`} className={`bb-checkout-review-block-title`}><Mail size={16} aria-hidden={`true`} />Contact</h3>
                      <p id={`bb-checkout-review-email`} className={`bb-checkout-review-line`}>{draft.contact.email}</p>
                      {draft.contact.phone && <p id={`bb-checkout-review-phone`} className={`bb-checkout-review-line`}>{draft.contact.phone}</p>}
                    </div>
                    <div id={`bb-checkout-review-address`} className={`bb-checkout-review-block`}>
                      <h3 id={`bb-checkout-review-address-title`} className={`bb-checkout-review-block-title`}><MapPin size={16} aria-hidden={`true`} />Shipping Address</h3>
                      <address id={`bb-checkout-review-address-copy`} className={`bb-checkout-review-address-copy`}>
                        <span id={`bb-checkout-review-name`} className={`bb-checkout-review-address-line`}>{draft.shipping.firstName} {draft.shipping.lastName}</span>
                        <span id={`bb-checkout-review-street`} className={`bb-checkout-review-address-line`}>{draft.shipping.addressLine1}</span>
                        {draft.shipping.addressLine2 && <span id={`bb-checkout-review-apartment`} className={`bb-checkout-review-address-line`}>{draft.shipping.addressLine2}</span>}
                        <span id={`bb-checkout-review-city`} className={`bb-checkout-review-address-line`}>{draft.shipping.city}, {draft.shipping.region} {draft.shipping.postalCode}</span>
                        <span id={`bb-checkout-review-country`} className={`bb-checkout-review-address-line`}>{draft.shipping.country}</span>
                      </address>
                    </div>
                    <button disabled={submitting} type={`button`} id={`bb-checkout-edit-details`} className={`bb-checkout-edit-details`} onClick={editDetails}><Pencil size={13} aria-hidden={`true`} />Edit your details</button>
                    <div id={`bb-checkout-payment-preview`} className={`bb-checkout-payment-preview`}>
                      <span id={`bb-checkout-payment-eyebrow`} className={`bb-eyebrow`}>One Last Touch</span>
                      <h3 id={`bb-checkout-payment-title`} className={`bb-checkout-payment-title`}>Ready for the studio to review.</h3>
                      <p id={`bb-checkout-payment-copy`} className={`bb-checkout-payment-copy`}>This saves an unpaid order request. Payment arrangements will be confirmed separately.</p>
                      {Boolean(paymentMethods.records.length) && <div id={`bb-checkout-payment-field`} className={`bb-checkout-field`}>
                        <label id={`bb-checkout-payment-label`} className={`bb-checkout-label`} htmlFor={`bb-checkout-payment-method`}><CreditCard size={14} aria-hidden={`true`} /> Preferred Payment Method (Optional)</label>
                        <select id={`bb-checkout-payment-method`} className={`bb-checkout-input`} value={paymentMethodId} disabled={submitting} onChange={(event) => setPaymentMethodId(event.target.value)}>
                          <option value={``}>Confirm With The Studio</option>
                          {paymentMethods.records.map((method) => <option key={method.id} id={`bb-checkout-payment-option-${method.id}`} value={method.id}>{method.name}</option>)}
                        </select>
                        {paymentMethodId && <p id={`bb-checkout-payment-description`} className={`bb-checkout-form-note`}>{paymentMethods.records.find((method) => method.id === paymentMethodId)?.description}</p>}
                      </div>}
                      <div id={`bb-checkout-notes-field`} className={`bb-checkout-field`}>
                        <label id={`bb-checkout-notes-label`} className={`bb-checkout-label`} htmlFor={`bb-checkout-notes`}>Order Notes (Optional)</label>
                        <textarea id={`bb-checkout-notes`} className={`bb-checkout-input`} maxLength={2000} value={notes} disabled={submitting} onChange={(event) => setNotes(event.target.value)} />
                      </div>
                      <button disabled={!canPlaceOrder} type={`button`} onClick={placeOrder} id={`bb-checkout-place-order`} className={`bb-button bb-checkout-place-order`} aria-describedby={`bb-checkout-preview-note`}>{submitting ? `Saving Request…` : `Save Order Request`} <ShoppingBag size={15} aria-hidden={`true`} /></button>
                      {error && <p id={`bb-checkout-save-error`} className={`bb-submission-error`} role={`alert`}>{error}</p>}
                    </div>
                  </div>
                ) : (
                  <form id={`bb-checkout-form`} className={`bb-checkout-form`} onSubmit={handleSubmit}>
                    <fieldset id={`bb-checkout-contact`} className={`bb-checkout-fieldset`}>
                      <legend id={`bb-checkout-contact-title`} className={`bb-checkout-section-title`}><Mail size={19} aria-hidden={`true`} />Your contact</legend>
                      <div id={`bb-checkout-contact-grid`} className={`bb-checkout-field-grid`}>
                        <div id={`bb-checkout-email-field`} className={`bb-checkout-field bb-checkout-field-full`}>
                          <label id={`bb-checkout-email-label`} className={`bb-checkout-label`} htmlFor={`bb-checkout-email`}>Email Address</label>
                          <input
                            required
                            type={`email`}
                            name={`email`}
                            maxLength={254}
                            autoComplete={`email`}
                            onInput={handleInput}
                            id={`bb-checkout-email`}
                            className={`bb-checkout-input`}
                            defaultValue={draft?.contact.email ?? ``}
                          />
                        </div>
                        <div id={`bb-checkout-phone-field`} className={`bb-checkout-field bb-checkout-field-full`}>
                          <label id={`bb-checkout-phone-label`} className={`bb-checkout-label`} htmlFor={`bb-checkout-phone`}>Phone Number (Optional)</label>
                          <input
                            type={`tel`}
                            name={`phone`}
                            maxLength={40}
                            autoComplete={`tel`}
                            onInput={handleInput}
                            id={`bb-checkout-phone`}
                            className={`bb-checkout-input`}
                            defaultValue={draft?.contact.phone ?? ``}
                          />
                        </div>
                      </div>
                      <p id={`bb-checkout-guest-note`} className={`bb-checkout-guest-note`}>Continue as a guest. <Link id={`bb-checkout-signin`} className={`bb-checkout-signin`} href={siteRoutes.signin.href}><LogIn size={12} aria-hidden={`true`} />Sign in</Link></p>
                    </fieldset>
                    <fieldset id={`bb-checkout-shipping`} className={`bb-checkout-fieldset`}>
                      <legend id={`bb-checkout-shipping-title`} className={`bb-checkout-section-title`}><MapPin size={19} aria-hidden={`true`} />Your shipping address</legend>
                      <div id={`bb-checkout-shipping-grid`} className={`bb-checkout-field-grid`}>
                        {shippingFields.map(({ name, label, full, required, autoComplete, maxLength }) => (
                          <div key={name} id={`bb-checkout-${name}-field`} className={`bb-checkout-field${full ? ` bb-checkout-field-full` : ``}`}>
                            <label id={`bb-checkout-${name}-label`} className={`bb-checkout-label`} htmlFor={`bb-checkout-${name}`}>{label}</label>
                            <input
                              name={name}
                              type={`text`}
                              maxLength={maxLength ?? 120}
                              required={required}
                              onInput={handleInput}
                              id={`bb-checkout-${name}`}
                              autoComplete={autoComplete}
                              className={`bb-checkout-input`}
                              defaultValue={draft?.shipping[name] ?? (name === `country` ? `United States` : ``)}
                            />
                          </div>
                        ))}
                      </div>
                    </fieldset>
                    <div id={`bb-checkout-form-actions`} className={`bb-checkout-form-actions`}>
                      <button disabled={!canPlaceOrder} type={`submit`} id={`bb-checkout-review-button`} className={`bb-button bb-checkout-review-button`} aria-describedby={`bb-checkout-preview-note`}>Review your details <ChevronRight size={16} aria-hidden={`true`} /></button>
                      <p id={`bb-checkout-form-note`} className={`bb-checkout-form-note`}>For a look at the next step. This does not place an order.</p>
                    </div>
                  </form>
                )}
                <div id={`bb-checkout-bottom-links`} className={`bb-checkout-bottom-links`}>
                  <Link id={`bb-checkout-back-to-bag`} className={`bb-checkout-back-to-bag`} href={siteRoutes.cart.href}><ArrowLeft size={14} aria-hidden={`true`} />Return to your bag</Link>
                  <div id={`bb-checkout-policy-links`} className={`bb-checkout-policy-links`}>
                    <Link id={`bb-checkout-privacy-link`} className={`bb-checkout-policy-link`} href={siteRoutes.privacy.href}>Privacy <ArrowUpRight size={11} aria-hidden={`true`} /></Link>
                    <Link id={`bb-checkout-terms-link`} className={`bb-checkout-policy-link`} href={siteRoutes.terms.href}>Terms <ArrowUpRight size={11} aria-hidden={`true`} /></Link>
                  </div>
                </div>
              </div>
              <OrderSummary id={`bb-checkout-order-summary`} />
            </div>
          </>
        ) : (
          <div id={`bb-checkout-empty`} className={`bb-checkout-empty`}>
            <ShoppingBag size={34} strokeWidth={1.2} aria-hidden={`true`} />
            <h2 id={`bb-checkout-empty-title`} className={`bb-checkout-empty-title`}>First, a little something lovely.</h2>
            <p id={`bb-checkout-empty-copy`} className={`bb-checkout-empty-copy`}>Choose a favorite from the Misty Market to begin your order request.</p>
            <Link id={`bb-checkout-empty-shop`} className={`bb-button bb-checkout-review-button`} href={siteRoutes.shop.href}>Explore the shop <ArrowUpRight size={15} aria-hidden={`true`} /></Link>
          </div>
        )}
      </div>
    </section>
  );
}
