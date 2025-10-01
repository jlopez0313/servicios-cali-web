import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { showAlert } from '@/plugins/sweetalert';
import { index as Comercios } from '@/routes/comercios';
import { show, store, update } from '@/routes/faq';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

type ThisForm = {
    comercios_id: string;
    pregunta: string;
    respuesta: string;
};

export const Form = ({ id, processing, onStore, onReload, onGetItem, onToggleModal }: any) => {
    const { data, setData, post, put, errors, reset } = useForm<Required<ThisForm>>({
        comercios_id: '',
        pregunta: '',
        respuesta: '',
    });

    const [resetKey, setResetKey] = useState(Date.now());
    const [comercios, setComercios] = useState<any[]>([]);

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();
        try {
            await onStore(store, update, data);
            onReload();
        } catch (error) {
            console.error(error);
            showAlert('error', 'No se pudieron registrar algunos datos');
        }
    };

    useEffect(() => {
        const getData = async () => {
            try {
                const {
                    data: { data: items },
                } = await axios.get(Comercios().url);

                setComercios(items ?? []);
            } catch (error) {
                console.error('Error fetching data:', error);
                showAlert('error', 'No se pudieron cargar algunos datos');
            }
        };

        getData();
    }, []);

    useEffect(() => {
        const getItem = async () => {
            if (!id) return;
            const item = await onGetItem(show, { faq: id });

            if (item) {
                setData({
                    comercios_id: item?.comercio?.id.toString() ?? '',
                    pregunta: item?.pregunta ?? '',
                    respuesta: item?.respuesta ?? '',
                });
            }

            setResetKey(Date.now());
        };

        getItem();
    }, [id]);

    return (
        <div className="pt-6 pb-12">
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <form onSubmit={submit}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="comercios_id"> Comercio </Label>

                            <Select
                                key={`comercios_id-${resetKey}`}
                                defaultValue={data.comercios_id}
                                onValueChange={(value) => (value ? setData('comercios_id', value) : null)}
                            >
                                <SelectTrigger className="flex w-full justify-start rounded-md border border-gray-300 px-3 py-2 text-sm">
                                    <SelectValue placeholder="Selecciona un valor" />
                                </SelectTrigger>
                                <SelectContent
                                    position="popper"
                                    align="start"
                                    side="bottom"
                                    sideOffset={3}
                                    className="z-[9999] rounded-md border border-gray-300 bg-white p-1 shadow-md"
                                >
                                    {comercios.map((item: any, idx: number) => {
                                        return (
                                            <SelectItem key={idx} value={`${item.id.toString()}`}>
                                                {' '}
                                                {item.nombre}{' '}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>

                            {errors.comercios_id && <p className="mt-1 text-sm text-red-500">{errors.comercios_id}</p>}
                        </div>

                        <div>
                            <Label htmlFor="pregunta"> Pregunta </Label>

                            <Textarea
                                rows={6}
                                id="pregunta"
                                name="pregunta"
                                required
                                value={data.pregunta}
                                placeholder="Pregunta"
                                onChange={(e) => setData('pregunta', e.target.value)}
                            />

                            {errors.pregunta && <p className="mt-1 text-sm text-red-500">{errors.pregunta}</p>}
                        </div>

                        <div>
                            <Label htmlFor="respuesta"> Respuesta </Label>

                            <Textarea
                                rows={6}
                                id="respuesta"
                                name="respuesta"
                                required
                                value={data.respuesta}
                                placeholder="Respuesta"
                                onChange={(e) => setData('respuesta', e.target.value)}
                            />

                            {errors.respuesta && <p className="mt-1 text-sm text-red-500">{errors.respuesta}</p>}
                        </div>
                    </div>

                    <div className="mt-4 flex items-center justify-end">
                        <Button variant={'outline'} className="mx-4 ms-4" disabled={processing} type="button" onClick={() => onToggleModal(false)}>
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
