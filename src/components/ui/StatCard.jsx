import React from 'react';
import { clsx } from 'clsx';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend, // { value: number, isPositive: boolean }
  description,
  color = 'primary'
}) => {
  const colorStyles = {
    primary: 'bg-primary-surface text-primary border-primary/20',
    secondary: 'bg-orange-50 text-secondary border-secondary/20',
    info: 'bg-blue-50 text-blue-600 border-blue-200',
    success: 'bg-green-50 text-green-600 border-green-200',
    warning: 'bg-amber-50 text-amber-600 border-amber-200',
    error: 'bg-red-50 text-error border-red-200'
  };

  return (
    <div className="card p-6 flex flex-col hover:shadow-md transition-shadow duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-text-secondary mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-text-primary">{value}</h3>
        </div>
        <div className={clsx("p-3 rounded-lg border", colorStyles[color])}>
          {Icon && <Icon size={24} />}
        </div>
      </div>
      
      {(trend || description) && (
        <div className="mt-auto flex items-center text-sm pt-4 border-t border-gray-100">
          {trend && (
            <div 
              className={clsx(
                "flex items-center font-medium",
                trend.isPositive === true ? "text-success" : 
                trend.isPositive === false ? "text-error" : 
                "text-gray-500"
              )}
            >
              {trend.isPositive === true && <TrendingUp size={16} className="mr-1" />}
              {trend.isPositive === false && <TrendingDown size={16} className="mr-1" />}
              {trend.isPositive === null && <Minus size={16} className="mr-1" />}
              {trend.value}%
            </div>
          )}
          {description && (
            <span className="text-text-tertiary ml-2">{description}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;
