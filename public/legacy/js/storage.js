const Almacen = {
  clave: 'inventario_equipos_v1',
  cargar() {
    try {
      const texto = localStorage.getItem(this.clave);
      if (texto) return JSON.parse(texto);
    } catch (e) {  }
    const db = crearDemo();
    this.guardar(db);
    return db;
  },
  guardar(db) {
    try { localStorage.setItem(this.clave, JSON.stringify(db)); } catch (e) { return false; }
    return true;
  },
  restaurar() {
    localStorage.removeItem(this.clave);
    return this.cargar();
  },
};
