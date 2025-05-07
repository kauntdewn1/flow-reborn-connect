import React from 'react';

interface DebtBarProps {
  currentDebt: number;
  initialDebt: number; // A dívida total com a qual o jogador começa
}

const DebtBar: React.FC<DebtBarProps> = ({ currentDebt, initialDebt }) => {
  const debtPercentage = initialDebt > 0 ? Math.max(0, (currentDebt / initialDebt) * 100) : 0;
  // Garante que a dívida não seja negativa para a barra e que o progresso seja de "quitação"
  const progressPercentage = initialDebt > 0 ? Math.max(0, 100 - (currentDebt / initialDebt) * 100) : 100;


  return (
    <div className="my-4 p-3 bg-black/30 border border-alert-red/50 rounded-lg shadow-md shadow-alert-red/20">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-semibold text-alert-red">DÍVIDA CRIPTO VIRTUAL</span>
        <span className="text-sm font-bold text-alert-red">
          {currentDebt.toLocaleString()} TON
        </span>
      </div>
      <div className="w-full bg-gray-700 rounded h-6 border border-alert-red/30 overflow-hidden">
        <div
          className="bg-gradient-to-r from-red-500 via-alert-red to-red-700 h-full rounded text-xs font-medium text-red-100 text-center p-0.5 leading-none transition-all duration-500 ease-out"
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
        <p className="text-center text-primary-text mt-2 font-bold animate-pulse">
          DÍVIDA QUITADA NA BALA™!
        </p>
      )}
    </div>
  );
};

export default DebtBar;