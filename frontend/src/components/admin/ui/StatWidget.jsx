import React from 'react'

export const StatWidget = ({ title, value, subtitle, icon: Icon, color = 'cyan', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-theme-card rounded-[22px] border border-theme p-6 shadow-2xl flex items-center justify-between gap-4 transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:border-theme-primary hover:-translate-y-1' : ''
      }`}
    >
      <div className="space-y-1">
        <p className="text-xs font-mono uppercase tracking-wider text-theme-muted">{title}</p>
        <h4 className="text-3xl font-black text-theme-base tracking-tight">{value}</h4>
        {subtitle && <p className="text-xs text-theme-muted">{subtitle}</p>}
      </div>

      {Icon && (
        <div className="p-3.5 bg-theme-canvas rounded-2xl border border-theme text-theme-primary shrink-0">
          <Icon size={24} />
        </div>
      )}
    </div>
  )
}

export default StatWidget
