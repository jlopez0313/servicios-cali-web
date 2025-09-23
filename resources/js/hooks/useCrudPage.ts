import { confirmDialog, showAlert } from '@/plugins/sweetalert';
import { router } from '@inertiajs/react';
import { useState } from 'react';

export const useCrudPage = (lista: any, destroyFn: any, _id: number | null = null) => {
    const [id, setId] = useState<number | null>(_id);
    const [show, setShow] = useState(false);
    const [processing, setProcessing] = useState(false);

    const onSetItem = (_id: number) => {
        setId(_id);
        onToggleModal(true);
    };

    const onToggleModal = (isShown: boolean) => {
        if (!isShown) {
            setId(null);
        }
        setShow(isShown);
    };

    const onReload = (deleted: boolean = false) => {
        if (lista) {
            const { current_page, total, per_page } = lista.meta;
            const lastPage = Math.max(1, Math.ceil((total - (deleted ? 1 : 0)) / per_page));
            const targetPage = Math.min(current_page, lastPage);

            router.visit(`?page=${targetPage}`, {
                preserveScroll: true,
            });
        }
    };

    const onList = async (indexFn: any, params: Record<string, any>) => {
        const { data } = await axios.get(indexFn().url, params);
        return data.data;
    };

    const onGetItem = async (showFn: any, params: Record<string, any>, queryParams: Record<string, any> = {}) => {
        const { data } = await axios.get(showFn(params).url, queryParams);
        return data.data;
    };

    const onStore = async (storeFn: any, updateFn: any, data: any, multimedia: boolean = false) => {
        setProcessing(true);

        try {
            if (id && updateFn) {
                if (multimedia) {
                    data.append('_method', 'PUT');
                    await axios.post(updateFn({ id }).url, data);
                } else {
                    await axios.put(updateFn({ id }).url, data);
                }
            } else {
                await axios.post(storeFn().url, data);
            }

            await showAlert('success', 'Registro guardado exitosamente!');
        } catch (error) {
            console.log(error);
        } finally {
            setProcessing(false);
            setShow( false )
        }
    };

    const onTrash = async (_id: number) => {
        const result = await confirmDialog({
            title: '¿Estás seguro?',
            text: '¡No podrás revertir esto!',
            icon: 'warning',
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(destroyFn({ id: _id }).url);
                await showAlert('success', 'Registro eliminado exitosamente!');
                onReload(true);
            } catch (error) {
                console.log(error);
                showAlert('error', 'Error al eliminar');
            }
        }
    };

    const onBack = () => {
        window.history.back();
    };

    return {
        id,
        show,
        processing,
        onList,
        onSetItem,
        onToggleModal,
        onReload,
        onTrash,
        onStore,
        onGetItem,
        onBack,
    };
};
