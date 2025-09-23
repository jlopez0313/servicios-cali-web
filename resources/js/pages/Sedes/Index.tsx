import { create, edit } from '@/actions/App/Http/Controllers/SedesController';
import { Search } from '@/components/Search/Search';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/Table/Pagination';
import { Table } from '@/components/ui/Table/Table';
import { useCrudPage } from '@/hooks/useCrudPage';
import AppLayout from '@/layouts/app-layout';
import { showAlert } from '@/plugins/sweetalert';
import { clone, destroy } from '@/routes/sedes';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Copy, Edit3, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Sedes',
        href: '/sedes',
    },
];

export default function Index({ auth, filters, lista }: any) {
    const {
        data,
        meta: { links },
    } = lista;

    const { onTrash, onReload } = useCrudPage(lista, destroy);

    const [list, setList] = useState([]);

    const onEdit = (id: number) => {
        onGoToForm(id);
    };

    const onClone = async (id: number) => {
        try {
            await axios.post(clone({ sede: id }).url);
            await showAlert('success', 'Registro clonado exitosamente!');
            onReload(true);
        } catch (error) {
            console.log(error);
            showAlert('error', 'Error al clonar');
        }
    }

    const onGoToForm = (id?: number) => {
        if (id) {
            router.visit(edit(id));
        } else {
            router.visit(create());
        }
    };

    useEffect(() => {
        const onSetData = () => {
            const _list = data.map((item: any) => {
                return {
                    id: item.id,
                    sede: item.sede,
                    direccion: item.direccion,
                    ciuad: item.ciudad?.name ?? '',
                    departamento: item.ciudad?.state?.name ?? '',
                    pais: item.ciudad?.state?.country?.name ?? '',
                };
            });

            setList(_list);
        };

        onSetData();
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sedes" />

            <div className="flex items-end justify-between px-4 pt-4">
                <Search filters={filters} ruta="sedes" />
                <Button onClick={() => onGoToForm()}> Agregar </Button>
            </div>

            <div className="overflow-x-auto px-4">
                <Table
                    user={auth.user}
                    data={list}
                    titles={['Sede', 'Dirección', 'Ciudad', 'Departamento', 'País']}
                    actions={[
                        { icon: Copy, action: onClone, title: 'Clonar' },
                        { icon: Edit3, action: onEdit, title: 'Editar' },
                        { icon: Trash2, action: onTrash, title: 'Eliminar' },
                    ]}
                    onRow={() => {}}
                />

                <Pagination links={links} />
            </div>
        </AppLayout>
    );
}
