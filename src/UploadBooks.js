function UploadBooks(url) {
    var inputFiles = document.getElementById('uploadBooks');
    const data = new FormData();
    for (var i = 0; i < inputFiles.files.length; i++) {
        if (inputFiles.files[i].type === 'application/pdf') {
            data.append('upload[]', inputFiles.files[i]);
        }
    }
    
    fetch(url, {
        method: 'post',
        body: data
    })
    .then((response) => {
        return response.text();
    })
    .then((data) => {
        console.log(data);
    });
}

export default UploadBooks;