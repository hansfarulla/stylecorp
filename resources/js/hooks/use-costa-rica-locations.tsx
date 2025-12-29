import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = 'https://api-geo-cr.vercel.app';

interface Provincia {
    idProvincia: number;
    descripcion: string;
}

interface Canton {
    idCanton: number;
    idProvincia: number;
    descripcion: string;
}

interface Distrito {
    idDistrito: number;
    idCanton: number;
    descripcion: string;
}

interface ApiResponse<T> {
    status: string;
    statusCode: number;
    message: string;
    data: T[];
    meta: {
        totalItems: number;
        itemCount: number;
        itemsPerPage: number;
        totalPages: number;
        currentPage: number;
        timestamp: string;
    };
}

// Caché en memoria
const cache = {
    provincias: null as Provincia[] | null,
    cantones: new Map<number, Canton[]>(),
    distritos: new Map<number, Distrito[]>(),
};

export function useCostaRicaLocations() {
    const [provincias, setProvincias] = useState<Provincia[]>([]);
    const [cantones, setCantones] = useState<Canton[]>([]);
    const [distritos, setDistritos] = useState<Distrito[]>([]);
    
    const [isLoadingProvincias, setIsLoadingProvincias] = useState(false);
    const [isLoadingCantones, setIsLoadingCantones] = useState(false);
    const [isLoadingDistritos, setIsLoadingDistritos] = useState(false);

    // Cargar todas las provincias
    const loadProvincias = useCallback(async () => {
        // Si ya están en caché, usar esas
        if (cache.provincias) {
            setProvincias(cache.provincias);
            return;
        }

        setIsLoadingProvincias(true);
        try {
            const response = await fetch(`${API_BASE_URL}/provincias?page=1&limit=10`);
            const result: ApiResponse<Provincia> = await response.json();
            
            cache.provincias = result.data;
            setProvincias(result.data);
        } catch (error) {
            console.error('Error cargando provincias:', error);
        } finally {
            setIsLoadingProvincias(false);
        }
    }, []);

    // Cargar cantones de una provincia
    const loadCantones = useCallback(async (idProvincia: number) => {
        if (!idProvincia) {
            setCantones([]);
            setDistritos([]);
            return;
        }

        // Si ya están en caché, usar esos
        if (cache.cantones.has(idProvincia)) {
            setCantones(cache.cantones.get(idProvincia)!);
            return;
        }

        setIsLoadingCantones(true);
        try {
            const response = await fetch(`${API_BASE_URL}/provincias/${idProvincia}/cantones?page=1&limit=100`);
            const result: ApiResponse<Canton> = await response.json();
            
            cache.cantones.set(idProvincia, result.data);
            setCantones(result.data);
        } catch (error) {
            console.error('Error cargando cantones:', error);
        } finally {
            setIsLoadingCantones(false);
        }
    }, []);

    // Cargar distritos de un cantón
    const loadDistritos = useCallback(async (idCanton: number) => {
        if (!idCanton) {
            setDistritos([]);
            return;
        }

        // Si ya están en caché, usar esos
        if (cache.distritos.has(idCanton)) {
            setDistritos(cache.distritos.get(idCanton)!);
            return;
        }

        setIsLoadingDistritos(true);
        try {
            const response = await fetch(`${API_BASE_URL}/cantones/${idCanton}/distritos?page=1&limit=100`);
            const result: ApiResponse<Distrito> = await response.json();
            
            cache.distritos.set(idCanton, result.data);
            setDistritos(result.data);
        } catch (error) {
            console.error('Error cargando distritos:', error);
        } finally {
            setIsLoadingDistritos(false);
        }
    }, []);

    // Cargar provincias al montar
    useEffect(() => {
        loadProvincias();
    }, [loadProvincias]);

    return {
        provincias,
        cantones,
        distritos,
        isLoadingProvincias,
        isLoadingCantones,
        isLoadingDistritos,
        loadCantones,
        loadDistritos,
    };
}
