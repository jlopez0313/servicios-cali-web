import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multiselect';
import { Textarea } from '@/components/ui/textarea';
import { Toggle } from '@/components/ui/toggle';
import { useCrudPage } from '@/hooks/useCrudPage';
import AppLayout from '@/layouts/app-layout';
import { showAlert } from '@/plugins/sweetalert';
import { index as Secciones } from '@/routes/secciones';
import { show, store, update } from '@/routes/servicios';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Check, LoaderCircle, X } from 'lucide-react';
import { E164Number } from 'node_modules/libphonenumber-js/types';
import { FormEventHandler, useEffect, useState } from 'react';
import PhoneInput, { Country, parsePhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import styles from './Servicios.module.scss';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Servicios',
        href: '/servicios',
    },
    {
        title: 'Gestionar Servicios',
        href: '',
    },
];

type ThisForm = {
    sedes_id: string;
    secciones_id: string[];
    servicio: string;
    url: string;
    whatsapp: string | undefined;
    precio: string;
    descripcion: string;
    imagen: string;
    es_virtual: boolean;
    a_domicilio: boolean;
    en_sede: boolean;
    precio_domicilio: string;
};

export default function ({ sedeId, servicioId }: any) {
    const { data, setData, errors, reset, setError } = useForm<ThisForm>({
        sedes_id: sedeId,
        secciones_id: [],
        servicio: '',
        url: '',
        whatsapp: '',
        precio: '',
        descripcion: '',
        imagen: '',
        es_virtual: false,
        a_domicilio: false,
        en_sede: false,
        precio_domicilio: '',
    });

    const { id, processing, onStore, onBack, onGetItem } = useCrudPage(null, null, servicioId);


    const [phone, setPhone] = useState<any>(undefined);
    const [country, setCountry] = useState<any>('CO');
    const [secciones, setSecciones] = useState([]);
    const [preview, setPreview] = useState('');
    const [resetKey, setResetKey] = useState(Date.now());

    const handlePhoneChange = (value: E164Number | undefined) => {
        
        setPhone(value);

        if (value) {
            try {
                const parsedNumber = parsePhoneNumber(value);
                setData('whatsapp', parsedNumber?.nationalNumber);
            } catch (error) {
                console.error('Error al parsear el número:', error);
            }
        }
    };

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
            onBack();
        } catch (error) {
            console.error('Error fetching data:', error);
            showAlert('error', 'No se pudieron registrar algunos datos');
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
            if (!id) return;
            const item = await onGetItem(show, { servicio: id });

            if (item) {
                setData({
                    secciones_id:
                        item.secciones.map((secc: any) => {
                            return secc.id;
                        }) || [],
                    sedes_id: sedeId,
                    servicio: item.servicio,
                    url: item.url,
                    whatsapp: item.whatsapp,
                    precio: item.precio,
                    descripcion: item.descripcion,
                    imagen: '',
                    es_virtual: item.es_virtual == 1 ? true : false,
                    a_domicilio: item.a_domicilio == 1 ? true : false,
                    en_sede: item.en_sede == 1 ? true : false,
                    precio_domicilio: item.precio_domicilio ?? '0',
                });

                setPhone(`+${item.sede?.ciudad?.state?.country.phone_code}${item.whatsapp}`);
                setCountry(item.sede?.ciudad?.state?.country?.iso2 ?? 'CO');

                setPreview('/' + item.imagen);
            }

            setResetKey(Date.now());
        };

        getItem();
    }, [id]);

    useEffect(() => {
        const onGetSubcategorias = async () => {
            const {
                data: { data: lista },
            } = await axios.get(Secciones().url);

            setSecciones(
                lista.map((cat: any) => {
                    return { label: cat.seccion, value: cat.id };
                }) ?? [],
            );
        };

        onGetSubcategorias();
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestionar Servicios" />

            <div className="pt-6 pb-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <form onSubmit={submit}>
                        <div className="border rounded-md p-8 grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="secciones_id"> Secciones </Label>
                                <MultiSelect
                                    placeholder="Selecciona Categorías"
                                    selected={data.secciones_id}
                                    onChange={(newSelected) => setData('secciones_id', newSelected)}
                                    options={secciones}
                                />

                                <InputError message={errors.secciones_id} className="mt-2" />
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
                                    countries={[country]}
                                    defaultCountry={country as Country | undefined}
                                    className={`${styles.phone}`}
                                    placeholder="Teléfono"
                                    value={phone?.replaceAll(' ', '')}
                                    onChange={handlePhoneChange}
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

                            <div>
                                <Label htmlFor="en_sede"> Servicio en Sede? </Label>

                                <Toggle
                                    className="mt-1 flex"
                                    pressed={data.en_sede}
                                    onPressedChange={(value) => setData('en_sede', value)}
                                    variant="outline"
                                    aria-label="Estado"
                                >
                                    {data.en_sede ? <Check /> : <X />}
                                </Toggle>
                            </div>

                            <div>
                                <Label htmlFor="es_virtual"> Servicio Virtual? </Label>

                                <Toggle
                                    className="mt-1 flex"
                                    pressed={data.es_virtual}
                                    onPressedChange={(value) => setData('es_virtual', value)}
                                    variant="outline"
                                    aria-label="Estado"
                                >
                                    {data.es_virtual ? <Check /> : <X />}
                                </Toggle>
                            </div>

                            <div>
                                <Label htmlFor="a_domicilio"> Servicio a Domicilio? </Label>

                                <Toggle
                                    className="mt-1 flex"
                                    pressed={data.a_domicilio}
                                    onPressedChange={(value) => setData('a_domicilio', value)}
                                    variant="outline"
                                    aria-label="Estado"
                                >
                                    {data.a_domicilio ? <Check /> : <X />}
                                </Toggle>
                            </div>

                            {data.a_domicilio && (
                                <div>
                                    <Label htmlFor="precio_domicilio"> Precio del Domicilio </Label>

                                    <Input
                                        required
                                        placeholder="Precio del Dommicilio"
                                        id="precio_domicilio"
                                        type="number"
                                        name="precio"
                                        value={data.precio_domicilio}
                                        className="mt-1 block w-full"
                                        autoComplete="precio_domicilio"
                                        onChange={(e) => setData('precio_domicilio', e.target.value)}
                                    />

                                    <InputError message={errors.precio_domicilio} className="mt-2" />
                                </div>
                            )}

                            <div className="col-span-2">
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

                            <div className="col-span-2">{preview && <img className="media preview" src={preview} alt="" />}</div>
                        </div>

                        <div className="mt-4 flex items-center justify-end gap-4">
                            <Button variant={'outline'} type="button" disabled={processing} onClick={() => onBack()}>
                                Regresar
                            </Button>
                            <Button disabled={processing}>
                                Guardar
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
};
