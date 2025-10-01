import { useEffect, useState } from 'react';
// import Layout from '@/Components/Layout';
// import SearchFilter from '@/Shared/SearchFilter';

import { create, edit } from '@/actions/App/Http/Controllers/ServiciosController';
import { Search } from '@/components/Search/Search';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/Table/Pagination';
import { Table } from '@/components/ui/Table/Table';
import { toCurrency } from '@/helpers/Numbers';
import { useCrudPage } from '@/hooks/useCrudPage';
import AppLayout from '@/layouts/app-layout';
import { servicio } from '@/routes/comentarios';
import { destroy } from '@/routes/servicios';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Edit3, MessagesSquare, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Sedes',
        href: '/sedes',
    },
    {
        title: 'Servicios',
        href: '/servicios',
    },
];

export default ({ auth, sedesId, filters, lista, roles }: any) => {
    const {
        data,
        meta: { links },
    } = lista;

    const {onTrash, onBack } = useCrudPage(lista, destroy);

    const [list, setList] = useState([]);

    const onComment = (id: number) => {
        router.visit(servicio({id}))
    }

    const onForm = (id?: number) => {
        if( id ) {
            router.visit( edit({id: id, sede: sedesId}).url )
        } else {
            router.visit( create({sede: sedesId}).url )
        }
    }

    useEffect(() => {
        const onSetList = () => {
            const _list = data.map((item: any) => {
                return {
                    id: item.id,
                    comercio: item.sede?.comercio?.nombre ?? '-',
                    sede: item.sede?.sede ?? '-',
                    secciones: item.secciones?.map((s: any) => s.seccion).join(', ') ?? '-',
                    servicio: item.servicio ?? '-',
                    whatsapp: item.whatsapp ?? '-',
                    precio: toCurrency(item.precio ?? 0),
                    imagen: <img src={`/${item.imagen}`} style={{ maxHeight: '50px' }} />,
                };
            });

            setList(_list);
        };

        onSetList();
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Servicios" />

            <div className="flex items-end justify-between px-4 pt-4">
                <Search filters={filters} ruta="servicios" />
                <div className="flex gap-4">
                    <Button variant={'outline'} onClick={onBack}>
                        {' '}
                        Regresar{' '}
                    </Button>
                    <Button className="ms-4" onClick={() => onForm()}>
                        Agregar
                    </Button>
                </div>
            </div>

            <div className="mt-8 overflow-x-auto px-4">
                <Table
                    user={auth.user}
                    data={list}
                    titles={['Comercio', 'Sede', 'Secciones', 'Servicio', 'WhatsApp', 'Precio', 'Imágen']}
                    actions={[
                        { icon: MessagesSquare, action: onComment, title: 'Comentarios' },
                        {
                            icon: Edit3,
                            action: onForm,
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
