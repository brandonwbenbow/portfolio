module.exports = function(config) {
    config.addPassthroughCopy("public");
    config.addPassthroughCopy("CNAME");

    return {
        dir: {
            input: "views",
            output: "docs"
        }   
    }
}