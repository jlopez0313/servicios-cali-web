import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/Modal';
import StarRating from '@/components/ui/StarRating';
import { Pagination } from '@/components/ui/Table/Pagination';
import { Table } from '@/components/ui/Table/Table';
import AppLayout from '@/layouts/app-layout';
import { confirmDialog, showAlert } from '@/plugins/sweetalert';
import { destroy } from '@/routes/comentarios';
import { BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { CheckSquare, Edit3, SquareX, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Form } from './Form';

export default function ({ id, type, lista }: any) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Sedes',
            href: '/sedes',
        },
        {
            title: 'Gestionar Sedes',
            href: '/sedes/editar/' + id,
        },
        {
            title: 'Comentarios',
            href: '',
        },
    ];

    const currentUrl = usePage().url;
    const { flash }: any = usePage().props;
    const [commentId, setCommentId] = useState<number | null>(null);
    const [show, setShow] = useState(false);
    const [data, setData] = useState([]);

    const onBack = () => {
        window.history.back();
    };

    const onEdit = (id: number) => {
        setCommentId(id);
        setShow(true);
    };
    const onTrash = async (_id: number) => {
        const result = await confirmDialog({
            title: '¿Estás seguro?',
            text: '¡No podrás revertir esto!',
            icon: 'warning',
        });

        if (result.isConfirmed) {
            router.delete(destroy(_id).url, {
                preserveScroll: true,
                onSuccess: async () => {
                    await showAlert('success', 'Registro eliminado');

                    const currentPage = lista.current_page;
                    const remainingItems = lista.data.length - 1;

                    if (remainingItems === 0 && currentPage > 1) {
                        router.visit(`/comentarios/${type}/${id}?page=${currentPage - 1}`);
                    } else {
                        router.visit(`comentarios/${type}/${id}?page=${currentPage}`);
                    }
                },
                onError: () => showAlert('error', 'Error al eliminar'),
            });
        }
    };

    const onReload = () => {
        router.visit(currentUrl, {
            preserveScroll: true,
        });
    };

    useEffect(() => {
        if (flash?.success) {
            showAlert('success', flash.success);
        }
        if (flash?.error) {
            showAlert('error', flash.error);
        }
        if (flash?.warning) {
            showAlert('warning', flash.warning);
        }
    }, [flash]);

    useEffect(() => {
        const onSetData = () => {
            const data = lista.data.map((item: any) => {
                return {
                    id: item.id,
                    nombre: item.nombre,
                    comentario: item.comentario?.length > 50 ? item.comentario.substring(0, 47) + '...' : item.comentario,
                    fecha: item.fecha,
                    rating: <StarRating readOnly={true} initialRating={item.rating} />,
                    aprobado: item.aprobado == 1 ? <CheckSquare /> : <SquareX />,
                };
            });
            setData(data);
        };

        onSetData();
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Comentarios" />

            <div className="flex w-full items-center justify-end px-4 pt-4">
                <Button variant={'outline'} onClick={onBack}>
                    {' '}
                    Regresar{' '}
                </Button>
            </div>

            <div className="overflow-x-auto px-4">
                <Table
                    data={data}
                    titles={['Nombre', 'Comentario', 'Fecha', 'Rating', 'Aprobado']}
                    actions={[
                        { icon: Edit3, action: onEdit, title: 'Editar' },
                        { icon: Trash2, action: onTrash, title: 'Eliminar' },
                    ]}
                    onRow={() => {}}
                />

                <Pagination links={lista.links} />

                <Modal show={show} closeable={true} title="Gestionar Comentarios">
                    <Form
                        id={commentId}
                        onReload={onReload}
                        onClose={() => {
                            setShow(false);
                            setCommentId(null);
                        }}
                    />
                </Modal>
            </div>
        </AppLayout>
    );
}
