module.exports = function(config) {
    config.addPassthroughCopy("public");
    config.addPassthroughCopy("CNAME");

    config.setQuietMode(true);

    config.setServerOptions({
        liveReload: true,
        domDiff: true,
        port: 8000
    });

    return {
        dir: {
            input: "views",
            output: "docs"
        }   
    }
}