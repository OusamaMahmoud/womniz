import { useEffect, useState } from 'react'
import { Product } from '../../../services/clothes-service';
import { useParams } from 'react-router-dom';
import apiClient from '../../../services/api-client';

const ProductDetailsEditing = () => {
    const [, setTargetProduct] = useState<Product>();
    const [, setError] = useState("");
    const { id } = useParams();
  
    useEffect(() => {
      apiClient
        .get<{ data: Product }>(`products/${id}`)
        .then((res) => {
          setTargetProduct(res.data.data);
          console.log(res.data.data);
        })
        .catch((err: any) => setError(err.message));
    }, []);

  return (
    <div>ProductDetailsEditing</div>
  )
}

export default ProductDetailsEditing