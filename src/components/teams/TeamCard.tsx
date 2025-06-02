import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserCircle, ListTodo, Calendar } from 'lucide-react';
import Card from '../common/Card';
import { Team } from '../../types';

interface TeamCardProps {
  team: Team;
}

const TeamCard: React.FC<TeamCardProps> = ({ team }) => {
  const navigate = useNavigate();
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card 
      hoverable 
      className="h-full"
      onClick={() => navigate(`/teams/${team.id}`)}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{team.name}</h3>
        <div className="bg-blue-100 text-blue-800 rounded-full p-1.5">
          <Users size={18} />
        </div>
      </div>
      
      <p className="text-gray-600 mb-6 line-clamp-2">{team.description}</p>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center">
          <UserCircle size={16} className="text-gray-500 mr-2" />
          <span className="text-sm text-gray-600">{team.agents.length} Agents</span>
        </div>
        <div className="flex items-center">
          <ListTodo size={16} className="text-gray-500 mr-2" />
          <span className="text-sm text-gray-600">{team.tasks.length} Tasks</span>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center">
          <Calendar size={14} className="text-gray-400 mr-1" />
          <span className="text-xs text-gray-500">Updated {formatDate(team.updatedAt)}</span>
        </div>
      </div>
    </Card>
  );
};

export default TeamCard;