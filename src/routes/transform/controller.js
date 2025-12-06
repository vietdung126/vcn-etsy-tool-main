import PDFParser from 'pdf2json'
import xlsx from 'xlsx'
import _ from 'lodash'
import { ErrorFactory, errors } from '#src/libs/error/index.js'
import * as LinkDesignModel from '#src/resources/linkdesign/model.js'
import * as SkuSpuModel from '#src/resources/skuspu/model.js'
import * as detachAdress from '#src/resources/transform/detach-address.js'

const VERTICAL_SPLITTER = 5
const DetachAdressByCountry = {
    Australia: detachAdress.australia,
    Austria: detachAdress.germany,
    Canada: detachAdress.canada,
    'Czech Republic': detachAdress.czechRepublic,
    Germany: detachAdress.germany,
    Ireland: detachAdress.ireland,
    Italy: detachAdress.italy,
    'New Zealand': detachAdress.australia,
    'The Netherlands': detachAdress.theNetherlands,
    Poland: detachAdress.poland,
    Sweden: detachAdress.sweden,
    'United States': detachAdress.us,
    'United Kingdom': detachAdress.uk,
    _default: detachAdress.germany,
}

export async function transform(ctx) {
    const { storeCode } = ctx.request.body

    const pdfParser = new PDFParser(this, 1)
    const filepath = ctx.request.files?.file?.filepath

    if (!filepath) {
        throw new ErrorFactory(
            errors.ValidationError,
            'Không tìm thấy file đơn hàng'
        )
    }

    const data = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error('timeout'))
        }, 60000)

        pdfParser.on('pdfParser_dataError', errData =>
            console.error(errData.parserError)
        )
        pdfParser.on('pdfParser_dataReady', async pdfData => {
            const result = []
            readOrder(result, pdfData.Pages, 0)

            const [skuLinks, skuSpus] = await Promise.all([
                LinkDesignModel.getAll(),
                SkuSpuModel.getAllSkuSpus(),
            ])
            const mapLinks = _.keyBy(skuLinks, 'sku')
            const mapSpus = _.keyBy(skuSpus, 'sku')
            const listSkuOfLink = Object.keys(mapLinks)
            const listSkuOfSpu = Object.keys(mapSpus)
            listSkuOfLink.sort((a, b) => (a.length > b.length ? -1 : 1))
            listSkuOfSpu.sort((a, b) => (a.length > b.length ? -1 : 1))

            result.forEach(item => {
                item.orderNumber = item.orderNumber + storeCode
                for (const property of listSkuOfLink) {
                    if (item.sku?.indexOf(property) === 0) {
                        item.designLink = mapLinks[property].link
                        break
                    }
                }
                for (const property of listSkuOfSpu) {
                    if (item.sku?.indexOf(property) === 0) {
                        item.spu = mapSpus[property].spu
                        break
                    }
                }
            })

            resolve(result)
            clearTimeout(timeout)
            // writeExcel(result)
        })
        pdfParser.loadPDF(filepath)
    })

    ctx.body = data
}

function readOrder(lines, pages, currentPageIndex) {
    if (currentPageIndex >= pages.length) {
        return
    }

    const startPageIndex = currentPageIndex
    let finishPageIndex = currentPageIndex + 1

    // tìm trang kết thúc của order
    while (finishPageIndex < pages.length) {
        const finishPage = pages[finishPageIndex]
        const orderNumberLine = finishPage.Texts[0]
        const orderNumberText = decodeURIComponent(orderNumberLine.R[0].T)
        if (orderNumberText?.startsWith('Order #')) {
            break
        }

        finishPageIndex += 1
    }

    // đọc thông tin chung của order
    const order = readOrderSummary(pages[startPageIndex])
    const items = []

    const result = readItems(
        items,
        pages,
        startPageIndex,
        finishPageIndex,
        startPageIndex,
        -1
    )

    for (const item of items) {
        const orderItem = { ...order, ...item }
        lines.push(orderItem)
    }

    readOrder(lines, pages, result.finishPageIndex)
}

