import { FormatAs } from '../../types/Config/OptionType';
import { OutputOptions } from './OutputOptions';

export interface ConfigOptions {
  spreadsheetId: string;
  spreadsheetTab: string;
  formatAs: FormatAs;
  output: OutputOptions;
}
