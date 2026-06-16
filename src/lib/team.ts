export type TeamProfile = {
  slug: string;
  name: string;
  shortName: string;
  role: string;
  image: string;
  note: string;
  category: "founder" | "board";
  headline: string;
  story: string[];
};

export const teamProfiles: TeamProfile[] = [
  {
    slug: "dr-dan-gikonyo",
    name: "Dr. Dan K. Gikonyo",
    shortName: "Dr. Dan Gikonyo",
    role: "Founder and Trustee",
    image: "/assets/team/dan-gikonyo.jpg",
    category: "founder",
    note: "Co-founder of the foundation and part of the clinical leadership that shaped its mission for children's heart care.",
    headline: "Founder and Trustee, The Heart to Heart Foundation",
    story: [
      "Dr. Dan Gikonyo is the Founder, Director, and Chief Cardiologist at The Karen Hospital. With over 43 years of experience, he is a leading specialist in interventional and non-invasive adult cardiology, maintaining a highly successful practice. Over his illustrious career, he has attended to thousands of patients from across the globe.",
      "In philanthropy, Dr. Dan Gikonyo co-founded the Heart to Heart Foundation in 1993 alongside his wife. The Foundation raises funds to provide treatment for underprivileged children with heart ailments and promotes heart disease prevention nationwide. They also initiated the annual Heart Run in 1994, a charity event that continues to make a significant impact.",
      "A passionate educator and mentor, Dr. Dan Gikonyo has played a significant role in training the majority of adult cardiologists in Kenya and the broader region. He holds a Post-Doctoral Fellowship in Adult Cardiology from the University of Minnesota, USA, and is a member of the American College of Cardiology. He has also served as a lecturer at the Faculty of Medicine, University of Nairobi, Kenya.",
      "Dr. Dan Gikonyo’s research experience includes roles as a scholar in cardiology at Abbott Northwestern Hospital and the Mayo Clinic in Rochester, Minnesota. His contributions extend to professional organizations as a member of the Kenya Medical Association, the Kenya Cardiac Society, and the East and Central Africa Association of Physicians. He has also participated in numerous international conferences and authored several papers on cardiac health and related topics.",
      "Notably, he served as the personal physician to the Third President of the Republic of Kenya. Beyond his professional achievements, he is the Patron of the Kagumo Old Boys Association, demonstrating his commitment to community service.",
      "Dr. Dan Gikonyo is also a celebrated author, sharing his inspiring journey and insights in his book, Doctor at Heart. With his extensive expertise, unwavering dedication, and visionary leadership, Dr. Gikonyo continues to guide the Heart to Heart Foundation as a trustee, ensuring its mission to save young lives and foster healthier communities remains at the forefront."
    ]
  },
  {
    slug: "dr-betty-gikonyo",
    name: "Dr. Betty M. Gikonyo",
    shortName: "Dr. Betty Gikonyo",
    role: "Founder and Trustee",
    image: "/assets/team/betty-gikonyo.jpg",
    category: "founder",
    note: "Co-founder and trustee helping steward a long-running Kenyan effort for prevention, treatment, and access.",
    headline: "Founder and Trustee, The Heart to Heart Foundation",
    story: [
      "Dr. Betty Muthoni Gikonyo: A Trailblazer in Healthcare and Philanthropy",
      "Dr. Betty Muthoni Gikonyo is a renowned pediatric cardiologist and visionary leader with a career spanning over 45 years. She has dedicated her life to transforming healthcare for children in Kenya and uplifting communities through her philanthropic endeavors.",
      "As the co-founder of the Heart to Heart Foundation in 1993, Dr. Betty Gikonyo has championed life-saving initiatives for underprivileged children suffering from heart ailments. She and her husband pioneered the Heart Run in 1994, a popular annual charity event that continues to raise funds and awareness. Under her leadership, the Foundation provides curative services to children under 18 and promotes nationwide education on heart disease prevention.",
      "Professional Journey and Contributions",
      "Dr. Betty Gikonyo’s journey in medicine began as a medical officer, progressing to a pediatrician, and later becoming Kenya’s first female cardiologist. She has played a pivotal role in mentoring and training the majority of pediatric cardiologists in the country. Her impact extends beyond medicine to hospital administration, where she served as Hospital Administrator for 15 years.",
      "Dr. Betty Gikonyo is the Founder and CEO of The Karen Hospital Healthcare System, which includes The Karen Hospital, a tertiary specialty hospital; eight satellite outpatient medical centers; a medical training college; and the Heart to Heart Foundation.",
      "Leadership and Public Service",
      "Her leadership extends to academia and public service. Dr. Betty Gikonyo served for 14 years on the University of Nairobi Council, rising to the position of Deputy Chair. She also founded and launched the University of Nairobi Alumni Association in 2005. Between 2004 and 2011, she chaired the Nairobi Health Management Board, transforming healthcare delivery in the city.",
      "Dr. Betty Gikonyo is a trustee of the Presbyterian University of East Africa (PUEA) and an associate member of the Kagumo Old Boys Association.",
      "Recognition and Awards",
      "Dr. Betty Gikonyo has received numerous accolades for her contributions, including:",
      "Presidential Awards: Moran of the Burning Spear (MBS) in 2008 and Silver Star (SS) in 1998.",
      "CEO Global Limited East Africa Regional Award: Most Influential Woman in the Medical Category, 2017.",
      "International Women’s Day Recognition: Highlighted as one of the women who made Kenya, Sunday Standard, 2020.",
      "Leadership in Healthcare Award: 2023 Quality Healthcare Awards.",
      "Kenya@60 Recognition: Named among the 60 most inspiring women in Kenya, Daily Nation, 2023.",
      "Media Features and Authorship",
      "Dr. Betty Gikonyo’s inspiring story has been showcased internationally on CNN African Voices and the BBC’s Africa Business Report, and locally across print and television media. She is also the author of The Girl Who Dared to Dream, an inspiring memoir that highlights her journey and the power of philanthropy.",
      "Community Engagement",
      "A charter and active member of the Rotary Club of Karen and a Paul Harris Fellow, Dr. Betty Gikonyo continues to uplift and inspire young girls, including as an alumna of Kiamabara Primary School in Nyeri County.",
      "Above all, Dr. Betty Gikonyo remains steadfast in her commitment to accessible healthcare and giving back to society. She is truly The Girl Who Dared to Dream, embodying courage, innovation, and compassion."
    ]
  },
  {
    slug: "anthony-mathiga",
    name: "Mr. Anthony M. Mathiga",
    shortName: "Mr. Anthony M. Mathiga",
    role: "Chairman",
    image: "/assets/team/anthony-mathiga.png",
    category: "board",
    note: "Board chairman supporting governance, partnerships, and long-term stewardship.",
    headline: "Chairman, The Heart to Heart Foundation",
    story: [
      "Mr. Anthony M. Mathiga supports the foundation through governance, stewardship, and leadership oversight."
    ]
  },
  {
    slug: "karimi-randall",
    name: "Mr. Karimi Randall",
    shortName: "Karimi Randall",
    role: "Executive Director",
    image: "/assets/team/karimi-randall.jpg",
    category: "board",
    note: "Executive Director connecting programmes, partnerships, fundraising, and delivery.",
    headline: "Executive Director, The Heart to Heart Foundation",
    story: [
      "Karimi Randall is a visionary leader in healthcare and social equity, dedicated to creating lasting change through innovative initiatives and compassionate service. With a wealth of experience and a deep understanding of the challenges faced by underserved populations, he has committed his career to improving healthcare access and addressing critical needs.",
      "As the Executive Director of The Heart to Heart Foundation, Karimi oversees programs aimed at bridging healthcare gaps, raising awareness, and delivering practical solutions to those in need. His approach emphasizes collaboration, sustainability, and community-driven impact, ensuring that the foundation’s initiatives address not just immediate needs but also long-term wellbeing.",
      "Karimi’s leadership is rooted in his unwavering belief in the power of collective effort to create healthier, more equitable futures. His work is defined by a hands-on approach, fostering empowerment, and amplifying the voices of individuals and families often left behind. Through his dedication, Karimi strives to inspire hope and bring about meaningful transformation in the lives of those he serves."
    ]
  },
  {
    slug: "carolyne-nandwa",
    name: "Ms. Carolyne Nandwa",
    shortName: "Ms. Carolyne Nandwa",
    role: "Project Manager",
    image: "/assets/team/carolyne-nandwa.png",
    category: "board",
    note: "Project Manager guiding programmes, partnerships, implementation, and long-term delivery.",
    headline: "Project Manager, Heart to Heart Foundation",
    story: [
      "Carolyne Nandwa is a driven Project Manager at the Heart to Heart Foundation, bringing over 15 years of proven success in leading and managing complex development programs. Prior to this role, she spearheaded the Karen Hospital Medical School Project, guiding the organizing committee from inception to completion. This project remains a significant pillar in fulfilling the hospital’s mission and vision while serving as a key revenue stream.",
      "Carolyne is recognized for her exceptional ability to strategically identify, devise, and implement impactful health programming, fundraising, and strategic management initiatives. Her expertise extends to building strong partner and stakeholder relationships across diverse organizational levels, including senior management, consultants, and external collaborators, driving long-term organizational objectives.",
      "She holds a Bachelor of Arts in Counseling Psychology and is currently pursuing a Master of Arts in Psychology (with a focus on Trauma) at Africa International University. Her extensive academic background includes: Professional Certificate in Monitoring and Evaluation from Kenya Institute of Management , Higher Diploma in Project Management from Kenya Institute of Management , Diploma in Business Management from Kenya Institute of Management , Diploma in Theology and Additional certifications in Leadership and Management, Manager Training, Curriculum Development, and Basic Lifesaving.",
      "She is recognized for her exceptional ability to strategically identify, devise, and implement impactful health programming, fundraising, and strategic management initiatives. Her expertise extends to building strong partner and stakeholder relationships across diverse organizational levels, including senior management, consultants, and external collaborators, driving long-term organizational objectives.",
      "Carolyne’s dedication to fostering collaborative environments and her commitment to continuous improvement have been pivotal in achieving organizational goals. Her unique blend of analytical thinking, proactive problem-solving, and strategic planning ensures the successful execution of multifaceted projects. She is passionate about leveraging her experiences to drive innovative programs that deliver meaningful and lasting impact."
    ]
  }
];

export function getTeamProfile(slug: string) {
  return teamProfiles.find((profile) => profile.slug === slug);
}

export const founderProfiles = teamProfiles.filter((profile) => profile.category === "founder");
export const boardProfiles = teamProfiles.filter((profile) => profile.category === "board");
