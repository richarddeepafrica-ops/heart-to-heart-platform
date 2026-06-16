export type ImpactStory = {
  slug: string;
  name: string;
  image: string;
  story: string;
  sponsorHref?: string;
};

export const impactStories: ImpactStory[] = [
  {
    slug: "joy-wambui",
    name: "Joy Wambui",
    image: "/assets/impact/joy-wambui.png",
    story: "Just like her name, Joy is a joyful girl. Born deaf and unable to speak, she underwent open heart surgery and reminds us to be thankful for the simple things we often take for granted.",
    sponsorHref: "/sponsor/joy-wambui"
  },
  {
    slug: "jsean-kairu",
    name: "J'sean Kairu",
    image: "/assets/impact/jsean-kairu.jpeg",
    story: "J'sean is a daddy's boy. He underwent successful open heart surgery, and his father stayed with him through the entire hospital journey.",
    sponsorHref: "/sponsor/jsean-kairu"
  },
  {
    slug: "jedidah-mukami",
    name: "Jedidah Mukami",
    image: "/assets/impact/jedidah-story.jpg",
    story: "Schools are among H2HF's biggest sponsors. Jedidah was referred through school, and after surgery the entire school visited her. Her recovery brought relief to her family and school community."
  },
  {
    slug: "leon-karanja",
    name: "Leon Karanja",
    image: "/assets/impact/leon-story.jpg",
    story: "Master Leon kept his beautiful smile even after surgery in the ICU. His joyful personality was contagious to everyone who met him."
  },
  {
    slug: "anjema",
    name: "Anjema",
    image: "/assets/impact/anjema.jpg",
    story: "Anjema is a very jolly girl born with Down syndrome. Her parents went out of their way to get help and make sure she received the right surgery for her heart condition through H2HF."
  },
  {
    slug: "repha",
    name: "Repha",
    image: "/assets/impact/repha.jpg",
    story: "Repha was awaiting surgery in the same year she sat for her K.C.P.E. final exams. She passed and was able to pursue her secondary education."
  },
  {
    slug: "lydia",
    name: "Lydia",
    image: "/assets/impact/lydia.jpg",
    story: "Lydia was living in a children's home and estranged from her mother. After successful surgery, one sponsor helped restore the family by taking Lydia to boarding school and buying land for the family to build."
  }
];

export function findImpactStory(slug: string) {
  return impactStories.find((story) => story.slug === slug);
}
