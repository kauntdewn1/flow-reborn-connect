import React from 'react';

interface DebtBarProps {
  currentDebt: number;
  initialDebt: number;
}

const DebtBar: React.FC<DebtBarProps> = ({ currentDebt, initialDebt }) => {
  const debtPercentage = initialDebt > 0 ? Math.max(0, (currentDebt / initialDebt) * 100) : 0;

  return (
    <div className="my-4 p-3 bg-black/30 border border-red-600/50 rounded-lg shadow-md shadow-red-500/30">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-semibold text-red-400">DÍVIDA CRIPTO VIRTUAL</span>
        <span className="text-sm font-bold text-red-500">
          {currentDebt.toLocaleString()} TON
        </span>
      </div>
      <div className="w-full bg-gray-800 rounded h-6 border border-red-500/30 overflow-hidden">
        <div
          className="bg-gradient-to-r from-red-600 via-red-500 to-red-700 h-full rounded text-xs font-medium text-white text-center p-0.5 leading-none transition-all duration-500 ease-out"
          style={{ width: `${debtPercentage}%` }}
          role="progressbar"
          aria-valuenow={debtPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          {debtPercentage > 10 ? `${debtPercentage.toFixed(0)}%` : ''}
        </div>
      </div>
      {currentDebt <= 0 && (
        <p className="text-center text-cyan-400 mt-2 font-bold animate-pulse uppercase tracking-wider">
          DÍVIDA QUITADA NA BALA™!
        </p>
      )}
    </div>
  );
};

export default DebtBar;
