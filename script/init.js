(() => {

    const functions = [
        // () => {
        //     queryParser = new QueryParser({
        //         commands: CONFIG.commands,
        //         pathDelimiter: CONFIG.pathDelimiter,
        //         searchDelimiter: CONFIG.searchDelimiter,
        //     });
        // },
        // () => {
        //     influencers = CONFIG.influencers.map(influencerConfig => {
        //         return new {
        //             Default: DefaultInfluencer,
        //             DuckDuckGo: DuckDuckGoInfluencer,
        //             History: HistoryInfluencer,
        //         } [influencerConfig.name]({
        //             defaultSuggestions: CONFIG.defaultSuggestions,
        //             limit: influencerConfig.limit,
        //             parseQuery: queryParser.parse,
        //         });
        //     });
        // },
        // () => {
        //     suggester = new Suggester({
        //         enabled: CONFIG.suggestions,
        //         influencers,
        //         limit: CONFIG.suggestionsLimit,
        //     });
        // },
        // () => {
        //     help = new Help({
        //         commands: CONFIG.commands,
        //         newTab: CONFIG.newTab,
        //     });
        // },
        // () => {
        //     hook = new Hook();
        // },
        // () => {
        //     form = new Form({
        //         colors: CONFIG.colors,
        //         instantRedirect: CONFIG.instantRedirect,
        //         newTab: CONFIG.newTab,
        //         parseQuery: queryParser.parse,
        //         suggester,
        //         hook,
        //         toggleHelp: help.toggle,
        //     });
        // },
        addApprox,
        sidebar.menu.addOptions,
        sidebar.menu.addEnterNext,
        sidebar.notesStorage.load,
        sidebar.notesStorage.storeOnBlur,
        weather.getWeather,
        () => {document.getElementById("mainBody").classList.add("transitionMainBody")},
    ]

    const workWhileIdle = (index = 0) => {
        console.log("initialization ", Math.floor(index/functions.length*100) + "% done");
        functions[index]();
    
        if (++index < functions.length) {
            requestIdleCallback(() => requestAnimationFrame(() => workWhileIdle(index)));
        }
        
    };

    
    requestIdleCallback(() => requestAnimationFrame(() => workWhileIdle()));
})();
