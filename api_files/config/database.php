<?php
// database.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

class Database
{
    // Credenciais do banco
    private $host = "srv1660.hstgr.io";
    private $db_name = "u139114102_lojaCloset";
    private $username = "u139114102_lojaCloset";
    private $password = "Ideal2015net";
    public $conn;

    // Método para conectar ao banco
    public function getConnection()
    {
        $this->conn = null;

        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8");
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            echo json_encode(array("message" => "Erro de conexão: " . $e->getMessage()));
            exit;
        }

        return $this->conn;
    }
}
