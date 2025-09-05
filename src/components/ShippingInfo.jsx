import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { Box, Stack, Typography } from '@mui/material';

// Imagens dos ícones das transportadoras
const jadlogIcon = '/image/jadlog.png'; // Coloque o arquivo em public/image/jadlog.png
const sedexIcon = '/image/sedex.png'; // Coloque o arquivo em public/image/sedex.png
const pacIcon = '/image/pac.png';
const loggiIcon = '/image/loggi.png';

const ShippingInfo = () => (
  <Box
    sx={{
      mt: 8,
      py: 4,
      px: 2,
      bgcolor: 'grey.100',
      borderRadius: 3,
      textAlign: 'center',
      boxShadow: 2,
      maxWidth: 600,
      mx: 'auto',
    }}
  >
    <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
      <LocalShippingIcon color="primary" sx={{ fontSize: 40 }} />
      <img src={jadlogIcon} alt="Jadlog" style={{ height: 40 }} />
      <img src={sedexIcon} alt="Sedex" style={{ height: 40 }} />
      <img src={pacIcon} alt="PAC" style={{ height: 40 }} />
      <img src={loggiIcon} alt="LOGGI" style={{ height: 40 }} />
    </Stack>
    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
      Entregamos para todo o Brasil!
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Enviamos pelas principais transportadoras: Jadlog, Sedex e PAC, Loggi e Via aéreo.
    </Typography>
  </Box>
);

export default ShippingInfo;
