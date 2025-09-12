import { useEffect, useState } from 'react';
// import Layout from '@/Components/Layout';
// import SearchFilter from '@/Shared/SearchFilter';

import { Search } from '@/components/Search/Search';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/Modal';
import { Pagination } from '@/components/ui/Table/Pagination';
import { Table } from '@/components/ui/Table/Table';
import AppLayout from '@/layouts/app-layout';
import { confirmDialog, showAlert } from '@/plugins/sweetalert';
import { destroy } from '@/routes/usuarios';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Edit3, Trash2 } from 'lucide-react';
import { Form } from './Form';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Usuarios',
        href: '/usuarios',
    },
];

export default ({ auth, filters, lista, roles }: any) => {
    const {
        data,
        meta: { links },
    } = lista;

    const [list, setList] = useState([]);
    const [id, setId] = useState<number | null>(null);
    const [show, setShow] = useState(false);

    const onSetList = () => {
        const _list = data.map((item: any) => {
            return {
                id: item.id,
                usuario: item.name || '-',
                rol: item.roles.join(', ') || '-',
                email: item.email || '-',
                cuenta: item.has_paid == '1' ? 'Premium' : 'Gratuita',
            };
        });

        setList(_list);
    };

    const onSetItem = (_id: number) => {
        setId(_id);
        onToggleModal(true);
    };

    const onTrash = async (_id: number) => {
        const result = await confirmDialog({
            title: '¿Estás seguro?',
            text: '¡No podrás revertir esto!',
            icon: 'warning',
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(destroy({ id: _id }).url);
                await showAlert('success', 'Registro eliminado');
                onReload();
            } catch (error) {
                showAlert('error', 'Error al eliminar');
            }
        }
    };

    const onToggleModal = (isShown: boolean) => {
        if (!isShown) {
            setId(null);
        }
        setShow(isShown);
    };

    const onReload = () => {
        onToggleModal(false);

        const url = new URL(window.location.href);
        const page = parseInt(url.searchParams.get('page') ?? '1');

        if (list.length == 1 && page > 1) {
            url.searchParams.set('page', String(page - 1));
            router.visit(url.toString());
        } else {
            router.visit(window.location.pathname + window.location.search);
        }
    };

    useEffect(() => {
        onSetList();
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Usuarios" />

            <div className="flex items-end justify-between px-4 pt-4">
                <Search filters={filters} ruta="usuarios" />
                <Button className="ms-4" onClick={() => onToggleModal(true)}>
                    Agregar
                </Button>
            </div>

            <div className="mt-8 overflow-x-auto px-4">
                <Table
                    user={auth.user}
                    data={list}
                    titles={['Usuario', 'Rol', 'Email', 'Cuenta']}
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
            <Modal show={show} closeable={true} title="Gestionar Usuarios">
                <Form roles={roles} setIsOpen={onToggleModal} onReload={onReload} id={id} />
            </Modal>
        </AppLayout>
    );
};
