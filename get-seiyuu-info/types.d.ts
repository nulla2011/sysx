export {};

declare global {
  interface String {
    removeHeimu(): string;
    removeRef(): string;
    removeDel(): string;
    removeInternalLink(): string;
    removeSource(): string;
    replaceLangJa(): string;
  }
}
