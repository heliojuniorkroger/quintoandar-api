import dotenv from 'dotenv';
import qs from 'qs';
import fetch from 'node-fetch';
import elasticClient from './singletons/elasticClient';

dotenv.config();

const getProperies = async () => {
    const response = await fetch('https://www.quintoandar.com.br/api/yellow-pages/search', {
        method: 'POST',
        body: JSON.stringify({
            criteria: {
                q: "for_rent:'true'",
                fq: "local:['-23.447564108636605,-46.704548471435544','-23.65339531867058,-46.56206952856445']",
                return: 'id,foto_capa,aluguel,area,quartos,custo,photos,photo_titles,variant_images,variant_images_titles,endereco,regiao_nome,cidade,visit_status,special_conditions,listing_tags,tipo,promotions,for_rent,for_sale,sale_price,condo_iptu,vagas',
                size: 5,
                'q.parser': 'structured',
                'expr.distance': 'floor(haversin(-23.550479713653594%2C-46.633309%2Clocal.latitude%2Clocal.longitude)*1000*0.002)',
                'expr.rank': '((-10*distance%2Brelevance_score)*(0.1))',
                sort: 'rank desc',
                start: 0,
            },
        }),
    });
    return response.json();
};

const getGeocode = async (address) => {
    const params = qs.stringify({
        address,
        key: process.env.GOOGLE_API_KEY,
        language: 'pt-BR',
    });
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?${params}`);
    const data = await response.json();
    const { formatted_address: formttedAddress, geometry } = data.results[0];
    const { location } = geometry;
    return {
        geometry: [ location.lat, location.lng ],
        formttedAddress,
    };
};

const populate = async () => {
    const data = await getProperies();
    data.hits.hit.forEach(async ({ fields }) => {
        let { photos } = fields;
        const {
            condo_iptu: condoIpu,
            vagas, area,
            quartos,
            aluguel,
            endereco,
            regiao_nome: region,
            cidade,
        } = fields;
        photos = photos.map((path) => `https://www.quintoandar.com.br/img/xxl/${path}`);
        const { formttedAddress, geometry } = await getGeocode(`${endereco} ${region} ${cidade}`);
        await elasticClient.index({
            index: 'properties',
            body: {
                photos,
                iptu: Number(condoIpu),
                parking_lots: Number(vagas),
                area: Number(area),
                for_rent: true,
                for_sale: false,
                geometry,
                rooms: Number(quartos),
                price: Number(aluguel),
                address: formttedAddress,
            },
        });
    });
};

populate();
