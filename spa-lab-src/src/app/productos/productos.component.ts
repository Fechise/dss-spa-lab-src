import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Producto, ProductoService } from "../services/producto.service";
import { NgForm } from "@angular/forms";

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
  encapsulation: ViewEncapsulation.None
}) 
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  nuevo: Producto = { id: 0, codigo: '', nombre: '', costo: 0, precio: 0, valor: 0 };
  editando = false;
  cargando = false;

  constructor(private productoSrv: ProductoService) { }

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

  guardar(form: NgForm) {
    // template-driven ya marca invalid; aquí una comprobación adicional
    if (form.invalid) {
      alert('Corrige los errores del formulario.');
      return;
    }

    // asegurar tipos numéricos
    this.nuevo.costo = Number(this.nuevo.costo);
    this.nuevo.precio = Number(this.nuevo.precio);
    this.nuevo.valor = Number(this.nuevo.valor);

    // validaciones extra en TS (por seguridad)
    if (this.nuevo.precio < 10 || this.nuevo.precio > 100) {
      alert('El precio está fuera de rango.');
      return;
    }
    if (this.nuevo.costo <= 0) {
      alert('Ingrese un costo válido.');
      return;
    }
    if (!/^[A-Za-z][0-9]+$/.test(this.nuevo.codigo || '')) {
      alert('Código inválido. Debe empezar con letra seguida de números.');
      return;
    }
    if (!this.nuevo.nombre || this.nuevo.nombre.trim().length < 5) {
      alert('El nombre del producto debe tener mínimo 5 caracteres.');
      return;
    }

    // envío
    if (this.editando) {
      this.productoSrv.actualizar(this.nuevo).subscribe(() => {
        this.cargarProductos();
        this.cancelar();
      });
    } else {
      this.productoSrv.agregar(this.nuevo).subscribe(() => {
        this.cargarProductos();
        this.nuevo = { id: 0, codigo: '', nombre: '', costo: 0, precio: 0, valor: 0 };
        form.resetForm();
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
    this.nuevo = { id: 0, codigo: '', nombre: '', costo: 0, precio: 0.0, valor: 0.0 };
  }
}