import path from 'path';

export const FilePaths = {
  REPORTS: path.join(process.cwd(), 'reports'),
  SCREENSHOTS: path.join(process.cwd(), 'screenshots'),
  VIDEOS: path.join(process.cwd(), 'videos'),
  TRACES: path.join(process.cwd(), 'traces'),
  LOGS: path.join(process.cwd(), 'logs'),
  TESTDATA: path.join(process.cwd(), 'src/testdata'),
  DOWNLOADS: path.join(process.cwd(), 'downloads')
};
