// Catálogo de demonstração; fotos ilustrativas fornecidas pelo repositório do curso. Sem estoque nem pagamentos reais.
const raw = [
  ['loop','Loop 01','Urbano','Todos',389.9,299.9,'#E5F2F8','#A8D8E8','#19385C','#4B7BF7'],
  ['flux','Flux Runner','Corrida','Masculino',459.9,379.9,'#FFF0E8','#F4C4A8','#F26F46','#392E3B'],
  ['drift','Drift Low','Casual','Todos',319.9,259.9,'#EFF0FD','#B8C2F3','#5B55AA','#D1FA49'],
  ['pulse','Pulse Aero','Corrida','Feminino',529.9,429.9,'#F2FADD','#D8EE97','#677E1D','#1B2929'],
  ['vega','Vega Court','Urbano','Feminino',349.9,null,'#FBECF0','#F0C6D2','#CC4C80','#414059'],
  ['norte','Norte Trail','Aventura','Masculino',589.9,479.9,'#F5F0E7','#D3C4A9','#876C48','#263B4E'],
  ['atlas','Atlas Pro','Corrida','Todos',499.9,399.9,'#E3F6F3','#A8DAD4','#11877B','#F8D44C'],
  ['brisa','Brisa Move','Casual','Feminino',289.9,229.9,'#F1EFFF','#D8D5FF','#7161B3','#F4F2ED'],
  ['delta','Delta Street','Urbano','Masculino',369.9,299.9,'#FBEDE3','#E7C4AC','#A54A38','#F6E9C9'],
  ['zenit','Zênit 02','Corrida','Todos',579.9,489.9,'#EAF1FE','#C6D6F5','#4066B0','#D9F862'],
  ['terra','Terra Walk','Aventura','Todos',419.9,359.9,'#F0F4EC','#DAE2CF','#5D765A','#EBAE6F'],
  ['noir','Noir Motion','Casual','Masculino',399.9,319.9,'#E9EBF0','#C0C4CC','#282E40','#9DAEF2']
];
const photoNumber = (index) => (index % 5) + 1;
export const products = raw.map(([id,model,category,gender,price,priceDiscount,bg,light,dark,accent], index) => ({
  id,
  name: `Nova Sport ${model}`,
  model,
  brand: 'NOVA SPORT',
  category,
  gender,
  price,
  priceDiscount,
  originalPrice: price,
  featured: index < 8,
  newArrival: [0,1,3,7,9].includes(index),
  isPopular: index < 5,
  reference: `RA-${String(index+1).padStart(4,'0')}`,
  image: `/course-images/product-thumb-${photoNumber(index)}.jpeg`,
  images: [
    { src: `/course-images/produc-image-${photoNumber(index)}.jpeg`, alt: `Foto ilustrativa do tênis ${model}` },
    { src: `/course-images/product-thumb-${photoNumber(index)}.jpeg`, alt: `Miniatura do tênis ${model}` }
  ],
  bg, light, dark, accent,
  colors: [dark,accent,'#F4F5F7'],
  sizes: [35,36,37,38,39,40,41,42,43,44],
  rating: Number((4.4 + (index % 5) / 10).toFixed(1)),
  reviews: 58 + (index*23) % 193,
  description: `O ${model} encontra a liberdade do movimento em uma silhueta contemporânea. Cabedal leve, palmilha macia e solado firme para levar seu estilo da primeira saída até o último destino.`,
}));
export const getProductById = id => products.find(p=>p.id===id);
export const featuredProducts = products.filter(p=>p.featured);
export const categories = ['Todos','Urbano','Corrida','Casual','Aventura'];
