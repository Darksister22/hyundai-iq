export interface PartTab {
  id: string;
  label: string;
  heading: string;
  intro: string;
  sections: { label: string; text: string }[];
  guarantees: string[];
  guaranteeImages: string[];
  images: string[];
}