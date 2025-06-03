import React, { useState } from 'react';
import { PlusCircle, X } from 'lucide-react';
import Input from '../common/Input';
import TextArea from '../common/TextArea';
import Button from '../common/Button';
import { Team } from '../../types';
import { useTeamContext } from '../../context/TeamContext';

interface TeamFormProps {
  team?: Team;
  onClose: () => void;
  isEdit?: boolean;
}

const TeamForm: React.FC<TeamFormProps> = ({ team, onClose, isEdit = false }) => {
  const { addTeam, updateTeam } = useTeamContext();
  
  const [formData, setFormData] = useState({
    name: team?.name || '',
    description: team?.description || '',
  });
  
  const [errors, setErrors] = useState({
    name: '',
    description: '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when field is being edited
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  const validate = () => {
    let valid = true;
    const newErrors = { ...errors };
    
    if (!formData.name.trim()) {
      newErrors.name = 'Team name is required';
      valid = false;
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
      valid = false;
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    if (isEdit && team) {
      updateTeam({
        ...team,
        name: formData.name,
        description: formData.description,
      });
    } else {
      addTeam({
        name: formData.name,
        description: formData.description,
        agents: [],
        tasks: [],
      });
    }
    
    onClose();
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {isEdit ? 'Edit Team' : 'Create New Team'}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X size={20} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          id="name"
          name="name"
          label="Team Name"
          placeholder="Enter team name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
        />
        
        <TextArea
          id="description"
          name="description"
          label="Description"
          placeholder="Describe what this team does"
          value={formData.description}
          onChange={handleChange}
          error={errors.description}
          required
          rows={3}
        />
        
        <div className="flex justify-end space-x-3 pt-3">
          <Button
            variant="outline"
            onClick={onClose}
            size="sm"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            icon={<PlusCircle size={16} />}
            size="sm"
          >
            {isEdit ? 'Update Team' : 'Create Team'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TeamForm;
