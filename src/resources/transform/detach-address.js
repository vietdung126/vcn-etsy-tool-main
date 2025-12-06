export function us(addressLines) {
    const lines = [...addressLines]
    const result = {
        customerName: lines.shift(),
        province: null,
        city: null,
        address1: null,
        postcode: null,
    }

    let cityText = lines.pop()

    const regex = /((\w{5,6})|(\w{5,6})-(\w{4,5}))$/
    const detect = cityText.match(regex)
    result.postcode = detect[0].trim()
    cityText = cityText.substring(0, detect.index).trim()

    if (!cityText) {
        cityText = lines.pop()
    }

    const [city, province] = cityText.split(',')
    result.city = city?.trim()
    result.province = province?.trim()
    result.address1 = lines.join(' ')

    return result
}

export function uk(addressLines) {
    let lines = [...addressLines]
    const result = {
        customerName: lines.shift(),
        province: null,
        city: null,
        address1: null,
        postcode: null,
    }

    let cityIndex = 0
    for (let i = 0; i < lines.length; i++) {
        const firstWord = lines[i].split(' ')[0]
        if (firstWord.length > 1 && !/.*[a-z0-9]+.*/.test(firstWord)) {
            cityIndex = i
            break
        }
    }

    let cityText = ''
    if (cityIndex) {
        cityText = lines.slice(cityIndex).join(' ')
        lines = lines.slice(0, cityIndex)
    } else {
        cityText = lines.pop()
        if (cityText.length < 6) {
            cityText = lines.pop() + ' ' + cityText
        }
    }

    const regex = /((\w{6,7})|(\w{2,4}) (\w{3,5}))$/
    const detect = cityText.match(regex)
    result.postcode = detect[0].trim()
    cityText = cityText.replace(regex, '').trim()

    if (cityText === '') {
        cityText = lines.pop()
    }

    const [city, province] = cityText.split(',')

    result.city = city?.trim()
    result.province = province?.trim()
    result.address1 = lines.join(' ')

    return result
}

export function ireland(addressLines) {
    let lines = [...addressLines]
    const result = {
        customerName: lines.shift(),
        province: null,
        city: null,
        address1: null,
        postcode: null,
    }

    let cityIndex = 0
    for (let i = 0; i < lines.length; i++) {
        const firstWord = lines[i].split(' ')[0]
        if (firstWord.length > 1 && !/.*[a-z0-9]+.*/.test(firstWord)) {
            cityIndex = i
            break
        }
    }

    let cityText = ''
    if (cityIndex) {
        cityText = lines.slice(cityIndex).join(' ')
        lines = lines.slice(0, cityIndex)
    } else {
        cityText = lines.pop()
        if (cityText.length < 6) {
            cityText = lines.pop() + ' ' + cityText
        }
    }

    const regex = /((\w{7})|(\w{3}) (\w{4}))$/
    const detect = cityText.match(regex)
    result.postcode = detect[0].trim()
    cityText = cityText.replace(regex, '').trim()

    if (cityText === '') {
        cityText = lines.pop()
    }

    if (cityText.includes(',')) {
        const [city, province] = cityText.split(',')
        result.city = city?.trim()
        result.province = province?.trim()
    } else if (cityText.includes(' ')) {
        const [city, ...province] = cityText.split(' ')
        result.city = city?.trim()
        result.province = province.join(' ')
    }

    result.address1 = lines.join(' ')

    if (result.postcode?.length === 7) {
        result.postcode =
            result.postcode.slice(0, 3) + ' ' + result.postcode.slice(3)
    }

    return result
}

export function germany(addressLines) {
    const lines = [...addressLines]
    const result = {
        customerName: lines.shift(),
        province: null,
        city: null,
        address1: null,
        postcode: null,
    }

    let cityText = lines.pop()
    let detachPostcode = postcodeNumberStart(cityText, 1)
    result.postcode = detachPostcode.postcode

    if (!result.postcode) {
        cityText = lines.pop() + ' ' + cityText
        detachPostcode = postcodeNumberStart(cityText, 1)
        result.postcode = detachPostcode.postcode
    }

    cityText = detachPostcode.city
    result.city = cityText?.trim()

    result.address1 = lines.join(' ')

    return result
}

