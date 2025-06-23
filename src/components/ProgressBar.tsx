type Props = {
  currentStep: number;
  totalSteps: number;
};

const ProgressBar = ({ currentStep, totalSteps }: Props) => {
  const progressPercentage = (currentStep / totalSteps) * 100;
  const stepLabels = [
    "Business Type",
    "Company Info",
    "Select Policies",
    "Customize",
    "Disclaimer",
    "Review & Download",
  ];

  return (
    <div className="w-full mb-8">
      <div className="relative h-2 bg-gray-200 rounded-full">
        <div
          className="absolute top-0 left-0 h-2 bg-indigo-600 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        {stepLabels.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div
              key={label}
              className={`w-1/6 text-center ${
                isCompleted ? "text-indigo-600 font-semibold" : ""
              } ${isCurrent ? "font-bold text-indigo-800" : ""}`}
            >
              {label}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar; 