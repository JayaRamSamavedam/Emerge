import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { Request } from '../helpers/axios_helper';

const Printfull = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await Request('GET', '/api/products');
                console.log(response);
                setProducts(response.data.result || []); // Update based on your response structure
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return <div>Loading products...</div>;
    }

    return (
        <div>
            <h1>Products</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                {products.map((product) => (
                    <Link
                        to={`/printfull/${product.id}`} // Navigate to Product Detail page with product ID
                        key={product.id}
                        style={{
                            textDecoration: 'none', // Remove default link styling
                            color: 'inherit',        // Inherit color for better UI
                        }}
                    >
                        <div
                            style={{
                                border: '1px solid #ddd',
                                padding: '16px',
                                width: '200px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: '0.3s',
                            }}
                        >
                            <img
                                src={product.thumbnail_url} // Use the correct thumbnail URL from the object
                                alt={product.name}
                                style={{ width: '100%', borderRadius: '8px' }}
                            />
                            <h2 style={{ fontSize: '16px' }}>{product.name}</h2>
                            <p>Variants: {product.variants}</p>
                            <p>Synced: {product.synced}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Printfull;
