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
    let text = ''
    let reader = s.body.getReader()
    let decoder = new TextDecoder()
    let read = () => {
        reader.read().then((s2) => {
            let c = decoder.decode(s2.value || new Uint8Array, {
                stream: !s.done
            })
            text += c
            if (s2.done) return text
            else return read()
        })
    }
    return read()
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
    fetch('http://cloud-vm-46-180.doc.ic.ac.uk:8000/paint', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(d)
    }).then((s) => dechunk(s)).then((t) => {
        t = t.trim()
        $('.result').css(
            'background-image',
            'url(http://cloud-vm-46-180.doc.ic.ac.uk:8000/sketch/' + t + ')'
        )
        $('.result').css(
            'background-size',
            'contain'
        )
    }).catch((e) => {
        console.log(e);
        try {
            toastr.error(e)
        } catch (e2) {
            alert(e)
        }
    })
}