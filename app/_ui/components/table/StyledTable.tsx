import clsx from "clsx";

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
}

export function StyledTable({ children, className, ...props }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-700">
      <table className={clsx("w-full border-collapse text-left text-sm", className)} {...props}>
        {children}
      </table>
    </div>
  );
}

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export function TableHeader({ children, className, ...props }: TableHeaderProps) {
  return (
    <thead className={clsx("bg-gray-800", className)} {...props}>
      {children}
    </thead>
  );
}

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export function TableBody({ children, className, ...props }: TableBodyProps) {
  return (
    <tbody className={clsx("divide-y divide-gray-700", className)} {...props}>
      {children}
    </tbody>
  );
}

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
  isClickable?: boolean;
}

export function TableRow({ children, className, isClickable, ...props }: TableRowProps) {
  return (
    <tr
      className={clsx(
        "transition-colors",
        {
          "cursor-pointer hover:bg-gray-800/50": isClickable,
          "hover:bg-gray-900/30": !isClickable,
        },
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

interface TableHeadCellProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

export function TableHeadCell({ children, className, ...props }: TableHeadCellProps) {
  return (
    <th
      className={clsx("px-4 py-3 text-xs font-bold tracking-wider uppercase", className)}
      {...props}
    >
      {children}
    </th>
  );
}

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

export function TableCell({ children, className, ...props }: TableCellProps) {
  return (
    <td className={clsx("px-4 py-3", className)} {...props}>
      {children}
    </td>
  );
}
