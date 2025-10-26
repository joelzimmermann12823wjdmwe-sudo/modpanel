export default function Button({ children, variant = 'primary', ...props }) {
  const baseClasses = "px-4 py-2 rounded font-medium transition-colors"
  const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    danger: "bg-red-500 text-white hover:bg-red-600",
    warning: "bg-orange-500 text-white hover:bg-orange-600",
    success: "bg-green-500 text-white hover:bg-green-600"
  }
  
  return (
    <button className={`${baseClasses} ${variants[variant]}`} {...props}>
      {children}
    </button>
  )
}
