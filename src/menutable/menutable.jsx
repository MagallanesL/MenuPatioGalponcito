import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseconfig';
import './menu.css';

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const productsCollection = collection(db, 'productosmesa');
  const bebidasCollection = collection(db, 'bebidas');

  // Obtener productos de la colección seleccionada
  const getProducts = async () => {
    if (category === 'bebidas') {
      const data = await getDocs(bebidasCollection);
      setProducts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    } else {
      const data = await getDocs(productsCollection);
      setProducts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }
  };

  useEffect(() => {
    getProducts();
  }, [category]); // Cambiar productos cuando la categoría cambia

  // Filtrar productos
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const isEnabled = product.disabled !== true;
    return matchesSearch && isEnabled;
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
        <button onClick={() => setCategory('all')}>Todos</button>
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