function readOrderSummary(page) {
    let order = {
        orderNumber: null,
        trackingCode: null,
        sku: null,
        size: null,
        spu: null,
        baseCost: null,
        quatity: null,
        totalPrice: null,
        shippingMethod: null,
        countryCode: null,
        customerName: null,
        province: null,
        city: null,
        address1: null,
        postcode: null,
        vat: null,
        telephone: null,
        email: null,
        designLink: null,
        note: null,
    }

    const leftSideTexts = page.Texts.filter(item => item.x < VERTICAL_SPLITTER)

    if (!leftSideTexts.length) {
        return order
    }

    const orderNumberLine = leftSideTexts[0]
    const orderNumberText = decodeURIComponent(orderNumberLine.R[0].T)

    if (!orderNumberText?.startsWith('Order #')) {
        return order
    }

    // Đọc thông tin chung
    order.orderNumber = orderNumberText.replace('Order ', '')

    for (let i = 1; i < leftSideTexts.length; i++) {
        const text = decodeURIComponent(leftSideTexts[i].R[0].T)
        // Cột note
        if (text === 'Marked as gift') {
            order.note = text
            continue
        }

        // Cột Shipping method
        if (text === 'Shipping method') {
            order.shippingMethod = decodeURIComponent(
                leftSideTexts[i + 1].R[0].T
            )
            break
        }

        // Address
        const addressLines = []
        if (text === 'Ship to' || text === 'Deliver to') {
            for (let j = i + 1; j < leftSideTexts.length; j++) {
                const addressText = decodeURIComponent(leftSideTexts[j].R[0].T)

                if (
                    addressText.startsWith('Scheduled to') || // dòng có chứa Scheduled to ở đầu câu
                    leftSideTexts[j].y - leftSideTexts[j - 1].y > 1 // hoặc bị viết cách ra
                ) {
                    i = j
                    break
                }

                addressLines.push(addressText)
            }

            order.countryCode = addressLines.pop()

            try {
                const detachAdressFunction =
                    DetachAdressByCountry[order.countryCode] ||
                    DetachAdressByCountry._default
                const addressDetails = detachAdressFunction(addressLines)

                order = { ...order, ...addressDetails }
            } catch (err) {
                console.error(err)
                order.customerName = addressLines.shift()
                order.address1 = addressLines.join(' ')
            }
        }
    }

    return order
}

