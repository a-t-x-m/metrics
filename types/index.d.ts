interface MetricsOptions {
  cacheBuster?: boolean;
  commandCategory?: string;
  commandTracking?: boolean;
  consentSetting?: string;
  dryRun?: boolean;
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
