USE inventario_db;

-- 1. Inserción de Categorías
INSERT INTO categoria (nombre_categoria, descripcion) VALUES
('Computadoras', 'Equipos portátiles, de escritorio y servidores'),
('Periféricos', 'Monitores, teclados, ratones y accesorios de entrada/salida'),
('Componentes', 'Procesadores, memorias RAM, almacenamiento y tarjetas madre'),
('Redes', 'Routers, switches, puntos de acceso y cableado estructurado');

-- 2. Inserción de Proveedores
INSERT INTO proveedor (nit, nombre_comercial, direccion, telefono, correo_electronico) VALUES
('1234567K', 'Tecnología San Marcos', '5a Avenida, Zona 1, San Marcos', '7760-0000', 'contacto@techsm.com'),
('9876543A', 'Distribuidora Central', 'Zona 4, Ciudad de Guatemala', '2222-1111', 'ventas@distcentral.com'),
('4561239B', 'Mayorista Occidente', 'Quetzaltenango', '7777-8888', 'info@occidente.com.gt');

-- 3. Inserción de Usuarios 
-- (Se generan cuentas de bodega asumiendo que el administrador principal se crea vía Node.js)
-- La contraseña cifrada corresponde a 'admin123' para facilitar las pruebas.
INSERT INTO usuario (nombre_usuario, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, correo_electronico, contrasenia, id_rol) VALUES
('bodega_01', 'Juan', 'Carlos', 'Pérez', 'Gómez', 'juan.perez@sm.com', '$2b$10$r8FBFMLDFBjNjXgMyKybWeuwmhxHe3JDbr4ezDTnyJwTqD4vkgfFK', 2),
('bodega_02', 'María', 'Fernanda', 'López', 'Díaz', 'maria.lopez@sm.com', '$2b$10$r8FBFMLDFBjNjXgMyKybWeuwmhxHe3JDbr4ezDTnyJwTqD4vkgfFK', 2);

-- 4. Inserción de Productos
-- (Se delega el SKU al BEFORE INSERT y el stock al AFTER INSERT de transacciones)
INSERT INTO producto (nombre, descripcion, precio_unitario, umbral_minimo, id_categoria, id_proveedor) VALUES
('Laptop HP ProBook', 'Procesador Core i5, 8GB RAM, 256GB SSD', 4500.00, 5, 1, 1);
INSERT INTO producto (nombre, descripcion, precio_unitario, umbral_minimo, id_categoria, id_proveedor) VALUES
('Monitor Dell 24 Pulgadas', 'Monitor LED Full HD 1080p', 1200.00, 10, 2, 2);
INSERT INTO producto (nombre, descripcion, precio_unitario, umbral_minimo, id_categoria, id_proveedor) VALUES
('Teclado Mecánico Logitech', 'Teclado retroiluminado RGB para trabajo intensivo', 450.00, 15, 2, 1);
INSERT INTO producto (nombre, descripcion, precio_unitario, umbral_minimo, id_categoria, id_proveedor) VALUES
('Disco Duro SSD Kingston 1TB', 'Unidad de estado sólido NVMe de alta velocidad', 850.00, 20, 3, 3);
INSERT INTO producto (nombre, descripcion, precio_unitario, umbral_minimo, id_categoria, id_proveedor) VALUES
('Router TP-Link Archer', 'Router doble banda Gigabit', 350.00, 10, 4, 1);
INSERT INTO producto (nombre, descripcion, precio_unitario, umbral_minimo, id_categoria, id_proveedor) VALUES
('Memoria RAM Corsair 16GB', 'Módulo de memoria DDR4 a 3200MHz', 600.00, 15, 3, 2);

-- 5. Inserción de Transacciones
-- (Estas operaciones pondrán a prueba el disparador para sumar y restar el stock)
INSERT INTO transaccion (tipo_transaccion, motivo, cantidad, id_usuario, id_producto) VALUES
-- Entradas para establecer el inventario inicial
('Entrada', 'Lote de inventario inicial', 20, 1, 1),
('Entrada', 'Lote de inventario inicial', 30, 1, 2),
('Entrada', 'Lote de inventario inicial', 50, 1, 3),
('Entrada', 'Lote de inventario inicial', 100, 2, 4),
('Entrada', 'Lote de inventario inicial', 40, 2, 5),
('Entrada', 'Lote de inventario inicial', 80, 1, 6),
-- Simulaciones de movimientos operativos diarios
('Salida', 'Asignación de equipo para nuevo empleado', 2, 1, 1),
('Salida', 'Requisición interna del departamento técnico', 1, 2, 3),
('Salida', 'Venta a cliente corporativo local', 5, 1, 2),
('Devolucion', 'Producto ingresado a garantía por defecto', 1, 1, 1),
('Ajuste', 'Corrección por conteo físico en bodega', -2, 2, 4);