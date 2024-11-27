import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseconfig';
import './menu.css';

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('pizza');
  const [searchTerm, setSearchTerm] = useState('');

  const productsCollection = collection(db, 'productosmesa');

  // Obtener productos de la colección seleccionada
  const getProducts = async () => {
    const data = await getDocs(productsCollection);
    const filteredData = data.docs
      .map((doc) => ({ ...doc.data(), id: doc.id }))
      .filter((product) => category === 'bebidas' ? product.category === 'bebidas' : product.category === category);
    
    setProducts(filteredData);
  };

  useEffect(() => {
    getProducts();
  }, [category]);

  // Filtrar productos por término de búsqueda
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch && product.disabled !== true;
  });

  return (
    <div className="productsPage">
      <h2>Lista de Productos</h2>
      <div className="searchContainer">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="searchInput"
        />
      </div>
      <div className="categoryMenu">
        <button onClick={() => setCategory('pizza')}>Pizzas</button>
        <button onClick={() => setCategory('sandwich')}>Sandwiches</button>
        <button onClick={() => setCategory('bebidas')}>Bebidas</button>
      </div>
      <div className="productsGrid">
        {filteredProducts.map((product) => (
          <div className="productCard" key={product.id}>
            <div className="productDetails">
              <h3>{product.name}</h3>
              {category === 'bebidas' ? (
                <p className="productPrice">${product.cost}</p>
              ) : (
                <>
                  <p>{product.description}</p>
                  <p className="productPrice">${product.price}</p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewProducts;
