export type Campaign = {
  id: string;
  title: string;
  type: string;
  summary: string;
  goal: number;
  raised: number;
  href: string;
};

export type EventProduct = {
  name: string;
  price: number;
  description: string;
};

export type ImpactMetric = {
  label: string;
  value: string;
};
