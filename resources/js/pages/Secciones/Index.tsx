import { useEffect, useState } from 'react';
// import Layout from '@/Components/Layout';
// import SearchFilter from '@/Shared/SearchFilter';

import { Search } from '@/components/Search/Search';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/Modal';
import { Pagination } from '@/components/ui/Table/Pagination';
import { Table } from '@/components/ui/Table/Table';
import { useCrudPage } from '@/hooks/useCrudPage';
import AppLayout from '@/layouts/app-layout';
import { destroy } from '@/routes/secciones';
import { BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Edit3, Trash2 } from 'lucide-react';
import { Form } from './Form';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Secciones',
        href: '/secciones',
    },
];

export default ({ auth, filters, lista, roles }: any) => {
    const {
        data,
        meta: { links },
    } = lista;

    const { id, show, onSetItem, onToggleModal, onReload, onTrash, processing, onStore, onGetItem } = useCrudPage(lista, destroy);

    const currentUrl = usePage().url;

    const [list, setList] = useState([]);

    useEffect(() => {
        const onSetList = () => {
            const _list = data.map((item: any) => {
                return {
                    id: item.id,
                    seccion: item.seccion ?? '-',
                    imagen: <img src={`/${item.imagen}`} style={{ maxHeight: '50px' }} />,
                };
            });

            setList(_list);
        };

        onSetList();
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Secciones" />

            <div className="flex items-end justify-between px-4 pt-4">
                <Search filters={filters} ruta="secciones" />
                <Button className="ms-4" onClick={() => onToggleModal(true)}>
                    Agregar
                </Button>
            </div>

            <div className="mt-8 overflow-x-auto px-4">
                <Table
                    user={auth.user}
                    data={list}
                    titles={['Subcategoria', 'Imágen']}
                    actions={[
                        {
                            icon: Edit3,
                            action: onSetItem,
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
            <Modal show={show} closeable={true} title="Gestionar Secciones">
                <Form
                    id={id}
                    roles={roles}
                    processing={processing}
                    onStore={onStore}
                    onReload={onReload}
                    onGetItem={onGetItem}
                    setIsOpen={onToggleModal}
                />
            </Modal>
        </AppLayout>
    );
};
