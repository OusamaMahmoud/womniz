import { ReactNode } from "react";

interface ActionBtn {
  className?: string;
  icon?: ReactNode;
  method?: () => void;
  label?: string;
  isDisabled?: boolean;
}

export const ActionButton = ({
  className,
  icon,
  method,
  label,
  isDisabled,
}: ActionBtn) => {
  return (
    <button disabled={isDisabled} className={className} onClick={method}>
      {icon} {label}
    </button>
  );
};
