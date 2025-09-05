import React, { useState, useEffect } from 'react';
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
  Alert
} from '@mui/material';
import { styled } from '@mui/system';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../utils/api';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.common.white,
}));

const CategoryManagement = ({ onSuccess }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({
    id: null,
    name: '',
    description: ''
  });
  
  // Buscar categorias ao carregar a página
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar categorias:', err);
      setError('Falha ao carregar as categorias. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleOpenDialog = (category = null) => {
    if (category) {
      setCurrentCategory(category);
      setEditMode(true);
    } else {
      setCurrentCategory({
        id: null,
        name: '',
        description: ''
      });
      setEditMode(false);
    }
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenDeleteDialog = (category) => {
    setCurrentCategory(category);
    setConfirmDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setConfirmDeleteDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCategory({
      ...currentCategory,
      [name]: value
    });
  };
  
  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (editMode) {
        await updateCategory(currentCategory.id, currentCategory);
        onSuccess('Categoria atualizada com sucesso!');
      } else {
        await createCategory(currentCategory);
        onSuccess('Categoria criada com sucesso!');
      }
      await fetchCategories();
      handleCloseDialog();
    } catch (err) {
      console.error('Erro ao salvar categoria:', err);
      setError(err.message || 'Ocorreu um erro ao salvar a categoria.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteCategory(currentCategory.id);
      onSuccess('Categoria excluída com sucesso!');
      await fetchCategories();
      handleCloseDeleteDialog();
    } catch (err) {
      console.error('Erro ao excluir categoria:', err);
      setError(err.message || 'Ocorreu um erro ao excluir a categoria.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Gerenciamento de Categorias</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nova Categoria
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading && !openDialog && !confirmDeleteDialog ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>ID</StyledTableCell>
                <StyledTableCell>Nome</StyledTableCell>
                <StyledTableCell>Slug</StyledTableCell>
                <StyledTableCell>Descrição</StyledTableCell>
                <StyledTableCell>Ações</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.id}</TableCell>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.slug}</TableCell>
                    <TableCell>{category.description || '-'}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleOpenDialog(category)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleOpenDeleteDialog(category)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Nenhuma categoria encontrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Diálogo para adicionar/editar categoria */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editMode ? 'Editar Categoria' : 'Nova Categoria'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Nome da Categoria"
            fullWidth
            value={currentCategory.name}
            onChange={handleInputChange}
            required
          />
          <TextField
            margin="dense"
            name="description"
            label="Descrição"
            fullWidth
            multiline
            rows={4}
            value={currentCategory.description || ''}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button 
            onClick={handleSubmit}
            variant="contained" 
            color="primary"
            disabled={!currentCategory.name}
          >
            {loading ? <CircularProgress size={24} /> : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmação para excluir categoria */}
      <Dialog open={confirmDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Você tem certeza que deseja excluir a categoria <strong>{currentCategory.name}</strong>? 
            Esta ação não poderá ser desfeita e poderá afetar produtos associados a esta categoria.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            variant="contained"
          >
            {loading ? <CircularProgress size={24} /> : 'Excluir'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoryManagement;
