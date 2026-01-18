import { forwardRef } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

const StyledInput = forwardRef<HTMLInputElement, InputProps>(
  ({ label, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        {label && <label className="font-bungee" htmlFor={props.id}>{label}</label>}
        <input
          className="bg-white rounded border border-gray-200 px-4 py-2 focus:outline-none focus:ring-4 focus:ring-blue-800 focus:ring-offset-2"
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);

StyledInput.displayName = "StyledInput";

export default StyledInput;
