import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Request } from '../helpers/axios_helper';

const PrintfullDetailed = () => {
    const { id } = useParams(); // Get the product ID from the URL
    const [productData, setProductData] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);

    useEffect(() => {
        if (!id) return; // If no id in URL, do nothing

        // Fetch product data based on the ID
        const fetchProductData = async () => {
            try {
                const response = await Request("GET", `/api/products/${id}`);
                console.log(response);
                setProductData(response.data.result);
                
                if (response.data.result?.sync_variants?.length) {
                    setSelectedVariant(response.data.result.sync_variants[0]); // Default to the first variant
                }
            } catch (error) {
                console.error('Error fetching product data:', error);
            }
        };

        fetchProductData();
    }, [id]); // Re-run the effect if the `id` changes

    // Handle variant selection
    const handleVariantSelection = (variant) => {
        setSelectedVariant(variant);
    };

    if (!productData) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ display: 'flex', padding: '20px' }}>
            {/* Left side: Product image and name */}
            <div style={{ flex: 1 }}>
                <h1>{productData.sync_product.name}</h1>
                <img
                    src={selectedVariant?.product?.image || productData.sync_product.thumbnail_url || 'default-image-url'}
                    alt={productData.sync_product.name}
                    style={{ width: '300px', height: 'auto', borderRadius: '8px' }}
                />
            </div>

            {/* Right side: Variant selection */}
            <div style={{ flex: 1, marginLeft: '20px' }}>
                <h2>Price: ${selectedVariant?.retail_price || 'N/A'}</h2>

                <div style={{ marginTop: '20px' }}>
                    {productData.sync_variants.map((variant) => (
                        <div
                            key={variant.id}
                            onClick={() => handleVariantSelection(variant)}
                            style={{
                                cursor: 'pointer',
                                padding: '10px',
                                marginBottom: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '8px',
                                backgroundColor: selectedVariant?.id === variant.id ? '#f0f0f0' : '#fff',
                            }}
                        >
                            <h3>{variant.name}</h3>
                            <img
                                src={variant.product.image}
                                alt={variant.name}
                                style={{ width: '100px', height: 'auto', borderRadius: '8px' }}
                            />
                            <p>Price: ${variant.retail_price}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PrintfullDetailed;
