import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SelectMultiple } from '@/components/ui/SelectMultiple';
import { show, store, update } from '@/routes/usuarios';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

type ThisForm = {
    name: string;
    email: string;
    role: string[];
    password?: string;
    repeated_password?: string;
};

export const Form = ({ id, roles, setIsOpen, processing, onStore, onGetItem, onReload }: any) => {
    const { data, setData, errors, reset, setError } = useForm<ThisForm>({
        name: '',
        email: '',
        role: [],
        password: '',
        repeated_password: '',
    });

    const [resetKey, setResetKey] = useState(Date.now());

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();

        setError('password', '');
        setError('repeated_password', '');

        if (data.password != data.repeated_password) {
            setError('password', 'Las contraseñas no coinciden');
            setError('repeated_password', 'Las contraseñas no coinciden');
            return;
        }

        if (!data.role.length) {
            setError('role', 'Debes seleccionar al menos un rol');
            return;
        }

        await onStore(store, update, data);
        onReload();
    };

    useEffect(() => {
        const getItem = async () => {
            if (!id) return;
            const item: any = await onGetItem(show, { id });

            if (item) {
                setData({
                    name: item.name,
                    email: item.email,
                    role: item.roles || [],
                });

                setResetKey(Date.now());
            }
        };
        getItem();
    }, [id]);

    return (
        <div className="pt-6 pb-12">
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <form onSubmit={submit}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="name"> Nombre </Label>

                            <Input
                                required
                                placeholder="Nombre"
                                id="name"
                                type="text"
                                name="name"
                                value={data.name}
                                className="mt-1 block w-full"
                                autoComplete="name"
                                onChange={(e) => setData('name', e.target.value)}
                            />

                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div>
                            <Label htmlFor="email"> Correo </Label>

                            <Input
                                required
                                placeholder="Correo"
                                id="email"
                                type="email"
                                name="email"
                                readOnly={id}
                                value={data.email}
                                className="mt-1 block w-full"
                                autoComplete="email"
                                onChange={(e) => setData('email', e.target.value)}
                            />

                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div>
                            <Label htmlFor="password"> Contraseña </Label>

                            <Input
                                required={!id}
                                placeholder="Contraseña"
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full"
                                autoComplete="password"
                                onChange={(e) => setData('password', e.target.value)}
                            />

                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div>
                            <Label htmlFor="repeated_password"> Repetir Contraseña </Label>

                            <Input
                                required={!id}
                                placeholder="Repetir Contraseña"
                                id="repeated_password"
                                type="password"
                                name="repeated_password"
                                value={data.repeated_password}
                                className="mt-1 block w-full"
                                autoComplete="repeated_password"
                                onChange={(e) => setData('repeated_password', e.target.value)}
                            />

                            <InputError message={errors.repeated_password} className="mt-2" />
                        </div>

                        <div>
                            <Label htmlFor="role"> Rol </Label>
                            <SelectMultiple
                                placeholder="Rol"
                                className="mt-1 block w-full"
                                options={roles.map((r: any) => {
                                    return { value: r, label: r };
                                })}
                                value={data.role}
                                onChange={(e) => setData('role', e)}
                            />

                            {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role}</p>}
                        </div>
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
