import { Wrapper } from '@layer/components/layout/Wrapper.jsx'
import config from '@layer/theme.config'
import { useState, useMemo } from "react"
import { getDbConnection } from '@layer/lib/db'
import Head from 'next/head'

const ITEMS_PER_PAGE = 5

function UpdateAccordion({ title, content, type, icon, patchDate }) {
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

    let parsedContent = [];
    try {
        parsedContent = typeof content === 'string' ? JSON.parse(content) : content;
    } catch (e) {
        parsedContent = content || [];
    }

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
                    <i className={`${icon || 'ri-sparkling-2-line'} text-xl`} />
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-sm" style={{ color: isOpen ? accentColor : 'var(--text-primary)' }}>
                        Patch {title}
                    </h3>
                    {patchDate && (
                        <p className="text-[10px] font-black opacity-50 uppercase tracking-tighter" style={{ color: isOpen ? accentColor : 'var(--text-muted)' }}>
                            {new Date(patchDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    )}
                </div>
                <div className={`flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <i className={`ri-arrow-down-s-line text-xl`} style={{ color: isOpen ? accentColor : 'var(--text-muted)' }} />
                </div>
            </button>

            <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <div className="px-5 pb-5 pt-0">
                        <div className="ml-14 space-y-3 border-l-2 pl-4" style={{ borderColor: style ? style.border : 'rgba(226, 110, 16, 0.2)' }}>
                            {Array.isArray(parsedContent) ? parsedContent.map((item, i) => {
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
                            }) : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Update({ groupedUpdates }) {
    // Flatten all logs for pagination
    const allLogs = useMemo(() => {
        const logs = []
        for (const group of groupedUpdates) {
            for (const log of group.logs) {
                logs.push({ ...log, monthGroup: group.month })
            }
        }
        return logs
    }, [groupedUpdates])

    const totalPages = Math.max(1, Math.ceil(allLogs.length / ITEMS_PER_PAGE))
    const [currentPage, setCurrentPage] = useState(1)

    // Get paginated logs and re-group by month
    const paginatedGroups = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE
        const slice = allLogs.slice(start, start + ITEMS_PER_PAGE)
        const groups = {}
        for (const item of slice) {
            if (!groups[item.monthGroup]) groups[item.monthGroup] = []
            groups[item.monthGroup].push(item)
        }
        return Object.keys(groups).map(k => ({ month: k, logs: groups[k] }))
    }, [allLogs, currentPage])

    function goToPage(page) {
        const p = Math.max(1, Math.min(page, totalPages))
        setCurrentPage(p)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <Wrapper
            title="Update & Patch Notes"
            description="Riwayat pembaruan dan patch notes terbaru untuk server Trinity Indonesia."
            path="/update"
        >
            <Head>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/remixicon@4.5.0/fonts/remixicon.css" />
            </Head>
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
            <div className="flex flex-col mb-8 space-y-8">
                {paginatedGroups.length > 0 ? paginatedGroups.map((monthGroup, i) => (
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
                                <UpdateAccordion key={j} title={log.title} content={log.content} type={log.type} icon={log.icon} patchDate={log.patch_date} />
                            ))}
                        </div>
                    </div>
                )) : (
                    <div className="text-center p-8 mc-card" style={{ background: 'rgba(232,224,240,0.5)' }}>
                        <p className="font-bold text-sm" style={{ color: 'var(--text-muted)' }}>Belum ada log patch notes saat ini.</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mb-12">
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
                        style={{
                            background: currentPage === 1 ? '#f0edf4' : 'var(--brand-secondary)',
                            color: currentPage === 1 ? 'var(--text-muted)' : '#fff',
                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                            opacity: currentPage === 1 ? 0.5 : 1
                        }}
                    >
                        ← Sebelumnya
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className="w-10 h-10 rounded-xl text-sm font-bold transition-all"
                            style={{
                                background: page === currentPage ? 'var(--brand-secondary)' : '#f0edf4',
                                color: page === currentPage ? '#fff' : 'var(--text-secondary)',
                                fontWeight: page === currentPage ? 800 : 600
                            }}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
                        style={{
                            background: currentPage === totalPages ? '#f0edf4' : 'var(--brand-secondary)',
                            color: currentPage === totalPages ? 'var(--text-muted)' : '#fff',
                            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                            opacity: currentPage === totalPages ? 0.5 : 1
                        }}
                    >
                        Selanjutnya →
                    </button>
                </div>
            )}
        </Wrapper>
    )
}

export async function getServerSideProps() {
    try {
        const pool = await getDbConnection()
        const [rows] = await pool.query('SELECT * FROM store_updates ORDER BY created_at DESC')

        // Serialize output for NextJS 
        const stringifiedRows = rows.map(r => ({
            ...r,
            content: typeof r.content === 'string' ? JSON.parse(r.content) : r.content,
            created_at: r.created_at.toISOString(),
            patch_date: r.patch_date ? r.patch_date.toISOString() : r.created_at.toISOString()
        }))

        // Group by month
        const groups = {};
        for (const item of stringifiedRows) {
            if (!groups[item.month_group]) groups[item.month_group] = [];
            groups[item.month_group].push(item);
        }

        const groupedArray = Object.keys(groups).map(k => ({
            month: k,
            logs: groups[k]
        }))

        return {
            props: { groupedUpdates: groupedArray }
        }
    } catch (e) {
        console.error("Failed fetching updates:", e)
        return {
            props: { groupedUpdates: [] }
        }
    }
}

