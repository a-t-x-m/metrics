interface MetricsOptions {
  cacheBuster?: boolean;
  commandAction?: string | string[];
  commandCategory?: string;
  muted?: boolean;
}

interface GoogleEvent {
  category: string;
  action: string;
  label?: string;
  value?: Number;
}
