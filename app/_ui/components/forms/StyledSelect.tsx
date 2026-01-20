import clsx from "clsx";
import { forwardRef } from "react";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  errors?: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
};

const StyledSelect = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, errors, options, placeholder, ...props }, ref) => {
    return (
      <div className="flex flex-col">
        {label && (
          <label className="font-bungee mb-2" htmlFor={props.id}>
            {label}
          </label>
        )}
        <select
          className={clsx(
            "h-10.5 rounded border bg-white px-4 py-2 text-black outline-none focus:ring-4 focus:ring-blue-800 focus:ring-offset-2",
            {
              "border-gray-200": !errors,
              "border-red-500": !!errors,
            }
          )}
          ref={ref}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors && <span className="mt-1 text-sm text-red-500">{errors}</span>}
      </div>
    );
  }
);

StyledSelect.displayName = "StyledSelect";

export default StyledSelect;
