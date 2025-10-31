import { Injectable } from "@angular/core";
import { delay, of } from "rxjs";

export interface Producto {
    id: number;
    codigo?: string;
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
    private nextId: number = 1; // Variable para el siguiente ID

    constructor() {
        const raw = localStorage.getItem('productos');
        // PRODUCTOS QUEMADOS CORREGIDOS (respetan TODAS las reglas de validación)
        this.productos = raw ? JSON.parse(raw) : [
            { id: 1, codigo: 'T001', nombre: 'Taza de Cerámica Personalizada', costo: 5, precio: 15.99, valor: 5 },
            { id: 2, codigo: 'L001', nombre: 'Libreta de Notas Premium (A5)', costo: 8, precio: 19.95, valor: 8 },
            { id: 3, codigo: 'M001', nombre: 'Mouse Pad Gamer XL', costo: 12.50, precio: 29.99, valor: 12.50 },
        ];
        this.actualizarNextId(); // Calculamos el siguiente ID al iniciar
    }

    private actualizarNextId() {
        // Si hay productos, el siguiente ID es el máximo ID actual + 1. Si no, es 1.
        this.nextId = this.productos.length > 0
            ? Math.max(...this.productos.map(p => p.id)) + 1
            : 1;
    }

    private guardar() {
        localStorage.setItem('productos', JSON.stringify(this.productos));
    }

    listar() {
        return of(this.productos).pipe(delay(500));
    }

    agregar(producto: Producto) {
        producto.id = this.nextId; // Usamos el ID auto-incremental
        this.productos.push(producto);
        this.actualizarNextId(); // Actualizamos el ID para el próximo producto
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
        this.actualizarNextId(); // Recalculamos el ID por si se borra el más alto
        this.guardar();
        return of(true).pipe(delay(300));
    }
}