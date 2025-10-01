import AppLogo from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import { ChevronRight, X } from 'lucide-react';
import { useSidebar } from './sidebar';

export const SidebarItem = ({ label, children }) => {
    return (
        <div className="flex flex-col">
            <button className="flex items-center justify-between rounded-lg px-4 py-2 hover:bg-gray-100">
                <span className="font-medium text-gray-700 ">{label}</span>
                {children && <ChevronRight size={18} />}
            </button>
            {children && <div className="mt-1 ml-6 flex flex-col gap-1">{children}</div>}
        </div>
    );
};

export const NavMain = ({ items }) => {
    const { open, toggleSidebar } = useSidebar();
    
    return (
        <div
            className={`fixed top-0 left-0 z-50 h-full w-72 transform bg-white shadow-lg transition-transform duration-300 ${
                open ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
            {/* Header */}
            <div className="flex items-center justify-between border-b p-4">
                <AppLogo />
                <button onClick={() => toggleSidebar()}>
                    <X size={24} className="text-gray-600" />
                </button>
            </div>

            {/* Botones login */}
            <div className="flex gap-2 px-4 py-3">
                <Button>Ingreso</Button>
                <Button>Registro</Button>
            </div>

            {/* Promo 
            <div className="px-4 py-3">
                <div className="cursor-pointer rounded-lg bg-purple-100 p-3 text-sm font-medium text-purple-800 hover:bg-purple-200">
                    🎉 Descubre nuestras promociones
                </div>
            </div>
*/}

            {/* Secciones */}
            <div className="flex flex-col gap-1 px-2 py-3">
                <p className="px-2 text-xs text-gray-400">Menú</p>
                {
                    items.map( (item, idx) => {
                        return <SidebarItem key={idx} label={item.title} />
                    })
                }
                <button className="px-4 py-2 text-left text-sm font-medium text-green-500 hover:underline">Ver más</button>
            </div>

            {/* Otros */}
            <div className="flex flex-col gap-1 px-2 py-3">
                <p className="px-2 text-xs text-gray-400">OTROS</p>
                <SidebarItem label="Registra tu Negocio" />
                <SidebarItem label="Registrate como Cliente" />
            </div>
        </div>
    );
};
