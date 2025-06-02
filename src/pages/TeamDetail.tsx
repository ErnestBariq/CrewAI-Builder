import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PlusCircle, ArrowLeft, Edit, Trash2, Users, ListChecks, Code } from 'lucide-react';
import { useTeamContext } from '../context/TeamContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import AgentCard from '../components/agents/AgentCard';
import AgentForm from '../components/agents/AgentForm';
import TaskCard from '../components/tasks/TaskCard';
import TaskForm from '../components/tasks/TaskForm';
import TeamForm from '../components/teams/TeamForm';
import TeamVisualizer from '../components/visualization/TeamVisualizer';
import CodeExporter from '../components/export/CodeExporter';

const TeamDetail: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const { teams, deleteTeam, setCurrentTeam } = useTeamContext();
  
  const [activeTab, setActiveTab] = useState<'agents' | 'tasks' | 'visualize' | 'export'>('agents');
  const [showAgentForm, setShowAgentForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showEditTeamForm, setShowEditTeamForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingAgent, setEditingAgent] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  
  // Find the team
  const team = teams.find(t => t.id === teamId);
  
  useEffect(() => {
    if (team) {
      setCurrentTeam(team);
    }
    
    return () => {
      setCurrentTeam(null);
    };
  }, [team, setCurrentTeam]);
  
  // Handle team not found
  if (!team) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Team Not Found</h2>
        <p className="text-gray-600 mb-6">
          The team you're looking for doesn't exist or has been deleted.
        </p>
        <Button onClick={() => navigate('/')}>
          Back to Teams
        </Button>
      </div>
    );
  }
  
  const handleDeleteTeam = () => {
    deleteTeam(team.id);
    navigate('/');
  };
  
  const handleEditAgent = (agentId: string) => {
    setEditingAgent(agentId);
    setShowAgentForm(true);
  };
  
  const handleEditTask = (taskId: string) => {
    setEditingTask(taskId);
    setShowTaskForm(true);
  };
  
  const selectedAgent = editingAgent ? team.agents.find(a => a.id === editingAgent) : undefined;
  const selectedTask = editingTask ? team.tasks.find(t => t.id === editingTask) : undefined;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Teams
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{team.name}</h1>
          <p className="text-gray-600">{team.description}</p>
        </div>
        
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Button
            variant="outline"
            onClick={() => setShowEditTeamForm(true)}
            icon={<Edit size={16} />}
          >
            Edit Team
          </Button>
          <Button
            variant="danger"
            onClick={() => setShowDeleteConfirm(true)}
            icon={<Trash2 size={16} />}
          >
            Delete
          </Button>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('agents')}
          className={`px-4 py-2 font-medium text-sm border-b-2 mr-4 whitespace-nowrap ${
            activeTab === 'agents'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center">
            <Users size={16} className="mr-2" />
            Agents ({team.agents.length})
          </div>
        </button>
        
        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-4 py-2 font-medium text-sm border-b-2 mr-4 whitespace-nowrap ${
            activeTab === 'tasks'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center">
            <ListChecks size={16} className="mr-2" />
            Tasks ({team.tasks.length})
          </div>
        </button>
        
        <button
          onClick={() => setActiveTab('visualize')}
          className={`px-4 py-2 font-medium text-sm border-b-2 mr-4 whitespace-nowrap ${
            activeTab === 'visualize'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center">
            <Users size={16} className="mr-2" />
            Visualize
          </div>
        </button>
        
        <button
          onClick={() => setActiveTab('export')}
          className={`px-4 py-2 font-medium text-sm border-b-2 mr-4 whitespace-nowrap ${
            activeTab === 'export'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center">
            <Code size={16} className="mr-2" />
            Export
          </div>
        </button>
      </div>
      
      {/* Agents Tab */}
      {activeTab === 'agents' && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Team Agents</h2>
            <Button
              onClick={() => {
                setEditingAgent(null);
                setShowAgentForm(true);
              }}
              size="sm"
              icon={<PlusCircle size={16} />}
            >
              Add Agent
            </Button>
          </div>
          
          {team.agents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {team.agents.map(agent => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  onClick={() => handleEditAgent(agent.id)}
                />
              ))}
            </div>
          ) : (
            <Card className="text-center py-8">
              <h3 className="text-lg font-medium text-gray-800 mb-2">No Agents Yet</h3>
              <p className="text-gray-600 mb-6">
                Add agents to your team to assign them tasks
              </p>
              <Button
                onClick={() => {
                  setEditingAgent(null);
                  setShowAgentForm(true);
                }}
                icon={<PlusCircle size={18} />}
              >
                Add Agent
              </Button>
            </Card>
          )}
        </>
      )}
      
      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Team Tasks</h2>
            <Button
              onClick={() => {
                setEditingTask(null);
                setShowTaskForm(true);
              }}
              size="sm"
              icon={<PlusCircle size={16} />}
              disabled={team.agents.length === 0}
            >
              Add Task
            </Button>
          </div>
          
          {team.agents.length === 0 ? (
            <Card className="text-center py-8">
              <h3 className="text-lg font-medium text-gray-800 mb-2">No Agents Available</h3>
              <p className="text-gray-600 mb-6">
                You need to add agents to your team before creating tasks
              </p>
              <Button
                onClick={() => {
                  setActiveTab('agents');
                  setEditingAgent(null);
                  setShowAgentForm(true);
                }}
                icon={<PlusCircle size={18} />}
              >
                Add Agent
              </Button>
            </Card>
          ) : team.tasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {team.tasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  agents={team.agents}
                  onClick={() => handleEditTask(task.id)}
                />
              ))}
            </div>
          ) : (
            <Card className="text-center py-8">
              <h3 className="text-lg font-medium text-gray-800 mb-2">No Tasks Yet</h3>
              <p className="text-gray-600 mb-6">
                Create tasks and assign them to your agents
              </p>
              <Button
                onClick={() => {
                  setEditingTask(null);
                  setShowTaskForm(true);
                }}
                icon={<PlusCircle size={18} />}
              >
                Add Task
              </Button>
            </Card>
          )}
        </>
      )}
      
      {/* Visualize Tab */}
      {activeTab === 'visualize' && (
        <>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Team Visualization</h2>
          </div>
          
          {team.agents.length === 0 || team.tasks.length === 0 ? (
            <Card className="text-center py-8">
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Not Enough Data to Visualize
              </h3>
              <p className="text-gray-600 mb-6">
                Add agents and tasks to your team to see a visual representation
              </p>
              <div className="flex justify-center space-x-4">
                {team.agents.length === 0 && (
                  <Button
                    onClick={() => {
                      setActiveTab('agents');
                      setEditingAgent(null);
                      setShowAgentForm(true);
                    }}
                    icon={<PlusCircle size={18} />}
                  >
                    Add Agent
                  </Button>
                )}
                
                {team.agents.length > 0 && team.tasks.length === 0 && (
                  <Button
                    onClick={() => {
                      setActiveTab('tasks');
                      setEditingTask(null);
                      setShowTaskForm(true);
                    }}
                    icon={<PlusCircle size={18} />}
                  >
                    Add Task
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-[600px]">
              <TeamVisualizer team={team} />
            </div>
          )}
        </>
      )}
      
      {/* Export Tab */}
      {activeTab === 'export' && (
        <>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Export Team</h2>
          </div>
          
          {team.agents.length === 0 || team.tasks.length === 0 ? (
            <Card className="text-center py-8">
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Not Enough Data to Export
              </h3>
              <p className="text-gray-600 mb-6">
                Add agents and tasks to your team before exporting
              </p>
              <div className="flex justify-center space-x-4">
                {team.agents.length === 0 && (
                  <Button
                    onClick={() => {
                      setActiveTab('agents');
                      setEditingAgent(null);
                      setShowAgentForm(true);
                    }}
                    icon={<PlusCircle size={18} />}
                  >
                    Add Agent
                  </Button>
                )}
                
                {team.agents.length > 0 && team.tasks.length === 0 && (
                  <Button
                    onClick={() => {
                      setActiveTab('tasks');
                      setEditingTask(null);
                      setShowTaskForm(true);
                    }}
                    icon={<PlusCircle size={18} />}
                  >
                    Add Task
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <CodeExporter team={team} />
          )}
        </>
      )}
      
      {/* Agent Form Modal */}
      {showAgentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <AgentForm
            teamId={team.id}
            agent={selectedAgent}
            onClose={() => {
              setShowAgentForm(false);
              setEditingAgent(null);
            }}
            isEdit={!!selectedAgent}
          />
        </div>
      )}
      
      {/* Task Form Modal */}
      {showTaskForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <TaskForm
            teamId={team.id}
            task={selectedTask}
            agents={team.agents}
            tasks={team.tasks}
            onClose={() => {
              setShowTaskForm(false);
              setEditingTask(null);
            }}
            isEdit={!!selectedTask}
          />
        </div>
      )}
      
      {/* Edit Team Modal */}
      {showEditTeamForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <TeamForm
            team={team}
            onClose={() => setShowEditTeamForm(false)}
            isEdit
          />
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Delete Team?</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{team.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteTeam}
              >
                Delete Team
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamDetail;