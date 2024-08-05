import { Box, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
// import { useValue } from '../../../context/ContextProvider';

const COLORS = ['#00C49F', '#0088FE', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};
export default function PieProductsCost({products}) {
//   const {
//     state: { rooms },
//   } = useValue();
  const [costGroups, setCostGroups] = useState([]);

  useEffect(() => {
    let free = 0,
      lessThan40 = 0,
      between40And80 = 0,
      moreThan80 = 0;
    products?.forEach((product) => {
      if (product.price < 30) return free++;
      if (product.price < 40) return lessThan40++;
      if (product.price <= 80) return between40And80++;
      moreThan80++;
    });
    setCostGroups([
      { name: 'Almost Free', qty: free },
      { name: 'Less Than $40', qty: lessThan40 },
      { name: 'Between $40 & $80', qty: between40And80 },
      { name: 'More Than $80', qty: moreThan80 },
    ]);
  }, [products]);
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        flexWrap: 'wrap',
      }}
    >
      <PieChart width={200} height={200}>
        <Pie
          data={costGroups}
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey="qty"
        >
          {costGroups.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
      <Stack gap={2}>
        <Typography variant="h6">Products Cost</Typography>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
          {COLORS.map((color, i) => (
            <Stack key={color} sx={{width: 125}} alignItems="center" spacing={1}>
              <Box sx={{ width: 20, height: 20, background: color }} />
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                {costGroups[i]?.name}
              </Typography>
            </Stack>
          ))}
        </Box>
      </Stack>
    </Box>
  );
}