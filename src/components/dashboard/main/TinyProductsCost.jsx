import { useEffect, useState } from 'react';
import { BarChart, Bar, Cell, Tooltip, ResponsiveContainer, XAxis, YAxis } from 'recharts';

const COLORS = ['#00C49F', '#0088FE', '#FFBB28', '#FF8042'];

const TinyProductsCost = ({ products }) => {
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    const formattedData = products?.map((product) => ({
      name: product.name,
      price: product.price,
    }));
    setProductData(formattedData);
  }, [products]);

  return (
    <div style={{ width: '100%', height: 300, minWidth: 250 }}>
      <ResponsiveContainer>
        <BarChart data={productData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="price" fill="#8884d8">
                {productData?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TinyProductsCost;
