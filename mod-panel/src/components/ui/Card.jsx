export default function Card({ children, className = "" }) {
  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm border-2 border-emerald-500/20 rounded-3xl shadow-xl p-6 ${className}`}>
      {children}
    </div>
  )
}
