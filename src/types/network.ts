export interface NetworkInfo {
  connectionType: string;
  effectiveType: string;
  downlinkSpeedMbps: number;
  rttMs: number;
  saveData: boolean;
  onlineStatus: boolean;
  ipAddress: string;
  isp: string;
  location: string;
  gateway: string;
  dnsServer: string;
  rssi: number;
  frequencyBand: string;
  channel: number;
  bssid: string;
  ssid: string;
  securityProtocol: string;
  packetLossRate: number;
  jitterMs: number;
  lastUpdated: string;
}

export interface PingDataPoint {
  id: number;
  timestamp: string;
  latencyMs: number;
  status: 'ok' | 'slow' | 'fail';
  target: string;
}

export interface ChannelInfo {
  channel: number;
  frequencyMhz: number;
  band: '2.4 GHz' | '5 GHz' | '6 GHz';
  interferenceLevel: 'Low' | 'Moderate' | 'High';
  activeNetworksCount: number;
  recommended: boolean;
  utilizationPercent: number;
}

export interface SecurityCheckItem {
  id: string;
  title: string;
  category: 'Encryption' | 'Firewall & Ports' | 'DNS & Privacy' | 'Access Control';
  status: 'passed' | 'warning' | 'failed' | 'info';
  description: string;
  recommendation: string;
}
