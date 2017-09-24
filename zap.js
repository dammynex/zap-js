var Zap = function (base) {
    
    base = base || location.protocol + '//' + location.hostname
    this.baseLoc = (base.substr(-1) === '/') ? base : base + '/'
}

Zap.prototype = {
    
    $routes: {},
    
    $filterPath: function(path) {
        
        var repath = path.substr(-1) === '/' ? path.substr(0, path.length-1) : path,
            path = repath.substr(0, 1) === '/' ? repath.substr(1) : repath
        
        return path
    },
    
    $getParams: function() {
        
        var theParams = {}
        
        if(this.base) {
            
            if(this.base.match(/\?/)){
                
                var params = this.base.split('?')[1]
                
                if(params) {
                    
                    var j,
                        rawParams = params.split('&')
                    
                    for(j in rawParams) {
                        
                        var fineParam = rawParams[j],
                            refineParam = fineParam.split('='),
                            refineParamName = refineParam[0],
                            refineParamVal = refineParam[1] || ''
                        
                        theParams[refineParamName] = refineParamVal
                    }
                }
            }
        }
        
        return theParams
    },
    
    $getPath: function() {
        
        this.base = location.href
        return this.base
    },
    
    $go: function (path, push) {
        
        var routes = this.$routes,
            hasMatch = false,
            args = [],
            a,
            push = push || 2,
            matchFound = false,
            path = this.$filterPath(path.replace(this.baseLoc, ''))
        
        for(a in routes) {
            
            var routeRegex = new RegExp(routes[a].regex),
                routeFn = routes[a].fn,
                match = path.split('?')[0].match(routeRegex)
            
            if(!matchFound) {
            
                if(match) {

                    if(push == 2) {
                        history.pushState({}, '', this.baseLoc + path)
                    }
                    this.$getPath()
                    
                    args = match.slice(1) || []
                    args = args.concat([this.$getParams()])

                    routeFn.apply(null, args)
                    matchFound = true
                }
            }
        }
    },

    $on: function (path, fn) {
        
        var regexPath, ret = {}

        path = (this.$filterPath(path)) ? this.$filterPath(path) : null
        regexPath = (path === '*') ? '(.*?)' : (path) ? path.replace(/\:([^(\/|?)]+)/gi, '([^\\/]+)') : '^\s*$'
        
        ret.regex = regexPath
        ret.fn = fn
        ret.rawPath = path
        
        this.$routes[path] = ret
        
    },

    $trigger: function () {
        
        var $this = this
        
        window.onpopstate = function(e) {
            
            var parsedLoc = $this.$getPath().replace($this.baseLoc, '')
            $this.$go(parsedLoc, 1)
        }
        
        document.addEventListener('DOMContentLoaded', function(e) {
            
            var el = document.querySelectorAll('[data-zap]'),
                element,
                index
            
            for(index in el) {

                element = el[index]

                if(typeof element === 'object') {
                    
                    element.addEventListener('click', function (e) {
                        
                        var attr = this.getAttribute('href')
                        $this.$go(attr)
                        
                        e.preventDefault()
                        e.stopPropagation()
                    })
                }
            }
            
        })

        $this.$go(location.href)
    }
}
