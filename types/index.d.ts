interface MetricsOptions {
  cacheBuster?: boolean;
  commandCategory?: string;
  commandTracking?: boolean;
  consentSetting?: string;
  dryRun?: boolean;
  muted?: boolean;
  ipOverride?: string;
  trackDevMode?: boolean;
  trackSpecMode?: boolean;
}

interface GoogleEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
}

interface GoogleUrlParams {
  aip: string;
  cid: string;
  ds: string;
  t: string;
  tid: string;
  ua: string;
  v: string;
  vp: string;
}
