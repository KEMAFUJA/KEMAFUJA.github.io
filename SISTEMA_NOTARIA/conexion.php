<?php
class Database {
    private static $dbName = 'NOTA_BORRADOR';    
    //private static $dbName = 'NOTARIA_135';
    private static $dbHost = 'localhost'; // server casa
    private static $dbUsername = 'postgres'; // Usuario de la base de datos
    private static $dbUserPassword = 'Queteimporta'; // Contraseña de la base de datos
    private static $cont = null;

    public function __construct() {
        die('Init function is not allowed');
    }

    public static function connect() {
        // Una conexión para toda la aplicación
        if (null == self::$cont) {
            try {
                self::$cont =  new PDO("pgsql:host=" . self::$dbHost . ";" . "dbname=" . self::$dbName, self::$dbUsername, self::$dbUserPassword);
                self::$cont->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // Configuración de manejo de errores
            } catch (PDOException $e) {
                die($e->getMessage());
            }
        }
        return self::$cont;
    }

    public static function disconnect() {
        self::$cont = null;
    }
}
?>