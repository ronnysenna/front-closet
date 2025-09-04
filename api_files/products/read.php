<?php
// read.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/database.php';

// Instancia o banco de dados
$database = new Database();
$db = $database->getConnection();

try {
    // Query para buscar produtos com suas categorias
    $query = "
        SELECT 
            p.id, p.name, p.slug, p.price, p.original_price, 
            p.description, p.short_description, p.main_image, 
            p.discount_percentage, p.featured, p.stock_quantity, 
            p.sku, p.rating, 
            c.id as category_id, c.name as category_name
        FROM products p
        LEFT JOIN product_categories pc ON p.id = pc.product_id
        LEFT JOIN categories c ON c.id = pc.category_id
        ORDER BY p.id";

    $stmt = $db->prepare($query);
    $stmt->execute();

    // Estrutura para organizar produtos com suas categorias
    $products = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $product_id = $row['id'];

        if (!isset($products[$product_id])) {
            $products[$product_id] = array(
                "id" => $product_id,
                "name" => $row['name'],
                "slug" => $row['slug'],
                "price" => (float)$row['price'],
                "original_price" => (float)$row['original_price'],
                "description" => $row['description'],
                "short_description" => $row['short_description'],
                "main_image" => $row['main_image'],
                "discount_percentage" => (int)$row['discount_percentage'],
                "featured" => (bool)$row['featured'],
                "stock_quantity" => (int)$row['stock_quantity'],
                "sku" => $row['sku'],
                "rating" => (float)$row['rating'],
                "categories" => array()
            );
        }

        if ($row['category_id']) {
            // Evita categorias duplicadas
            $category_exists = false;
            foreach ($products[$product_id]['categories'] as $cat) {
                if ($cat['id'] === $row['category_id']) {
                    $category_exists = true;
                    break;
                }
            }

            if (!$category_exists) {
                $products[$product_id]['categories'][] = array(
                    "id" => $row['category_id'],
                    "name" => $row['category_name']
                );
            }
        }
    }

    // Converte para array indexado
    $result = array_values($products);

    // Verifica se há produtos
    if (count($result) > 0) {
        echo json_encode($result);
    } else {
        echo json_encode(array("message" => "Nenhum produto encontrado."));
    }
} catch (PDOException $e) {
    echo json_encode(array("message" => "Erro: " . $e->getMessage()));
}