export function australia(addressLines) {
    const lines = [...addressLines]
    const result = {
        customerName: lines.shift(),
        province: null,
        city: null,
        address1: null,
        postcode: null,
    }

    let cityText = lines.pop()
    const detachPostcode = postcodeNumberEnd(cityText, 1)
    result.postcode = detachPostcode.postcode
    cityText = detachPostcode.city
    cityText = cityText || lines.pop()
    cityText = cityText.trim()

    const { city, province } = detachProvince2Chars(cityText)
    result.province = province
    result.city = city
    result.address1 = lines.join(' ')

    return result
}

export function canada(addressLines) {
    const lines = [...addressLines]
    const result = {
        customerName: lines.shift(),
        province: null,
        city: null,
        address1: null,
        postcode: null,
    }

    let cityText = lines.pop()
    if (cityText.length < 6) {
        cityText = lines.pop() + ' ' + cityText
    }

    const regex = /((\w{6})|(\w{3}) (\w{3}))$/
    const detect = cityText.match(regex)
    const postcode = detect[0].trim()
    cityText = cityText.replace(regex, '').trim()
    result.postcode = postcode

    const { city, province } = detachProvince2Chars(cityText)
    result.province = province
    result.city = city
    result.address1 = lines.join(' ')

    return result
}

export function czechRepublic(addressLines) {
    const lines = [...addressLines]
    const result = {
        customerName: lines.shift(),
        province: null,
        city: null,
        address1: null,
        postcode: null,
    }

    let cityText = lines.pop()
    let detachPostcode = postcodeNumberStart(cityText, 2)
    result.postcode = detachPostcode.postcode

    if (!result.postcode) {
        cityText = lines.pop() + ' ' + cityText
        detachPostcode = postcodeNumberStart(cityText, 2)
        result.postcode = detachPostcode.postcode
    }

    cityText = detachPostcode.city
    result.city = cityText?.trim()

    result.address1 = lines.join(' ')

    return result
}

export function italy(addressLines) {
    const lines = [...addressLines]
    const result = {
        customerName: lines.shift(),
        province: null,
        city: null,
        address1: null,
        postcode: null,
    }

    let cityText = lines.pop()
    let detachPostcode = postcodeNumberStart(cityText, 1)
    result.postcode = detachPostcode.postcode

    if (!result.postcode) {
        cityText = lines.pop() + ' ' + cityText
        detachPostcode = postcodeNumberStart(cityText, 2)
        result.postcode = detachPostcode.postcode
    }

    cityText = detachPostcode.city
    cityText = cityText.trim()

    const { city, province } = detachProvince2Chars(cityText)
    result.province = province
    result.city = city
    result.address1 = lines.join(' ')

    return result
}

export function sweden(addressLines) {
    const lines = [...addressLines]
    const result = {
        customerName: lines.shift(),
        province: null,
        city: null,
        address1: null,
        postcode: null,
    }

    let cityText = lines.pop()
    let detachPostcode = postcodeNumberStart(cityText, 2)
    result.postcode = detachPostcode.postcode

    if (!result.postcode) {
        cityText = lines.pop() + ' ' + cityText
        detachPostcode = postcodeNumberStart(cityText, 2)
        result.postcode = detachPostcode.postcode
    }

    cityText = detachPostcode.city
    result.city = cityText?.trim()

    result.address1 = lines.join(' ')

    return result
}

