import InputError from '@/components/input-error';
import OSMDraggableMap from '@/components/Map/OSMDraggableMap';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multiselect';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCrudPage } from '@/hooks/useCrudPage';
import { cn } from '@/lib/utils';
import { showAlert } from '@/plugins/sweetalert';
import { index } from '@/routes/categorias';
import { index as Cities } from '@/routes/cities';
import { show, store, update } from '@/routes/comercios';
import { index as Countries } from '@/routes/countries';
import { index as States } from '@/routes/states';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { E164Number } from 'node_modules/libphonenumber-js/types';
import { FormEventHandler, useEffect, useMemo, useState } from 'react';
import PhoneInput, { Country, parsePhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

type ThisForm = {
    paises_id: string;
    departamentos_id: string;
    ciudades_id: string;
    nombre: string;
    logo: string;
    banner: string;
    direccion: string;
    latitud: number;
    longitud: number;
    categorias: string[];
    numero: string | undefined;
    phone: E164Number | undefined;
    country: string | undefined;
};

const latitude = 3.450965;
const longitude = -76.537658;

export const Informacion = ({ comercioId }: any) => {
    const { data, setData, errors, reset, setError } = useForm<ThisForm>({
        paises_id: '',
        departamentos_id: '',
        ciudades_id: '',
        nombre: '',
        logo: '',
        banner: '',
        direccion: '',
        latitud: latitude,
        longitud: longitude,
        numero: '',
        phone: undefined,
        country: '',
        categorias: [],
    });

    const { id, processing, onStore, onBack, onGetItem } = useCrudPage(null, null, comercioId);

    const [preview, setPreview] = useState<any>({});
    const [categorias, setCategorias] = useState([]);
    const [resetKey, setResetKey] = useState(Date.now());
    const [paises, setPaises] = useState<any[]>([]);
    const [departamentos, setDepartamentos] = useState<any[]>([]);
    const [ciudades, setCiudades] = useState<any[]>([]);

    const initialPos = useMemo(() => {
        return { lat: data.latitud, lng: data.longitud };
    }, [data.latitud, data.longitud]);

    const onAddressUpdate = (evt: any) => {
        // setData('direccion', evt.address);
        setData('latitud', evt.latitude);
        setData('longitud', evt.longitude);
    };

    const handlePhoneChange = (value: E164Number | undefined) => {
        setData('phone', value);

        if (value) {
            try {
                const parsedNumber = parsePhoneNumber(value);
                setData('numero', parsedNumber?.nationalNumber);
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
        } catch (error) {
            console.log(error);
            showAlert('error', 'No se pudieron registrar algunos datos')
        }
    };

    const onSetPreview = (evt: any, key: string) => {
        setData({
            ...data,
            [key]: evt.target.files[0],
        });

        const image = URL.createObjectURL(evt.target.files[0]);
        setPreview({
            ...preview,
            [key]: image,
        });
    };

    useEffect(() => {
        const getData = async () => {
            try {
                const {
                    data: { data: categorias },
                } = await axios.get(index().url);

                setCategorias(
                    categorias.map((cat: any) => {
                        return { label: cat.categoria, value: cat.id };
                    }) ?? [],
                );
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
            const item = await onGetItem(show, { comercio: id });

            if (item) {
                setData({
                    categorias:
                        item.categorias.map((cat: any) => {
                            return cat.id;
                        }) || [],
                    paises_id: item.ciudad?.state?.country_id.toString() ?? '',
                    departamentos_id: item.ciudad?.state_id.toString() ?? '',
                    ciudades_id: item.ciudad?.id.toString() ?? '',
                    nombre: item.nombre,
                    logo: '',
                    banner: '',
                    direccion: item.direccion ?? '',
                    latitud: Number(item.latitud) || latitude,
                    longitud: Number(item.longitud) || longitude,
                    country: item.ciudad?.state?.country.iso2,
                    numero: item.numero,
                    phone: `+${item.ciudad?.state?.country.phone_code}${item.numero}`,
                });

                setPreview({
                    logo: '/' + item.logo,
                    banner: '/' + item.banner,
                });

                setResetKey(Date.now());
            }
        };

        getItem();
    }, [id]);

    useEffect(() => {
        const getData = async () => {
            try {
                const {
                    data: { data: paises },
                } = await axios.get(Countries({ prefix: 'api' }, { query: { fields: 'iso2, phone_code' } }).url);
                setPaises(paises ?? []);
            } catch (error) {
                console.error('Error fetching data:', error);
                showAlert('error', 'No se pudieron cargar algunos datos');
            }
        };

        getData();
    }, []);

    useEffect(() => {
        const getData = async () => {
            if (!data.paises_id) return;
            try {
                const country = paises.find((p) => p.id == data.paises_id);
                
                if ( country ) {
                    setData('country', country.iso2);
                }

                const {
                    data: { data: lista },
                } = await axios.get(States({ prefix: 'api' }, { query: { 'filters[country_id]': data.paises_id } }).url);

                setDepartamentos(lista);
            } catch (error) {
                console.error('Error fetching data:', error);
                showAlert('error', 'No se pudieron cargar algunos datos');
            }
        };

        getData();
    }, [paises, data.paises_id]);

    useEffect(() => {
        const getData = async () => {
            if (!data.departamentos_id) return;
            try {
                const {
                    data: { data: lista },
                } = await axios.get(Cities({ prefix: 'api' }, { query: { 'filters[state_id]': data.departamentos_id } }).url);

                setCiudades(lista);
            } catch (error) {
                console.error('Error fetching data:', error);
                showAlert('error', 'No se pudieron cargar algunos datos');
            }
        };

        getData();
    }, [data.departamentos_id]);

    return (
        <div className="pt-6 pb-12">
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <form onSubmit={submit}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="paises_id"> País </Label>

                            <Select
                                key={`paises_id-${resetKey}`}
                                defaultValue={data.paises_id}
                                onValueChange={(value) => (value ? setData('paises_id', value) : null)}
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
                                    {paises.map((item: any, idx: number) => {
                                        return (
                                            <SelectItem key={idx} value={`${item.id.toString()}`}>
                                                {' '}
                                                {item.name}{' '}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>

                            {errors.paises_id && <p className="mt-1 text-sm text-red-500">{errors.paises_id}</p>}
                        </div>

                        <div>
                            <Label htmlFor="departamentos_id"> Departamento </Label>

                            <Select
                                key={`departamentos_id-${resetKey}`}
                                defaultValue={data.departamentos_id}
                                onValueChange={(value) => (value ? setData('departamentos_id', value) : null)}
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
                                    {departamentos.map((item: any, idx: number) => {
                                        return (
                                            <SelectItem key={idx} value={`${item.id.toString()}`}>
                                                {' '}
                                                {item.name}{' '}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>

                            {errors.departamentos_id && <p className="mt-1 text-sm text-red-500">{errors.departamentos_id}</p>}
                        </div>

                        <div>
                            <Label htmlFor="ciudades_id"> Ciudad </Label>

                            <Select
                                key={`ciudades_id-${resetKey}`}
                                defaultValue={data.ciudades_id}
                                onValueChange={(value) => (value ? setData('ciudades_id', value) : null)}
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
                                    {ciudades.map((item: any, idx: number) => {
                                        return (
                                            <SelectItem key={idx} value={`${item.id.toString()}`}>
                                                {' '}
                                                {item.name}{' '}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>

                            {errors.ciudades_id && <p className="mt-1 text-sm text-red-500">{errors.ciudades_id}</p>}
                        </div>

                        <div>
                            <Label htmlFor="comercio"> Nombre del Comercio </Label>

                            <Input
                                required
                                placeholder="Nombre del Comercio"
                                id="comercio"
                                type="text"
                                name="comercio"
                                value={data.nombre}
                                className="mt-1 block w-full"
                                autoComplete="comercio"
                                onChange={(e) => setData('nombre', e.target.value)}
                            />

                            <InputError message={errors.nombre} className="mt-2" />
                        </div>

                        <div>
                            <Label htmlFor="direccion"> Dirección </Label>

                            <Input
                                autoFocus
                                id="direccion"
                                name="direccion"
                                required
                                value={data.direccion}
                                placeholder="Dirección"
                                onChange={(e) => setData('direccion', e.target.value)}
                            />

                            {errors.direccion && <p className="mt-1 text-sm text-red-500">{errors.direccion}</p>}
                        </div>

                        <div>
                            <Label htmlFor="phone"> WhatsApp </Label>
                            <div className="relative">
                                <PhoneInput
                                    className={cn(
                                        'flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                                        'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
                                        'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
                                        'w-full rounded-md border p-2',
                                    )}
                                    defaultCountry={data.country as Country | undefined}
                                    placeholder="Ingrese su teléfono"
                                    value={data.phone?.replaceAll(' ', '')}
                                    onChange={handlePhoneChange}
                                    international={false}
                                    countryCallingCodeEditable={false}
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="categorias"> Categorías </Label>
                            <MultiSelect
                                placeholder="Selecciona Categorías"
                                selected={data.categorias}
                                onChange={(newSelected) => setData('categorias', newSelected)}
                                options={categorias}
                            />

                            {errors.categorias && <p className="mt-1 text-sm text-red-500">{errors.categorias}</p>}
                        </div>

                        <div></div>

                        <div>
                            <Label htmlFor="logo"> Logo </Label>

                            <Input
                                type="file"
                                required={!id}
                                placeholder="Logo"
                                id="logo"
                                name="logo"
                                className="mt-1 block w-full"
                                accept="image/*"
                                onChange={(e) => onSetPreview(e, 'logo')}
                            />

                            <InputError message={errors.logo} className="mt-2" />
                        </div>

                        <div>
                            <Label htmlFor="banner"> Banner </Label>

                            <Input
                                type="file"
                                required={!id}
                                placeholder="Logo"
                                id="banner"
                                name="banner"
                                className="mt-1 block w-full"
                                accept="image/*"
                                onChange={(e) => onSetPreview(e, 'banner')}
                            />

                            <InputError message={errors.banner} className="mt-2" />
                        </div>

                        <div>{preview.logo && <img className="media preview" src={preview.logo} alt="" />}</div>

                        <div>{preview.banner && <img className="media preview" src={preview.banner} alt="" />}</div>

                        <div className="col-span-2">
                            {/*
                            <DraggableMarkerMap
                                initialAddress={data.direccion}
                                initialPosition={initialPos}
                                onAddressUpdate={onAddressUpdate}
                            />

                            */}
                            <OSMDraggableMap initialPosition={initialPos} onAddressUpdate={onAddressUpdate} />
                        </div>
                    </div>

                    <div className="mt-4 flex items-center justify-end gap-4">
                        <Button
                            variant={'outline'}
                            type="button"
                            disabled={processing}
                            onClick={() => {
                                onBack();
                            }}
                        >
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
    );
};
