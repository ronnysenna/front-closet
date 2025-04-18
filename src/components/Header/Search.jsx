import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// Importa os dados diretamente - certifique-se que o caminho está correto
import productsData from "../../components/Allproducts/allProductsData";
// Opcional: Importar debounce (exemplo usando lodash, precisa instalar: npm install lodash.debounce)
// import debounce from 'lodash.debounce';

const Search = ({ cartItems }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]); // Estado para os resultados

  // Acessa o array real de produtos
  const allProducts = productsData.allProductsData || [];

  // --- Função de Filtragem ---
  // Agora separada para poder ser usada com debounce (opcional)
  const filterProducts = (term) => {
    if (!term || term.length < 1) { // Não busca se vazio ou muito curto (ajuste o length se quiser mínimo > 1)
      setSearchResults([]);
      return;
    }
    const lowerCaseTerm = term.toLowerCase();
    const filtered = allProducts.filter((product) =>
      product.name.toLowerCase().includes(lowerCaseTerm)
      // || (product.desc && product.desc.toLowerCase().includes(lowerCaseTerm)) // Descomente para buscar na descrição também
    );
    setSearchResults(filtered);
  };

  // --- Debounce (Opcional - Melhora Performance com muitos dados) ---
  // Cria uma versão "debounced" da função de filtro que só executa 300ms após a última chamada
  // const debouncedFilter = debounce(filterProducts, 300);

  // Atualiza o termo de busca e chama o filtro
  const handleInputChange = (e) => {
    const newTerm = e.target.value;
    setSearchTerm(newTerm);
    // Se usar debounce:
    // debouncedFilter(newTerm);
    // Se NÃO usar debounce:
    filterProducts(newTerm);
  };

  // Efeito para o scroll (mantido como antes)
  useEffect(() => {
    const handleScroll = () => { /* ... seu código de scroll ... */ };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <section className="search">
        <div className="container c_flex">
          {/* ... Logo ... */}
          <div className="logo width">
            <Link aria-label="Daraz Home" to="/">
              <img src="/assets/main-logo/Daraz-Logo.png" alt="Logo" />
            </Link>
          </div>

          {/* --- Caixa de Pesquisa e Resultados --- */}
          <div className="search-container" style={{ position: 'relative', flexGrow: 1 }}> {/* Container para input e resultados */}
            <div className="search-box f_flex">
              <i className="fa fa-search"></i>
              <input
                type="text"
                placeholder="Pesquisar por nome..."
                value={searchTerm}
                onChange={handleInputChange} // Usa a nova função
                style={{ flexGrow: 1 }}
              />
              {/* Opcional: botão de limpar busca */}
              {searchTerm && (
                <i
                  className="fa fa-times"
                  onClick={() => { setSearchTerm(''); setSearchResults([]); }}
                  style={{ cursor: 'pointer', padding: '0 10px', color: '#888' }}
                ></i>
              )}
            </div>

            {/* --- Dropdown de Resultados --- */}
            {/* Mostra o dropdown se houver termo e resultados */}
            {searchTerm && searchResults.length > 0 && (
              <div
                className="search-results-dropdown"
                style={{
                  position: 'absolute',
                  top: '100%', // Logo abaixo da caixa de busca
                  left: 0,
                  right: 0,
                  backgroundColor: 'white',
                  border: '1px solid #eee',
                  borderRadius: '0 0 5px 5px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  maxHeight: '400px', // Limita a altura
                  overflowY: 'auto', // Adiciona scroll se necessário
                  zIndex: 1000 // Garante que fique sobre outros elementos
                }}
              >
                {searchResults.map((product) => (
                  <Link
                    key={product.id}
                    to={`/all-products/${product.id}`}
                    className="search-result-item"
                    onClick={() => { setSearchTerm(''); setSearchResults([]); }} // Limpa busca ao clicar
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '10px',
                      textDecoration: 'none',
                      color: 'inherit',
                      borderBottom: '1px solid #f0f0f0'
                    }}
                  >
                    <img src={product.img} alt="" style={{ width: '40px', height: '40px', objectFit: 'contain', marginRight: '10px' }} />
                    <span>{product.name} - R$ {product.price}</span>
                  </Link>




                ))}
              </div>
            )}
            {/* Mensagem se buscar e não achar nada */}
            {searchTerm && searchResults.length === 0 && (
               <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', padding: '10px', border: '1px solid #eee', borderRadius: '0 0 5px 5px', zIndex: 1000 }}>
                 Nenhum produto encontrado para "{searchTerm}".
               </div>
            )}
          </div> {/* Fim search-container */}

          {/* ... Ícones de login/carrinho ... */}
          <div className="icon f_flex width">
            {/* ... */}
            <Link aria-label="Login page" to="/login"><i className="fa fa-user icon-circle"></i></Link>
            <div className="cart"><Link to="/cart"><i className="fa fa-shopping-bag icon-circle"></i><span>{cartItems?.length || 0}</span></Link></div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Search;