export function poland(addressLines) {
    const lines = [...addressLines]
    const result = {
        customerName: lines.shift(),
        province: null,
        city: null,
        address1: null,
        postcode: null,
    }

    let cityText = lines.pop()

    const regex = /^((\w{5,6})|(\w{2,3})-(\w{3,4}))/
    let detect = cityText.match(regex) || []
    result.postcode = detect[0].trim()

    if (!result.postcode) {
        cityText = lines.pop() + ' ' + cityText
        detect = cityText.match(regex)
        result.postcode = detect[0].trim()
    }
    cityText = cityText.substring(result.postcode.length).trim()

    result.city = cityText
    result.address1 = lines.join(' ')

    return result
}

export function theNetherlands(addressLines) {
    const lines = [...addressLines]
    const result = {
        customerName: lines.shift(),
        province: null,
        city: null,
        address1: null,
        postcode: null,
    }

    let cityText = lines.pop()

    const regex = /^(\d{4} ?[A-Z]{2})/
    let detect = cityText.match(regex) || []
    result.postcode = detect[0].trim()

    if (!result.postcode) {
        cityText = lines.pop() + ' ' + cityText
        detect = cityText.match(regex)
        result.postcode = detect[0].trim()
    }

    if (result.postcode.indexOf(' ') === -1) {
        result.postcode =
            result.postcode.slice(0, 4) + ' ' + result.postcode.slice(4)
    }

    cityText = cityText.substring(result.postcode.length).trim()

    result.city = cityText
    result.address1 = lines.join(' ')

    return result
}

function postcodeNumberEnd(text, type) {
    let regex = new RegExp()
    switch (type) {
        case 1:
            regex = /(\d+)$/
            break
        case 2:
            regex = /(\d+) (\d+)$/
            break
        default:
            regex = /((\d+)|(\d+) (\d+))$/
    }

    const detect = text.match(regex)
    if (!detect) {
        return { postcode: '', city: '' }
    }

    const postcode = detect[0].trim()
    const city = text.replace(regex, '').trim()
    return { postcode, city }
}

function postcodeNumberStart(text, type) {
    let regex = new RegExp()
    switch (type) {
        case 1:
            regex = /^(\d+)/
            break
        case 2:
            regex = /^(\d+) (\d+)/
            break
        default:
            regex = /^((\d+)|(\d+) (\d+))/
    }

    const detect = text.match(regex)
    if (!detect) {
        return { postcode: '', city: '' }
    }

    const postcode = detect[0]?.trim()
    const city = text.substring(postcode?.length || 0).trim()
    return { postcode, city }
}

function postcodeAnyEnd(text, type) {
    let regex = new RegExp()
    switch (type) {
        case 1:
            regex = /(\w+)$/
            break
        case 2:
            regex = /(\w+) (\w+)$/
            break
        default:
            regex = /((\w+)|(\w+) (\w+))$/
    }

    const detect = text.match(regex)
    const postcode = detect[0].trim()
    const city = text.replace(regex, '').trim()
    return { postcode, city }
}

function postcodeAnyStart(text, type) {
    let regex = new RegExp()
    switch (type) {
        case 1:
            regex = /^(\w+)/
            break
        case 2:
            regex = /^(\w+) (\w+)/
            break
        default:
            regex = /^((\w+)|(\w+) (\w+))/
    }

    const detect = text.match(regex)
    const postcode = detect[0].trim()
    const city = text.substring(postcode.length).trim()
    return { postcode, city }
}

function detachProvince2Chars(text) {
    const cityData = text.match(/(\w+)$/)
    const province = cityData[0].trim()
    const city = text.substring(0, cityData.index).trim()

    return { city, province }
}

const AustraliaProvince = {
    NSW: 'NSW',
    QLD: 'QLD',
    SA: 'SA',
    TAS: 'TAS',
    VIC: 'VIC',
    WA: 'WA',
    ACT: 'ACT',
    NT: 'NT',
}

const CanadaProvince = {
    AB: 'AB',
    BC: 'BC',
    MB: 'MB',
    NB: 'NB',
    NL: 'NL',
    NS: 'NS',
    ON: 'ON',
    PE: 'PE',
    QC: 'QC',
    SK: 'SK',
    NT: 'NT',
    NU: 'NU',
    YT: 'YT',
}
