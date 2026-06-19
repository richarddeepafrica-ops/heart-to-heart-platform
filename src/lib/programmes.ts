export type ProgrammeRecord = {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  imageUrl: string;
  introduction: string[];
  results: string[];
};

export const programmes: ProgrammeRecord[] = [
  {
    slug: "treatment",
    title: "Treatment",
    eyebrow: "Open-heart surgery in children",
    summary: "Open-heart surgery in children and support for patients who need donated pacemakers, heart valves, medication, and screening.",
    imageUrl: "/assets/programmes/treatment-care.png",
    introduction: [
      "Open-heart Surgery in Children. Assisting patients to acquire donated pacemakers."
    ],
    results: [
      "Perform heart surgeries to over 250 patients",
      "Donate heart valves worth over 5 million shillings",
      "Assist patients acquire pacemakers worth over 3 million shillings",
      "Donation of drugs such as warfarin (coumadin) to patients worth over 1.5 million shillings",
      "Organize over 25 successful open heart camps",
      "Organize yearly heart screening camps in Kenya - Nairobi, Nakuru, Nyeri, Kisumu, Mombasa - reaching over 10,000 patients",
      "Reach the region via heart screening camps in Burundi, Rwanda, Congo and Tanzania, reaching over 1,500 patients"
    ]
  },
  {
    slug: "prevention",
    title: "Prevention",
    eyebrow: "Training Programs Since 2006",
    summary: "Assisting nurses and doctors to acquire training in cardiac fields while creating awareness in schools and communities.",
    imageUrl: "/assets/programmes/prevention-education.png",
    introduction: [
      "Training Programs Since 2006",
      "Assisting nurses and doctors to acquire training in cardiac fields."
    ],
    results: [
      "In conjunction with The Karen Hospital, participated in several training programs since 2006 targeting medical professionals",
      "Laparascopic Training",
      "ENT workshop",
      "Cath Lab Training",
      "ENT Training",
      "Advanced Life Support Training",
      "Continuous Medical Education Trainings",
      "Annual teachers workshop aimed in creating awareness in schools"
    ]
  },
  {
    slug: "fundraising",
    title: "Fundraising",
    eyebrow: "Raising funds through fundraising activities",
    summary: "The Foundation supports its programmes through annual fundraising activities including the Heart Run and Gala Dinner.",
    imageUrl: "/assets/programmes/heart-run-family.png",
    introduction: [
      "Raising funds through the Fundraising Activities",
      "The Foundation supports its programs by raising funds through the Fundraising programs:",
      "The Annual Heart-Run",
      "The Annual Gala Dinner"
    ],
    results: [
      "Successfully held yearly fundraising events since 1994",
      "Over 15 successful annual fundraising events held since 1993",
      "Over 1.5 million shillings raised from membership drive",
      "Over 120 million shillings raised",
      "Allocated on average 75% of net income on the medical operations of children and rheumatic program"
    ]
  },
  {
    slug: "research",
    title: "Research",
    eyebrow: "In joint collaboration",
    summary: "Research and prevention work with the Ministry of Health and the University of Nairobi through the RFPP programme.",
    imageUrl: "/assets/programmes/research-lab.png",
    introduction: [
      "In Joint Collaboration with the Ministry of Health and the University of Nairobi.",
      "The RFPP was initiated in 1996 in joint collaboration with the Ministry of Health and the University of Nairobi.",
      "The Program's broad primary objectives include raising the profile of RF as a preventable disease, improving diagnosis standards, and sensitizing practitioners to provide client, patient, family, and community education."
    ],
    results: [
      "Training 10,000 health care providers as TOTs",
      "Establishing 34 intervention sites in 4 provinces of Kenya",
      "Reaching over 2 million community members with the prevention message",
      "Production and distribution of educational materials for both health workers and the community",
      "Through improved diagnosis, health workers diagnosed over 300 rheumatic heart disease cases who have since either been referred for surgery or are being followed up in their clinics"
    ]
  }
];

export function getProgramme(slug: string) {
  return programmes.find((programme) => programme.slug === slug);
}
