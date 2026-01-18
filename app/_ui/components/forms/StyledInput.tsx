import clsx from "clsx";
import { forwardRef } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  errors?: string;
};

const StyledInput = forwardRef<HTMLInputElement, InputProps>(
  ({ label, errors, ...props }, ref) => {
    return (
      <div className="flex flex-col">
        {label && <label className="font-bungee mb-2" htmlFor={props.id}>{label}</label>}
        <input
          className={clsx("bg-white rounded border text-black px-4 py-2 focus:outline-none focus:ring-4 focus:ring-blue-800 focus:ring-offset-2", {
            'border-gray-200': !errors,
            'border-red-500': !!errors,
          })}
          ref={ref}
          {...props}
        />
        {errors && <span className="text-red-500 text-sm mt-1">{errors}</span>}
      </div>
    );
  },
);

StyledInput.displayName = "StyledInput";

export default StyledInput;
