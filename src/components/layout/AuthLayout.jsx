import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[url('/pattern.svg')] bg-repeat">
      <div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 flex items-center justify-center gap-2">
          <span className="text-primary text-4xl">🥬</span> 
          OnlineVegi
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Partner & Admin Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-gray-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
