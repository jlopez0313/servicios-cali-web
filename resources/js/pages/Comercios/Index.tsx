import { useEffect, useState } from 'react';
// import Layout from '@/Components/Layout';
// import SearchFilter from '@/Shared/SearchFilter';

import { create, edit } from '@/actions/App/Http/Controllers/ComerciosController';
import { Search } from '@/components/Search/Search';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/Table/Pagination';
import { Table } from '@/components/ui/Table/Table';
import { useCrudPage } from '@/hooks/useCrudPage';
import AppLayout from '@/layouts/app-layout';
import { destroy } from '@/routes/comercios';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Edit3, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Comercios',
        href: '/comercios',
    },
];

export default ({ auth, filters, lista, roles }: any) => {
    const {
        data,
        meta: { links },
    } = lista;

    const { onTrash } = useCrudPage(lista, destroy);

    const [list, setList] = useState([]);

    const onEdit = (id: number) => {
        onGoToForm(id);
    };

    const onGoToForm = (id?: number) => {
        if (id) {
            router.visit(edit(id));
        } else {
            router.visit(create());
        }
    };

    useEffect(() => {
        const onSetList = () => {
            const _list = data.map((item: any) => {
                return {
                    id: item.id,
                    categorias: item.categorias?.map(c => c.categoria)?.join(', ') ?? '-',
                    nombre: item.nombre ?? '-',
                    logo: <img src={`/${item.logo}`} style={{ maxHeight: '50px' }} />,
                    banner: <img src={`/${item.banner}`} style={{ maxHeight: '50px' }} />,
                };
            });

            setList(_list);
        };

        onSetList();
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Comercios" />

            <div className="flex items-end justify-between px-4 pt-4">
                <Search filters={filters} ruta="comercios" />
                <Button className="ms-4" onClick={() => onGoToForm()}>
                    Agregar
                </Button>
            </div>

            <div className="mt-8 overflow-x-auto px-4">
                <Table
                    user={auth.user}
                    data={list}
                    titles={['Categorías', 'Nombre', 'Logo', 'Banner']}
                    actions={[
                        {
                            icon: Edit3,
                            action: onEdit,
                            title: 'Editar',
                        },
                        {
                            icon: Trash2,
                            action: onTrash,
                            title: 'Eliminar',
                        },
                    ]}
                />
            </div>

            <Pagination links={links} />
        </AppLayout>
    );
};
