interface MetricsOptions {
  cacheBuster?: boolean;
  commandAction?: string | string[];
  commandCategory?: string;
  consentSetting?: string;
  muted?: boolean;
  trackDevMode?: boolean;
  trackSpecMode?: boolean;
}

interface GoogleEvent {
  category: string;
  action: string;
  label?: string;
  value?: Number;
}
