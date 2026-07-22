import path from 'path';

export const FilePaths = {
  REPORTS: path.join(process.cwd(), 'reports'),
  SCREENSHOTS: path.join(process.cwd(), 'reports', 'screenshots'),
  VIDEOS: path.join(process.cwd(), 'reports', 'videos'),
  LOGS: path.join(process.cwd(), 'reports', 'logs'),
  TESTDATA: path.join(process.cwd(), 'src/core/data/testdata'),
  DOWNLOADS: path.join(process.cwd(), 'downloads')
};
