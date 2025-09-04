<?php
// index.php
session_start();

// Verifica login
if (!isset($_SESSION['admin_loggedin']) || $_SESSION['admin_loggedin'] !== true) {
    header("Location: login.php");
    exit;
}

include_once '../config/database.php';
$database = new Database();
$db = $database->getConnection();

// Busca produtos para listar
$query = "SELECT id, name, price, stock_quantity FROM products ORDER BY id DESC";
$stmt = $db->prepare($query);
$stmt->execute();
?>
<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Painel Admin - Closet Moda Fitness</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container">
            <a class="navbar-brand" href="#">Closet Moda Fitness</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link active" href="index.php">Produtos</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="categories.php">Categorias</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="import.html">Importar</a>
                    </li>
                </ul>
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="logout.php">Sair</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <div class="container mt-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2>Gerenciar Produtos</h2>
            <a href="add_product.php" class="btn btn-success">Adicionar Produto</a>
        </div>

        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Preço</th>
                        <th>Estoque</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <?php while ($row = $stmt->fetch(PDO::FETCH_ASSOC)): ?>
                        <tr>
                            <td><?= $row['id'] ?></td>
                            <td><?= htmlspecialchars($row['name']) ?></td>
                            <td>R$ <?= number_format($row['price'], 2, ',', '.') ?></td>
                            <td><?= $row['stock_quantity'] ?></td>
                            <td>
                                <a href="edit_product.php?id=<?= $row['id'] ?>" class="btn btn-sm btn-warning">Editar</a>
                                <a href="delete_product.php?id=<?= $row['id'] ?>" class="btn btn-sm btn-danger"
                                    onclick="return confirm('Tem certeza que deseja excluir este produto?')">Excluir</a>
                            </td>
                        </tr>
                    <?php endwhile; ?>

                    <?php if ($stmt->rowCount() === 0): ?>
                        <tr>
                            <td colspan="5" class="text-center py-3">Nenhum produto cadastrado</td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>