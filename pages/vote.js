import { Wrapper } from '@layer/components/layout/Wrapper.jsx';
import { Icons } from '@layer/components/elements/Icons.jsx';

const VOTE_LINKS = [
    {
        id: 1,
        name: 'Minecraft MP',
        url: 'https://minecraft-mp.com/server/355080/vote/',
        icon: 'https://www.google.com/s2/favicons?domain=minecraft-mp.com&sz=128',
        description: 'Dukung kami di Minecraft MP!'
    },
    {
        id: 2,
        name: 'Minecraft Pocket Servers',
        url: 'https://minecraftpocket-servers.com/server/132890/vote/',
        icon: 'https://www.google.com/s2/favicons?domain=minecraftpocket-servers.com&sz=128',
        description: 'Beri vote via MC Pocket Servers!'
    },
    {
        id: 3,
        name: 'Minecraft IP List',
        url: 'https://www.minecraftiplist.com/server/TrinityIndonesia1AnarchyRPG-39288/vote',
        icon: 'https://www.google.com/s2/favicons?domain=www.minecraftiplist.com&sz=128',
        description: 'Dukung kami di Minecraft IP List!'
    },
    {
        id: 4,
        name: 'MC Server Time',
        url: 'https://mcservertime.com/server-trinity-indonesia-1-anarchy-rpg.2802/vote',
        icon: 'https://www.google.com/s2/favicons?domain=mcservertime.com&sz=128',
        description: 'Beri vote via MC Server Time!'
    },
    {
        id: 5,
        name: 'Top Minecraft Servers',
        url: 'https://topminecraftservers.org/vote/42892',
        icon: 'https://www.google.com/s2/favicons?domain=topminecraftservers.org&sz=128',
        description: 'Dukung kami di Top MC Servers!'
    },
];

export default function Vote() {
    return (
        <Wrapper
            title="Vote"
            description="Dukung Trinity Indonesia dengan melakukan vote setiap hari."
            path="/vote"
        >
            <div className="mc-content-card mb-8">
                <h2 className="text-2xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Vote Server
                </h2>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Dukung Trinity Indonesia dengan melakukan vote di situs-situs berikut setiap hari dan dapatkan hadiah menarik di dalam game!
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                {VOTE_LINKS.map((link) => (
                    <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mc-content-card flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300 group"
                        style={{ textDecoration: 'none', border: '1px solid #e5e7eb' }}
                    >
                        {/* Left: Icon */}
                        <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 rounded-2xl flex items-center justify-center overflow-hidden bg-white shadow-sm" style={{ border: '1px solid #e5e7eb' }}>
                            <img src={link.icon} alt={link.name} className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
                        </div>

                        {/* Middle: Text (Title + Description) */}
                        <div className="flex-grow text-left">
                            <h3 className="font-bold text-base sm:text-lg leading-tight" style={{ color: 'var(--text-primary)' }}>{link.name}</h3>
                            <p className="text-xs sm:text-sm mt-1 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{link.description}</p>
                        </div>

                        {/* Right: Arrow */}
                        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl transition-colors duration-300 group-hover:bg-gray-100" style={{ color: 'var(--brand-secondary)' }}>
                            <Icons.ChevronDown className="w-5 h-5 -rotate-90" />
                        </div>
                    </a>
                ))}
            </div>
        </Wrapper>
    );
}
