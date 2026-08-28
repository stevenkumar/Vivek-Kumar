import React from 'react'

export const AdminCard = ({ title, subtitle, icon: Icon, badge, action, children, className = '' }) => {
  return (
    <div className={`bg-theme-card rounded-[22px] border border-theme p-6 sm:p-8 shadow-2xl ${className}`}>
      {(title || subtitle || Icon || action) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-theme">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="p-2.5 bg-theme-canvas rounded-xl border border-theme text-theme-primary shrink-0">
                <Icon size={20} />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-theme-base text-lg tracking-tight">{title}</h3>
                {badge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-theme-canvas text-theme-primary border border-theme">
                    {badge}
                  </span>
                )}
              </div>
              {subtitle && <p className="text-xs text-theme-muted mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </div>
  )
}

export default AdminCard
