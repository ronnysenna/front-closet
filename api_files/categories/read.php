<?php
// read.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/database.php';

// Instancia o banco de dados
$database = new Database();
$db = $database->getConnection();

try {
    // Query para buscar todas as categorias
    $query = "SELECT id, name, slug, description FROM categories ORDER BY name";

    $stmt = $db->prepare($query);
    $stmt->execute();

    $categories = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $category = array(
            "id" => $row['id'],
            "name" => $row['name'],
            "slug" => $row['slug'],
            "description" => $row['description']
        );

        $categories[] = $category;
    }

    // Verifica se há categorias
    if (count($categories) > 0) {
        echo json_encode($categories);
    } else {
        echo json_encode(array("message" => "Nenhuma categoria encontrada."));
    }
} catch (PDOException $e) {
    echo json_encode(array("message" => "Erro: " . $e->getMessage()));
}
