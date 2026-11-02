export const formatPrice = (value) => new Intl.NumberFormat('pt-BR', {style:'currency',currency:'BRL'}).format(value);
export const salePrice = product => product.priceDiscount ?? product.price;
export function filterProducts(list,{search='',categories=[],genders=[],sort='popular',maxPrice=1000}={}){
  const query=search.trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  return list.filter(p=>{
    const haystack=[p.name,p.model,p.category,p.gender].join(' ').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    return (!query||haystack.includes(query)) && (!categories.length||categories.includes(p.category)) && (!genders.length||genders.includes(p.gender)) && salePrice(p)<=maxPrice;
  }).sort((a,b)=>sort==='lowest'?salePrice(a)-salePrice(b):sort==='highest'?salePrice(b)-salePrice(a):sort==='name'?a.name.localeCompare(b.name):Number(b.isPopular)-Number(a.isPopular));
}
