export type StatusType = "traditional" | "disputed" | "archaeological";

export type Kanda =
  | "Bala Kanda"
  | "Ayodhya Kanda"
  | "Aranya Kanda"
  | "Kishkindha Kanda"
  | "Sundara Kanda"
  | "Yuddha Kanda"
  | "Uttara Kanda";

export interface Location {
  id: string;
  name: string;
  modernIdentification: string;
  coordinates: [number, number]; // [lat, lng]
  kanda: Kanda;
  description: string;
  status: StatusType;
  sources: string[];
  sequenceOrder: number;
  alternateTheory?: string; // Optional note for disputed alternate identifications
}

export interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
}

export const STATUS_CONFIG: Record<StatusType, StatusConfig> = {
  traditional: {
    label: "Traditional",
    color: "#C4872A",
    bgColor: "bg-amber-100",
    borderColor: "border-amber-400",
    description: "Site identified through continuous pilgrimage tradition and textual correspondence",
  },
  disputed: {
    label: "Disputed",
    color: "#B85C38",
    bgColor: "bg-red-100",
    borderColor: "border-red-400",
    description: "Identification contested among scholars; multiple competing theories exist",
  },
  archaeological: {
    label: "Archaeological",
    color: "#5C7A4E",
    bgColor: "bg-green-100",
    borderColor: "border-green-400",
    description: "Site supported by material evidence from excavation or remote sensing studies",
  },
};
