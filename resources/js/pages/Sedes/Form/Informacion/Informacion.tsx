import OSMDraggableMap from '@/components/Map/OSMDraggableMap';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StarRating from '@/components/ui/StarRating';
import { useCrudPage } from '@/hooks/useCrudPage';
import { cn } from '@/lib/utils';
import { showAlert } from '@/plugins/sweetalert';
import { index as Cities } from '@/routes/cities';
import { index as Comercios } from '@/routes/comercios';
import { index as Countries } from '@/routes/countries';
import { show, store, update } from '@/routes/sedes';
import { index as States } from '@/routes/states';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import { LoaderCircle } from 'lucide-react';
import { E164Number } from 'node_modules/libphonenumber-js/types';
import { FormEventHandler, useEffect, useMemo, useState } from 'react';
import PhoneInput, { Country, parsePhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

type ThisForm = {
    paises_id: string;
    departamentos_id: string;
    ciudades_id: string;
    comercios_id: string;
    sede: string;
    direccion: string;
    latitud: number;
    longitud: number;
    estrellas: number;
    rating_precios: number;
    numero: string | undefined;
    phone: E164Number | undefined;
    country: string | undefined;
    estado: string;
};

const latitude = 3.450965;
const longitude = -76.537658;

export const Informacion = ({ sedeId }: any) => {
    const { data, setData, errors, reset } = useForm<Required<ThisForm>>({
        paises_id: '',
        departamentos_id: '',
        ciudades_id: '',
        comercios_id: '',
        sede: '',
        direccion: '',
        latitud: latitude,
        longitud: longitude,
        estrellas: 0,
        rating_precios: 0,
        numero: '',
        phone: undefined,
        country: '',
        estado: '',
    });

    const [resetKey, setResetKey] = useState(Date.now());
    const { id, processing, onStore, onBack, onGetItem } = useCrudPage(null, null, sedeId);

    const [estados, setEstados] = useState<any[]>([]);
    const [paises, setPaises] = useState<any[]>([]);
    const [departamentos, setDepartamentos] = useState<any[]>([]);
    const [ciudades, setCiudades] = useState<any[]>([]);
    const [comercios, setComercios] = useState<any[]>([]);

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

    const onAddressUpdate = (evt: any) => {
        // setData('direccion', evt.address);
        setData('latitud', evt.latitude);
        setData('longitud', evt.longitude);
    };

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();

        try {
            onStore(store, update, data);
        } catch (error) {
            console.error(error)
            showAlert('error', 'No se pudieron registrar algunos datos')
        }
    };

    const initialPos = useMemo(() => {
        return { lat: data.latitud, lng: data.longitud };
    }, [data.latitud, data.longitud]);

    useEffect(() => {
        const getData = async () => {
            try {
                const [
                    {
                        data: { data: paises },
                    },
                    {
                        data: { data: comercios },
                    },
                    {
                        data: constantes,
                    },
                ] = await axios.all([
                    axios.get(Countries({ prefix: 'api' }, { query: { fields: 'iso2, phone_code' } }).url), 
                    axios.get(Comercios().url),
                    axios.get('/api/constants'),
                ]);

                setPaises(paises ?? []);
                setComercios(comercios ?? []);
                setEstados(constantes.estados ?? []);
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

                if (country) {
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
    }, [data.paises_id]);

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
    }, [paises, data.departamentos_id]);

    useEffect(() => {
        const getItem = async () => {
            if (!sedeId) return;

            const item = await onGetItem(show, { id: sedeId });

            setData({
                paises_id: item.ciudad?.state?.country_id.toString() ?? '',
                departamentos_id: item.ciudad?.state_id.toString() ?? '',
                ciudades_id: item.ciudad?.id.toString() ?? '',
                comercios_id: item.comercio?.id.toString() ?? '',
                sede: item.sede ?? '',
                direccion: item.direccion ?? '',
                latitud: Number(item.latitud) || latitude,
                longitud: Number(item.longitud) || longitude,
                estrellas: item.estrellas || 0,
                rating_precios: item.rating_precios || 0,
                country: item.ciudad?.state?.country.iso2,
                numero: item.numero,
                phone: `+${item.ciudad?.state?.country.phone_code}${item.numero}`,
                estado: item.estado,
            });

            setResetKey(Date.now());
        };

        getItem();
    }, [sedeId]);

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
                            <Label htmlFor="sede"> Nombre de la Sede </Label>

                            <Input
                                autoFocus
                                id="sede"
                                name="sede"
                                required
                                value={data.sede}
                                placeholder="Nombre de la Sede"
                                onChange={(e) => setData('sede', e.target.value)}
                            />

                            {errors.sede && <p className="mt-1 text-sm text-red-500">{errors.sede}</p>}
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
                            <Label htmlFor="estado"> Estado </Label>

                            <Select
                                key={`estado-${resetKey}`}
                                defaultValue={data.estado}
                                onValueChange={(value) => (value ? setData('estado', value) : null)}
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
                                    {estados.map((item: any, idx: number) => {
                                        return (
                                            <SelectItem key={idx} value={`${item.key}`}>
                                                {' '}
                                                {item.valor}{' '}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>

                            {errors.estado && <p className="mt-1 text-sm text-red-500">{errors.estado}</p>}
                        </div>

                        {sedeId && (
                            <div className="flex flex-col items-start justify-start space-y-3">
                                <Label htmlFor="verificado"> Estrellas </Label>

                                <div className="flex">
                                    <StarRating readOnly={true} key={`stars-${resetKey}`} resetKey={resetKey} initialRating={data.estrellas} />
                                </div>
                            </div>
                        )}

                        {sedeId && (
                            <div className="flex flex-col items-start justify-start space-y-3">
                                <Label htmlFor="verificado"> Rating de Precios </Label>

                                <div className="flex">
                                    <StarRating readOnly={true} key={`stars-${resetKey}`} resetKey={resetKey} initialRating={data.rating_precios} />
                                </div>
                            </div>
                        )}

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
                            disabled={processing}
                            type="button"
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
