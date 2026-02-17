export const Card = ({ children, title, description, icon: Icon, className = "", footer }: any) => {
  return (
    <div className={`
      bg-white dark:bg-[var(--card)] 
      border border-[var(--border-soft)] 
      rounded-[var(--radius)] 
      shadow-sm 
      /* Hapus overflow-hidden agar dropdown portal atau absolute bisa terlihat bebas */
      /* overflow-hidden */ 
      relative 
      ${className}
    `}>
      {(title || Icon) && (
        <div className="px-6 py-4 border-b border-[var(--border-soft)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            {Icon && <Icon size={18} className="text-primary" />}
            <div>
              <div className="font-bold tracking-tight">{title}</div>
              {description && <p className="text-sm text-[var(--muted)] tracking-tighter">{description}</p>}
            </div>
          </div>
        </div>
      )}
      
      {/* Container utama children */}
      <div className="p-6">{children}</div>
      
      {footer && (
        <div className="px-6 py-4 bg-zinc-50/50 dark:bg-white/5 border-t border-[var(--border-soft)] rounded-b-[var(--radius)]">
          {footer}
        </div>
      )}
    </div>
  );
};