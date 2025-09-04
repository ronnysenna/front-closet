<?php
// import_products.php
session_start();

// Verifica login
if (!isset($_SESSION['admin_loggedin']) || $_SESSION['admin_loggedin'] !== true) {
    header('Content-Type: application/json');
    echo json_encode(array("message" => "Acesso não autorizado"));
    exit;
}

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/database.php';

// Função para criar slug a partir do nome
function createSlug($string)
{
    $string = preg_replace('/[^\p{L}\p{N}]+/u', '-', $string);
    $string = mb_strtolower($string, 'UTF-8');
    $string = trim($string, '-');
    return $string;
}

// Verifica se foi enviado um arquivo
if (!isset($_FILES['products_json'])) {
    echo json_encode(array("message" => "Nenhum arquivo enviado."));
    exit;
}

try {
    // Lê o arquivo enviado
    $json_file = $_FILES['products_json']['tmp_name'];
    $json_data = file_get_contents($json_file);

    // Tenta extrair dados de um arquivo JS (export const products = [...])
    $pattern = '/export\s+const\s+products\s*=\s*(\[.*\])/s';
    if (preg_match($pattern, $json_data, $matches)) {
        $json_data = $matches[1];
    }

    // Decodifica o JSON
    $products = json_decode($json_data, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode(array("message" => "Erro ao decodificar JSON: " . json_last_error_msg()));
        exit;
    }

    if (!is_array($products)) {
        echo json_encode(array("message" => "O arquivo não contém um array de produtos válido."));
        exit;
    }

    // Conecta ao banco
    $database = new Database();
    $db = $database->getConnection();

    $successful = 0;
    $failed = 0;
    $db->beginTransaction();

    foreach ($products as $product) {
        // Verifica campos obrigatórios
        if (!isset($product['name']) || !isset($product['price'])) {
            $failed++;
            continue;
        }

        // Cria slug se não existir
        if (!isset($product['slug']) || empty($product['slug'])) {
            $product['slug'] = createSlug($product['name']);
        }

        // Ajusta valores padrão
        $product['original_price'] = isset($product['original_price']) ? $product['original_price'] : $product['price'];
        $product['short_description'] = isset($product['short_description']) ? $product['short_description'] : '';
        $product['description'] = isset($product['description']) ? $product['description'] : '';
        $product['main_image'] = isset($product['main_image']) ? $product['main_image'] : '';
        $product['discount_percentage'] = isset($product['discount_percentage']) ? $product['discount_percentage'] : 0;
        $product['featured'] = isset($product['featured']) ? $product['featured'] : false;
        $product['stock_quantity'] = isset($product['stock_quantity']) ? $product['stock_quantity'] : 10;
        $product['sku'] = isset($product['sku']) ? $product['sku'] : 'SKU-' . rand(1000, 9999);
        $product['rating'] = isset($product['rating']) ? $product['rating'] : 5.0;

        // Insere produto
        $query = "INSERT INTO products 
                  (name, slug, price, original_price, description, short_description, 
                   main_image, discount_percentage, featured, stock_quantity, sku, rating) 
                  VALUES 
                  (:name, :slug, :price, :original_price, :description, :short_description, 
                   :main_image, :discount_percentage, :featured, :stock_quantity, :sku, :rating)";

        $stmt = $db->prepare($query);

        $stmt->bindParam(":name", $product['name']);
        $stmt->bindParam(":slug", $product['slug']);
        $stmt->bindParam(":price", $product['price']);
        $stmt->bindParam(":original_price", $product['original_price']);
        $stmt->bindParam(":description", $product['description']);
        $stmt->bindParam(":short_description", $product['short_description']);
        $stmt->bindParam(":main_image", $product['main_image']);
        $stmt->bindParam(":discount_percentage", $product['discount_percentage']);
        $featured = $product['featured'] ? 1 : 0;
        $stmt->bindParam(":featured", $featured);
        $stmt->bindParam(":stock_quantity", $product['stock_quantity']);
        $stmt->bindParam(":sku", $product['sku']);
        $stmt->bindParam(":rating", $product['rating']);

        if ($stmt->execute()) {
            $product_id = $db->lastInsertId();

            // Insere categorias
            if (isset($product['categories']) && is_array($product['categories'])) {
                foreach ($product['categories'] as $category) {
                    // Se for uma string, é o nome da categoria
                    if (is_string($category)) {
                        $category_name = $category;
                        $category_slug = createSlug($category);
                    }
                    // Se for um objeto, pode ter id e name
                    else if (is_array($category) && isset($category['name'])) {
                        $category_name = $category['name'];
                        $category_slug = isset($category['slug']) ? $category['slug'] : createSlug($category_name);
                    } else {
                        continue; // Pula esta categoria
                    }

                    // Verifica se a categoria já existe
                    $cat_query = "SELECT id FROM categories WHERE name = :name";
                    $cat_stmt = $db->prepare($cat_query);
                    $cat_stmt->bindParam(":name", $category_name);
                    $cat_stmt->execute();

                    if ($cat_stmt->rowCount() > 0) {
                        $cat_row = $cat_stmt->fetch(PDO::FETCH_ASSOC);
                        $category_id = $cat_row['id'];
                    } else {
                        // Cria a categoria se não existir
                        $insert_cat = "INSERT INTO categories (name, slug) VALUES (:name, :slug)";
                        $cat_insert_stmt = $db->prepare($insert_cat);
                        $cat_insert_stmt->bindParam(":name", $category_name);
                        $cat_insert_stmt->bindParam(":slug", $category_slug);
                        $cat_insert_stmt->execute();
                        $category_id = $db->lastInsertId();
                    }

                    // Associa produto à categoria
                    $pc_query = "INSERT INTO product_categories (product_id, category_id) VALUES (:product_id, :category_id)";
                    $pc_stmt = $db->prepare($pc_query);
                    $pc_stmt->bindParam(":product_id", $product_id);
                    $pc_stmt->bindParam(":category_id", $category_id);
                    $pc_stmt->execute();
                }
            }

            // Processa imagens adicionais
            if (isset($product['images']) && is_array($product['images'])) {
                $display_order = 0;
                foreach ($product['images'] as $image) {
                    // Se for uma string, é o URL da imagem
                    if (is_string($image)) {
                        $image_url = $image;
                        $alt_text = $product['name'];
                    }
                    // Se for um objeto, pode ter url e alt
                    else if (is_array($image) && isset($image['url'])) {
                        $image_url = $image['url'];
                        $alt_text = isset($image['alt']) ? $image['alt'] : $product['name'];
                    } else {
                        continue; // Pula esta imagem
                    }

                    // Insere a imagem
                    $img_query = "INSERT INTO product_images (product_id, image_url, alt_text, display_order) 
                                 VALUES (:product_id, :image_url, :alt_text, :display_order)";
                    $img_stmt = $db->prepare($img_query);
                    $img_stmt->bindParam(":product_id", $product_id);
                    $img_stmt->bindParam(":image_url", $image_url);
                    $img_stmt->bindParam(":alt_text", $alt_text);
                    $img_stmt->bindParam(":display_order", $display_order);
                    $img_stmt->execute();
                    $display_order++;
                }
            }

            $successful++;
        } else {
            $failed++;
        }
    }

    $db->commit();
    echo json_encode(array(
        "message" => "Importação concluída",
        "successful" => $successful,
        "failed" => $failed
    ));
} catch (Exception $e) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    echo json_encode(array("message" => "Erro: " . $e->getMessage()));
}
