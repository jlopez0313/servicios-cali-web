import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Informacion } from './Informacion/Informacion';
import { Redes } from './Redes/Redes';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Comercios',
        href: '/comercios',
    },
    {
        title: 'Gestionar Comercios',
        href: '',
    },
];

export default function ({ id }: any) {
   

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestionar Comercios" />

            <Tabs defaultValue="info" className="w-full p-2">
                <TabsList className="flex w-full space-x-2 rounded-md bg-gray-100 p-1">
                    <TabsTrigger value="info" className="flex-1">
                        Información General
                    </TabsTrigger>
                    <TabsTrigger value="redes" className="flex-1">
                        Redes Sociales
                    </TabsTrigger>
                    
                </TabsList>

                <TabsContent value="info" className="mt-4">
                    <Informacion comercioId={id} />
                </TabsContent>
                <TabsContent value="redes" className="mt-4">
                    <Redes comercioId={id} />
                </TabsContent>
            </Tabs>
        </AppLayout>
    );
}
