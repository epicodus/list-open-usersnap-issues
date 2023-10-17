// For Github workflow, set ORG and INSTALLATION_TOKEN env variables
// For local use, set ORG, PRIVATE_KEY, APP_ID, INSTALLATION_ID env variables

import { default as axios } from 'axios';
import { getInstallationAccessToken } from './getInstallationToken.mjs';
import "dotenv/config";

const repos = [
  'pre-work-full-stack',
  'intro-full-stack',
  'javascript-full-stack',
  'react-full-stack',
  'c-sharp-full-stack',
  'career-services-full-stack',
  'shared-full-stack',
  'DEI-full-stack',
  'capstone',
  'workshops',
];

const org = process.env.ORG;
const INSTALLATION_ACCESS_TOKEN = process.env.INSTALLATION_TOKEN || await getInstallationAccessToken();

async function getOpenIssues(repo) {
  const client = axios.create({
    baseURL: `https://api.github.com/repos/${org}/${repo}/issues?state=open&sort=created&direction=desc`,
    headers: {
      Accept: "application/vnd.github.raw+json",
      Authorization: `Bearer ${INSTALLATION_ACCESS_TOKEN}`,
    },
  });
  try {
    const response = await client.get('/');
    return response.data;
  } catch(e) {
    console.error(e);
  }
}

for (const repo of repos) {
  console.log(`\n${repo.toUpperCase()}...`);
  const openIssues = await getOpenIssues(repo);
  const usersnapIssues = openIssues.filter(issue => issue.title.includes('[Usersnap]'));
  for (const issue of usersnapIssues) {
    console.log('');
    console.log(new Date(issue.created_at).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
    console.log(issue.title);
    console.log(issue.html_url);
  }
}
