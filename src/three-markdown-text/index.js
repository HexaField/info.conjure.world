import * as THREE from 'three'
import { ShapePath } from 'three'

export default class ThreeMarkdownText
{
    constructor(args = {})
    {
        // parameters

        this.font = args.font
        this.fontBold = args.fontBold
        this.string = args.string || ''
        this.fontScale = args.fontScale === undefined ? 1 : args.fontScale
        this.material = args.material || new THREE.MeshBasicMaterial({ side: THREE.DoubleSide })

        // internals

        this._backgroundMaterial = new THREE.MeshBasicMaterial({ visible: false })
        this._midpoint = 0

        this._group = new THREE.Group()
        this._letters = new THREE.Group()
        this._group.add(this._letters)
        
        this._vec3 = new THREE.Vector3()
        
        this._createText()
    }

    setText(text)
    {
        this.string = text
        this._createText()
    }

    getText()
    {
        return this.string
    }

    getObject()
    {
        return this._group
    }

    // ========= //
    // INTERNALS //
    // ========= //

    _createText()
    {
        // remove previous text
        while(this._letters.children.length > 0)
        {
            this._letters.remove(this._letters.children[0])
        }

        this.string = String(this.string)
        let lines = this.string.split('\n')
        let newChars = []

        // taken from THREE.Font
        const scale = this.fontScale / this.font.data.resolution
        let baseLineHeight  = ( this.font.data.boundingBox.yMax - this.font.data.boundingBox.yMin + this.font.data.underlineThickness ) * scale

        let offsetX = 0, offsetY = 0, biggestX = 0, lineHeights = []
        let inCodeBlock = false
        let codeFormatting = ''

        for (let line of lines)
        {
            let lineCharacters = Array.from(line)

            // code blocks
            if(line.substring(0, 3) === '\`\`\`')
            {
                if(line !== '')
                    codeFormatting = line.slice(3)
                line = ''
                lineCharacters = []
                inCodeBlock = !inCodeBlock
            }
            
            let scaleModifier = 1
            let heading = 0

            if(!inCodeBlock)
            {
                // headings
                for(let character of lineCharacters)
                {
                    if(character !== '#')
                    {
                        if(character === ' ' && heading)
                        {
                            lineCharacters.splice(0, heading + 1)
                            scaleModifier = Math.max(4 * (1 / heading), 1)
                        }
                        else
                            heading = 0
                        break
                    }
                    heading ++
                }
            }
            lineHeights.push(scaleModifier)
            let bold = false
            let italics = false
            for(let i = 0; i < lineCharacters.length; i++)
            {
                if(lineCharacters[i] === '*' || lineCharacters[i] === '_')
                {
                    if(i < lineCharacters.length - 1 && lineCharacters[i] === lineCharacters[i + 1])
                    {
                        bold = !bold
                        continue
                    }
                    italics = !italics
                    continue
                }
                // clone of THREE.Font
                const ret = this._createPath(lineCharacters[i], scale * scaleModifier, offsetX, offsetY, bold ? this.fontBold.data : this.font.data)
                
                let geometry = new THREE.ShapeBufferGeometry(ret.path.toShapes())
                let mesh = new THREE.Mesh(geometry, this.material)
                // userdata is used to save metadata
                mesh.userData.offset = { x: offsetX, y: offsetY, width: ret.offsetX, height: baseLineHeight * scaleModifier }

                this._letters.add(mesh)

                offsetX += ret.offsetX

                if(offsetX > biggestX)
                    biggestX = offsetX
            }
            offsetX = 0
            offsetY -= baseLineHeight * scaleModifier
        }
    }

    // Taken from THREE.Font - need to see if there is a way to expose this function natively
    _createPath( char, scale, offsetX, offsetY, data ) {

        const glyph = data.glyphs[ char ] || data.glyphs[ '?' ]

        if ( ! glyph ) {

            console.error( 'FontExtension: character "' + char + '" does not exists in font family ' + data.familyName + '.' )

            return

        }

        const path = new ShapePath()

        let x, y, cpx, cpy, cpx1, cpy1, cpx2, cpy2

        if ( glyph.o ) {

            const outline = glyph._cachedOutline || ( glyph._cachedOutline = glyph.o.split( ' ' ) )

            for ( let i = 0, l = outline.length; i < l; ) {

                const action = outline[ i ++ ]

                switch ( action ) {

                    case 'm': // moveTo

                        x = outline[ i ++ ] * scale + offsetX
                        y = outline[ i ++ ] * scale + offsetY

                        path.moveTo( x, y )

                        break

                    case 'l': // lineTo

                        x = outline[ i ++ ] * scale + offsetX
                        y = outline[ i ++ ] * scale + offsetY

                        path.lineTo( x, y )

                        break

                    case 'q': // quadraticCurveTo

                        cpx = outline[ i ++ ] * scale + offsetX
                        cpy = outline[ i ++ ] * scale + offsetY
                        cpx1 = outline[ i ++ ] * scale + offsetX
                        cpy1 = outline[ i ++ ] * scale + offsetY

                        path.quadraticCurveTo( cpx1, cpy1, cpx, cpy )

                        break

                    case 'b': // bezierCurveTo

                        cpx = outline[ i ++ ] * scale + offsetX
                        cpy = outline[ i ++ ] * scale + offsetY
                        cpx1 = outline[ i ++ ] * scale + offsetX
                        cpy1 = outline[ i ++ ] * scale + offsetY
                        cpx2 = outline[ i ++ ] * scale + offsetX
                        cpy2 = outline[ i ++ ] * scale + offsetY

                        path.bezierCurveTo( cpx1, cpy1, cpx2, cpy2, cpx, cpy )

                        break

                }

            }

        }

        return { offsetX: glyph.ha * scale, path: path }
    }
}