function readItems(
    items,
    pages,
    startPageIndex,
    finishPageIndex,
    currentPageIndex,
    minY
) {
    const result = {
        items: items,
        startPageIndex,
        finishPageIndex,
    }

    if (currentPageIndex >= finishPageIndex) {
        return result
    }

    const itemLines = []

    const page = pages[currentPageIndex]
    const rightSideTexts = page.Texts.filter(item => item.x > VERTICAL_SPLITTER)
    const rightSideHLines = page.HLines.filter(
        line => line.x > VERTICAL_SPLITTER
    )

    if (startPageIndex === currentPageIndex && minY === -1) {
        minY = rightSideHLines[0].y
    }

    let maxY = minY
    for (const rightSideHLine of rightSideHLines) {
        if (rightSideHLine.y > minY) {
            // có dòng gạch ngang kết thúc
            maxY = rightSideHLine.y
            break
        }
    }

    let preLineY = minY
    rightSideTexts.forEach(line => {
        if (line.y <= minY) {
            return
        }

        if (line.y < maxY || minY === maxY) {
            if (line.y > preLineY + 3) {
                return
            }
            preLineY = line.y
            itemLines.push(line)
        }
    })

    if (maxY === minY) {
        // không có dòng gạch ngang kết thúc thì đọc sang trang tiếp theo
        currentPageIndex += 1
        if (currentPageIndex >= finishPageIndex) {
            return result
        }
        const nextPage = pages[currentPageIndex]
        const nextPageRightSideTexts = nextPage.Texts.filter(
            item => item.x > VERTICAL_SPLITTER
        )
        const nextPageRightSideHLines = nextPage.HLines.filter(
            line => line.x > VERTICAL_SPLITTER
        )
        maxY = nextPageRightSideHLines[0]?.y || 0 // maxY = 0 trong trường hợp gặp file trống
        itemLines.push(...nextPageRightSideTexts.filter(line => line.y < maxY))
    }

    // đọc thông tin item
    const item = {
        sku: null,
        quantity: 0,
        style: null,
        size: null,
        color: null,
        personalisation: null,
    }

    const quantityIndex = null
    for (let i = 0; i < itemLines.length; i++) {
        const textLine = decodeURIComponent(itemLines[i].R[0].T)

        if (textLine.startsWith('SKU:')) {
            item.sku = textLine.replace(/SKU:\s*/, '')
        }

        if (textLine.startsWith('Quantity:')) {
            item.quantity = textLine.replace(/Quantity:\s*/, '')
        }

        if (textLine.startsWith('Color:')) {
            item.color = textLine.replace(/Color:\s*/, '')
        }
        if (textLine.startsWith('Colour:')) {
            item.color = textLine.replace(/Colour:\s*/, '')
        }

        if (textLine.startsWith('Personalisation:')) {
            item.personalisation = textLine.replace(/Personalisation:\s*/, '')
            for (let j = i + 1; j < itemLines.length; j++) {
                if (itemLines[j].y - itemLines[j - 1].y < 0.9) {
                    item.personalisation +=
                        ' ' + decodeURIComponent(itemLines[j].R[0].T)
                } else {
                    i = j - 1
                    break
                }
            }
        }

        if (i > quantityIndex) {
            const regexSize = /\bsize(?:\s|:)\s*([^\n]+)/i
            const matched = regexSize.exec(textLine)
            if (matched) {
                item.size = matched[1].trim()
            }

            if (item.size) {
                // Xóa "US letter" hoặc các ký tự phía sau
                item.size = item.size.replace(/( US letter)/gi, '')
            }
        }

        if (textLine.indexOf('Style:') > -1) {
            item.style = textLine.replace(/Style:\s*/, '')
        }
    }

    items.push(item)
    // đọc thông tin item tiếp theo
    return readItems(
        items,
        pages,
        startPageIndex,
        finishPageIndex,
        currentPageIndex,
        maxY
    )
}

function writeExcel(items) {
    /* create a new blank workbook */
    const workbook = xlsx.utils.book_new()
    const lines = [
        [
            null,
            'Order number',
            'Tracking code',
            'SKU',
            'Size',
            'SPU',
            'Base cost',
            'Quatity',
            'Total Price',
            'Shipping method',
            'Country code',
            'Customer Name',
            'Province',
            'City',
            'Address 1',
            'Postcode',
            'VAT',
            'Telephone',
            'Email',
            'Design Link',
            'Note',
        ],
    ]

    items.forEach(item => {
        const line = [
            null,
            item.orderNumber,
            item.trackingCode,
            item.sku,
            item.size,
            item.spu,
            item.baseCost,
            item.quatity,
            item.totalPrice,
            item.shippingMethod,
            item.countryCode,
            item.customerName,
            item.province,
            item.city,
            item.address1,
            item.postcode,
            item.vat,
            item.telephone,
            item.email,
            item.designLink,
            item.note,
        ]

        lines.push(line)
    })

    var worksheet = xlsx.utils.aoa_to_sheet(lines)

    // Định dạng background cho hàng đầu tiên
    const range = xlsx.utils.decode_range(worksheet['!ref'])

    for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell_address = xlsx.utils.encode_cell({ r: 0, c: C })
        if (!worksheet[cell_address]) continue
        worksheet[cell_address].s = {
            fill: {
                patternType: 'solid',
                fgColor: { rgb: 'FFFF00' }, // Màu vàng
            },
        }
    }

    xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

    // write the workbook object to a file
    xlsx.writeFile(workbook, 'out.xlsx')
}
