import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import PropTypes from "prop-types";
import { useEffect, useId, useRef, useState } from "react";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getCategories,
  updateProduct,
  uploadProductImage,
} from "../../utils/api";
import { ASSETS_BASE_URL } from "../../config";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.common.white,
}));

// Componente de ações de paginação personalizado
function TablePaginationActions(props) {
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="primeira página"
      >
        <FirstPageIcon />
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="página anterior"
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="próxima página"
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="última página"
      >
        <LastPageIcon />
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

// Componente para gerenciamento de produtos
const ProductManagement = ({ onSuccess }) => {
  // Gerar IDs únicos para componentes

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    name: "",
    price: "",
    stockQuantity: "",
    description: "",
    shortDescription: "",
    mainImage: "",
    categoryId: "",
    images: [],
    sizes: [],
    colors: [],
    sizesText: "",
    colorsText: "",
  });

  // Estados para paginação
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25); // Valor padrão de 25 itens por página

  // IDs únicos para elementos
  const categoryLabelId = useId();

  // Estado para o gerenciamento de imagens
  const [openImagesDialog, setOpenImagesDialog] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageAlt, setNewImageAlt] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [, setPreviewImage] = useState(null);
  const [lastUploadedImage, setLastUploadedImage] = useState(null);
  const fileInputRef = useRef(null);

  // Buscar produtos e categorias ao carregar a página
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          getAllProducts(),
          getCategories(),
        ]);

        console.log("Produtos carregados:", productsData);
        console.log("Total de produtos:", productsData.length);

        setProducts(productsData);
        setCategories(categoriesData);
        setError(null);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError("Falha ao carregar os produtos. Por favor, tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Log para debug da paginação
  useEffect(() => {
    console.log("Página atual:", page);
    console.log("Itens por página:", rowsPerPage);
    console.log("Total de produtos:", products.length);
    console.log(
      "Produtos exibidos:",
      rowsPerPage > 0
        ? Math.min(rowsPerPage, products.length - page * rowsPerPage)
        : products.length
    );
  }, [page, rowsPerPage, products.length]);

  const handleOpenDialog = (product = null) => {
    if (product) {
      // Mapeia os nomes de campos para garantir consistência
      const productSizes = product.sizes || [];
      const productColors = product.colors || [];

      setCurrentProduct({
        ...product,
        stockQuantity: product.stock_quantity || product.stockQuantity || "",
        categoryId:
          product.categories && product.categories.length > 0
            ? product.categories[0].id
            : "",
        // Inicializa os campos sizes e colors (arrays ou objetos)
        sizes: productSizes,
        colors: productColors,
        // Inicializa os campos de texto para edição fácil
        sizesText: Array.isArray(productSizes) ? productSizes.join(", ") : "",
        colorsText: Array.isArray(productColors)
          ? productColors.join(", ")
          : "",
      });
      setEditMode(true);
    } else {
      setCurrentProduct({
        name: "",
        price: "",
        stockQuantity: "",
        description: "",
        shortDescription: "",
        mainImage: "",
        categoryId: "",
        images: [],
        sizes: [],
        colors: [],
        sizesText: "",
        colorsText: "",
      });
      setEditMode(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct({
      ...currentProduct,
      [name]: value,
    });
  };

  // Funções para gerenciar tamanhos e cores
  const handleSizeChange = (e) => {
    const sizesValue = e.target.value;

    // Armazena o valor como uma string no state para manter a experiência de edição
    setCurrentProduct({
      ...currentProduct,
      sizesText: sizesValue,
      // Converte para array apenas quando for salvar
      sizes: sizesValue
        .split(",")
        .map((size) => size.trim())
        .filter((size) => size),
    });
  };

  const handleColorChange = (e) => {
    const colorsValue = e.target.value;

    // Armazena o valor como uma string no state para manter a experiência de edição
    setCurrentProduct({
      ...currentProduct,
      colorsText: colorsValue,
      // Converte para array apenas quando for salvar
      colors: colorsValue
        .split(",")
        .map((color) => color.trim())
        .filter((color) => color),
    });
  };

  const handleSaveProduct = async () => {
    try {
      setLoading(true);
      if (editMode) {
        await updateProduct(currentProduct.id, {
          name: currentProduct.name,
          price: parseFloat(currentProduct.price),
          originalPrice: currentProduct.original_price
            ? parseFloat(currentProduct.original_price)
            : null,
          description: currentProduct.description,
          shortDescription: currentProduct.shortDescription,
          mainImage: currentProduct.mainImage,
          stockQuantity: parseInt(currentProduct.stockQuantity, 10) || 0,
          categoryIds: currentProduct.categoryId
            ? [parseInt(currentProduct.categoryId, 10)]
            : [],
          images: currentProduct.images,
          sizes: currentProduct.sizes,
          colors: currentProduct.colors,
        });
        onSuccess("Produto atualizado com sucesso!");
      } else {
        await createProduct({
          name: currentProduct.name,
          price: parseFloat(currentProduct.price),
          description: currentProduct.description,
          shortDescription: `${currentProduct.description?.split(".")[0]}.`,
          mainImage: currentProduct.mainImage || "image/default.jpg",
          stockQuantity: parseInt(currentProduct.stockQuantity, 10) || 0,
          categoryIds: currentProduct.categoryId
            ? [parseInt(currentProduct.categoryId, 10)]
            : [],
          images: currentProduct.images,
          sizes: currentProduct.sizes,
          colors: currentProduct.colors,
        });
        onSuccess("Produto criado com sucesso!");
      }
      // Recarregar a lista de produtos
      const productsData = await getAllProducts();
      setProducts(productsData);
      handleCloseDialog();
    } catch (err) {
      console.error("Erro ao salvar produto:", err);
      setError(err.message || "Ocorreu um erro ao salvar o produto.");
    } finally {
      setLoading(false);
    }
  };

  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);

  const handleOpenDeleteDialog = (product) => {
    setCurrentProduct(product);
    setConfirmDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setConfirmDeleteDialog(false);
  };

  // Handlers para gerenciamento de imagens
  const handleOpenImagesDialog = () => {
    setOpenImagesDialog(true);
  };

  const handleCloseImagesDialog = () => {
    setOpenImagesDialog(false);
    setNewImageUrl("");
    setNewImageAlt("");
    setPreviewImage(null);
    setUploadError("");

    // Atualizar a lista de produtos se houver novas imagens
    if (lastUploadedImage || currentProduct.images?.length > 0) {
      getAllProducts()
        .then((productsData) => {
          setProducts(productsData);
        })
        .catch((error) => {
          console.error("Erro ao atualizar lista de produtos:", error);
        });
    }
  };

  const handleDeleteProduct = async () => {
    try {
      setLoading(true);
      await deleteProduct(currentProduct.id);
      onSuccess("Produto excluído com sucesso!");
      // Recarregar a lista de produtos
      const productsData = await getAllProducts();
      setProducts(productsData);
      handleCloseDeleteDialog();
    } catch (err) {
      console.error("Erro ao excluir produto:", err);
      setError(err.message || "Ocorreu um erro ao excluir o produto.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    console.log("Alterando para", newRowsPerPage, "itens por página");
    setRowsPerPage(newRowsPerPage);
    setPage(0);

    // Log adicional para debug
    setTimeout(() => {
      console.log("rowsPerPage após atualização:", newRowsPerPage);
      console.log(
        "displayedProducts após atualização:",
        newRowsPerPage > 0
          ? products.slice(0, newRowsPerPage).length
          : products.length
      );
    }, 100);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  // Calcular os produtos a serem exibidos na página atual
  const displayedProducts =
    rowsPerPage > 0
      ? products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : products;

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Box>
          <Typography variant="h6">Gerenciamento de Produtos</Typography>
          <Typography variant="body2" color="text.secondary">
            Total de {products.length} produtos cadastrados
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Novo Produto
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>Nome</StyledTableCell>
              <StyledTableCell>Preço</StyledTableCell>
              <StyledTableCell>Estoque</StyledTableCell>
              <StyledTableCell>Categoria</StyledTableCell>
              <StyledTableCell>Ações</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>
                  {product.name}
                  {product.sizes && product.sizes.length > 0 && (
                    <Typography
                      variant="caption"
                      display="block"
                      color="text.secondary"
                    >
                      Tamanhos:{" "}
                      {Array.isArray(product.sizes)
                        ? product.sizes.join(", ")
                        : ""}
                    </Typography>
                  )}
                  {product.colors && product.colors.length > 0 && (
                    <Typography
                      variant="caption"
                      display="block"
                      color="text.secondary"
                    >
                      Cores:{" "}
                      {Array.isArray(product.colors)
                        ? product.colors.join(", ")
                        : ""}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>R$ {parseFloat(product.price).toFixed(2)}</TableCell>
                <TableCell>
                  {product.stock_quantity || product.stockQuantity || "N/A"}
                </TableCell>
                <TableCell>
                  {product.category?.name || "Sem categoria"}
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(product)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleOpenDeleteDialog(product)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Nenhum produto encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[
                  7,
                  15,
                  25,
                  50,
                  { label: "Todos", value: -1 },
                ]}
                colSpan={6}
                count={products.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    "aria-label": "linhas por página",
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
                labelRowsPerPage="Itens por página:"
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}-${to} de ${count}`
                }
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      {/* Diálogo para criar/editar produto */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editMode ? "Editar Produto" : "Novo Produto"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Preencha os detalhes do produto abaixo:
          </DialogContentText>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="name"
                label="Nome do Produto"
                fullWidth
                value={currentProduct.name}
                onChange={handleInputChange}
                margin="dense"
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel id={categoryLabelId}>Categoria</InputLabel>
                <Select
                  labelId={categoryLabelId}
                  name="categoryId"
                  value={currentProduct.categoryId}
                  onChange={handleInputChange}
                  label="Categoria"
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="price"
                label="Preço (R$)"
                fullWidth
                type="number"
                value={currentProduct.price}
                onChange={handleInputChange}
                margin="dense"
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="stockQuantity"
                label="Estoque"
                fullWidth
                type="number"
                value={currentProduct.stockQuantity}
                onChange={handleInputChange}
                margin="dense"
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="sizes"
                label="Tamanhos (separados por vírgula)"
                fullWidth
                value={currentProduct.sizesText}
                onChange={handleSizeChange}
                margin="dense"
                variant="outlined"
                placeholder="P, M, G, GG"
                helperText="Digite os tamanhos separados por vírgula"
                inputProps={{ spellCheck: false }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="colors"
                label="Cores (separadas por vírgula)"
                fullWidth
                value={currentProduct.colorsText}
                onChange={handleColorChange}
                margin="dense"
                variant="outlined"
                placeholder="Azul, Vermelho, Preto"
                helperText="Digite as cores separadas por vírgula"
                inputProps={{ spellCheck: false }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="description"
                label="Descrição"
                fullWidth
                multiline
                rows={4}
                value={currentProduct.description}
                onChange={handleInputChange}
                margin="dense"
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                <TextField
                  name="mainImage"
                  label="URL da Imagem Principal"
                  fullWidth
                  value={currentProduct.mainImage || ""}
                  onChange={handleInputChange}
                  margin="dense"
                  variant="outlined"
                  placeholder="image/nome-da-imagem.jpg"
                  helperText="Coloque o caminho da imagem em relação à pasta 'public/image'"
                />
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<ImageIcon />}
                  sx={{ ml: 1, mt: 1 }}
                  onClick={handleOpenImagesDialog}
                >
                  Gerenciar Imagens
                </Button>
              </Box>
            </Grid>

            {currentProduct.mainImage && (
              <Grid item xs={12} sx={{ mt: 2, textAlign: "center" }}>
                <Typography variant="subtitle2" gutterBottom>
                  Pré-visualização da imagem principal:
                </Typography>
                <Box
                  component="img"
                  src={
                    currentProduct.mainImage.startsWith("http")
                      ? currentProduct.mainImage
                      : `${ASSETS_BASE_URL}/${
                          currentProduct.mainImage.startsWith("/")
                            ? currentProduct.mainImage.substring(1)
                            : currentProduct.mainImage
                        }`
                  }
                  alt={currentProduct.name}
                  sx={{
                    maxHeight: 200,
                    maxWidth: "100%",
                    objectFit: "contain",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    p: 1,
                    backgroundColor: "#f9f9f9",
                  }}
                  onError={(e) => {
                    console.log(
                      "Erro ao carregar imagem principal:",
                      currentProduct.mainImage
                    );
                    e.target.onerror = null;
                    e.target.src = "/image/placeholder.jpg";
                  }}
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  {currentProduct.mainImage.split("/").pop()}
                </Typography>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            onClick={handleSaveProduct}
            variant="contained"
            color="primary"
          >
            {editMode ? "Atualizar Produto" : "Criar Produto"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmação para excluir produto */}
      <Dialog open={confirmDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza de que deseja excluir o produto "{currentProduct.name}"?
            Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button
            onClick={handleDeleteProduct}
            color="error"
            variant="contained"
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para gerenciar imagens do produto */}
      <Dialog
        open={openImagesDialog}
        onClose={handleCloseImagesDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Gerenciar Imagens do Produto</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Adicione, remova ou defina a imagem principal do produto.
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
            {currentProduct.images && currentProduct.images.length > 0 ? (
              currentProduct.images.map((img, idx) => (
                <Box
                  key={img.url || idx}
                  sx={{ position: "relative", width: 120, height: 120 }}
                >
                  <img
                    src={
                      img.url?.startsWith("http")
                        ? img.url
                        : `${ASSETS_BASE_URL}/${img.url}`
                    }
                    alt={img.alt || `Imagem ${idx + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: 8,
                      border:
                        currentProduct.mainImage === img.url
                          ? "2px solid #ff6923"
                          : "1px solid #ccc",
                    }}
                  />
                  <IconButton
                    size="small"
                    color="error"
                    sx={{
                      position: "absolute",
                      top: 2,
                      right: 2,
                      bgcolor: "white",
                      p: 0.5,
                    }}
                    onClick={() => {
                      setCurrentProduct({
                        ...currentProduct,
                        images: currentProduct.images.filter(
                          (_, i) => i !== idx
                        ),
                      });
                      // Se remover a principal, limpa mainImage
                      if (currentProduct.mainImage === img.url) {
                        setCurrentProduct((cp) => ({ ...cp, mainImage: "" }));
                      }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                  {currentProduct.mainImage !== img.url && (
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{
                        position: "absolute",
                        bottom: 4,
                        left: 4,
                        fontSize: 10,
                        p: 0.5,
                        minWidth: 0,
                      }}
                      onClick={() =>
                        setCurrentProduct((cp) => ({
                          ...cp,
                          mainImage: img.url,
                        }))
                      }
                    >
                      Definir Principal
                    </Button>
                  )}
                  {currentProduct.mainImage === img.url && (
                    <Typography
                      variant="caption"
                      sx={{
                        position: "absolute",
                        bottom: 4,
                        left: 4,
                        bgcolor: "#ff6923",
                        color: "white",
                        px: 1,
                        borderRadius: 1,
                        fontSize: 10,
                      }}
                    >
                      Principal
                    </Typography>
                  )}
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                Nenhuma imagem adicionada.
              </Typography>
            )}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Button
              variant="contained"
              component="label"
              disabled={isUploading}
            >
              Upload Imagem
              <input
                type="file"
                accept="image/*"
                hidden
                ref={fileInputRef}
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  setIsUploading(true);
                  setUploadError("");
                  try {
                    const result = await uploadProductImage(file);
                    const url =
                      result?.url || result?.imageUrl || result?.path || "";
                    if (url) {
                      setCurrentProduct((cp) => ({
                        ...cp,
                        images: [...(cp.images || []), { url, alt: file.name }],
                      }));
                      setLastUploadedImage(url);
                    }
                  } catch {
                    setUploadError("Erro ao fazer upload da imagem.");
                  } finally {
                    setIsUploading(false);
                  }
                }}
              />
            </Button>
            {isUploading && <CircularProgress size={24} />}
            {uploadError && (
              <Typography color="error">{uploadError}</Typography>
            )}
          </Box>
          <TextField
            label="URL da Imagem Manual"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            size="small"
            sx={{ mr: 1, width: 300 }}
            placeholder="image/nome-da-imagem.jpg"
          />
          <TextField
            label="Descrição/Alt da Imagem"
            value={newImageAlt}
            onChange={(e) => setNewImageAlt(e.target.value)}
            size="small"
            sx={{ mr: 1, width: 200 }}
            placeholder="Ex: Foto lateral"
          />
          <Button
            variant="outlined"
            onClick={() => {
              if (newImageUrl) {
                setCurrentProduct((cp) => ({
                  ...cp,
                  images: [
                    ...(cp.images || []),
                    { url: newImageUrl, alt: newImageAlt },
                  ],
                }));
                setNewImageUrl("");
                setNewImageAlt("");
              }
            }}
            disabled={!newImageUrl}
          >
            Adicionar Manualmente
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseImagesDialog}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

ProductManagement.propTypes = {
  onSuccess: PropTypes.func,
};

export default ProductManagement;
