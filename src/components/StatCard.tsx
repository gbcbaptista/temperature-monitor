export const StatCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: string;
}) => (
  <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-sky-400 hover:shadow-xl transition-shadow duration-300">
    <div className="flex items-center justify-between h-full">
      <div className="flex flex-col justify-between h-full flex-1">
        <p className="text-gray-600 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold text-gray-800 h-full flex justify-center items-end">
          {value}
        </p>
      </div>
      <div className="text-4xl text-sky-400">{icon}</div>
    </div>
  </div>
);
