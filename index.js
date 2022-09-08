const fs = require("fs");
const express = require("express");
const app = express();
const PORT = 8080;

class Contenedor {
    async save(producto) {
        try {
            await fs.promises.writeFile(
            "./productos.txt",
            JSON.stringify(producto, null, 2),
            "utf-8"
            );
        } catch (e) {
            console.log(e);
        }
    }

    async getAll(){
        try{
            const contenido = await fs.promises.readFile('./productos.txt', "utf-8");
            console.log(contenido);
            return JSON.parse(contenido);
        }   catch(error) {}
    }   

    async saveNew(productoNuevo){
        const contenido = await this.getAll();
        const indice = contenido.sort((a, b)=> b.id - a.id)[0].id;
        productoNuevo.id = indice + 1;
        contenido.push(productoNuevo);
        this.save(contenido);
    }

    async getById(id){
        const contenido = await this.getAll();
        const productoBuscado = contenido.filter(producto => producto.id == id);
        console.log(productoBuscado);
    }

    async deleteById(id){
        const contenido = await this.getAll();
        const arrayFiltrado = contenido.filter(producto => producto.id !== id);
        this.save(arrayFiltrado);
    }

    async deleteAll(productos){
        const contenido = await this.getAll();
        const arrayVacio = [];
        this.save(arrayVacio);
    }
}

const contenedor = new Contenedor();

const server = app.listen(PORT, () =>{
    console.log("servidor iniciado");
});

app.get("/productos", (req, res)=>{
    res.send(contenedor.getAll());
})

app.get("/productosRandom", (req, res)=>{
    const random = Math.ceil(Math.random()*10);
    res.send(contenedor.getById(random));
})