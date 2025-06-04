import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ title: string; icon?: React.ReactNode; action?: React.ReactNode }> = ({ 
  title, 
  icon, 
  action 
}) => {
  return (
    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        {icon && <span className="text-pink-500">{icon}</span>}
        <h3 className="font-semibold text-gray-800">{title}</h3>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

export const CardBody: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
      {children}
    </div>
  );
};

export default Card;