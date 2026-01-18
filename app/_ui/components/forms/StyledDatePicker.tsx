import clsx from "clsx";
import { forwardRef } from "react";

type DatePickerProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: string;
  errors?: string;
};

const StyledDatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ label, errors, ...props }, ref) => {
    return (
      <div className="flex flex-col">
        {label && (
          <label className="font-bungee mb-2" htmlFor={props.id}>
            {label}
          </label>
        )}
        <input
          type="date"
          className={clsx(
            "rounded border bg-white px-4 py-2 text-black outline-none focus:ring-4 focus:ring-blue-800 focus:ring-offset-2",
            {
              "border-gray-200": !errors,
              "border-red-500": !!errors,
            }
          )}
          ref={ref}
          {...props}
        />
        {errors && <span className="mt-1 text-sm text-red-500">{errors}</span>}
      </div>
    );
  }
);

StyledDatePicker.displayName = "StyledDatePicker";

export default StyledDatePicker;
