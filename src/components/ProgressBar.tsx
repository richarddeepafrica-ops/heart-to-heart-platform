type ProgressBarProps = {
  value: number;
};

export function ProgressBar({ value }: ProgressBarProps) {
  return (
    <div className="progress" aria-label={`${value}% funded`}>
      <span style={{ width: `${value}%` }} />
    </div>
  );
}
