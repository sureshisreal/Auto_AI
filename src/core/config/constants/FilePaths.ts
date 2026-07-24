import path from 'path';

export const FilePaths = {
  REPORTS: path.join(process.cwd(), 'reports'),
  SCREENSHOTS: path.join(process.cwd(), 'reports', 'screenshots'),
  VIDEOS: path.join(process.cwd(), 'reports', 'videos'),
  LOGS: path.join(process.cwd(), 'reports', 'logs'),
  TESTDATA: path.join(process.cwd(), 'src/core/data/testdata'),
  DOWNLOADS: path.join(process.cwd(), 'downloads'),
  VISUAL_BASELINE: path.join(process.cwd(), 'reports', 'visual', 'baseline'),
  VISUAL_DIFF: path.join(process.cwd(), 'reports', 'visual', 'diff'),
  VISUAL_ACTUAL: path.join(process.cwd(), 'reports', 'visual', 'actual'),
};
