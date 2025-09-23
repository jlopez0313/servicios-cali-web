import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { show, store, update } from '@/routes/redes';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect } from 'react';

type ThisForm = {
    nombre: string;
    url: string;
    sedes_id: number;
};

export const Form = ({ sedeId, redId, onLoad, onClose, processing, onStore, onGetItem }: any) => {
    const { data, setData, post, put, errors, reset } = useForm<Required<ThisForm>>({
        nombre: '',
        url: '',
        sedes_id: sedeId,
    });

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();

        try {
            await onStore(store, update, data);
            onClose();
            onLoad();
        } catch (error) {}
    };

    useEffect(() => {
        const getItem = async () => {
            if (!redId) return;
            const item: any = await onGetItem(show, { id: redId });

            if (item) {
                setData({
                    nombre: item.nombre || '',
                    url: item.url || '',
                    sedes_id: item.sedes_id || 0,
                });
            }
        };

        getItem();
    }, [redId]);

    return (
        <div className="pt-6 pb-12">
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <form onSubmit={submit}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="nombre"> Nombre </Label>

                            <Input
                                autoFocus
                                id="nombre"
                                name="nombre"
                                required
                                value={data.nombre}
                                placeholder="Nombre"
                                onChange={(e) => setData('nombre', e.target.value)}
                            />

                            {errors.nombre && <p className="mt-1 text-sm text-red-500">{errors.nombre}</p>}
                        </div>
                        <div>
                            <Label htmlFor="nombre"> Url </Label>

                            <Input
                                autoFocus
                                type="url"
                                id="url"
                                name="url"
                                required
                                value={data.url}
                                placeholder="https://"
                                onChange={(e) => setData('url', e.target.value)}
                            />

                            {errors.url && <p className="mt-1 text-sm text-red-500">{errors.url}</p>}
                        </div>
                    </div>

                    <div className="mt-4 flex items-center justify-end">
                        <Button
                            variant={'outline'}
                            className="mx-4 ms-4"
                            disabled={processing}
                            type="button"
                            onClick={() => {
                                reset();
                                onClose();
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button disabled={processing}>
                            Guardar
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
