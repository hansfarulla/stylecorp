import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useCostaRicaLocations } from '@/hooks/use-costa-rica-locations';
import { useEffect, useState } from 'react';

interface LocationSelectorProps {
    provincia?: string;
    canton?: string;
    distrito?: string;
    onProvinceChange: (value: string) => void;
    onCantonChange: (value: string) => void;
    onDistrictChange: (value: string) => void;
}

export function LocationSelector({
    provincia = '',
    canton = '',
    distrito = '',
    onProvinceChange,
    onCantonChange,
    onDistrictChange,
}: LocationSelectorProps) {
    const {
        provincias,
        cantones,
        distritos,
        isLoadingProvincias,
        isLoadingCantones,
        isLoadingDistritos,
        loadCantones,
        loadDistritos,
    } = useCostaRicaLocations();

    const [selectedProvinciaId, setSelectedProvinciaId] = useState<number | null>(null);
    const [selectedCantonId, setSelectedCantonId] = useState<number | null>(null);

    // Buscar ID de provincia desde el nombre
    useEffect(() => {
        if (provincia && provincias.length > 0) {
            const prov = provincias.find(p => p.descripcion === provincia);
            if (prov && prov.idProvincia !== selectedProvinciaId) {
                setSelectedProvinciaId(prov.idProvincia);
                loadCantones(prov.idProvincia);
            }
        }
    }, [provincia, provincias, selectedProvinciaId, loadCantones]);

    // Buscar ID de cantón desde el nombre
    useEffect(() => {
        if (canton && cantones.length > 0) {
            const cant = cantones.find(c => c.descripcion === canton);
            if (cant && cant.idCanton !== selectedCantonId) {
                setSelectedCantonId(cant.idCanton);
                loadDistritos(cant.idCanton);
            }
        }
    }, [canton, cantones, selectedCantonId, loadDistritos]);

    const handleProvinceChange = (value: string) => {
        const prov = provincias.find(p => p.descripcion === value);
        if (prov) {
            setSelectedProvinciaId(prov.idProvincia);
            setSelectedCantonId(null);
            
            onProvinceChange(value);
            onCantonChange('');
            onDistrictChange('');
            
            loadCantones(prov.idProvincia);
        }
    };

    const handleCantonChange = (value: string) => {
        const cant = cantones.find(c => c.descripcion === value);
        if (cant) {
            setSelectedCantonId(cant.idCanton);
            
            onCantonChange(value);
            onDistrictChange('');
            
            loadDistritos(cant.idCanton);
        }
    };

    const handleDistrictChange = (value: string) => {
        onDistrictChange(value);
    };

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Provincia */}
            <div className="space-y-2">
                <Label htmlFor="provincia">Provincia</Label>
                <Select
                    value={provincia}
                    onValueChange={handleProvinceChange}
                    disabled={isLoadingProvincias}
                >
                    <SelectTrigger id="provincia">
                        <SelectValue placeholder={isLoadingProvincias ? "Cargando..." : "Seleccionar"} />
                    </SelectTrigger>
                    <SelectContent>
                        {provincias.map((prov) => (
                            <SelectItem key={prov.idProvincia} value={prov.descripcion}>
                                {prov.descripcion}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Cantón */}
            <div className="space-y-2">
                <Label htmlFor="canton">Cantón</Label>
                <Select
                    value={canton}
                    onValueChange={handleCantonChange}
                    disabled={!selectedProvinciaId || isLoadingCantones}
                >
                    <SelectTrigger id="canton">
                        <SelectValue 
                            placeholder={
                                !selectedProvinciaId 
                                    ? "Selecciona provincia primero" 
                                    : isLoadingCantones 
                                    ? "Cargando..." 
                                    : "Seleccionar"
                            } 
                        />
                    </SelectTrigger>
                    <SelectContent>
                        {cantones.map((cant) => (
                            <SelectItem key={cant.idCanton} value={cant.descripcion}>
                                {cant.descripcion}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Distrito */}
            <div className="space-y-2">
                <Label htmlFor="distrito">Distrito</Label>
                <Select
                    value={distrito}
                    onValueChange={handleDistrictChange}
                    disabled={!selectedCantonId || isLoadingDistritos}
                >
                    <SelectTrigger id="distrito">
                        <SelectValue 
                            placeholder={
                                !selectedCantonId 
                                    ? "Selecciona cantón primero" 
                                    : isLoadingDistritos 
                                    ? "Cargando..." 
                                    : "Seleccionar"
                            } 
                        />
                    </SelectTrigger>
                    <SelectContent>
                        {distritos.map((dist) => (
                            <SelectItem key={dist.idDistrito} value={dist.descripcion}>
                                {dist.descripcion}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
