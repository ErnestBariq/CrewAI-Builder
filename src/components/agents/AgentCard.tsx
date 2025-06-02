import React from 'react';
import { UserCircle, PenTool as Tool, Lightbulb, MessageSquare } from 'lucide-react';
import Card from '../common/Card';
import { Agent } from '../../types';

interface AgentCardProps {
  agent: Agent;
  onClick?: () => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, onClick }) => {
  return (
    <Card 
      hoverable={!!onClick} 
      className="h-full transition-all duration-300"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{agent.name}</h3>
        <div className="bg-green-100 text-green-800 rounded-full p-1.5">
          <UserCircle size={18} />
        </div>
      </div>
      
      <div className="mb-4">
        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
          {agent.role}
        </span>
      </div>
      
      <div className="flex items-start mb-4">
        <Lightbulb size={16} className="text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-gray-600 line-clamp-2">{agent.goal}</p>
      </div>
      
      <div className="flex items-start mb-4">
        <MessageSquare size={16} className="text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-gray-600 line-clamp-2">{agent.backstory}</p>
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500">Tools:</span>
          <div className="flex space-x-1">
            {agent.tools.map(tool => (
              <div key={tool.id} className="tooltip" data-tip={tool.name}>
                <Tool size={14} className="text-gray-400" />
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-4">
            <span className={`text-xs px-2 py-0.5 rounded-full ${agent.allowDelegation ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
              {agent.allowDelegation ? 'Can Delegate' : 'No Delegation'}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${agent.verbose ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
              {agent.verbose ? 'Verbose' : 'Concise'}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AgentCard;