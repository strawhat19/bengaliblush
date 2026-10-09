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
          `You can send a contact message without signing in. Your email address or phone number, message, and submission date are stored in Firebase Firestore. An active signed-in account may also be linked to the request. Bengali Blush uses this information to review and respond to your enquiry.`,
          `Appointment requests can be submitted without an account and store your name, email address, chosen service, preferred date and time, notes, and submission date in Firestore. An active signed-in account may also be linked to the request. Requests can be reviewed by authorised studio admins and the owner. A saved request does not reserve or confirm an appointment.`,
        ],
      },
      {
        id: `accounts`,
        title: `Your account`,
        paragraphs: [
          `Google and email/password sign-in are handled by Firebase Authentication. Bengali Blush stores your account name, email address, optional Google profile photo, provider reference, and account role in Firestore. Email/password credentials are sent to Firebase Authentication and are not saved in Firestore. The website does not receive or store your Google password. Account and submission access is restricted through Firebase security rules.`,
        ],
      },
      {
        id: `browser-storage`,
        title: `What stays in your browser`,
        paragraphs: [
          `Your shopping bag is saved in your browser’s local storage so your selected items remain available when you return. Firebase Authentication also keeps sign-in state in your browser so you can remain signed in between visits.`,
          `Checkout saves an unpaid order request in Firestore after you submit it. Your contact details, delivery address, requested items, and quoted product subtotal are private to the studio and an active linked account. No card details are collected and no payment is processed. Contact and appointment submissions are also saved only after a successful submission.`,
        ],
      },
      {
        id: `reviews`,
        title: `Published reviews`,
        paragraphs: [
          `Reviews managed by the studio are stored in Firestore. Published reviews show the reviewer’s display name, rating, message, service description, and any supplied image on the website. Draft and archived reviews are available only to authorised studio admins and the owner.`,
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
          `You can browse, request an order, and use the booking or contact forms without signing in. Sign out to end your session on this device. Clearing this website’s browser data removes locally saved shopping bag and sign-in state; it does not delete your account or requests stored in Firestore.`,
          `To ask about your account or request changes or deletion of information shared with the studio, use the contact details below.`,
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
          `Anyone can submit an appointment request without signing in. A successfully submitted request is saved for Bengali Blush to review. It does not reserve a time or confirm an appointment; the studio must confirm availability and the details with you.`,
          `Confirm the service, availability, price, and any preparation or cancellation arrangements with the studio before your appointment. Listed service durations are a guide for planning your visit.`,
        ],
      },
      {
        id: `shopping`,
        title: `Shopping bag and checkout`,
        paragraphs: [
          `You can add products to a shopping bag saved in your browser and submit an unpaid order request. A saved request does not take payment or confirm a purchase. Confirm availability, the final price, delivery, and any return arrangements with Bengali Blush before purchasing.`,
        ],
      },
      {
        id: `contact`,
        title: `Sending an enquiry`,
        paragraphs: [
          `Anyone can send a contact message without signing in. A successfully submitted message is stored for the studio to review and reply using the contact details you provide. You can also contact the studio directly using the email address or phone number shown on the website.`,
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
