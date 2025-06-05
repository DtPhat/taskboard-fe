import { api } from './api';

export interface GitHubBranch {
  name: string;
  lastCommitSha: string;
}

export interface GitHubPullRequest {
  title: string;
  pullNumber: string;
}

export interface GitHubIssue {
  title: string;
  issueNumber: string;
}

export interface GitHubCommit {
  sha: string;
  message: string;
}

export interface GitHubInfo {
  repositoryId: string;
  branches: GitHubBranch[];
  pulls: GitHubPullRequest[];
  issues: GitHubIssue[];
  commits: GitHubCommit[];
}

export const githubService = {
  // Get GitHub information for a repository
  getRepositoryInfo: async (repositoryId: string): Promise<GitHubInfo> => {
    const response = await api.get<GitHubInfo>(`/repositories/${repositoryId}/github-info`);
    return response.data;
  },
}; 