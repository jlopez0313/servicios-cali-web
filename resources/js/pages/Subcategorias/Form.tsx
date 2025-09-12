import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { index } from '@/routes/categorias';
import { show, store, update } from '@/routes/subcategorias';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

type ThisForm = {
    categorias_id: string;
    subcategoria: string;
    url: string;
    descripcion: string;
    imagen: string;
};

export const Form = ({ id, setIsOpen, onReload }: any) => {
    const { data, setData, errors, reset, setError } = useForm<ThisForm>({
        categorias_id: '',
        subcategoria: '',
        url: '',
        descripcion: '',
        imagen: '',
    });

    const [categorias, setCategorias] = useState([]);
    const [preview, setPreview] = useState('');
    const [processing, setProcessing] = useState(false);
    const [resetKey, setResetKey] = useState(Date.now());

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            formData.append(key, data[key]);
        });

        setProcessing(true);

        try {
            if (id) {
                formData.append('_method', 'PUT');
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

    const onGetData = async () => {
        const {
            data: { data },
        } = await axios.get(index().url);
        setCategorias(data);
    };

    const onGetItem = async () => {
        const { data } = await axios.get(show({ subcategoria: id }).url);
        const item = { ...data.data };

        setData({
            categorias_id: item.categoria?.id.toString() ?? '',
            subcategoria: item.subcategoria,
            url: item.url,
            descripcion: item.descripcion,
            imagen: '',
        });

        setPreview(item.imagen);

        setResetKey(Date.now());
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
        onGetData();
        id && onGetItem();
    }, []);

    return (
        <div className="pt-6 pb-12">
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <form onSubmit={submit}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="categorias_id"> Categoría </Label>

                            <Select
                                key={`categorias_id-${resetKey}`}
                                required
                                defaultValue={data.categorias_id}
                                onValueChange={(value) => setData('categorias_id', value)}
                            >
                                <SelectTrigger className="flex w-full justify-start rounded-md border border-gray-300 px-3 py-2 text-sm mt-1">
                                    <SelectValue placeholder="Selecciona un valor" />
                                </SelectTrigger>
                                <SelectContent
                                    position="popper"
                                    align="start"
                                    side="bottom"
                                    sideOffset={3}
                                    className="rounded-md border border-gray-300 bg-white p-1 shadow-md"
                                >
                                    {categorias.map((tipo: any, key: number) => {
                                        return (
                                            <SelectItem value={tipo.id.toString()} key={key}>
                                                {" "}
                                                {tipo.categoria}{" "}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>

                            </Select>

                            <InputError message={errors.categorias_id} className="mt-2" />
                        </div>

                        <div>
                            <Label htmlFor="subcategoria"> Subcategoria </Label>

                            <Input
                                required
                                placeholder="Subcategoria"
                                id="subcategoria"
                                type="text"
                                name="subcategoria"
                                value={data.subcategoria}
                                className="mt-1 block w-full"
                                autoComplete="subcategoria"
                                onChange={(e) => setData('subcategoria', e.target.value)}
                            />

                            <InputError message={errors.subcategoria} className="mt-2" />
                        </div>

                        <div>
                            <Label htmlFor="descripcion"> Descripción </Label>

                            <Textarea
                                required
                                placeholder="Descripción"
                                id="descripcion"
                                name="descripcion"
                                value={data.descripcion}
                                className="mt-1 block w-full"
                                autoComplete="descripcion"
                                onChange={(e) => setData('descripcion', e.target.value)}
                                rows={4}
                            />

                            <InputError message={errors.descripcion} className="mt-2" />
                        </div>

                        <div>
                            <Label htmlFor="url"> Link </Label>

                            <Input
                                required
                                placeholder="Link"
                                id="url"
                                type="url"
                                name="url"
                                value={data.url}
                                className="mt-1 block w-full"
                                autoComplete="url"
                                onChange={(e) => setData('url', e.target.value)}
                            />

                            <InputError message={errors.url} className="mt-2" />
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
