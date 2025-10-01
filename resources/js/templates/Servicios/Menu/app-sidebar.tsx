import { publicMethod } from '@/routes/categorias';
import { useEffect, useState } from 'react';
import { NavMain } from './nav-main';

export function AppSidebar() {
    const [categorias, setCategorias] = useState<any[]>([]);


    useEffect(() => {
        const getCategorias = async () => {
            const { data: {data} } = await axios.get(publicMethod().url);
            const lista = data.map( (item: any) => ({ 
                title: item.categoria,
                href: ''
            }))

            setCategorias( lista );
        }

        getCategorias();
    }, [])

    return (
        <NavMain items={categorias} />
    );
}
