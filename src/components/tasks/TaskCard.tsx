import React from 'react';
import { ClipboardList, ArrowRight, Check } from 'lucide-react';
import Card from '../common/Card';
import { Task, Agent } from '../../types';

interface TaskCardProps {
  task: Task;
  agents: Agent[];
  onClick?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, agents, onClick }) => {
  const assignedAgent = agents.find(agent => agent.id === task.agentId);
  
  return (
    <Card 
      hoverable={!!onClick} 
      className="h-full"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="bg-purple-100 text-purple-800 rounded-full p-1.5">
          <ClipboardList size={18} />
        </div>
        
        {assignedAgent && (
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {assignedAgent.name}
          </span>
        )}
      </div>
      
      <h3 className="text-lg font-medium text-gray-800 mb-3">{task.description}</h3>
      
      <div className="flex items-start mb-4">
        <ArrowRight size={16} className="text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-gray-600">{task.expectedOutput}</p>
      </div>
      
      {task.dependencies.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <span className="text-xs font-medium text-gray-500 mb-2 block">Dependencies:</span>
          <div className="flex flex-wrap gap-2">
            {task.dependencies.map(depId => (
              <span key={depId} className="inline-flex items-center text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                <Check size={12} className="mr-1 text-green-500" />
                Task {depId.substring(0, 4)}...
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default TaskCard;