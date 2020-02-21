interface MetricsOptions {
  cacheBuster?: boolean;
  muted?: boolean;
}

interface GoogleEvent {
  category: string;
  action: string;
  label?: string;
  value?: Number;
}
