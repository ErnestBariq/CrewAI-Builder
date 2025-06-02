// Agent Types
export interface Agent {
  id: string;
  name: string;
  role: string;
  goal: string;
  backstory: string;
  allowDelegation: boolean;
  verbose: boolean;
  tools: Tool[];
}

// Tool Types
export interface Tool {
  id: string;
  name: string;
  description: string;
}

// Team Types
export interface Team {
  id: string;
  name: string;
  description: string;
  agents: Agent[];
  tasks: Task[];
  createdAt: Date;
  updatedAt: Date;
}

// Task Types
export interface Task {
  id: string;
  description: string;
  agentId: string; // ID of the agent assigned to this task
  expectedOutput: string;
  dependencies: string[]; // IDs of tasks that must be completed before this one
}