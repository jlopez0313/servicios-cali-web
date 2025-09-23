import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/Modal';
import { Table } from '@/components/ui/Table/Table';
import { useCrudPage } from '@/hooks/useCrudPage';
import { destroy, index } from '@/routes/redes';
import { Edit3, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Form } from './Form';

export const Redes = ({ sedeId }: any) => {
    const { id: redId, show, onList, onSetItem, onToggleModal, onTrash, processing, onStore, onGetItem } = useCrudPage(null, destroy);
    const [data, setData] = useState([]);

    const onDelete = async (id: number) => {
        try {
            await onTrash(id);
            onLoad();
        } catch (error) {
            console.log(error);
        }
    };

    const onLoad = async () => {
        const lista = await onList(index, { params: { id: sedeId } });
        const data = lista.map((item: any) => {
            return {
                id: item.id,
                nombre: item.nombre,
                url: item.url,
            };
        });
        setData(data);
    };

    useEffect(() => {
        onLoad();
    }, [sedeId]);

    return (
        <div className="pt-6 pb-12">
            <div className="flex w-full items-center justify-end px-4 pt-4">
                <Button type="button" onClick={() => onToggleModal(true)}>
                    Agregar Red
                </Button>
            </div>

            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <Table
                    data={data}
                    titles={['Nombre', 'Url']}
                    actions={[
                        { icon: Edit3, action: onSetItem, title: 'Editar' },
                        { icon: Trash2, action: onDelete, title: 'Eliminar' },
                    ]}
                    onRow={() => {}}
                />

                <Modal show={show} closeable={true} title="Gestionar Redes Sociales">
                    <Form
                        processing={processing}
                        onStore={onStore}
                        onGetItem={onGetItem}
                        sedeId={sedeId}
                        redId={redId}
                        onLoad={onLoad}
                        onClose={() => {
                            onToggleModal(false);
                        }}
                    />
                </Modal>
            </div>
        </div>
    );
};
