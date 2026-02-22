import { Wrapper } from '@layer/components/layout/Wrapper.jsx'
import { Icons } from '@layer/components/elements/Icons.jsx'
import { useState } from "react"

import updates from '../updates.json'

function UpdateAccordion({ title, content, type }) {
    const [isOpen, setIsOpen] = useState(false);

    // Color based on type
    const typeStyles = {
        added: { bg: '#dcfce7', color: '#16a34a', border: '#bbf7d0' },
        fixed: { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
        removed: { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' }
    };
    const style = type ? typeStyles[type] : null;
    const accentColor = style ? style.color : 'var(--brand-secondary)';
    const iconBg = style && isOpen ? style.bg : (isOpen ? 'var(--brand-secondary)' : '#f0edf4');
    const iconColor = style && isOpen ? style.color : (isOpen ? '#fff' : 'var(--text-muted)');

    return (
        <div className={`mc-accordion ${isOpen ? 'open' : ''}`}
            style={isOpen && style ? { borderColor: style.border } : {}}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-5 flex items-center gap-4 text-left"
            >
                <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
                    style={{ background: iconBg, color: iconColor }}
                >
                    <Icons.Sparkles className="h-5 w-5" />
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-sm" style={{ color: isOpen ? accentColor : 'var(--text-primary)' }}>
                        Patch {title}
                    </h3>
                </div>
                <div className={`flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <Icons.ChevronDown className="h-5 w-5" style={{ color: isOpen ? accentColor : 'var(--text-muted)' }} />
                </div>
            </button>

            <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <div className="px-5 pb-5 pt-0">
                        <div className="ml-14 space-y-3 border-l-2 pl-4" style={{ borderColor: style ? style.border : 'rgba(226, 110, 16, 0.2)' }}>
                            {content.map((item, i) => {
                                // Dynamic coloring for the symbol (+, -, *, dll)
                                let symbolColor = accentColor;
                                if (item.num === '+') symbolColor = '#16a34a'; // Green for added
                                else if (item.num === '-') symbolColor = '#dc2626'; // Red for removed
                                else if (item.num === '*') symbolColor = '#2563eb'; // Blue for fixed/changed

                                return (
                                    <div key={i} className="text-sm leading-relaxed flex items-start" style={{ color: 'var(--text-secondary)' }}>
                                        <span className="font-black mr-3 mt-0.5" style={{ color: symbolColor }}>
                                            {item.num}
                                        </span>
                                        <span>{item.text}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Update() {
    return (
        <Wrapper
            title="Update & Patch Notes"
            description="Riwayat pembaruan dan patch notes terbaru untuk server Trinity Indonesia."
            path="/update"
        >
            {/* Header */}
            <div className="mc-content-card mb-8">
                <h2 className="text-2xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Update & Patch Notes
                </h2>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Lihat semua riwayat pembaruan, fitur baru, dan perbaikan bug yang telah kami lakukan di server Trinity Indonesia.
                </p>
            </div>

            {/* Update Logs Grouped by Month */}
            <div className="flex flex-col mb-12 space-y-8">
                {updates.map((monthGroup, i) => (
                    <div key={i} className="space-y-4">
                        {/* Month Separator */}
                        <div className="flex items-center gap-4">
                            <h3 className="text-lg font-black tracking-widest uppercase" style={{ color: 'var(--brand-secondary)' }}>
                                {monthGroup.month}
                            </h3>
                            <div className="h-[2px] flex-1 bg-gradient-to-r from-[var(--brand-secondary)] to-transparent opacity-20"></div>
                        </div>

                        {/* Accordions for that month */}
                        <div className="flex flex-col">
                            {monthGroup.logs.map((log, j) => (
                                <UpdateAccordion key={j} title={log.title} content={log.content} type={log.type} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </Wrapper>
    )
}
