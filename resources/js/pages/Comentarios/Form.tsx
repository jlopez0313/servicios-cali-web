import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import StarRating from '@/components/ui/StarRating';
import { Textarea } from '@/components/ui/textarea';
import { showAlert } from '@/plugins/sweetalert';
import { show, store, update } from '@/routes/comentarios';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

type ThisForm = {
    rating: number;
    comentario: string;
    respuesta: string;
    aprobado: boolean | 'indeterminate';
};

export const Form = ({ id, processing, onStore, onReload, onGetItem, onToggleModal }: any) => {
    const { data, setData, post, put, errors, reset } = useForm<Required<ThisForm>>({
        rating: 5,
        comentario: '',
        respuesta: '',
        aprobado: false,
    });

    const [resetKey, setResetKey] = useState(Date.now());

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
        const getItem = async () => {
            if (!id) return;
            const item = await onGetItem(show, { comentario: id });

            if (item) {
                setData({
                    rating: item?.rating || 5,
                    comentario: item?.comentario || '',
                    respuesta: item?.respuesta?.respuesta || '',
                    aprobado: item?.aprobado == 1 ? true : false,
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
                        <div className="flex items-center space-x-3">
                            <Checkbox
                                defaultChecked={data.aprobado}
                                key={`checkbox-${resetKey}`}
                                id="verificado"
                                onCheckedChange={(checked) => setData('aprobado', checked)}
                            />
                            <Label htmlFor="verificado"> Comentario Aprobado </Label>

                            {errors.aprobado && <p className="mt-1 text-sm text-red-500">{errors.aprobado}</p>}
                        </div>

                        <div>
                            <Label htmlFor="rating"> Rating </Label>
                            <StarRating readOnly={true} key={`stars-${resetKey}`} resetKey={resetKey} initialRating={data.rating} />
                        </div>
                        <div>
                            <Label htmlFor="comentario"> Comentario </Label>

                            <span className="d-block flex h-auto w-full rounded-md border px-3 py-1 text-sm" id="comentario">
                                {data.comentario}
                            </span>

                            {errors.respuesta && <p className="mt-1 text-sm text-red-500">{errors.respuesta}</p>}
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
