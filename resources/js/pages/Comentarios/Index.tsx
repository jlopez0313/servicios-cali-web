import { Search } from '@/components/Search/Search';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/Modal';
import StarRating from '@/components/ui/StarRating';
import { Pagination } from '@/components/ui/Table/Pagination';
import { Table } from '@/components/ui/Table/Table';
import { useCrudPage } from '@/hooks/useCrudPage';
import AppLayout from '@/layouts/app-layout';
import { destroy } from '@/routes/comentarios';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { CheckSquare, Edit3, SquareX, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Form } from './Form';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Comentarios',
        href: '',
    },
];

export default function ({ sedesId, filters, lista }: any) {

    const {
        data,
        meta: { links },
    } = lista;

    const { id, processing, show, onReload, onStore, onSetItem, onTrash, onBack, onGetItem, onToggleModal } = useCrudPage(lista, destroy);
    const [list, setList] = useState([]);

    useEffect(() => {
        const onSetData = () => {
            const lista = data.map((item: any) => {
                return {
                    id: item.id,
                    nombre: item.cliente?.name,
                    comentario: item.comentario?.length > 50 ? item.comentario.substring(0, 47) + '...' : item.comentario,
                    fecha: new Date(item.created_at).toLocaleDateString(),
                    rating: <StarRating readOnly={true} initialRating={item.rating} />,
                    aprobado: item.aprobado == 1 ? <CheckSquare /> : <SquareX />,
                };
            });
            setList(lista);
        };

        onSetData();
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Comentarios" />

            <div className="flex items-end justify-between px-4 pt-4">
                <Search filters={filters} ruta={`/comentarios/sedes/${sedesId}`}  />
                <Button variant={'outline'} onClick={onBack}>
                    {' '}
                    Regresar{' '}
                </Button>
            </div>

            <div className="overflow-x-auto px-4">
                <Table
                    data={list}
                    titles={['Cliente', 'Comentario', 'Fecha', 'Rating', 'Aprobado']}
                    actions={[
                        { icon: Edit3, action: onSetItem, title: 'Editar' },
                        { icon: Trash2, action: onTrash, title: 'Eliminar' },
                    ]}
                    onRow={() => { }}
                />

                <Pagination links={links} />

                <Modal show={show} closeable={true} title="Gestionar Comentarios">
                    <Form id={id} onStore={onStore} onReload={onReload} onGetItem={onGetItem} onToggleModal={onToggleModal} processing={processing} />
                </Modal>
            </div>
        </AppLayout>
    );
}
