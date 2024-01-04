import pdfjsDist from 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.0.379/+esm';
const pdfState = {
    pdf: null,
    currentPage: 1,
    zoom: 1
}

document.addEventListener('DOMContentLoaded', () => {
    let drop = document.getElementById('drop-zone');
    // ondrop="drop(e)" ondragover="allowDrop(e)"
    drop.ondrop = handleDrop;
    drop.ondragover = allowDrop;
});

function handleDrop(e) {
    e.preventDefault();
    // let data = e.dataTransfer.getData();
    console.log(e.dataTransfer.files, e.dataTransfer.items);
    pdfjsDist.getDocument(e.dataTransfer.files[0].name).then((pdf) => {

    });
}

function allowDrop(e) {
    e.preventDefault();
}

function render() {
    
}