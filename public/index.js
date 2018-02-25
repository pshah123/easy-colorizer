var readerBoi = new FileReader()

$(".interactive").click(() => {
    $("#upload").trigger("click")
})

$("#upload").on("change", () => {
    readerBoi.readAsDataURL(
        $("#upload").prop("files")[0]
    )
})

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
    fetch('http://127.0.0.1:8000/paint', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(d)
    }).then((s) => s.text()).then((t) => {
        $('.result').css(
            'background-image',
            'url(http://127.0.0.1:8000/sketch/' + t + ')'
        )
        $('.result').css(
            'background-size',
            'contain'
        )
    }).catch((e) => console.log(e))
}