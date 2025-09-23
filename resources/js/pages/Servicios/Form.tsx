import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { index } from '@/routes/categorias';
import { show, store, update } from '@/routes/servicios';
import { categoria as byCategoria } from '@/routes/subcategorias';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import styles from './Servicios.module.scss';

type ThisForm = {
    categorias_id: string;
    subcategorias_id: string;
    servicio: string;
    url: string;
    whatsapp: string | undefined;
    precio: string;
    descripcion: string;
    imagen: string;
};

export const Form = ({ id, setIsOpen, onReload }: any) => {
    const { data, setData, errors, reset, setError } = useForm<ThisForm>({
        categorias_id: '',
        subcategorias_id: '',
        servicio: '',
        url: '',
        whatsapp: '',
        precio: '',
        descripcion: '',
        imagen: '',
    });

    const [categorias, setCategorias] = useState([]);
    const [subcategorias, setSubCategorias] = useState([]);
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

    const onGetSubcategorias = async () => {
        const {
            data: { data: lista },
        } = await axios.get(byCategoria({ id: Number(data.categorias_id) }).url);

        setSubCategorias(lista);
    };

    const onGetItem = async () => {
        const { data } = await axios.get(show({ servicio: id }).url);
        const item = { ...data.data };

        setData({
            categorias_id: item.subcategoria?.categoria?.id.toString() ?? '',
            subcategorias_id: item.subcategoria?.id.toString() ?? '',
            servicio: item.servicio,
            url: item.url,
            whatsapp: item.whatsapp,
            precio: item.precio,
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

    useEffect(() => {
        data.categorias_id && onGetSubcategorias();
    }, [data.categorias_id]);

    return (
        <div className="pt-6 pb-12">
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <form onSubmit={submit}>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="categorias_id"> Categoría </Label>

                            <Select
                                key={`categorias_id-${resetKey}`}
                                required
                                defaultValue={data.categorias_id}
                                onValueChange={(value) => setData('categorias_id', value)}
                            >
                                <SelectTrigger className="mt-1 flex w-full justify-start rounded-md border border-gray-300 px-3 py-2 text-sm">
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
                                                {' '}
                                                {tipo.categoria}{' '}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>

                            <InputError message={errors.categorias_id} className="mt-2" />
                        </div>

                        <div>
                            <Label htmlFor="subcategorias_id"> Subcategoría </Label>

                            <Select
                                key={`subcategorias_id-${resetKey}`}
                                required
                                defaultValue={data.subcategorias_id}
                                onValueChange={(value) => setData('subcategorias_id', value)}
                            >
                                <SelectTrigger className="mt-1 flex w-full justify-start rounded-md border border-gray-300 px-3 py-2 text-sm">
                                    <SelectValue placeholder="Selecciona un valor" />
                                </SelectTrigger>
                                <SelectContent
                                    position="popper"
                                    align="start"
                                    side="bottom"
                                    sideOffset={3}
                                    className="rounded-md border border-gray-300 bg-white p-1 shadow-md"
                                >
                                    {subcategorias.map((tipo: any, key: number) => {
                                        return (
                                            <SelectItem value={tipo.id.toString()} key={key}>
                                                {' '}
                                                {tipo.subcategoria}{' '}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>

                            <InputError message={errors.subcategorias_id} className="mt-2" />
                        </div>

                        <div>
                            <Label htmlFor="servicio"> Servicio </Label>

                            <Input
                                required
                                placeholder="Servicio"
                                id="servicio"
                                type="text"
                                name="servicio"
                                value={data.servicio}
                                className="mt-1 block w-full"
                                autoComplete="servicio"
                                onChange={(e) => setData('servicio', e.target.value)}
                            />

                            <InputError message={errors.servicio} className="mt-2" />
                        </div>

                        <div>
                            <Label htmlFor="url"> Link de Contacto </Label>

                            <Input
                                placeholder="Link de Contacto"
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
                            <Label htmlFor="whatsapp"> WhatsApp </Label>

                            <PhoneInput
                                defaultCountry={'CO'}
                                className={`${styles.phone}`}
                                placeholder="Teléfono"
                                value={data.whatsapp}
                                onChange={(e) => setData('whatsapp', e?.toString())}
                                initialValueFormat="national"
                                inputFormat="NATIONAL"
                            />

                            <InputError message={errors.whatsapp} className="mt-2" />
                        </div>

                        <div>
                            <Label htmlFor="Precio"> Precio del Servicio </Label>

                            <Input
                                required
                                placeholder="Precio del Servicio"
                                id="precio"
                                type="number"
                                name="precio"
                                value={data.precio}
                                className="mt-1 block w-full"
                                autoComplete="precio"
                                onChange={(e) => setData('precio', e.target.value)}
                            />

                            <InputError message={errors.whatsapp} className="mt-2" />
                        </div>

                        <div className='col-span-2'>
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

                        <div className="col-span-3">{preview && <img className="media preview" src={preview} alt="" />}</div>
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
