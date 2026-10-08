export type Review = {
  id: string;
  name: string;
  rating: number;
  image: string;
  quote: string;
  service: string;
  imageAlt: string;
  heading: {
    first: string;
    accent: string;
    last: string;
  };
};

export const sampleTestimonials: Review[] = [
  {
    id: `nabila`,
    name: `Nabila`,
    rating: 5,
    image: `/hair-styling.jpg`,
    service: `lash set client`,
    heading: { first: `Get`, accent: `ready`, last: `with me` },
    imageAlt: `Editorial beauty portrait of a woman in a red sari`,
    quote: `Sadia listened when I asked for natural lashes. They look fuller, but still like me.`,
  },
  {
    id: `aisha`,
    name: `Aisha`,
    rating: 5,
    image: `/testimonial-aisha.png`,
    service: `first-time lash client`,
    heading: { first: `You`, accent: `shine`, last: `your way` },
    quote: `I was nervous for my first set. Sadia explained everything and made me feel comfortable.`,
    imageAlt: `Editorial portrait of a fictional client in cream silk against an earthy brown backdrop`,
  },
  {
    id: `maya`,
    name: `Maya`,
    rating: 5,
    image: `/testimonial-maya.png`,
    service: `lash fill client`,
    heading: { first: `The`, accent: `magic`, last: `is yours` },
    quote: `I came in for a fill before a wedding. Sadia took her time, and they looked fresh again.`,
    imageAlt: `Editorial portrait of a fictional woman with a dark shoulder-length bob in burgundy satin against an earthy brown backdrop`,
  },
];
