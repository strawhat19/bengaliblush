export type LegalPageKind = `privacy` | `terms`;

type LegalSection = {
  id: string;
  title: string;
  paragraphs: readonly string[];
};

type LegalContent = {
  title: string;
  accent: string;
  eyebrow: string;
  introduction: string;
  sections: readonly LegalSection[];
};

export const legalContent = {
  privacy: {
    title: `Privacy`,
    accent: `Policy`,
    eyebrow: `A little clarity`,
    introduction: `This page explains how information is handled when you browse Bengali Blush, use the booking form, or get in touch.`,
    sections: [
      {
        id: `contact`,
        title: `When you get in touch`,
        paragraphs: [
          `The contact form uses the email address or phone number and message you enter to prepare a draft in your email app. It does not send the message automatically. If you send the draft, Bengali Blush receives the information included in your email and can use it to respond to your enquiry.`,
        ],
      },
      {
        id: `browser-storage`,
        title: `What stays in your browser`,
        paragraphs: [
          `Your shopping bag is saved in your browser’s local storage so your selected items remain available when you return. The current booking form also saves your name and selected service locally, together with a generated reference and the date of the request.`,
          `Booking entries are not transmitted to the studio by this form. Contact Bengali Blush directly to arrange an appointment. The current checkout does not process payments or complete orders.`,
        ],
      },
      {
        id: `other-services`,
        title: `Analytics and other services`,
        paragraphs: [
          `The website includes Vercel web analytics to understand site visits. It also displays Google Maps and links to Instagram. These services may receive technical information when their content loads or you visit their websites, and their own privacy policies apply to that processing.`,
        ],
      },
      {
        id: `your-choices`,
        title: `Your choices`,
        paragraphs: [
          `You can browse without using the booking or contact forms. Clearing this website’s data in your browser removes locally saved shopping bag and booking entries. This does not remove messages you have already sent by email.`,
          `For questions about information shared directly with the studio, use the contact details below.`,
        ],
      },
      {
        id: `updates`,
        title: `Updates to this page`,
        paragraphs: [
          `This policy describes the website’s current features. We may update it when those features or the way information is handled changes. The date above identifies this version.`,
        ],
      },
    ],
  },
  terms: {
    title: `Terms`,
    accent: `of Use`,
    eyebrow: `Before your next beauty ritual`,
    introduction: `These terms explain how to use the Bengali Blush website and what to expect from its current booking and shopping features.`,
    sections: [
      {
        id: `website`,
        title: `Using the website`,
        paragraphs: [
          `This website introduces Bengali Blush, its beauty services, and its shop. Use it respectfully, provide accurate information when getting in touch, and do not interfere with its operation or attempt unauthorised access.`,
        ],
      },
      {
        id: `appointments`,
        title: `Arranging an appointment`,
        paragraphs: [
          `Submitting the current booking form saves a request in your browser only. It does not send the request to Bengali Blush, reserve a time, or confirm an appointment. Contact the studio directly to arrange your visit.`,
          `Confirm the service, availability, price, and any preparation or cancellation arrangements with the studio before your appointment. Listed service durations are a guide for planning your visit.`,
        ],
      },
      {
        id: `shopping`,
        title: `Shopping bag and checkout`,
        paragraphs: [
          `You can add products to a shopping bag saved in your browser. The current checkout does not accept payment or complete an order. Contact Bengali Blush to discuss an item and confirm its availability, final price, delivery, and any return arrangements before purchasing.`,
        ],
      },
      {
        id: `contact`,
        title: `Sending an enquiry`,
        paragraphs: [
          `The contact form prepares an email draft. Review and send it from your email app to deliver your enquiry. Opening the draft alone does not send a message to the studio.`,
        ],
      },
      {
        id: `external-services`,
        title: `Links and website updates`,
        paragraphs: [
          `Google Maps, Instagram, and other external services operate under their own terms and privacy policies. Website content, services, and product details may be updated. Confirm details directly with the studio when planning a visit or purchase.`,
        ],
      },
    ],
  },
} satisfies Record<LegalPageKind, LegalContent>;
