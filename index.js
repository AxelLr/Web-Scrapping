const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs-extra')
const https = require('https')

const agent = new https.Agent({  
     rejectUnauthorized: false
   })

const excelFile = fs.createWriteStream('catalogo-productos.csv') 
  
const getWebsiteContent = async () => {

    try {

     excelFile.write('Nombre Producto|Url Imagen| Precio\n')
      
     for(let i = 1; i <= 3; i++) {
       
     const response = await axios.get(`https://proverbioweb.com/index.php?route=product/category&path=61&limit=100&page=${i}`, { httpsAgent: agent })
     const $ = cheerio.load(response.data)

      $('.product-list .row').each( async (i, el) => {

          const product = $(el).find('a img')

          const productName = product.attr('alt')

          const productImage = product.attr('src')

          const productPrice = $(el).find('.price').text().replace(/[^0-9.]/g, '')

          excelFile.write(`${productName}|${productImage}|${productPrice}\n`)

        })      
      }

    } catch (error) {
  
      console.error(error)
    }
  }
  
  getWebsiteContent()
  