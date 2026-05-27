CREATE DATABASE inventario_db;
USE inventario_db;

CREATE TABLE rol (
    id_rol INT PRIMARY KEY AUTO_INCREMENT,
    rol VARCHAR(50) NOT NULL
);

CREATE TABLE usuario (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre_usuario VARCHAR(50) NOT NULL UNIQUE,
    primer_nombre VARCHAR(50) NOT NULL,
    segundo_nombre VARCHAR(50) NULL,
    primer_apellido VARCHAR(50) NOT NULL,
    segundo_apellido VARCHAR(50) NULL,
    correo_electronico VARCHAR(100),
    contrasenia VARCHAR(255) NOT NULL,
    id_rol INT NOT NULL,
    FOREIGN KEY (id_rol) REFERENCES rol(id_rol)
);

CREATE TABLE categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(100) NOT NULL,
    descripcion TEXT
);

CREATE TABLE proveedor (
    id_proveedor INT AUTO_INCREMENT PRIMARY KEY,
    nit VARCHAR(9) NOT NULL,
    nombre_comercial VARCHAR(100) NOT NULL,
    direccion VARCHAR(150),
    telefono VARCHAR(20),
    correo_electronico VARCHAR(100)
);

CREATE TABLE producto (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(50) UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio_unitario DECIMAL(10,2) NOT NULL CHECK (precio_unitario >= 0),
    stock_actual INT NOT NULL DEFAULT 0 CHECK (stock_actual >= 0),
    umbral_minimo INT NOT NULL DEFAULT 0 CHECK (umbral_minimo >= 0),
    id_categoria INT NOT NULL,
    id_proveedor INT NOT NULL,
    FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria),
    FOREIGN KEY (id_proveedor) REFERENCES proveedor(id_proveedor)
);

DELIMITER //

CREATE TRIGGER tr_generar_sku_producto
BEFORE INSERT ON producto
FOR EACH ROW
BEGIN
    DECLARE next_id INT;
    
    SELECT AUTO_INCREMENT INTO next_id
    FROM information_schema.tables
    WHERE table_name = 'producto' AND table_schema = DATABASE();
    
    IF next_id IS NULL THEN
        SET next_id = 1;
    END IF;

    SET NEW.sku = CONCAT('TSM-', LPAD(next_id, 6, '0'));
END; //

DELIMITER ;

CREATE TABLE transaccion (
    id_transaccion INT AUTO_INCREMENT PRIMARY KEY,
    tipo_transaccion VARCHAR(20) NOT NULL CHECK (tipo_transaccion IN ('Entrada', 'Salida', 'Devolucion', 'Ajuste')),
    motivo TEXT,
    fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cantidad INT NOT NULL,
    id_usuario INT NOT NULL,
    id_producto INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
);

DELIMITER //

CREATE TRIGGER tr_actualizar_stock_transaccion
AFTER INSERT ON transaccion
FOR EACH ROW
BEGIN
    UPDATE producto
    SET stock_actual = stock_actual + (
        CASE
            WHEN NEW.tipo_transaccion IN ('Entrada', 'Devolucion') THEN NEW.cantidad
            WHEN NEW.tipo_transaccion = 'Salida' THEN -NEW.cantidad
            WHEN NEW.tipo_transaccion = 'Ajuste' THEN NEW.cantidad
            ELSE 0
        END
    )
    WHERE id_producto = NEW.id_producto;
END; //

DELIMITER ;

INSERT INTO rol (rol) VALUES
('Administrador'),
('Bodeguero/a');