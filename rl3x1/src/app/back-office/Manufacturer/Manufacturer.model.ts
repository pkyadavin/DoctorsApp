export class Manufacturer{
    ID: number;
    ManufacturerID: number;
    ManufacturerCode: string;
    ManufacturerName: string;
    GlobalManufacturerName: string;
    IsActive: boolean;

    constructor();
    constructor(Manufacturer: Manufacturer);
    constructor(Manufacturer?: any)
    {
        this.ID = Manufacturer && Manufacturer.ManufacturerID || 0;
        this.ManufacturerID = Manufacturer && Manufacturer.ManufacturerID || 0;
        this.ManufacturerCode = Manufacturer && Manufacturer.ManufacturerCode || '';
        this.ManufacturerName = Manufacturer && Manufacturer.ManufacturerName || '';
        this.GlobalManufacturerName = Manufacturer && Manufacturer.GlobalManufacturerName || '';
        this.IsActive = Manufacturer && Manufacturer.IsActive || false;
    }

}