export type ImageSectionImage = {
  src: string;
  srcset: string;
  alt: string;
  className?: string;
  loading?: "eager" | "lazy";
  fetchpriority?: "high" | "low" | "auto";
  sizes?: string;
  width?: number | string;
  height?: number | string;
  decoding?: "async" | "sync" | "auto";
};
