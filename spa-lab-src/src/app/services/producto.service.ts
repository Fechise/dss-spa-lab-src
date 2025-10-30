import { Injectable } from "@angular/core";
import { delay, of } from "rxjs";

export interface Producto {
    id: number;
    nombre: string;
    costo: number;
    precio: number;
    valor: number;
}

@Injectable({
    providedIn: 'root'
})
export class ProductoService {
    private productos: Producto[] = [];

    constructor() {
        const raw = localStorage.getItem('productos');
        this.productos = raw ? JSON.parse(raw) : [
            { id: 1, nombre: 'Termo', costo: 15, precio: 15, valor: 15 },
            { id: 2, nombre: 'Taza', costo: 10, precio: 10, valor: 10 }
        ];
    }

    private guardar() {
        localStorage.setItem('productos', JSON.stringify(this.productos));
    }

    listar() {
        return of(this.productos).pipe(delay(500));
    }

    agregar(producto: Producto) {
        producto.id = Date.now();
        this.productos.push(producto);
        this.guardar();
        return of(producto).pipe(delay(400));
    }

    actualizar(producto: Producto) {
        const idx = this.productos.findIndex(p => p.id === producto.id);
        if (idx >= 0) this.productos[idx] = producto;
        this.guardar();
        return of(producto).pipe(delay(400));
    }

    eliminar(id: number) {
        this.productos = this.productos.filter(p => p.id !== id);
        this.guardar();
        return of(true).pipe(delay(300));
    }
}