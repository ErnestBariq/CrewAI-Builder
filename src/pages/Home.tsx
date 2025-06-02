import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTeamContext } from '../context/TeamContext';
import TeamCard from '../components/teams/TeamCard';
import TeamForm from '../components/teams/TeamForm';
import Button from '../components/common/Button';

const Home: React.FC = () => {
  const { teams } = useTeamContext();
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your CrewAI Teams</h1>
          <p className="text-gray-600">
            Create and manage your AI agent teams for collaborative workflows
          </p>
        </div>
        
        <Button
          className="mt-4 md:mt-0"
          onClick={() => setShowCreateModal(true)}
          icon={<Plus size={18} />}
        >
          Create New Team
        </Button>
      </div>
      
      {teams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map(team => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <h3 className="text-lg font-medium text-gray-800 mb-2">No Teams Yet</h3>
          <p className="text-gray-600 mb-6">
            Create your first team to start building your AI agent workflows
          </p>
          <Button
            onClick={() => setShowCreateModal(true)}
            icon={<Plus size={18} />}
          >
            Create New Team
          </Button>
        </div>
      )}
      
      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <TeamForm onClose={() => setShowCreateModal(false)} />
        </div>
      )}
    </div>
  );
};

export default Home;