import React, { useState } from 'react';
import { ListPlus, X } from 'lucide-react';
import Input from '../common/Input';
import TextArea from '../common/TextArea';
import Button from '../common/Button';
import Select from '../common/Select';
import { Task, Agent } from '../../types';
import { useTeamContext } from '../../context/TeamContext';

interface TaskFormProps {
  teamId: string;
  task?: Task;
  agents: Agent[];
  tasks: Task[];
  onClose: () => void;
  isEdit?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ teamId, task, agents, tasks, onClose, isEdit = false }) => {
  const { addTask, updateTask } = useTeamContext();
  
  const [formData, setFormData] = useState<Omit<Task, 'id'>>({
    description: task?.description || '',
    agentId: task?.agentId || '',
    expectedOutput: task?.expectedOutput || '',
    dependencies: task?.dependencies || [],
  });
  
  const [errors, setErrors] = useState({
    description: '',
    agentId: '',
    expectedOutput: '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when field is being edited
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  const handleDependencyChange = (taskId: string) => {
    // If dependency is already selected, remove it, otherwise add it
    if (formData.dependencies.includes(taskId)) {
      setFormData({
        ...formData,
        dependencies: formData.dependencies.filter(id => id !== taskId)
      });
    } else {
      setFormData({
        ...formData,
        dependencies: [...formData.dependencies, taskId]
      });
    }
  };
  
  const validate = () => {
    let valid = true;
    const newErrors = { ...errors };
    
    if (!formData.description.trim()) {
      newErrors.description = 'Task description is required';
      valid = false;
    }
    
    if (!formData.agentId) {
      newErrors.agentId = 'Assigned agent is required';
      valid = false;
    }
    
    if (!formData.expectedOutput.trim()) {
      newErrors.expectedOutput = 'Expected output is required';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    if (isEdit && task) {
      updateTask(teamId, {
        ...task,
        description: formData.description,
        agentId: formData.agentId,
        expectedOutput: formData.expectedOutput,
        dependencies: formData.dependencies,
      });
    } else {
      addTask(teamId, formData);
    }
    
    onClose();
  };
  
  // Filter out the current task from dependencies list if in edit mode
  const availableDependencyTasks = tasks.filter(t => !isEdit || t.id !== task?.id);
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-md max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {isEdit ? 'Edit Task' : 'Create New Task'}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X size={20} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <TextArea
          id="description"
          name="description"
          label="Task Description"
          placeholder="What should be done?"
          value={formData.description}
          onChange={handleChange}
          error={errors.description}
          required
          rows={2}
        />
        
        <Select
          id="agentId"
          name="agentId"
          label="Assign to Agent"
          options={agents.map(agent => ({ value: agent.id, label: agent.name }))}
          value={formData.agentId}
          onChange={handleChange}
          error={errors.agentId}
          required
          placeholder="Select an agent"
        />
        
        <TextArea
          id="expectedOutput"
          name="expectedOutput"
          label="Expected Output"
          placeholder="What should this task produce?"
          value={formData.expectedOutput}
          onChange={handleChange}
          error={errors.expectedOutput}
          required
          rows={2}
        />
        
        {availableDependencyTasks.length > 0 && (
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Task Dependencies (Optional)</label>
            <div className="max-h-32 overflow-y-auto border rounded-md p-2">
              {availableDependencyTasks.map(t => (
                <div 
                  key={t.id}
                  className={`p-1.5 mb-1 rounded cursor-pointer transition-colors text-sm ${
                    formData.dependencies.includes(t.id) 
                      ? 'bg-blue-50 border border-blue-200' 
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                  onClick={() => handleDependencyChange(t.id)}
                >
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      checked={formData.dependencies.includes(t.id)}
                      onChange={() => {}}
                      className="mr-2 h-3.5 w-3.5"
                    />
                    <span className="truncate">{t.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
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
            icon={<ListPlus size={16} />}
            size="sm"
          >
            {isEdit ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
