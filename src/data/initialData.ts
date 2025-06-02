import { Team, Agent, Task, Tool } from '../types';

// Sample tools
export const sampleTools: Tool[] = [
  {
    id: 'web-search',
    name: 'Web Search',
    description: 'Search the web for information',
  },
  {
    id: 'code-interpreter',
    name: 'Code Interpreter',
    description: 'Write and execute code',
  },
  {
    id: 'file-manager',
    name: 'File Manager',
    description: 'Read and write files',
  },
];

// Sample agents
export const sampleAgents: Agent[] = [
  {
    id: 'researcher',
    name: 'Research Specialist',
    role: 'Researcher',
    goal: 'Find and analyze information from various sources',
    backstory: 'An expert at gathering and synthesizing information from multiple sources',
    allowDelegation: true,
    verbose: false,
    tools: [sampleTools[0], sampleTools[2]],
  },
  {
    id: 'developer',
    name: 'Code Expert',
    role: 'Developer',
    goal: 'Write efficient, clean code to solve problems',
    backstory: 'A seasoned software engineer with expertise in multiple programming languages',
    allowDelegation: false,
    verbose: true,
    tools: [sampleTools[1], sampleTools[2]],
  },
];

// Sample tasks
export const sampleTasks: Task[] = [
  {
    id: 'research-task',
    description: 'Research the latest trends in AI development',
    agentId: 'researcher',
    expectedOutput: 'A comprehensive report on AI trends',
    dependencies: [],
  },
  {
    id: 'code-task',
    description: 'Develop a simple prototype based on research findings',
    agentId: 'developer',
    expectedOutput: 'A working prototype with documentation',
    dependencies: ['research-task'],
  },
];

// Sample team
export const sampleTeam: Team = {
  id: 'team-1',
  name: 'AI Development Team',
  description: 'A team focused on researching and developing AI solutions',
  agents: sampleAgents,
  tasks: sampleTasks,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Sample teams list
export const sampleTeams: Team[] = [sampleTeam];