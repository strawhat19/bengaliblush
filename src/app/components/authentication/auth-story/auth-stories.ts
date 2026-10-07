export const authStories = [
  {
    id: `glow`,
    label: `Soft Glam · Bengali Warmth`,
    title: `Come for the glow.`,
    accent: `Stay for the feeling.`,
    detail: `Atlanta, Georgia · By appointment`,
    description: `Modern glam, Bengali warmth, and a little extra time in the mirror. Your beauty ritual starts here.`,
  },
  {
    id: `beauty`,
    label: `Your Look · Your Way`,
    title: `A little extra blush.`,
    accent: `A whole lot of you.`,
    detail: `Lash services · Hair styling · Party makeup`,
    description: `Fluttery lashes, polished waves, and luminous party makeup. Thoughtful details for everyday rituals and your next main character moment.`,
  },
  {
    id: `story`,
    label: `California Girls · Our Story`,
    title: `Bangladesh. Los Angeles.`,
    accent: `Beautifully Atlanta.`,
    detail: `Sadia Islam Misty · Certified Lash Technician`,
    description: `Bengali roots, California inspiration, and an Atlanta beauty studio. Meet Sadia Islam Misty, the heart behind Bengali Blush.`,
  },
] as const;

export type AuthStoryId = (typeof authStories)[number][`id`];
