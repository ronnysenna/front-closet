<?php
// by_category.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/database.php';

// Instancia o banco de dados
$database = new Database();
$db = $database->getConnection();

// Pega categoria da URL
$category_id = isset($_GET['id']) ? $_GET['id'] : null;
$category_slug = isset($_GET['slug']) ? $_GET['slug'] : null;

if (!$category_id && !$category_slug) {
    echo json_encode(array("message" => "ID ou slug da categoria não fornecido."));
    exit;
}

try {
    // Query para buscar produtos por categoria
    $query = "
        SELECT 
            p.id, p.name, p.slug, p.price, p.original_price, 
            p.description, p.short_description, p.main_image, 
            p.discount_percentage, p.featured, p.stock_quantity, 
            p.sku, p.rating
        FROM products p
        JOIN product_categories pc ON p.id = pc.product_id
        JOIN categories c ON c.id = pc.category_id
        WHERE ";

    if ($category_id) {
        $query .= "c.id = :identifier";
        $identifier = $category_id;
    } else {
        $query .= "c.slug = :identifier";
        $identifier = $category_slug;
    }

    $query .= " ORDER BY p.name";

    $stmt = $db->prepare($query);
    $stmt->bindParam(":identifier", $identifier);
    $stmt->execute();

    $products = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $product = array(
            "id" => $row['id'],
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
            "rating" => (float)$row['rating']
        );

        $products[] = $product;
    }

    // Verifica se há produtos
    if (count($products) > 0) {
        echo json_encode($products);
    } else {
        echo json_encode(array("message" => "Nenhum produto encontrado nesta categoria."));
    }
} catch (PDOException $e) {
    echo json_encode(array("message" => "Erro: " . $e->getMessage()));
}
