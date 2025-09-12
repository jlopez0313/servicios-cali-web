import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { show, store, update } from '@/routes/categorias';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

type ThisForm = {
    categoria: string;
    imagen: string;
};

export const Form = ({ id, setIsOpen, onReload }: any) => {
    const { data, setData, errors, reset, setError } = useForm<ThisForm>({
        categoria: '',
        imagen: '',
    });

    const [preview, setPreview] = useState('');
    const [processing, setProcessing] = useState(false);

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            formData.append(key, data[key]);
        });

        setProcessing(true);

        try {
            if (id) {
                formData.append("_method", "PUT");
                await axios.post(update({ id }).url, formData);
            } else {
                await axios.post(store().url, formData);
            }
            setProcessing(false);
            onReload();
        } catch (error) {
            setProcessing(false);
        }
    };

    const onGetItem = async () => {
        const { data } = await axios.get(show({ categoria: id }).url);
        const item = { ...data.data };

        setData({
            categoria: item.categoria,
            imagen: '',
        });

        setPreview(item.imagen);
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
        id && onGetItem();
    }, []);

    return (
        <div className="pt-6 pb-12">
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <form onSubmit={submit}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="categoria"> Categoría </Label>

                            <Input
                                required
                                placeholder="Categoría"
                                id="categoria"
                                type="text"
                                name="categoria"
                                value={data.categoria}
                                className="mt-1 block w-full"
                                autoComplete="categoria"
                                onChange={(e) => setData('categoria', e.target.value)}
                            />

                            <InputError message={errors.categoria} className="mt-2" />
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
                                accept='image/*'
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
