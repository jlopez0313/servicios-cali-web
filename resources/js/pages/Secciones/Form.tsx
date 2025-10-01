import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showAlert } from '@/plugins/sweetalert';
import { show, store, update } from '@/routes/secciones';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

type ThisForm = {
    seccion: string;
    imagen: string;
};

export const Form = ({ id, setIsOpen, onReload, processing, onStore, onGetItem }: any) => {
    const { data, setData, errors, reset, setError } = useForm<ThisForm>({
        seccion: '',
        imagen: '',
    });

    const [preview, setPreview] = useState('');
    const [resetKey, setResetKey] = useState(Date.now());

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            const value = data[key as keyof ThisForm];

            if (Array.isArray(value)) {
                value.forEach((v) => {
                    formData.append(`${key}[]`, v);
                });
            } else {
                formData.append(key, value as any);
            }
        });

        try {
            await onStore(store, update, formData, true);
            onReload();
        } catch (error) {
            console.error(error)
            showAlert('error', 'No se pudieron registrar algunos datos')
        }
    };

    const onSetPreview = (evt: any) => {
        setData({
            ...data,
            imagen: evt.target.files[0],
        });

        const preview = URL.createObjectURL(evt.target.files[0]);
        setPreview(preview);
    };

    useEffect(() => {
       const getItem = async () => {
            const item = await onGetItem(show, { seccione: id });

            if (item) {
                setData({
                    seccion: item.seccion,
                    imagen: '',
                });

                setPreview('/' + item.imagen);

                setResetKey(Date.now());
            }
        };

        getItem();
    }, []);

    return (
        <div className="pt-6 pb-12">
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <form onSubmit={submit}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="seccion"> Sección </Label>

                            <Input
                                required
                                placeholder="Sección"
                                id="seccion"
                                type="text"
                                name="seccion"
                                value={data.seccion}
                                className="mt-1 block w-full"
                                autoComplete="seccion"
                                onChange={(e) => setData('seccion', e.target.value)}
                            />

                            <InputError message={errors.seccion} className="mt-2" />
                        </div>

                        <div>
                            <Label htmlFor="imagen"> Imagen </Label>

                            <Input
                                type="file"
                                required={!id}
                                placeholder="Imagen"
                                id="imagen"
                                name="imagen"
                                className="mt-1 block w-full"
                                autoComplete="imagen"
                                accept="image/*"
                                onChange={onSetPreview}
                            />

                            <InputError message={errors.imagen} className="mt-2" />
                        </div>

                        <div className="col-span-2">{preview && <img className="media preview" src={preview} alt="" />}</div>
                    </div>

                    <div className="mt-4 flex items-center justify-end gap-4">
                        <Button variant={'outline'} type="button" disabled={processing} onClick={() => setIsOpen(false)}>
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
