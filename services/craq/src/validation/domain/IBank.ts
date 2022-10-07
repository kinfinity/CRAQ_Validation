export interface jsonBank {
  serialize(): void;
  deserialize(file: string): void;
}
