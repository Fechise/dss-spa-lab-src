import { Component, OnInit } from "@angular/core";
import { Producto, ProductoService } from "../services/producto.service";

@Component({
    selector: 'app-productos',
    templateUrl: './productos.component.html'
})

export class ProductosComponent implements OnInit {
    productos: Producto[] = [];
    nuevo: Producto = { id: 0, nombre: '', costo: 0, precio: 0, valor: 0};
    editando = false;
    cargando = false;

    constructor(private productoSrv: ProductoService) {}

    ngOnInit() {
        this.cargarProductos();
    }

    cargarProductos() {
        this.cargando = true;
        this.productoSrv.listar().subscribe(data => {
            this.productos = data;
            this.cargando = false;
        });
    }

    guardar() {
        if (!this.nuevo.nombre || !this.nuevo.costo || !this.nuevo.precio || !this.nuevo.valor) return alert('Complete los campos');
        if (this.editando) {
      this.productoSrv.actualizar(this.nuevo).subscribe(() => {
        this.cargarProductos();
        this.cancelar();
      });
    } else {
      this.productoSrv.agregar(this.nuevo).subscribe(() => {
        this.cargarProductos();
        this.nuevo = { id: 0, nombre: '', costo: 0, precio: 0.0, valor: 0.0};
      });
    }
  }

  editar(producto: Producto) {
      this.nuevo = { ...producto };
      this.editando = true;
    }
  
    eliminar(id: number) {
      if (!confirm('¿Eliminar producto?')) return;
      this.productoSrv.eliminar(id).subscribe(() => this.cargarProductos());
    }
  
    cancelar() {
      this.editando = false;
      this.nuevo = { id: 0, nombre: '', costo: 0, precio: 0.0, valor: 0.0};
    }
}