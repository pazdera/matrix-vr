module.exports = {
    files: './docs/index.html',
    from: [
        /\/assets\//g,
        /type="module"/g,
        /\.\/src\/index\.js/g,
    ],
    to: [
        '/matrix-vr/assets/',
        '',
        'index.js'
    ]
};