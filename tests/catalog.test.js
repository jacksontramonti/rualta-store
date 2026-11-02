import test from 'node:test';import assert from 'node:assert/strict';
import {getProductById,products} from '../src/data/products.js';import {filterProducts,salePrice} from '../src/utils/catalog.js';
test('catálogo contém 12 itens originais com IDs únicos',()=>{assert.equal(products.length,12);assert.equal(new Set(products.map(p=>p.id)).size,12);});
test('localiza item pelo ID',()=>assert.equal(getProductById('flux').model,'Flux Runner'));
test('preço promocional tem prioridade',()=>assert.equal(salePrice(products[0]),299.9));
test('busca ignora acentos e maiúsculas',()=>assert.deepEqual(filterProducts(products,{search:'ZENIT'}).map(p=>p.id),['zenit']));
test('filtra categoria e ordena do mais barato',()=>{const list=filterProducts(products,{categories:['Corrida'],sort:'lowest'});assert.equal(list.length,4);assert.ok(list.every(p=>p.category==='Corrida'));assert.ok(list.every((p,i)=>i===0||salePrice(list[i-1])<=salePrice(p)));});
test('filtra por preço máximo',()=>assert.ok(filterProducts(products,{maxPrice:270}).every(p=>salePrice(p)<=270)));
