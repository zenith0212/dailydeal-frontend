const axios = require("axios").default;
const BrandProduct = require("../db/Model/brandGatewayModel");
const express = require("express");
const router = express.Router();

var all_products = [];
const getProductList = async () => {
    var page = 1;
    while (page > 0) {
        try {
            var res = await axios({
                method: 'get',
                url: `https://nova.shopwoo.com/api/v1/products?store_id=2&page=${page}&per_page=100&stock_status=instock&lang=en`,
                headers: {
                    'accept': 'application/json',
                    'Authorization': 'Basic c3RldmVAbmV3bWlyYS5jb20gOnN3NDg0NCEh',
                }
            });
            if (res.data.length === 0) {
                page = 0;
            } else {

                for (var i = 0; i < 100; i++) {
                    const brandProduct = new BrandProduct({
                        id: res.data[i].id,
                        sku: res.data[i].sku,
                        description: res.data[i].description,
                        regular_price: res.data[i].regular_price,
                        sale_price: res.data[i].sale_price,
                        in_stock: res.data[i].in_stock,
                        stock_quantity: res.data[i].stock_quantity,
                        stock_status: res.data[i].stock_status,
                        categories: res.data[i].categories,
                        images: res.data[i].images,
                        attributes: res.data[i].attributes,
                        variations: res.data[i].variations,
                        name: res.data[i].name,
                        type: res.data[i].type
                    });

                    // console.log(brandProduct);
                    brandProduct.save()
                    // return success if the new user is added to the database successfully

                }
            }
            page++;
        } catch {

            page = 0;
            response.status(500).send({
                message: "try after a few hours",
                err
            })
        }
    }
    response.status(201).send({
        message: "Successfully Updated Brandgateway Products!",
    });

}

const deleteAllDocument = async (response) => {
    try {
        await BrandProduct.deleteMany();
    } catch (err) {
        response.status(500).send({
            err
        })
    }
}
router.post("/", async (request, response) => {

    deleteAllDocument(response);
    try {
        var page = 1;
        while (page > 0) {
            var res = await axios({
                method: 'get',
                url: `https://nova.shopwoo.com/api/v1/products?store_id=2&page=${page}&per_page=100&stock_status=instock&lang=en`,
                headers: {
                    'accept': 'application/json',
                    'Authorization': 'Basic c3RldmVAbmV3bWlyYS5jb20gOnN3NDg0NCEh',
                }
            });
            if (res.data.length === 0) {
                page = 0;
            } else {

                for (var i = 0; i < 100; i++) {
                    if (!!res.data[i].id) {
                        const brandProduct = new BrandProduct({
                            id: res.data[i].id,
                            sku: res.data[i].sku,
                            description: res.data[i].description,
                            regular_price: res.data[i].regular_price,
                            sale_price: res.data[i].sale_price,
                            in_stock: res.data[i].in_stock,
                            stock_quantity: res.data[i].stock_quantity,
                            stock_status: res.data[i].stock_status,
                            categories: res.data[i].categories,
                            images: res.data[i].images,
                            attributes: res.data[i].attributes,
                            variations: res.data[i].variations,
                            name: res.data[i].name,
                            type: res.data[i].type
                        });
                        brandProduct.save();
                    }
                    // console.log(brandProduct);
                    // return success if the new user is added to the database successfully

                }
            }
            page++;
        }
        response.status(200).json({ message: "Updated successfully!" });

    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});
router.get("/", async (req, res) => {
    try {
        console.log(req.query);
        const data = await BrandProduct.find({"name": {$regex: req.query.searchKey}}).limit(req.query.limit).skip((req.query.page - 1) * req.query.limit);
        res.status(200).json(data);
    } catch (err) {
        res.status(500).send({
            err
        })
    }
});
router.get("/count", async (req, res) => {
    try {
        const data = await BrandProduct.find({"name": {$regex: req.query.searchKey}}).count();
        res.status(200).send({ count: data });
    } catch (err) {
        res.status(500).send({ err });
    }
})

module.exports = router;