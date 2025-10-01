import { Search } from '@/components/Search/Search';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/Modal';
import { Pagination } from '@/components/ui/Table/Pagination';
import { Table } from '@/components/ui/Table/Table';
import { useCrudPage } from '@/hooks/useCrudPage';
import AppLayout from '@/layouts/app-layout';
import { destroy } from '@/routes/faq';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Edit3, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Form } from './Form';

export default function ({ sedesId, filters, lista }: any) {
    const {
        data,
        meta: { links },
    } = lista;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Preguntas Frecuentes',
            href: '/faq',
        },
    ];

    const { id, processing, show, onReload, onStore, onSetItem, onTrash, onBack, onGetItem, onToggleModal } = useCrudPage(lista, destroy);
    const [list, setList] = useState([]);

    useEffect(() => {
        const onSetData = () => {
            const lista = data.map((item: any) => {
                return {
                    id: item.id,
                    comercio: item.comercio?.nombre ?? '-',
                    pregunta: item.pregunta ?? -'',
                    respuesta: item.respuesta ?? -'',
                };
            });
            setList(lista);
        };

        onSetData();
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Preguntas Frecuentes" />

            <div className="flex items-end justify-between px-4 pt-4">
                <Search filters={filters} ruta="faq"  />
                <Button onClick={( ) => onToggleModal(true)}>
                    {' '}
                    Agregar{' '}
                </Button>
            </div>

            <div className="overflow-x-auto px-4">
                <Table
                    data={list}
                    titles={['Comercio', 'Pregunta', 'Respuesta']}
                    actions={[
                        { icon: Edit3, action: onSetItem, title: 'Editar' },
                        { icon: Trash2, action: onTrash, title: 'Eliminar' },
                    ]}
                    onRow={() => { }}
                />

                <Pagination links={links} />

                <Modal show={show} closeable={true} title="Gestionar Preguntas Frecuentes">
                    <Form id={id} onStore={onStore} onReload={onReload} onGetItem={onGetItem} onToggleModal={onToggleModal} processing={processing} />
                </Modal>
            </div>
        </AppLayout>
    );
}
