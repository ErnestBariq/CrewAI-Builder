import React, { useEffect, useRef } from 'react';
import { Team } from '../../types';

interface TeamVisualizerProps {
  team: Team;
}

const TeamVisualizer: React.FC<TeamVisualizerProps> = ({ team }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions with higher resolution for retina displays
    const scale = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * scale;
    canvas.height = canvas.offsetHeight * scale;
    ctx.scale(scale, scale);
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate center and radius
    const centerX = canvas.width / (2 * scale);
    const centerY = canvas.height / (2 * scale);
    const radius = Math.min(centerX, centerY) * 0.4; // Reduced radius for better spacing
    
    // Draw subtle grid
    ctx.strokeStyle = 'rgba(229, 231, 235, 0.3)';
    ctx.lineWidth = 0.5;
    const gridSize = 30;
    
    for (let i = 0; i < canvas.width / scale; i += gridSize) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height / scale);
      ctx.stroke();
    }
    
    for (let i = 0; i < canvas.height / scale; i += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width / scale, i);
      ctx.stroke();
    }
    
    // Draw team name in center with background
    const teamNameGradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, 80
    );
    teamNameGradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    teamNameGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, 80, 0, 2 * Math.PI);
    ctx.fillStyle = teamNameGradient;
    ctx.fill();
    
    ctx.font = 'bold 24px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#111827';
    ctx.fillText(team.name, centerX, centerY);
    
    // Draw agents with improved visuals
    team.agents.forEach((agent, index) => {
      const angle = (index / team.agents.length) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      // Agent background glow
      const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, 50);
      glowGradient.addColorStop(0, 'rgba(16, 185, 129, 0.2)');
      glowGradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
      
      ctx.beginPath();
      ctx.arc(x, y, 50, 0, 2 * Math.PI);
      ctx.fillStyle = glowGradient;
      ctx.fill();
      
      // Agent circle
      const circleGradient = ctx.createLinearGradient(x - 35, y - 35, x + 35, y + 35);
      circleGradient.addColorStop(0, 'rgba(16, 185, 129, 0.9)');
      circleGradient.addColorStop(1, 'rgba(16, 185, 129, 0.7)');
      
      ctx.beginPath();
      ctx.arc(x, y, 35, 0, 2 * Math.PI);
      ctx.fillStyle = circleGradient;
      ctx.fill();
      ctx.strokeStyle = 'rgba(16, 185, 129, 1)';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Agent name with shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 2;
      ctx.font = 'bold 14px Inter, system-ui, sans-serif';
      ctx.fillStyle = 'white';
      ctx.fillText(agent.name, x, y - 8);
      
      // Agent role
      ctx.font = '12px Inter, system-ui, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillText(agent.role, x, y + 8);
      
      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    });
    
    // Draw tasks with improved visuals
    team.tasks.forEach((task, index) => {
      const angle = (index / team.tasks.length) * 2 * Math.PI;
      const x = centerX + radius * 1.8 * Math.cos(angle);
      const y = centerY + radius * 1.8 * Math.sin(angle);
      
      const cardWidth = 160;
      const cardHeight = 80;
      
      // Task card background with gradient
      const cardGradient = ctx.createLinearGradient(
        x - cardWidth/2, y - cardHeight/2,
        x + cardWidth/2, y + cardHeight/2
      );
      cardGradient.addColorStop(0, 'rgba(124, 58, 237, 0.15)');
      cardGradient.addColorStop(1, 'rgba(124, 58, 237, 0.05)');
      
      // Draw card shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 4;
      
      ctx.beginPath();
      ctx.roundRect(x - cardWidth/2, y - cardHeight/2, cardWidth, cardHeight, 12);
      ctx.fillStyle = cardGradient;
      ctx.fill();
      
      // Card border
      ctx.shadowColor = 'transparent';
      ctx.strokeStyle = 'rgba(124, 58, 237, 0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Task description
      ctx.font = '13px Inter, system-ui, sans-serif';
      ctx.fillStyle = '#1F2937';
      ctx.textAlign = 'center';
      
      const words = task.description.split(' ');
      let line = '';
      let lines = [];
      let y1 = y - 15;
      
      for (let word of words) {
        const testLine = line + (line ? ' ' : '') + word;
        if (ctx.measureText(testLine).width > cardWidth - 30) {
          lines.push(line);
          line = word;
        } else {
          line = testLine;
        }
      }
      lines.push(line);
      
      // Limit to 2 lines and add ellipsis if needed
      if (lines.length > 2) {
        lines = lines.slice(0, 2);
        lines[1] = lines[1].slice(0, -3) + '...';
      }
      
      lines.forEach((line, i) => {
        ctx.fillText(line, x, y1 + i * 20);
      });
    });
    
    // Draw connections between tasks and agents
    team.tasks.forEach((task, taskIndex) => {
      const taskAngle = (taskIndex / team.tasks.length) * 2 * Math.PI;
      const taskX = centerX + radius * 1.8 * Math.cos(taskAngle);
      const taskY = centerY + radius * 1.8 * Math.sin(taskAngle);
      
      // Find assigned agent
      const agent = team.agents.find(a => a.id === task.agentId);
      if (agent) {
        const agentIndex = team.agents.indexOf(agent);
        const agentAngle = (agentIndex / team.agents.length) * 2 * Math.PI;
        const agentX = centerX + radius * Math.cos(agentAngle);
        const agentY = centerY + radius * Math.sin(agentAngle);
        
        // Draw curved connection
        const midX = (taskX + agentX) / 2;
        const midY = (taskY + agentY) / 2;
        const curvature = 0.2;
        const controlX = midX + (centerX - midX) * curvature;
        const controlY = midY + (centerY - midY) * curvature;
        
        const gradient = ctx.createLinearGradient(agentX, agentY, taskX, taskY);
        gradient.addColorStop(0, 'rgba(16, 185, 129, 0.8)');
        gradient.addColorStop(1, 'rgba(124, 58, 237, 0.8)');
        
        ctx.beginPath();
        ctx.moveTo(agentX, agentY);
        ctx.quadraticCurveTo(controlX, controlY, taskX, taskY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      
      // Draw task dependencies
      task.dependencies.forEach(depId => {
        const depTask = team.tasks.find(t => t.id === depId);
        if (depTask) {
          const depIndex = team.tasks.indexOf(depTask);
          const depAngle = (depIndex / team.tasks.length) * 2 * Math.PI;
          const depX = centerX + radius * 1.8 * Math.cos(depAngle);
          const depY = centerY + radius * 1.8 * Math.sin(depAngle);
          
          // Draw curved dependency arrow
          const midX = (taskX + depX) / 2;
          const midY = (taskY + depY) / 2;
          const controlX = midX + (centerX - midX) * 0.3;
          const controlY = midY + (centerY - midY) * 0.3;
          
          ctx.beginPath();
          ctx.moveTo(taskX, taskY);
          ctx.quadraticCurveTo(controlX, controlY, depX, depY);
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
          ctx.lineWidth = 2;
          ctx.setLineDash([6, 4]);
          ctx.stroke();
          ctx.setLineDash([]);
          
          // Draw arrow
          const angle = Math.atan2(depY - controlY, depX - controlX);
          const arrowSize = 10;
          
          ctx.beginPath();
          ctx.moveTo(depX, depY);
          ctx.lineTo(
            depX - arrowSize * Math.cos(angle - Math.PI / 6),
            depY - arrowSize * Math.sin(angle - Math.PI / 6)
          );
          ctx.lineTo(
            depX - arrowSize * Math.cos(angle + Math.PI / 6),
            depY - arrowSize * Math.sin(angle + Math.PI / 6)
          );
          ctx.closePath();
          ctx.fillStyle = 'rgba(245, 158, 11, 0.8)';
          ctx.fill();
        }
      });
    });
    
  }, [team]);
  
  return (
    <div className="w-full h-full flex justify-center items-center p-8">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full max-h-[800px] rounded-xl bg-white shadow-lg"
        style={{ maxWidth: '1400px' }}
      />
    </div>
  );
};

export default TeamVisualizer;