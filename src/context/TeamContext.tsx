import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Team, Agent, Task } from '../types';
import { sampleTeams } from '../data/initialData';
import { v4 as uuidv4 } from 'uuid';

interface TeamContextType {
  teams: Team[];
  currentTeam: Team | null;
  setCurrentTeam: (team: Team | null) => void;
  addTeam: (team: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTeam: (team: Team) => void;
  deleteTeam: (teamId: string) => void;
  addAgent: (teamId: string, agent: Omit<Agent, 'id'>) => void;
  updateAgent: (teamId: string, agent: Agent) => void;
  deleteAgent: (teamId: string, agentId: string) => void;
  addTask: (teamId: string, task: Omit<Task, 'id'>) => void;
  updateTask: (teamId: string, task: Task) => void;
  deleteTask: (teamId: string, taskId: string) => void;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const TeamProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [teams, setTeams] = useState<Team[]>(sampleTeams);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);

  const addTeam = (team: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTeam: Team = {
      ...team,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTeams([...teams, newTeam]);
  };

  const updateTeam = (updatedTeam: Team) => {
    setTeams(teams.map(team => 
      team.id === updatedTeam.id 
        ? { ...updatedTeam, updatedAt: new Date() } 
        : team
    ));
    
    if (currentTeam && currentTeam.id === updatedTeam.id) {
      setCurrentTeam({ ...updatedTeam, updatedAt: new Date() });
    }
  };

  const deleteTeam = (teamId: string) => {
    setTeams(teams.filter(team => team.id !== teamId));
    if (currentTeam && currentTeam.id === teamId) {
      setCurrentTeam(null);
    }
  };

  const addAgent = (teamId: string, agent: Omit<Agent, 'id'>) => {
    const newAgent: Agent = {
      ...agent,
      id: uuidv4(),
    };
    
    setTeams(teams.map(team => 
      team.id === teamId 
        ? { 
            ...team, 
            agents: [...team.agents, newAgent], 
            updatedAt: new Date() 
          } 
        : team
    ));
    
    if (currentTeam && currentTeam.id === teamId) {
      setCurrentTeam({
        ...currentTeam,
        agents: [...currentTeam.agents, newAgent],
        updatedAt: new Date()
      });
    }
  };

  const updateAgent = (teamId: string, updatedAgent: Agent) => {
    setTeams(teams.map(team => 
      team.id === teamId 
        ? { 
            ...team, 
            agents: team.agents.map(agent => 
              agent.id === updatedAgent.id ? updatedAgent : agent
            ),
            updatedAt: new Date() 
          } 
        : team
    ));
    
    if (currentTeam && currentTeam.id === teamId) {
      setCurrentTeam({
        ...currentTeam,
        agents: currentTeam.agents.map(agent => 
          agent.id === updatedAgent.id ? updatedAgent : agent
        ),
        updatedAt: new Date()
      });
    }
  };

  const deleteAgent = (teamId: string, agentId: string) => {
    setTeams(teams.map(team => 
      team.id === teamId 
        ? { 
            ...team, 
            agents: team.agents.filter(agent => agent.id !== agentId),
            tasks: team.tasks.filter(task => task.agentId !== agentId),
            updatedAt: new Date() 
          } 
        : team
    ));
    
    if (currentTeam && currentTeam.id === teamId) {
      setCurrentTeam({
        ...currentTeam,
        agents: currentTeam.agents.filter(agent => agent.id !== agentId),
        tasks: currentTeam.tasks.filter(task => task.agentId !== agentId),
        updatedAt: new Date()
      });
    }
  };

  const addTask = (teamId: string, task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: uuidv4(),
    };
    
    setTeams(teams.map(team => 
      team.id === teamId 
        ? { 
            ...team, 
            tasks: [...team.tasks, newTask], 
            updatedAt: new Date() 
          } 
        : team
    ));
    
    if (currentTeam && currentTeam.id === teamId) {
      setCurrentTeam({
        ...currentTeam,
        tasks: [...currentTeam.tasks, newTask],
        updatedAt: new Date()
      });
    }
  };

  const updateTask = (teamId: string, updatedTask: Task) => {
    setTeams(teams.map(team => 
      team.id === teamId 
        ? { 
            ...team, 
            tasks: team.tasks.map(task => 
              task.id === updatedTask.id ? updatedTask : task
            ),
            updatedAt: new Date() 
          } 
        : team
    ));
    
    if (currentTeam && currentTeam.id === teamId) {
      setCurrentTeam({
        ...currentTeam,
        tasks: currentTeam.tasks.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        ),
        updatedAt: new Date()
      });
    }
  };

  const deleteTask = (teamId: string, taskId: string) => {
    // First update dependencies in other tasks
    const updatedTeams = teams.map(team => 
      team.id === teamId 
        ? { 
            ...team, 
            tasks: team.tasks.map(task => ({
              ...task,
              dependencies: task.dependencies.filter(dep => dep !== taskId)
            })).filter(task => task.id !== taskId),
            updatedAt: new Date() 
          } 
        : team
    );
    
    setTeams(updatedTeams);
    
    if (currentTeam && currentTeam.id === teamId) {
      setCurrentTeam({
        ...currentTeam,
        tasks: currentTeam.tasks.map(task => ({
          ...task,
          dependencies: task.dependencies.filter(dep => dep !== taskId)
        })).filter(task => task.id !== taskId),
        updatedAt: new Date()
      });
    }
  };

  return (
    <TeamContext.Provider value={{
      teams,
      currentTeam,
      setCurrentTeam,
      addTeam,
      updateTeam,
      deleteTeam,
      addAgent,
      updateAgent,
      deleteAgent,
      addTask,
      updateTask,
      deleteTask,
    }}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeamContext = () => {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error('useTeamContext must be used within a TeamProvider');
  }
  return context;
};