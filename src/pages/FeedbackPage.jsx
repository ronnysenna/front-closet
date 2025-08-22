import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container, Paper } from '@mui/material';

const FeedbackPage = () => {
  const [form, setForm] = useState({ nome: '', email: '', celular: '', mensagem: '' });
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleChange = (e) => {
  setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');
    try {
      const res = await fetch('https://n8n-fluxo-n8n.exzgdz.easypanel.host/webhook/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Erro ao enviar feedback');
      setEnviado(true);
    } catch (err) {
      setErro('Não foi possível enviar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" color="primary" fontWeight={700} gutterBottom align="center">
          Sua opinião é muito importante!
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
          O feedback dos nossos clientes nos ajuda a melhorar cada vez mais. Por favor, preencha seus dados e compartilhe sua experiência ou sugestão. Sua participação faz toda a diferença!
        </Typography>
        {enviado ? (
          <Typography variant="h6" color="success.main" align="center">
            Obrigado pelo seu feedback! 😊
          </Typography>
        ) : (
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Nome"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
            />
            <TextField
              label="E-mail"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Celular"
              name="celular"
              type="tel"
              value={form.celular}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Seu feedback"
              name="mensagem"
              value={form.mensagem}
              onChange={handleChange}
              required
              fullWidth
              multiline
              minRows={4}
              variant="outlined"
              sx={{ mt: 1 }}
              placeholder="Conte sua experiência, sugestão ou opinião..."
            />
            <Button type="submit" variant="contained" color="primary" size="large" disabled={loading} sx={{ mt: 2 }}>
              {loading ? 'Enviando...' : 'Enviar Feedback'}
            </Button>
            {erro && (
              <Typography color="error" align="center">{erro}</Typography>
            )}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default FeedbackPage;
