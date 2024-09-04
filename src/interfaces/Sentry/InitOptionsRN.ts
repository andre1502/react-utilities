import { InitOptions } from './InitOptions';

export interface InitOptionsRN extends Omit<InitOptions, 'release'> {
  release?: string;
}
