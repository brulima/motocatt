(function homolog (hostname) {
    if (hostname.indexOf('homolog')) {
        var base = document.querySelector('base');
        base.setAttribute('href', hostname);
    }
})('http://' + document.location.hostname + '/');