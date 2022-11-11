const calculateNormal = (position, indices) => {
    let pontos = []
    let faces = []
    let resultado
    
    for (let i = 0; i < position.length; i += 3) {
        pontos.push([position[i], position[i+1],position[i+2]])
    }
    
    for (let i = 0; i < indices.length; i += 3) {
        faces.push([indices[i], indices[i+1],indices[i+2]])
    }

    var normalUsadas = {}

    for (let i = 0, j = 0; i < position.length; i+=3, j++) {
        normalUsadas[j] = []
    }

    normal = faces.map(item => {
        // AB AC
        vetorA1 = [pontos[item[1]][0] - pontos[item[0]][0], pontos[item[1]][1] - pontos[item[0]][1], pontos[item[1]][2] - pontos[item[0]][2]]
        vetorB1 = [pontos[item[2]][0] - pontos[item[0]][0], pontos[item[2]][1] - pontos[item[0]][1], pontos[item[2]][2] - pontos[item[0]][2]]

        // BA BC
        vetorB2 = [pontos[item[0]][0] - pontos[item[1]][0], pontos[item[0]][1] - pontos[item[1]][1], pontos[item[0]][2] - pontos[item[1]][2]]
        vetorA2 = [pontos[item[2]][0] - pontos[item[1]][0], pontos[item[2]][1] - pontos[item[1]][1], pontos[item[2]][2] - pontos[item[1]][2]]

        // CA CB
        vetorA3 = [pontos[item[0]][0] - pontos[item[2]][0], pontos[item[0]][1] - pontos[item[2]][1], pontos[item[0]][2] - pontos[item[2]][2]]
        vetorB3 = [pontos[item[1]][0] - pontos[item[2]][0], pontos[item[1]][1] - pontos[item[2]][1], pontos[item[1]][2] - pontos[item[2]][2]]

        produto = [
            vetorA1[1] * vetorB1[2] - vetorB1[1] * vetorA1[2],
            vetorB1[0] * vetorA1[2] - vetorA1[0] * vetorB1[2],
            vetorA1[0] * vetorB1[1] - vetorB1[0] * vetorA1[1],

            vetorA2[1] * vetorB2[2] - vetorB2[1] * vetorA2[2],
            vetorB2[0] * vetorA2[2] - vetorA2[0] * vetorB2[2],
            vetorA2[0] * vetorB2[1] - vetorB2[0] * vetorA2[1],

            vetorA3[1] * vetorB3[2] - vetorB3[1] * vetorA3[2],
            vetorB3[0] * vetorA3[2] - vetorA3[0] * vetorB3[2],
            vetorA3[0] * vetorB3[1] - vetorB3[0] * vetorA3[1]
        ]

        let distancia = []

        for (let i = 0, j = 0; i < produto.length; i+=3, j++) {
            distancia.push(Math.abs(Math.sqrt(produto[i] * produto[i] + produto[i+1] * produto[i+1] + produto[i+2] * produto[i+2])))

            produto[i] = produto[i] / distancia[j]
            produto[i+1] = produto[i+1] / distancia[j]
            produto[i+2] = produto[i+2] / distancia[j]
        }

        for (let i = 0, j = 0; i < produto.length; i+=3, j++) {
            if (normalUsadas[item[0]].length == 0) {
                normalUsadas[item[0]] = [produto[i], produto[i+1], produto[i+2]]
            } else {
                if (normalUsadas[item[1]].length == 0) {
                    normalUsadas[item[1]] = [produto[i], produto[i+1], produto[i+2]]
                } else {
                    normalUsadas[item[2]] = [produto[i], produto[i+1], produto[i+2]]
                }
            }
        }
   
        return produto
    })


    let normaisTratadas = []

    for (const item in normalUsadas) {
        for (let i = 0; i < normalUsadas[item].length; i++) {
            normaisTratadas.push(normalUsadas[item][i])
        }
    }

    return normaisTratadas;
}