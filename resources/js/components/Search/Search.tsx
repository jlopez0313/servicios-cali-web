import { Button } from "@/components//ui/button";
import { Input } from "@/components/ui/input";
import { router } from "@inertiajs/react";
import { FormEventHandler, useState } from "react";

export const Search = ({filters, ruta, params = {}}: any) => {
    const [search, setSearch] = useState(filters.search ?? "");

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();
        router.get(
            ruta,
            {
                search,
            },
            {
                preserveState: false,
                replace: true,
            },
        );
    };

    return (
        <form
            onSubmit={submit}
            className="flex gap-2 items-end w-full max-w-md"
        >
            <Input
                id="comunidad"
                name="comunidad"
                value={search}
                className="w-full"
                autoComplete="comunidad"
                placeholder="Buscar..."
                onChange={(e) => setSearch(e.target.value)}
            />
            <Button variant={"outline"}>Buscar</Button>
        </form>
    );
};
