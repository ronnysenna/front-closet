<?php
// read_one.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/database.php';

// Instancia o banco de dados
$database = new Database();
$db = $database->getConnection();

// Pega ID ou slug da URL
$identifier = isset($_GET['id']) ? $_GET['id'] : (isset($_GET['slug']) ? $_GET['slug'] : null);
$type = isset($_GET['id']) ? 'id' : 'slug';

if (!$identifier) {
    echo json_encode(array("message" => "ID ou slug do produto não fornecido."));
    exit;
}

try {
    // Query para buscar um produto específico com suas categorias
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
        WHERE p.$type = :identifier";

    $stmt = $db->prepare($query);
    $stmt->bindParam(":identifier", $identifier);
    $stmt->execute();

    if ($stmt->rowCount() == 0) {
        echo json_encode(array("message" => "Produto não encontrado."));
        exit;
    }

    // Monta o produto
    $product = array();
    $images = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        if (empty($product)) {
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
                "rating" => (float)$row['rating'],
                "categories" => array(),
                "images" => array()
            );
        }

        // Adiciona categoria se existir
        if ($row['category_id']) {
            $category_exists = false;
            foreach ($product['categories'] as $cat) {
                if ($cat['id'] === $row['category_id']) {
                    $category_exists = true;
                    break;
                }
            }

            if (!$category_exists) {
                $product['categories'][] = array(
                    "id" => $row['category_id'],
                    "name" => $row['category_name']
                );
            }
        }
    }

    // Busca imagens adicionais do produto
    $images_query = "SELECT id, image_url, alt_text FROM product_images WHERE product_id = :product_id ORDER BY display_order ASC";
    $images_stmt = $db->prepare($images_query);
    $images_stmt->bindParam(":product_id", $product['id']);
    $images_stmt->execute();

    while ($img_row = $images_stmt->fetch(PDO::FETCH_ASSOC)) {
        $product['images'][] = array(
            "id" => $img_row['id'],
            "url" => $img_row['image_url'],
            "alt" => $img_row['alt_text']
        );
    }

    // Se não houver imagens adicionais, adiciona a principal
    if (empty($product['images'])) {
        $product['images'][] = array(
            "id" => 0,
            "url" => $product['main_image'],
            "alt" => $product['name']
        );
    }

    echo json_encode($product);
} catch (PDOException $e) {
    echo json_encode(array("message" => "Erro: " . $e->getMessage()));
}
