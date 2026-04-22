export type PlantId =
  | "aurobindo-u7"
  | "aurobindo-u8"
  | "msn-unit2"
  | "msn-unit4";

export interface Plant {
  id: PlantId;
  label: string;
  organisation: "Aurobindo" | "MSN";
  unit: string;
  focus: string;
}

export const PLANTS: Plant[] = [
  {
    id: "aurobindo-u7",
    label: "Aurobindo — Unit 7",
    organisation: "Aurobindo",
    unit: "Unit 7",
    focus: "Sterile injectables",
  },
  {
    id: "aurobindo-u8",
    label: "Aurobindo — Unit 8",
    organisation: "Aurobindo",
    unit: "Unit 8",
    focus: "OSD formulations",
  },
  {
    id: "msn-unit2",
    label: "MSN — Unit II",
    organisation: "MSN",
    unit: "Unit II",
    focus: "API",
  },
  {
    id: "msn-unit4",
    label: "MSN — Unit IV",
    organisation: "MSN",
    unit: "Unit IV",
    focus: "Formulations",
  },
];

export const PLANT_COOKIE = "mkt_plant";
