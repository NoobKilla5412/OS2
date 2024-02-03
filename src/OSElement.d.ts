export interface OSElement {
  init(): Promise<void>;
  draw(): void;
}
