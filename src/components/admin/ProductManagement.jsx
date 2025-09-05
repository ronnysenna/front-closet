import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Divider,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  LinearProgress,
  Alert
} from '@mui/material';
import { styled } from '@mui/system';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import ImageIcon from '@mui/icons-material/Image';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { getAllProducts, getCategories, createProduct, updateProduct, deleteProduct, uploadProductImage } from '../../utils/api';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.common.white,
}));

// Componente placeholder para gerenciamento de produtos
// Na implementação real, você adicionaria funções para editar, criar e excluir produtos
const ProductManagement = ({ onSuccess }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    name: '',
    price: '',
    stockQuantity: '',
    description: '',
    shortDescription: '',
    mainImage: '',
    categoryId: '',
    images: []
  });
  
  // Estado para o gerenciamento de imagens
  const [openImagesDialog, setOpenImagesDialog] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageAlt, setNewImageAlt] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [lastUploadedImage, setLastUploadedImage] = useState(null);
  const fileInputRef = useRef(null);
  
  // Buscar produtos e categorias ao carregar a página
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          getAllProducts(),
          getCategories()
        ]);
        
        setProducts(productsData);
        setCategories(categoriesData);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Falha ao carregar os produtos. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleOpenDialog = (product = null) => {
    if (product) {
      // Mapeia os nomes de campos para garantir consistência
      setCurrentProduct({
        ...product,
        stockQuantity: product.stock_quantity || product.stockQuantity || '',
        categoryId: product.categories && product.categories.length > 0 ? product.categories[0].id : ''
      });
      setEditMode(true);
    } else {
      setCurrentProduct({
        name: '',
        price: '',
        stockQuantity: '',
        description: '',
        shortDescription: '',
        mainImage: '',
        categoryId: '',
        images: []
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
      [name]: value
    });
  };
  
  const handleSaveProduct = async () => {
    try {
      setLoading(true);
      if (editMode) {
        await updateProduct(currentProduct.id, {
          name: currentProduct.name,
          price: parseFloat(currentProduct.price),
          originalPrice: currentProduct.original_price ? parseFloat(currentProduct.original_price) : null,
          description: currentProduct.description,
          shortDescription: currentProduct.shortDescription,
          mainImage: currentProduct.mainImage,
          stockQuantity: parseInt(currentProduct.stockQuantity) || 0,
          categoryIds: currentProduct.categoryId ? [parseInt(currentProduct.categoryId)] : []
        });
        onSuccess('Produto atualizado com sucesso!');
      } else {
        await createProduct({
          name: currentProduct.name,
          price: parseFloat(currentProduct.price),
          description: currentProduct.description,
          shortDescription: currentProduct.description?.split('.')[0] + '.',
          mainImage: currentProduct.mainImage || 'image/default.jpg',
          stockQuantity: parseInt(currentProduct.stockQuantity) || 0,
          categoryIds: currentProduct.categoryId ? [parseInt(currentProduct.categoryId)] : []
        });
        onSuccess('Produto criado com sucesso!');
      }
      // Recarregar a lista de produtos
      const productsData = await getAllProducts();
      setProducts(productsData);
      handleCloseDialog();
    } catch (err) {
      console.error('Erro ao salvar produto:', err);
      setError(err.message || 'Ocorreu um erro ao salvar o produto.');
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
    setNewImageUrl('');
    setNewImageAlt('');
    setPreviewImage(null);
    setUploadError('');
    
    // Atualizar a lista de produtos se houver novas imagens
    if (lastUploadedImage) {
      getAllProducts().then(productsData => {
        setProducts(productsData);
      }).catch(error => {
        console.error('Erro ao atualizar lista de produtos:', error);
      });
    }
  };
  
  const handleAddImage = () => {
    if (!newImageUrl) return;
    
    const newImages = [...(currentProduct.images || []), {
      url: newImageUrl,
      alt: newImageAlt || currentProduct.name || 'Imagem do produto'
    }];
    
    setCurrentProduct({
      ...currentProduct,
      images: newImages
    });
    
    setNewImageUrl('');
    setNewImageAlt('');
  };
  
  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Gerar preview da imagem selecionada
    const fileUrl = URL.createObjectURL(file);
    setPreviewImage(fileUrl);
    
    // Extrair o nome do arquivo para usar como texto alternativo
    const fileName = file.name.split('.')[0] || 'Imagem do produto';
    setNewImageAlt(fileName);
    
    try {
      setIsUploading(true);
      setUploadProgress(10);
      
      // Simular progresso para dar feedback visual
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);
      
      // Fazer upload da imagem
      const response = await uploadProductImage(file);
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Usar o texto alternativo fornecido ou extraído do nome do arquivo
      const imageAlt = newImageAlt || fileName || currentProduct.name || 'Imagem do produto';
      
      // Adicionar a URL da imagem retornada à lista de imagens do produto
      const newImages = [...(currentProduct.images || []), {
        url: response.imageUrl,
        alt: imageAlt
      }];
      
      // Salvar a informação sobre a última imagem enviada
      setLastUploadedImage({
        url: response.imageUrl,
        alt: imageAlt
      });
      
      // Atualizar o produto com a nova imagem
      setCurrentProduct({
        ...currentProduct,
        images: newImages
      });
      
      // Se não houver imagem principal, definir essa como principal
      if (!currentProduct.mainImage) {
        setCurrentProduct(prev => ({
          ...prev,
          mainImage: response.imageUrl
        }));
      }
      
      // Mostrar a imagem por um momento antes de limpar
      setTimeout(() => {
        // Manter a pré-visualização para o usuário ver o que foi enviado
        setNewImageAlt('');
        setUploadError('');
        
        // Limpar o input de arquivo
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 2000); // Mostra a pré-visualização por 2 segundos após o upload
      
      // Feedback de sucesso
      onSuccess && onSuccess('Imagem adicionada com sucesso');
      
    } catch (error) {
      console.error('Erro no upload:', error);
      setUploadError(error.message || 'Ocorreu um erro durante o upload da imagem');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
  
  const handleRemoveImage = (index) => {
    const newImages = [...currentProduct.images];
    newImages.splice(index, 1);
    
    setCurrentProduct({
      ...currentProduct,
      images: newImages
    });
  };
  
  const handleSetMainImage = (url) => {
    // Garantir que a URL esteja padronizada (remover a barra inicial se existir)
    const normalizedUrl = url.startsWith('/') ? url.substring(1) : url;
    
    setCurrentProduct({
      ...currentProduct,
      mainImage: normalizedUrl
    });
    
    // Feedback para o usuário
    onSuccess && onSuccess('Imagem principal atualizada com sucesso');
  };
  
  const handleDeleteProduct = async () => {
    try {
      setLoading(true);
      await deleteProduct(currentProduct.id);
      onSuccess('Produto excluído com sucesso!');
      // Recarregar a lista de produtos
      const productsData = await getAllProducts();
      setProducts(productsData);
      handleCloseDeleteDialog();
    } catch (err) {
      console.error('Erro ao excluir produto:', err);
      setError(err.message || 'Ocorreu um erro ao excluir o produto.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Gerenciamento de Produtos</Typography>
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
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>R$ {parseFloat(product.price).toFixed(2)}</TableCell>
                <TableCell>{product.stock_quantity || product.stockQuantity || 'N/A'}</TableCell>
                <TableCell>{product.category?.name || 'Sem categoria'}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpenDialog(product)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleOpenDeleteDialog(product)}>
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
        </Table>
      </TableContainer>

      {/* Diálogo para criar/editar produto */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editMode ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
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
                <InputLabel id="category-label">Categoria</InputLabel>
                <Select
                  labelId="category-label"
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
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <TextField
                  name="mainImage"
                  label="URL da Imagem Principal"
                  fullWidth
                  value={currentProduct.mainImage || ''}
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
              <Grid item xs={12} sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Pré-visualização da imagem principal:
                </Typography>
                <Box 
                  component="img"
                  src={currentProduct.mainImage.startsWith('http') ? 
                    currentProduct.mainImage : 
                    `/${currentProduct.mainImage.startsWith('/') ? currentProduct.mainImage.substring(1) : currentProduct.mainImage}`}
                  alt={currentProduct.name}
                  sx={{ 
                    maxHeight: 200, 
                    maxWidth: '100%', 
                    objectFit: 'contain',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    p: 1,
                    backgroundColor: '#f9f9f9'
                  }}
                  onError={(e) => {
                    console.log('Erro ao carregar imagem principal:', currentProduct.mainImage);
                    e.target.onerror = null;
                    e.target.src = '/image/placeholder.jpg';
                  }}
                />
                <Typography variant="caption" color="text.secondary" display="block">
                  {currentProduct.mainImage.split('/').pop()}
                </Typography>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSaveProduct} color="primary" variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmação para excluir produto */}
      <Dialog open={confirmDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Você tem certeza que deseja excluir o produto <strong>{currentProduct.name}</strong>? 
            Esta ação não poderá ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button 
            onClick={handleDeleteProduct} 
            color="error" 
            variant="contained"
          >
            {loading ? <CircularProgress size={24} /> : 'Excluir'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para gerenciar imagens */}
      <Dialog open={openImagesDialog} onClose={handleCloseImagesDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Gerenciar Imagens do Produto
          <Typography variant="body2" color="text.secondary">
            Você pode adicionar várias imagens ao produto e escolher qual será a imagem principal
          </Typography>
        </DialogTitle>
        <DialogContent>
          {uploadError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {uploadError}
            </Alert>
          )}

          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Upload de Imagem
              </Typography>
              <Tooltip title="Clique no botão abaixo para selecionar uma imagem do seu computador">
                <IconButton size="small" color="primary">
                  <AddPhotoAlternateIcon />
                </IconButton>
              </Tooltip>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileInputChange}
                    id="upload-image-input"
                  />
                  <label htmlFor="upload-image-input">
                    <Button
                      variant="contained"
                      component="span"
                      startIcon={<UploadFileIcon />}
                      disabled={isUploading}
                      color="primary"
                      size="large"
                      sx={{ 
                        mb: 1, 
                        fontSize: '1rem',
                        padding: '10px 20px',
                        background: '#4caf50',
                        '&:hover': {
                          background: '#388e3c'
                        }
                      }}
                    >
                      {isUploading ? 'Enviando...' : 'SELECIONAR IMAGEM'}
                    </Button>
                  </label>
                  
                  {isUploading && (
                    <Box sx={{ width: '100%', mt: 1 }}>
                      <LinearProgress variant="determinate" value={uploadProgress} />
                      <Typography variant="body2" color="text.secondary" align="center">
                        Enviando... {uploadProgress}%
                      </Typography>
                    </Box>
                  )}
                  
                  <TextField
                    fullWidth
                    label="Texto Alternativo"
                    placeholder="Descrição da imagem para acessibilidade"
                    value={newImageAlt}
                    onChange={(e) => setNewImageAlt(e.target.value)}
                    margin="normal"
                  />
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ textAlign: 'center' }}>
                  {previewImage ? (
                    <>
                      <Typography variant="subtitle2" gutterBottom>Pré-visualização:</Typography>
                      <Box
                        component="img"
                        src={previewImage}
                        alt="Pré-visualização"
                        sx={{
                          maxHeight: 150,
                          maxWidth: '100%',
                          objectFit: 'contain',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          p: 1
                        }}
                      />
                    </>
                  ) : lastUploadedImage && (
                    <>
                      <Typography variant="subtitle2" gutterBottom>Última imagem enviada:</Typography>
                      <Box
                        component="img"
                        src={lastUploadedImage.url.startsWith('http') ? 
                          lastUploadedImage.url : 
                          `/${lastUploadedImage.url.startsWith('/') ? lastUploadedImage.url.substring(1) : lastUploadedImage.url}`
                        }
                        alt={lastUploadedImage.alt}
                        sx={{
                          maxHeight: 150,
                          maxWidth: '100%',
                          objectFit: 'contain',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          p: 1,
                          backgroundColor: '#f9f9f9'
                        }}
                        onError={(e) => {
                          console.log('Erro ao carregar última imagem enviada:', lastUploadedImage.url);
                          e.target.onerror = null;
                          e.target.src = '/image/placeholder.jpg';
                        }}
                      />
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                        {lastUploadedImage.url.split('/').pop()}
                      </Typography>
                    </>
                  )}
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle1" gutterBottom>Ou Adicionar por URL</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  label="URL da Imagem"
                  placeholder="image/nome-da-imagem.jpg"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  helperText="Coloque o caminho da imagem em relação à pasta 'public/image'"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button 
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleAddImage}
                  disabled={!newImageUrl}
                  sx={{ mt: 1 }}
                >
                  Adicionar
                </Button>
              </Grid>
            </Grid>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle1">
              Imagens do Produto ({currentProduct.images?.length || 0})
            </Typography>
            
            <Tooltip title="A imagem principal é a que aparece primeiro na página do produto">
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                Clique em "Definir como Principal" para escolher a imagem principal
              </Typography>
            </Tooltip>
          </Box>
          
          {currentProduct.images && currentProduct.images.length > 0 ? (
            <Grid container spacing={2}>
              {currentProduct.images.map((image, index) => (
                <Grid item xs={12} sm={6} md={4} key={`image-${index}-${image.url.split('/').pop()}`}>
                  <Card variant="outlined">
                    <CardMedia
                      component="img"
                      height="140"
                      image={image.url.startsWith('http') ? image.url : `/${image.url.startsWith('/') ? image.url.substring(1) : image.url}`}
                      alt={image.alt}
                      onError={(e) => {
                        console.log('Erro ao carregar imagem:', image.url);
                        e.target.onerror = null;
                        e.target.src = '/image/placeholder.jpg';
                      }}
                      sx={{
                        objectFit: 'contain',
                        backgroundColor: '#f9f9f9',
                      }}
                    />
                    <CardContent sx={{ pt: 1, pb: 1 }}>
                      <Typography variant="body2" noWrap>
                        {image.url.split('/').pop()}
                      </Typography>
                      {image.alt && (
                        <Typography variant="caption" color="text.secondary" noWrap>
                          {image.alt}
                        </Typography>
                      )}
                    </CardContent>
                    <CardActions>
                      <Button 
                        size="small" 
                        color={currentProduct.mainImage === image.url ? "success" : "primary"}
                        onClick={() => handleSetMainImage(image.url)}
                        disabled={currentProduct.mainImage === image.url}
                        startIcon={currentProduct.mainImage === image.url ? <CheckCircleIcon /> : null}
                        sx={{
                          fontWeight: currentProduct.mainImage === image.url ? 'bold' : 'normal',
                          backgroundColor: currentProduct.mainImage === image.url ? '#e8f5e9' : 'inherit',
                        }}
                      >
                        {currentProduct.mainImage === image.url ? 'Imagem Principal' : 'Definir como Principal'}
                      </Button>
                      <IconButton 
                        color="error" 
                        size="small"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography color="text.secondary" align="center" sx={{ my: 4 }}>
              Nenhuma imagem adicionada a este produto
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Box sx={{ mr: 'auto' }}>
            <Typography variant="body2" color="text.secondary">
              Total de imagens: {currentProduct.images?.length || 0}
            </Typography>
          </Box>
          <Button 
            onClick={handleCloseImagesDialog} 
            variant="contained"
            color="primary"
          >
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductManagement;
