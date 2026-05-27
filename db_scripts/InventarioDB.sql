CREATE DATABASE InventarioDB;
USE InventarioDB;

CREATE TABLE Rol (
    Id_Rol INT PRIMARY KEY AUTO_INCREMENT,
    Rol VARCHAR(50) NOT NULL
);

CREATE TABLE Usuario (
    Id_Usuario INT PRIMARY KEY AUTO_INCREMENT,
    Nombre_Usuario VARCHAR(50) NOT NULL UNIQUE,
    Primer_Nombre VARCHAR(50) NOT NULL,
    Segundo_Nombre VARCHAR(50) NULL,
    Primer_Apellido VARCHAR(50) NOT NULL,
    Segundo_Apellido VARCHAR(50) NULL,
    Correo_Electronico VARCHAR(100),
    Contrasenia VARCHAR(255) NOT NULL,
    Id_Rol INT NOT NULL,
    FOREIGN KEY (Id_Rol) REFERENCES Rol(Id_Rol)
);

CREATE TABLE Categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(100) NOT NULL,
    descripcion TEXT
);

CREATE TABLE Proveedor (
    id_proveedor INT AUTO_INCREMENT PRIMARY KEY,
    nit VARCHAR(9) NOT NULL,
    nombre_comercial VARCHAR(100) NOT NULL,
    direccion VARCHAR(150),
    telefono VARCHAR(20),
    correo_electronico VARCHAR(100)
);

CREATE TABLE Producto (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(50) UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio_unitario DECIMAL(10,2) NOT NULL CHECK (precio_unitario >= 0),
    stock_actual INT NOT NULL DEFAULT 0 CHECK (stock_actual >= 0),
    umbral_minimo INT NOT NULL DEFAULT 0 CHECK (umbral_minimo >= 0),
    id_categoria INT NOT NULL,
    id_proveedor INT NOT NULL,
    FOREIGN KEY (id_categoria) REFERENCES Categoria(id_categoria),
    FOREIGN KEY (id_proveedor) REFERENCES Proveedor(id_proveedor)
);

DELIMITER //

CREATE TRIGGER tr_GenerarSKU_Producto
BEFORE INSERT ON Producto
FOR EACH ROW
BEGIN
    DECLARE next_id INT;
    
    SELECT AUTO_INCREMENT INTO next_id
    FROM information_schema.tables
    WHERE table_name = 'Producto' AND table_schema = DATABASE();
    
    IF next_id IS NULL THEN
        SET next_id = 1;
    END IF;

    SET NEW.sku = CONCAT('TSM-', LPAD(next_id, 6, '0'));
END; //

DELIMITER ;

CREATE TABLE Transaccion (
    id_transaccion INT AUTO_INCREMENT PRIMARY KEY,
    tipo_transaccion VARCHAR(20) NOT NULL CHECK (tipo_transaccion IN ('Entrada', 'Salida', 'Devolucion', 'Ajuste')),
    motivo TEXT,
    fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cantidad INT NOT NULL,
    Id_Usuario INT NOT NULL,
    id_producto INT NOT NULL,
    FOREIGN KEY (Id_Usuario) REFERENCES Usuario(Id_Usuario),
    FOREIGN KEY (id_producto) REFERENCES Producto(id_producto)
);

DELIMITER //

CREATE TRIGGER tr_ActualizarStock_Transaccion
AFTER INSERT ON Transaccion
FOR EACH ROW
BEGIN
    UPDATE Producto
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

INSERT INTO Rol (Rol) VALUES
('Administrador'),
('Bodeguero/a');