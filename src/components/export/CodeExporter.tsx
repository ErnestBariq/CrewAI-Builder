import React, { useState } from 'react';
import { Code, Copy, Check } from 'lucide-react';
import { Team } from '../../types';
import Button from '../common/Button';

interface CodeExporterProps {
  team: Team;
}

const CodeExporter: React.FC<CodeExporterProps> = ({ team }) => {
  const [copied, setCopied] = useState(false);
  
  // Generate Python code for crewAI
  const generateCode = () => {
    // Function to convert a string to a valid Python variable name
    const toPythonVar = (str: string) => {
      return str
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, '');
    };
    
    // Start with imports
    let code = `from crewai import Agent, Task, Crew, Process\n\n`;
    
    // Define tool imports if needed
    if (team.agents.some(agent => agent.tools.length > 0)) {
      code += `# Import tools based on your needs\n`;
      code += `from crewai.tools import WebSearchTool, FileReadTool, FileWriteTool\n\n`;
    }
    
    // Define agents
    code += `# Define agents\n`;
    team.agents.forEach(agent => {
      const agentVar = toPythonVar(agent.name);
      let agentCode = `${agentVar} = Agent(\n`;
      agentCode += `    role="${agent.role}",\n`;
      agentCode += `    goal="${agent.goal}",\n`;
      agentCode += `    backstory="${agent.backstory}",\n`;
      
      // Add tools if any
      if (agent.tools.length > 0) {
        agentCode += `    tools=[\n`;
        agent.tools.forEach(tool => {
          if (tool.id === 'web-search') {
            agentCode += `        WebSearchTool(),\n`;
          } else if (tool.id === 'file-manager') {
            agentCode += `        FileReadTool(),\n`;
            agentCode += `        FileWriteTool(),\n`;
          } else if (tool.id === 'code-interpreter') {
            agentCode += `        # Add your code interpreter tool here\n`;
          }
        });
        agentCode += `    ],\n`;
      }
      
      // Add allow_delegation
      agentCode += `    allow_delegation=${agent.allowDelegation.toString().toLowerCase()},\n`;
      
      // Add verbose flag
      agentCode += `    verbose=${agent.verbose.toString().toLowerCase()}\n`;
      
      agentCode += `)\n\n`;
      code += agentCode;
    });
    
    // Define tasks
    code += `# Define tasks\n`;
    team.tasks.forEach(task => {
      const taskVar = toPythonVar('task_' + task.description.substring(0, 20));
      let taskCode = `${taskVar} = Task(\n`;
      taskCode += `    description="${task.description}",\n`;
      
      // Find the agent for this task
      const agent = team.agents.find(a => a.id === task.agentId);
      if (agent) {
        taskCode += `    agent=${toPythonVar(agent.name)},\n`;
      }
      
      taskCode += `    expected_output="${task.expectedOutput}",\n`;
      
      // Add dependencies if any
      if (task.dependencies.length > 0) {
        taskCode += `    dependencies=[\n`;
        task.dependencies.forEach(depId => {
          const depTask = team.tasks.find(t => t.id === depId);
          if (depTask) {
            const depVar = toPythonVar('task_' + depTask.description.substring(0, 20));
            taskCode += `        ${depVar},\n`;
          }
        });
        taskCode += `    ],\n`;
      }
      
      taskCode += `)\n\n`;
      code += taskCode;
    });
    
    // Create the crew
    code += `# Create the crew\n`;
    code += `${toPythonVar(team.name)} = Crew(\n`;
    code += `    agents=[\n`;
    team.agents.forEach(agent => {
      code += `        ${toPythonVar(agent.name)},\n`;
    });
    code += `    ],\n`;
    code += `    tasks=[\n`;
    team.tasks.forEach(task => {
      const taskVar = toPythonVar('task_' + task.description.substring(0, 20));
      code += `        ${taskVar},\n`;
    });
    code += `    ],\n`;
    code += `    process=Process.sequential,  # or Process.hierarchical\n`;
    code += `    verbose=True\n`;
    code += `)\n\n`;
    
    // Run the crew
    code += `# Run the crew\n`;
    code += `result = ${toPythonVar(team.name)}.kickoff()\n`;
    
    return code;
  };
  
  const code = generateCode();
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Code size={20} className="mr-2 text-blue-500" />
          Export as CrewAI Code
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          icon={copied ? <Check size={16} /> : <Copy size={16} />}
        >
          {copied ? 'Copied!' : 'Copy Code'}
        </Button>
      </div>
      
      <div className="bg-gray-800 rounded-md p-4 overflow-auto max-h-[500px]">
        <pre className="text-gray-100 text-sm font-mono whitespace-pre">
          {code}
        </pre>
      </div>
      
      <p className="mt-4 text-sm text-gray-600">
        Copy this code and use it in your CrewAI application. You may need to adjust imports and tool configurations based on your specific requirements.
      </p>
    </div>
  );
};

export default CodeExporter;