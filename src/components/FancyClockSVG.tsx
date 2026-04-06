interface FancyClockSVGProps {
  elapsedTime: number;
}

const formatTime = (milliseconds: number) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    hours: hours.toString().padStart(2, "0"),
    minutes: minutes.toString().padStart(2, "0"),
    seconds: seconds.toString().padStart(2, "0"),
  };
};

export const FancyClockSVG = ({ elapsedTime }: FancyClockSVGProps) => {
  const time = formatTime(elapsedTime);

  return (
    <div className="bg-white/10 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        <svg
          aria-hidden="true"
          className="w-4 h-4 text-white/70"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
        </svg>
        <span className="text-xs text-white/70 font-medium">Tiempo transcurrido</span>
      </div>
      <div className="flex items-center justify-center gap-2 font-mono">
        <div className="text-center">
          <span className="block bg-[var(--primary)] text-white text-lg font-bold px-3 py-1.5 rounded-md min-w-[3rem]">
            {time.hours}
          </span>
          <span className="text-[10px] text-white/50 mt-1 block">HRS</span>
        </div>
        <span className="text-white/60 text-lg font-bold pb-4">:</span>
        <div className="text-center">
          <span className="block bg-[var(--primary)] text-white text-lg font-bold px-3 py-1.5 rounded-md min-w-[3rem]">
            {time.minutes}
          </span>
          <span className="text-[10px] text-white/50 mt-1 block">MIN</span>
        </div>
        <span className="text-white/60 text-lg font-bold pb-4">:</span>
        <div className="text-center">
          <span className="block bg-white/15 text-white text-lg font-bold px-3 py-1.5 rounded-md min-w-[3rem]">
            {time.seconds}
          </span>
          <span className="text-[10px] text-white/50 mt-1 block">SEG</span>
        </div>
      </div>
    </div>
  );
};
