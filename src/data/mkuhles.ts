import mkuhlesData from "./mkuhles.json";
import type { MkuhlesData } from "../types/MkuhlesData";

const typedMkuhles: MkuhlesData = mkuhlesData;

export const mkuhles = typedMkuhles;
export const { contact, profile, skills, experience, education } = mkuhles;
