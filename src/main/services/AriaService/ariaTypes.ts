export type Download = {
  gid: string;
  status: 'active' | 'waiting' | 'error' | 'paused' | 'removed' | 'complete';
  totalLength: number;
  completedLength: number;
  downloadSpeed: number;
  dir: string;
  files: { path: string }[];
  bittorrent?: {
    info: {
      name: string;
    };
  };
};
