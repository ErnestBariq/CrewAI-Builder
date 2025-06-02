import React, { useState } from 'react';
import { UserPlus, X, Plus, Minus } from 'lucide-react';
import Input from '../common/Input';
import TextArea from '../common/TextArea';
import Button from '../common/Button';
import Checkbox from '../common/Checkbox';
import Select from '../common/Select';
import { Agent, Tool } from '../../types';
import { useTeamContext } from '../../context/TeamContext';
import { sampleTools } from '../../data/initialData';

interface AgentFormProps {
  teamId: string;
  agent?: Agent;
  onClose: () => void;
  isEdit?: boolean;
}

const AgentForm: React.FC<AgentFormProps> = ({ teamId, agent, onClose, isEdit = false }) => {
  const { addAgent, updateAgent } = useTeamContext();
  
  const [formData, setFormData] = useState<Omit<Agent, 'id'>>({
    name: agent?.name || '',
    role: agent?.role || '',
    goal: agent?.goal || '',
    backstory: agent?.backstory || '',
    allowDelegation: agent?.allowDelegation ?? false,
    verbose: agent?.verbose ?? false,
    tools: agent?.tools || [],
  });
  
  const [errors, setErrors] = useState({
    name: '',
    role: '',
    goal: '',
    backstory: '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when field is being edited
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };
  
  const handleToolChange = (toolId: string) => {
    // If tool is already selected, remove it, otherwise add it
    if (formData.tools.some(tool => tool.id === toolId)) {
      setFormData({
        ...formData,
        tools: formData.tools.filter(tool => tool.id !== toolId)
      });
    } else {
      const toolToAdd = sampleTools.find(tool => tool.id === toolId);
      if (toolToAdd) {
        setFormData({
          ...formData,
          tools: [...formData.tools, toolToAdd]
        });
      }
    }
  };
  
  const validate = () => {
    let valid = true;
    const newErrors = { ...errors };
    
    if (!formData.name.trim()) {
      newErrors.name = 'Agent name is required';
      valid = false;
    }
    
    if (!formData.role.trim()) {
      newErrors.role = 'Role is required';
      valid = false;
    }
    
    if (!formData.goal.trim()) {
      newErrors.goal = 'Goal is required';
      valid = false;
    }
    
    if (!formData.backstory.trim()) {
      newErrors.backstory = 'Backstory is required';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    if (isEdit && agent) {
      updateAgent(teamId, {
        ...agent,
        ...formData,
      });
    } else {
      addAgent(teamId, formData);
    }
    
    onClose();
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {isEdit ? 'Edit Agent' : 'Create New Agent'}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X size={20} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="name"
          name="name"
          label="Agent Name"
          placeholder="Enter agent name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
        />
        
        <Input
          id="role"
          name="role"
          label="Role"
          placeholder="e.g., Researcher, Developer, Analyst"
          value={formData.role}
          onChange={handleChange}
          error={errors.role}
          required
        />
        
        <TextArea
          id="goal"
          name="goal"
          label="Goal"
          placeholder="What is this agent trying to achieve?"
          value={formData.goal}
          onChange={handleChange}
          error={errors.goal}
          required
        />
        
        <TextArea
          id="backstory"
          name="backstory"
          label="Backstory"
          placeholder="Provide context and background for this agent"
          value={formData.backstory}
          onChange={handleChange}
          error={errors.backstory}
          required
          rows={3}
        />
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Tools</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sampleTools.map(tool => (
              <div 
                key={tool.id}
                className={`border rounded-md p-3 cursor-pointer transition-colors ${
                  formData.tools.some(t => t.id === tool.id) 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleToolChange(tool.id)}
              >
                <div className="flex items-center">
                  {formData.tools.some(t => t.id === tool.id) ? 
                    <Minus size={16} className="text-blue-500 mr-2" /> : 
                    <Plus size={16} className="text-gray-400 mr-2" />
                  }
                  <div>
                    <p className="text-sm font-medium">{tool.name}</p>
                    <p className="text-xs text-gray-500">{tool.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-3 sm:space-y-0">
          <Checkbox
            id="allowDelegation"
            name="allowDelegation"
            label="Allow Delegation"
            checked={formData.allowDelegation}
            onChange={handleCheckboxChange}
          />
          
          <Checkbox
            id="verbose"
            name="verbose"
            label="Verbose Output"
            checked={formData.verbose}
            onChange={handleCheckboxChange}
          />
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            icon={<UserPlus size={18} />}
          >
            {isEdit ? 'Update Agent' : 'Create Agent'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AgentForm;