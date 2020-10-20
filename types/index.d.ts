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

interface MetricsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
}

interface GoogleUrlParams extends Record<string, string | number | boolean> {
  aip?: number | string;
  cid?: string;
  ds?: string;
  ea?: string;
  ec?: string;
  el?: string;
  ev?: string;
  t?: string;
  tid?: string;
  ua?: string;
  uip?: string;
  v?: number | string;
  vp?: string;
  z?: number;
}

interface MatomoUrlParams extends Record<string, string | number | boolean> {
  _id: string;
  apiv: number | string;
  e_a?: string;
  e_c?: string;
  e_l?: string;
  e_v?: string;
  idsite: string;
  rec: number | string;
  res: string;
  ua: string;
}

interface ShortHashOptions {
  algorithm?: 'sha1' | 'sha256' | 'sha512';
  length?: number;
}
