interface PermissionToggleProps {
  value: "none" | "read" | "full";
  onChange: (value: "none" | "read" | "full") => void;
  size?: "sm" | "md";
}

export function PermissionToggle({
  value,
  onChange,
  size = "sm",
}: PermissionToggleProps) {
  const handleClick = () => {
    const nextValue = {
      none: "read",
      read: "full",
      full: "none",
    }[value] as "none" | "read" | "full";

    onChange(nextValue);
  };

  const getStyles = () => {
    const baseSize = size === "sm" ? "w-6 h-6 text-xs" : "w-8 h-8 text-sm";

    switch (value) {
      case "none":
        return `${baseSize} bg-gray-100 text-gray-400 border-gray-200`;
      case "read":
        return `${baseSize} bg-blue-100 text-blue-600 border-blue-200`;
      case "full":
        return `${baseSize} bg-green-100 text-green-600 border-green-200`;
      default:
        return `${baseSize} bg-gray-100 text-gray-400 border-gray-200`;
    }
  };

  const getIcon = () => {
    switch (value) {
      case "none":
        return "✕";
      case "read":
        return "👁";
      case "full":
        return "✓";
      default:
        return "✕";
    }
  };

  const getTooltip = () => {
    switch (value) {
      case "none":
        return "No Access - Click to set Read Only";
      case "read":
        return "Read Only - Click to set Full Access";
      case "full":
        return "Full Access - Click to remove access";
      default:
        return "No Access";
    }
  };

  return (
    <button
      onClick={handleClick}
      title={getTooltip()}
      className={`inline-flex cursor-pointer items-center justify-center rounded-md border transition-all duration-150 hover:shadow-sm focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 focus:outline-none ${getStyles()} `}
    >
      {getIcon()}
    </button>
  );
}
