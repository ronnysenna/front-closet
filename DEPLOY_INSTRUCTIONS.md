# Closet Moda Fitness - Instruções de Deploy

Este documento contém as instruções para fazer o deploy completo da loja virtual Closet Moda Fitness, incluindo o frontend React e a API PHP que se conecta ao banco de dados MySQL.

## 1. Estrutura de Arquivos

```
public_html/                  # Pasta raiz do site
├── index.html                # Página principal do React
├── .htaccess                 # Configurações do servidor
├── assets/                   # Assets estáticos do React
│   ├── js/
│   └── css/
├── api/                      # API PHP
│   ├── config/
│   │   └── database.php      # Configurações de conexão
│   ├── products/
│   │   ├── read.php
│   │   ├── read_one.php
│   │   └── by_category.php
│   ├── categories/
│   │   └── read.php
│   └── admin/                # Painel administrativo
│       ├── login.php
│       ├── index.php
│       ├── import.html
│       ├── import_products.php
│       └── logout.php
└── image/                    # Imagens dos produtos
```

## 2. Deploy do Frontend React

O frontend React já está configurado para ser implantado automaticamente através do GitHub Actions. O arquivo `.github/workflows/deploy.yml` faz:

1. Build do projeto React
2. Upload via FTP dos arquivos para a pasta `public_html/` na Hostinger

Para que isso funcione, você precisa configurar no GitHub:

1. Vá para Settings > Secrets and variables > Actions
2. Adicione os seguintes secrets:
   - `FTP_SERVER` - Servidor FTP da Hostinger (normalmente ftp.closetmodafitness.com)
   - `FTP_USERNAME` - Seu nome de usuário FTP
   - `FTP_PASSWORD` - Sua senha FTP

## 3. Deploy da API PHP

Os arquivos da API precisam ser enviados manualmente para o servidor:

1. Conecte-se via FTP à sua hospedagem na Hostinger
2. Navegue até a pasta `public_html/`
3. Crie uma pasta chamada `api/`
4. Faça upload de todos os arquivos da pasta `api_files/` para a pasta `api/` no servidor, mantendo a mesma estrutura de pastas

## 4. Configuração do Banco de Dados

O banco de dados já está configurado na Hostinger com todas as tabelas necessárias. Se precisar recriar:

1. Acesse o phpMyAdmin pelo painel da Hostinger
2. Selecione o banco de dados `u139114102_lojaCloset`
3. Execute o script SQL fornecido anteriormente para criar todas as tabelas

## 5. Importação de Produtos

Para importar os produtos do arquivo JSON para o banco de dados:

1. Acesse `https://closetmodafitness.com/api/admin/login.php`
2. Use as credenciais:
   - Usuário: `admin`
   - Senha: `Ideal2015net`
3. No painel admin, clique em "Importar"
4. Faça upload do arquivo JSON ou JS com os produtos

## 6. Teste da Aplicação

Após o deploy, teste os seguintes endpoints:

- Frontend: `https://closetmodafitness.com/`
- API: `https://closetmodafitness.com/api/products/read.php`
- Admin: `https://closetmodafitness.com/api/admin/`

## 7. Segurança

Importante! Por segurança, após a implantação inicial:

1. Altere a senha do painel administrativo em `api/admin/login.php`
2. Verifique as permissões dos arquivos no servidor:
   - Arquivos PHP: 644
   - Diretórios: 755
   - Arquivos de configuração: 600

## 8. Suporte e Manutenção

Para futuras atualizações:

1. Para o frontend: atualize o código e faça push para o GitHub; o deploy acontecerá automaticamente
2. Para a API: atualize os arquivos manualmente via FTP
3. Para o banco de dados: faça alterações via phpMyAdmin

Em caso de dúvidas ou problemas, entre em contato com o desenvolvedor.
