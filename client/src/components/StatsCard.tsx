import { ReactNode } from "react";

interface StatsCardProps {
  icon: ReactNode;
  value: string;
  label: string;
  iconColor: string;
}

const StatsCard = ({ icon, value, label, iconColor }: StatsCardProps) => {
  return (
    <div className="bg-black border border-gray-800 rounded-lg p-6 flex flex-col items-center">
      <div className={`text-${iconColor} text-3xl mb-2`}>{icon}</div>
      <div className="text-2xl font-semibold mb-1 text-white">{value}</div>
      <div className="text-gray-400 lowercase">{label}</div>
    </div>
  );
};

export default StatsCard;
