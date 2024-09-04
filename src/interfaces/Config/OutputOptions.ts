import { ExportAs } from '../../types/Config/OptionType';

export interface OutputOptions {
  folder: string;
  filename: string;
  isFilenameLowercase?: boolean;
  exportAs?: ExportAs;
}
