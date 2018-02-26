var readerBoi = new FileReader()

$(".interactive").click(() => {
    $("#upload").trigger("click")
})

$("#upload").on("change", () => {
    readerBoi.readAsDataURL(
        $("#upload").prop("files")[0]
    )
})

var dechunk = (s) => {

}

readerBoi.onload = () => {
    let sketch = readerBoi.result
    $('.interactive').css(
        'background-image',
        'url(' + sketch + ')'
    )
    $('.interactive').css(
        'background-size',
        'contain'
    )
    let ref = 'rem' // TODO: add ref selection
    let name = 'test' // TODO: generate name from filename
    let d = {
        sketch: sketch,
        name: name,
        ref: ref
    }
    toastr.info("Working... This could take up a minute or two.")
    fetch('http://cloud-vm-46-180.doc.ic.ac.uk:8000/paint', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(d)
    }).then((s) => {
        let t = ''
        let reader = s.body.getReader()
        let decoder = new TextDecoder()
        let read = () => {
            reader.read().then((s2) => {
                let c = decoder.decode(s2.value || new Uint8Array, {
                    stream: !s2.done
                })
                t = t.trim()
                while (t.indexOf(':E') > 0) {
                    toastr.info(t.substring(2, t.indexOf(':E')))
                    t = t.substring(t.indexOf(':E') + 2).trim()
                }
                t += c
                console.log(t)
                if (s2.done) {
                    while (t.indexOf(':E') > 0) {
                        toastr.info(t.substring(2, t.indexOf(':E')))
                        t = t.substring(t.indexOf(':E') + 2).trim()
                    }
                    t = t.trim()
                    $('.result').css(
                        'background-image',
                        'url(http://cloud-vm-46-180.doc.ic.ac.uk:8000/sketch/test)'
                    )
                    $('.result').css(
                        'background-size',
                        'contain'
                    )
                } else return read()
            })
        }
        return read()
    }).catch((e) => {
        console.log(e);
        try {
            toastr.error(e)
        } catch (e2) {
            alert(e)
        }
    })
}