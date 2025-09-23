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
import { destroy } from '@/routes/categorias';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Edit3, Trash2 } from 'lucide-react';
import { Form } from './Form';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categorias',
        href: '/categorias',
    },
];

export default ({ auth, filters, lista, roles }: any) => {
    const {
        data,
        meta: { links },
    } = lista;

    const { id, show, onSetItem, onToggleModal, onReload, onTrash, processing, onStore, onGetItem } = useCrudPage(lista, destroy);

    const [list, setList] = useState([]);

    useEffect(() => {
        const onSetList = () => {
            const _list = data.map((item: any) => {
                return {
                    id: item.id,
                    categoria: item.categoria ?? '-',
                    imagen: <img src={`/${item.imagen}`} style={{ maxHeight: '50px' }} />,
                };
            });

            setList(_list);
        };

        onSetList();
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categorias" />

            <div className="flex items-end justify-between px-4 pt-4">
                <Search filters={filters} ruta="categorias" />
                <Button className="ms-4" onClick={() => onToggleModal(true)}>
                    Agregar
                </Button>
            </div>

            <div className="mt-8 overflow-x-auto px-4">
                <Table
                    user={auth.user}
                    data={list}
                    titles={['Categoría', 'Imágen']}
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
            <Modal show={show} closeable={true} title="Gestionar Categorias">
                <Form
                    roles={roles}
                    setIsOpen={onToggleModal}
                    onReload={onReload}
                    id={id}
                    processing={processing}
                    onStore={onStore}
                    onGetItem={onGetItem}
                />
            </Modal>
        </AppLayout>
    );
};
