import { StringRegexArr } from '../../types/Sentry/OptionType';

export interface HttpClientIntegrationOptions {
  failedRequestStatusCodes: ([number, number] | number)[];
  failedRequestTargets: StringRegexArr;
}

export interface CaptureConsoleIntegrationOptions {
  levels: string[];
}

export interface InitOptions {
  env: string;
  dsn: string;
  debug: boolean;
  release: string;
  requiredEnvForSendToSentry?: string[];
  ignoreErrorsOptions?: StringRegexArr;
  httpClientIntegrationOptions?: HttpClientIntegrationOptions;
  captureConsoleIntegrationOptions?: CaptureConsoleIntegrationOptions;
  beforeSend?: (event: any, hint: any) => any;
  options?: any;
}
