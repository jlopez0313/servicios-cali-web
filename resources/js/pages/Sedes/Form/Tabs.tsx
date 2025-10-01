import { index } from '@/actions/App/Http/Controllers/ServiciosController';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { sede } from '@/routes/comentarios';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Horarios } from './Horarios/Horarios';
import { Informacion } from './Informacion/Informacion';
import { Redes } from './Redes/Redes';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Sedes',
        href: '/sedes',
    },
    {
        title: 'Gestionar Sedes',
        href: '',
    },
];

export default function ({ id }: any) {
    const goToComments = () => {
        router.visit(sede({ id }));
    };

    const goToServicios = () => {
        router.visit(index(id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestionar Sedes" />

            <Tabs defaultValue="info" className="w-full p-2">
                <TabsList className="flex w-full space-x-2 rounded-md bg-gray-100 p-1">
                    <TabsTrigger value="info" className="flex-1">
                        Información General
                    </TabsTrigger>
                    <TabsTrigger value="horarios" className="flex-1">
                        Horarios
                    </TabsTrigger>
                    <TabsTrigger value="redes" className="flex-1">
                        Redes Sociales
                    </TabsTrigger>
                    <TabsTrigger value="servicios" className="flex-1" onClick={goToServicios}>
                        Servicios
                    </TabsTrigger>
                    <TabsTrigger value="comentarios" className="flex-1" onClick={goToComments}>
                        Comentarios
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="mt-4">
                    <Informacion sedeId={id} />
                </TabsContent>
                <TabsContent value="horarios" className="mt-4">
                    <Horarios sedeId={id} />
                </TabsContent>
                <TabsContent value="redes" className="mt-4">
                    <Redes sedeId={id} />
                </TabsContent>
            </Tabs>
        </AppLayout>
    );
}
